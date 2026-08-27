/* ==========================================================================
   ACADEMIA TENIS HITS (ATH) - ADMIN MANAGEMENT PANEL (ARGENTINA)
   Módulos: 
   1. Gestión de Usuarios y Roles (Buscador y asignación de RBAC)
   2. Control de Pagos y Reservas (Aprobar / Rechazar reservas)
   3. Edición de Contenido (Publicar Noticias y Torneos)
   4. Edición de Precios y Tarifas Oficiales
   ========================================================================== */

/* Estado de Sub-Navegación de Reservas ('activas' vs 'historial') */
window.subtabActualReservas = window.subtabActualReservas || 'activas';

window.cambiarSubtabReservas = function(tab) {
    console.log(`📋 [ATH Admin] Cambiando a sub-pestaña: ${tab}`);
    window.subtabActualReservas = tab;
    
    const btnActivas = document.getElementById('btn-subtab-activas');
    const btnHistorial = document.getElementById('btn-subtab-historial');
    
    if (btnActivas && btnHistorial) {
        if (tab === 'activas') {
            btnActivas.style.background = "linear-gradient(135deg, #FF6600 0%, #FF8800 100%)";
            btnActivas.style.border = "1px solid #FFD700";
            btnActivas.style.color = "#FFF";
            btnHistorial.style.background = "rgba(255,255,255,0.05)";
            btnHistorial.style.border = "1px solid rgba(255,255,255,0.15)";
            btnHistorial.style.color = "#CBD5E1";
        } else {
            btnHistorial.style.background = "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)";
            btnHistorial.style.border = "1px solid #60A5FA";
            btnHistorial.style.color = "#FFF";
            btnActivas.style.background = "rgba(255,255,255,0.05)";
            btnActivas.style.border = "1px solid rgba(255,255,255,0.15)";
            btnActivas.style.color = "#CBD5E1";
        }
    }
    if (typeof window.cargarTablaReservas === 'function') {
        window.cargarTablaReservas();
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificación de Seguridad Estricta (Solo Cuentas con Role: 'admin')
    function getActiveUser() {
        if (window.DBHits && typeof window.DBHits.getActiveUser === 'function') {
            return window.DBHits.getActiveUser();
        }
        try {
            return JSON.parse(localStorage.getItem('ath_active_user')) || null;
        } catch {
            return null;
        }
    }

    const currentUser = getActiveUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'secretaria')) {
        alert('⛔ ACCESO DENEGADO: Privilegios insuficientes.');
        window.location.href = 'index.html';
        return;
    }

    // Elements
    const adminTabs = document.querySelectorAll('.admin-tab-btn');
    const adminContents = document.querySelectorAll('.admin-tab-content');

        if (currentUser.role === 'secretaria') {
            // 1. Ocultar barra superior entera y pestañas prohibidas
            const navTabs = document.querySelector('.admin-tabs-nav');
            if (navTabs) navTabs.style.display = 'none';

            // 2. Destruir sub-pestañas y reporte financiero
            const subTabs = document.querySelector('.subtabs-container');
            if (subTabs) subTabs.style.display = 'none';
            const panelFin = document.getElementById('panel-reportes-financieros');
            if (panelFin) panelFin.style.display = 'none';

            // 3. Forzar vista en reservas
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            const tabReservas = document.getElementById('admin-tab-reservas');
            if (tabReservas) {
                tabReservas.classList.add('active');
                const title = tabReservas.querySelector('.admin-card-title');
                if (title) title.innerHTML = '<i class="fa-solid fa-address-book" style="color: var(--color-ath-orange);"></i> Agenda y Reservas de Secretaría';
                const desc = tabReservas.querySelector('p');
                if (desc) desc.innerHTML = 'Seleccioná la fecha en el calendario para ver la disponibilidad y agendar nuevos turnos en mostrador.';
            }
            
            // 4. Setear filtro de fecha automáticamente a HOY (dejándolo libre para edición)
            setTimeout(() => {
                const agendaFilter = document.querySelector('.agendaDateFilterInput') || document.getElementById('agendaDateFilter');
                if (agendaFilter && !agendaFilter.value) {
                    const today = new Date();
                    const offset = today.getTimezoneOffset() * 60000;
                    const localISOTime = (new Date(today - offset)).toISOString().split('T')[0];
                    agendaFilter.value = localISOTime;
                    if (typeof cargarTablaReservas === 'function') cargarTablaReservas();
                }
            }, 100);
        }


    // Cambiar Pestañas en Panel Admin
    adminTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            adminTabs.forEach(t => t.classList.remove('active'));
            adminContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = `admin-tab-${btn.dataset.admintab}`;
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    /* ==========================================================================
       MÓDULO 1: GESTIÓN DE USUARIOS Y ROLES (BUSCADOR & CAMBIO RBAC)
       ========================================================================== */
    const userSearchInput = document.getElementById('userSearchInput');
    const usersTableBody = document.getElementById('usersTableBody');
    const totalUsersCount = document.getElementById('totalUsersCount');

    async function cargarTablaUsuarios(filtro = '') {
        if (!usersTableBody) return;
        usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Cargando usuarios registrados...</td></tr>';

        const todosUsuarios = await window.DBHits.listarUsuarios();
        const term = filtro.toLowerCase().trim();

        const usuariosFiltrados = todosUsuarios.filter(u => {
            const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
            return nombreCompleto.includes(term) || 
                   (u.dni && u.dni.includes(term)) || 
                   (u.email && u.email.toLowerCase().includes(term));
        });

        if (totalUsersCount) totalUsersCount.textContent = usuariosFiltrados.length;

        if (usuariosFiltrados.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--color-text-muted);">No se encontraron usuarios registrados con ese criterio.</td></tr>';
            return;
        }

        usersTableBody.innerHTML = usuariosFiltrados.map(u => `
            <tr>
                <td data-label="Usuario"><strong>${u.nombre} ${u.apellido}</strong></td>
                <td data-label="DNI"><code>${u.dni || 'Sin DNI'}</code></td>
                <td data-label="Correo">${u.email}</td>
                <td data-label="Teléfono">${u.telefono || '-'}</td>
                <td data-label="Rol">
                    <select class="role-select-dropdown" data-userid="${u.id}">
                        <option value="usuario" ${u.role === 'usuario' ? 'selected' : ''}>Usuario</option>
                        <option value="socio" ${u.role === 'socio' ? 'selected' : ''}>Socio ATH</option>
                        <option value="alumno" ${u.role === 'alumno' ? 'selected' : ''}>Alumno ATH</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Administrador</option>
                        <option value="secretaria" ${u.role === 'secretaria' ? 'selected' : ''}>Secretaría</option>
                    </select>
                </td>
                <td data-label="Acción">
                    <button class="btn-save-role" data-userid="${u.id}">
                        <i class="fa-solid fa-floppy-disk"></i> Guardar
                    </button>
                </td>
            </tr>
        `).join('');

        // Escuchadores para cambio de rol
        document.querySelectorAll('.btn-save-role').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = btn.dataset.userid;
                const select = document.querySelector(`.role-select-dropdown[data-userid="${userId}"]`);
                if (!select) return;

                const nuevoRol = select.value;
                try {
                    await window.DBHits.actualizarRolUsuario(userId, nuevoRol);
                    alert(`¡Rol actualizado con éxito! El usuario ahora posee el rol de '${nuevoRol}'.`);
                    cargarTablaUsuarios(userSearchInput ? userSearchInput.value : '');
                } catch (err) {
                    alert(`Error al actualizar el rol: ${err.message}`);
                }
            });
        });
    }

    if (userSearchInput) {
        userSearchInput.addEventListener('input', (e) => {
            cargarTablaUsuarios(e.target.value);
        });
    }

    /* ==========================================================================
       MÓDULO 2: CONTROL DE PAGOS Y RESERVAS DE CANCHAS
       ========================================================================== */
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    const totalBookingsCount = document.getElementById('totalBookingsCount');

    async function cargarTablaReservas() {
        if (!bookingsTableBody) return;
        bookingsTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">Cargando reservas de canchas...</td></tr>';

        const reservas = await window.DBHits.listarReservas();
        if (totalBookingsCount) totalBookingsCount.textContent = reservas.length;

        const ahora = new Date();

        // 1. Ordenar siempre las más nuevas primero por ID o Timestamp
        reservas.sort((a, b) => (b.timestampCreacion || b.id || 0) - (a.timestampCreacion || a.id || 0));

        const reservasHistorial = reservas.filter(r => {
            // A) Limpiar la hora de texto (ej: "17:30 hs" -> "17:30") para evitar Invalid Date
            let horaLimpia = '23:59';
            if (r.horaFin) {
                horaLimpia = String(r.horaFin).replace(/[^0-9:]/g, '');
                if (horaLimpia.length === 2) horaLimpia += ':00';
            }
            
            const fechaTurno = new Date(`${r.fecha}T${horaLimpia}`);
            const esPasada = !isNaN(fechaTurno) ? (fechaTurno < ahora) : (new Date(`${r.fecha}T23:59:00`) < ahora);
            
            // B) Condiciones para ir al historial:
            // - Si fue explícitamente rechazada/cancelada, va al historial.
            const esRechazada = r.estadoPago && (r.estadoPago.includes('rechazado') || r.estadoPago.includes('❌') || String(r.estadoPago).toLowerCase().includes('rechazad'));
            
            // - Si ya pasó en el tiempo Y su pago NO está pendiente de revisión por la secretaría
            const pagoPendiente = r.estadoPago && (r.estadoPago.includes('esperando') || r.estadoPago.includes('⏳'));
            
            return esRechazada || (esPasada && !pagoPendiente);
        });

        // Las activas son todas las que no están en el historial
        const reservasActivas = reservas.filter(r => !reservasHistorial.includes(r));

        // Actualizar contadores visuales en los botones si existen en el DOM
        const badgeActivas = document.getElementById('badge-count-activas');
        const badgeHistorial = document.getElementById('badge-count-historial');
        if (badgeActivas) badgeActivas.textContent = reservasActivas.length;
        if (badgeHistorial) badgeHistorial.textContent = reservasHistorial.length;

        const agendaFilterDate = document.querySelector('.agendaDateFilterInput')?.value || (document.getElementById('agendaDateFilter') ? document.getElementById('agendaDateFilter').value : '');
        const listaARenderizarRaw = window.subtabActualReservas === 'activas' ? reservasActivas : reservasHistorial;
        const listaARenderizar = agendaFilterDate ? listaARenderizarRaw.filter(r => r.fecha === agendaFilterDate) : listaARenderizarRaw;

        // Si la lista está vacía, mostrar mensaje amigable
        if (listaARenderizar.length === 0) {
            bookingsTableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 30px; color: #94A3B8; font-style: italic;">
                        📭 No hay turnos registrados en la sección "${window.subtabActualReservas === 'activas' ? 'Activos & Pendientes' : 'Historial de Pagos & Reservas'}".
                    </td>
                </tr>
            `;
            return;
        }

        bookingsTableBody.innerHTML = listaARenderizar.map(r => {
            let badgeClass = 'status-pending';
            let badgeStyle = '';
            if (r.estadoPago === '✅ Pago confirmado' || r.estadoPago === 'Aprobado') {
                badgeClass = 'status-approved';
                badgeStyle = 'style="background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid #10B981; font-weight: 700; padding: 4px 8px; border-radius: 6px; display: inline-block;"';
            } else if (r.estadoPago === 'Rechazado' || r.estadoPago === '❌ Pago rechazado') {
                badgeClass = 'status-rejected';
            } else if (r.estadoPago === '⏳ Pago esperando aprobación' || (r.estadoPago && (r.estadoPago.includes('esperando') || r.estadoPago.includes('Revisión') || r.estadoPago.includes('Pendiente')))) {
                badgeClass = 'status-review';
                badgeStyle = 'style="background: rgba(255, 215, 0, 0.2); color: #FFD700; border: 1px solid #FFD700; font-weight: 700; padding: 4px 8px; border-radius: 6px; display: inline-block;"';
            }

            // Determinación visual del Método de Pago
            let metodoPagoHtml = '';
            const mPago = String(r.metodoPago || '').toLowerCase();
            if (mPago.includes('transferencia') || mPago.includes('mercado') || mPago.includes('mp') || r.comprobanteBase64) {
                metodoPagoHtml = `<span style="background: rgba(255, 102, 0, 0.15); color: #FF8800; border: 1px solid rgba(255, 102, 0, 0.3); padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-credit-card"></i> Transferencia (MP)</span>`;
            } else {
                metodoPagoHtml = `<span style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-building-columns"></i> En Secretaría (Físico)</span>`;
            }

            // Badge Visual de Asistencia
            let asistenciaHtml = '<span style="color: var(--color-text-muted); font-size: 0.8rem; font-style: italic;">⏳ Sin confirmar</span>';
            if (r.asistencia === 'Asistió') {
                asistenciaHtml = `<span style="background: rgba(59, 130, 246, 0.2); color: #60A5FA; border: 1px solid #3B82F6; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 800;"><i class="fa-solid fa-user-check"></i> Asistió</span>`;
            } else if (r.asistencia === 'No asistió') {
                asistenciaHtml = `<span style="background: rgba(239, 68, 68, 0.2); color: #EF4444; border: 1px solid #EF4444; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 800;"><i class="fa-solid fa-user-xmark"></i> No asistió</span>`;
            }

            const canchaTexto = r.canchaNombre || `Cancha ${r.canchaId}`;
            const horarioTexto = (r.horaInicio && r.horaFin) ? `${r.horaInicio} a ${r.horaFin} hs` : (r.horario || '-');
            const fechaTexto = r.fecha || '-';
            const montoTexto = `$${(r.precioTotal || r.monto || 12000).toLocaleString('es-AR')} ARS`;

            // 1. Botón de Comprobante
            let botonComprobanteHtml = r.comprobanteBase64 
                ? `<button class="btn-view-receipt" data-resid="${r.id}" title="Ver comprobante de transferencia adjunto" style="background: rgba(255, 215, 0, 0.15); border: 1px solid #FFD700; color: #FFD700; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; margin-bottom: 6px; transition: all 0.2s;"><i class="fa-solid fa-paperclip"></i> Ver Recibo Adjunto</button>` 
                : '';

            // 2. Estructura modular de la botonera de control
            let accionesHtml = '';
            const usrAdmin = window.DBHits ? window.DBHits.getActiveUser() : null;
            
            // Evaluamos si el método de pago corresponde al mostrador
            const mPagoParaAccion = String(r.metodoPago || '').toLowerCase();
            const esPagoFisico = mPagoParaAccion.includes('secretaría') || mPagoParaAccion.includes('físico');

            // Si es secretaría y el pago es Online/Transferencia, se bloquea. Si es físico, pasa de largo para mostrar los botones de Aprobar/Rechazar.
            if (usrAdmin && usrAdmin.role === 'secretaria' && !esPagoFisico) {
                accionesHtml = '<div style="text-align:center; color:#94A3B8; font-size:0.75rem; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);"><i class="fa-solid fa-eye"></i> Solo Lectura (Transferencia)</div>';
            } else if (subtabActualReservas === 'historial') {
                accionesHtml = `
                    <div style="padding: 8px 10px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; text-align: center; min-width: 190px;">
                        <span style="color: #94A3B8; font-size: 0.78rem; font-weight: 700; display: block; margin-bottom: 6px;"><i class="fa-solid fa-box-archive"></i> Turno Archivado & Resuelto</span>
                        ${botonComprobanteHtml}
                    </div>
                `;
            } else {
                accionesHtml = `
                    <div style="display: flex; flex-direction: column; gap: 8px; min-width: 210px; background: rgba(0, 0, 0, 0.25); padding: 10px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08);">
                        
                        <!-- SECCIÓN A: CONTROL DE PAGO -->
                        <div>
                            <span style="font-size: 0.68rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800; display: block; margin-bottom: 6px;">💰 Gestión de Pago:</span>
                            ${botonComprobanteHtml}
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                                <button class="btn-action-approve" data-resid="${r.id}" title="Confirmar pago de la reserva" style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10B981; color: #10B981; padding: 6px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.2s;">
                                    <i class="fa-solid fa-check"></i> Aprobar
                                </button>
                                <button class="btn-action-reject" data-resid="${r.id}" title="Rechazar pago y cancelar turno" style="background: rgba(239, 68, 68, 0.18); border: 1px solid #EF4444; color: #EF4444; padding: 6px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.2s;">
                                    <i class="fa-solid fa-xmark"></i> Rechazar
                                </button>
                            </div>
                        </div>

                        </div>
                    </div>
                `;
            }

            return `
                <tr>
                    <td data-label="Solicitante">
                        <strong>${r.usuarioNombre || 'Usuario'}</strong><br>
                        <small style="color: var(--color-text-muted);">${r.usuarioEmail || ''}</small><br>
                        <span style="font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; ${r.rolUsuario === 'socio' ? 'background: rgba(59, 130, 246, 0.2); color: #60A5FA; border: 1px solid #3B82F6;' : r.rolUsuario === 'alumno' ? 'background: rgba(16, 185, 129, 0.2); color: #34D399; border: 1px solid #10B981;' : 'background: rgba(255, 255, 255, 0.1); color: #CBD5E1; border: 1px solid rgba(255, 255, 255, 0.2);'}">
                            <i class="fa-solid ${r.rolUsuario === 'socio' ? 'fa-id-card' : r.rolUsuario === 'alumno' ? 'fa-graduation-cap' : 'fa-user'}"></i> ${(r.rolUsuario || 'usuario').toUpperCase()} ${r.descuentoAplicado === 'Sí' ? '(Descuento %)' : ''}
                        </span>
                    </td>
                    <td data-label="Cancha">${canchaTexto}</td>
                    <td data-label="Fecha & Turno">${fechaTexto} &bull; ${horarioTexto}</td>
                    <td data-label="Monto">${montoTexto}</td>
                    <td data-label="Método de Pago">${metodoPagoHtml}</td>
                    <td data-label="Estado Pago"><span class="status-badge ${badgeClass}" ${badgeStyle}>${r.estadoPago || '⏳ Pago esperando aprobación'}</span></td>
                    
                    <td data-label="Acciones" class="action-buttons-cell">
                        ${accionesHtml}
                    </td>
                </tr>
            `;
        }).join('');

        window.cargarTablaReservas = cargarTablaReservas;
        window.cargarTablaReservasFn = cargarTablaReservas;

        document.querySelectorAll('.btn-view-receipt').forEach(btn => {
            btn.addEventListener('click', () => {
                const resId = btn.dataset.resid;
                const resObj = reservas.find(r => String(r.id) === String(resId));
                if (resObj && resObj.comprobanteBase64) {
                    const win = window.open('', '_blank');
                    if (win) {
                        win.document.write(`
                            <!DOCTYPE html>
                            <html>
                                <head>
                                    <title>Comprobante de Pago ATH - Reserva #${resObj.id}</title>
                                    <style>
                                        body { margin: 0; background: #0a192f; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; box-sizing: border-box; }
                                        .card { background: rgba(16, 42, 77, 0.9); border: 1px solid #ff6600; padding: 24px; border-radius: 16px; max-width: 650px; width: 100%; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
                                        h2 { color: #ff6600; margin-top: 0; }
                                        p { margin: 6px 0; color: #cbd5e1; font-size: 0.95rem; }
                                        img { max-width: 100%; max-height: 65vh; border-radius: 12px; margin-top: 16px; border: 1px solid rgba(255,255,255,0.2); }
                                    </style>
                                </head>
                                <body>
                                    <div class="card">
                                        <h2>🎾 Comprobante de Pago ATH</h2>
                                        <p><strong>Solicitante:</strong> ${resObj.usuarioNombre} (${resObj.usuarioEmail || 'Sin email'})</p>
                                        <p><strong>Reserva:</strong> Cancha ${resObj.canchaId} &bull; ${resObj.fecha} (${resObj.horaInicio} a ${resObj.horaFin} hs)</p>
                                        <p><strong>Monto Total:</strong> $${(resObj.precioTotal || 0).toLocaleString('es-AR')} ARS</p>
                                        <img src="${resObj.comprobanteBase64}" alt="Captura del comprobante" />
                                    </div>
                                </body>
                            </html>
                        `);
                        win.document.close();
                    } else {
                        alert("Por favor autoriza las ventanas emergentes en tu navegador para auditar el comprobante.");
                    }
                }
            });
        });

        document.querySelectorAll('.btn-action-approve').forEach(btn => {
            btn.addEventListener('click', async () => {
                const resId = btn.dataset.resid;
                await window.DBHits.actualizarEstadoReserva(resId, '✅ Pago confirmado');
                alert("¡Pago aprobado y verificado correctamente! El estado de la reserva ha cambiado a '✅ Pago confirmado'.");
                cargarTablaReservas();
            });
        });

        document.querySelectorAll('.btn-action-reject').forEach(btn => {
            btn.addEventListener('click', async () => {
                const resId = btn.dataset.resid;
                await window.DBHits.actualizarEstadoReserva(resId, 'Rechazado');
                alert('La reserva ha sido rechazada/cancelada.');
                cargarTablaReservas();
            });
        });

        

        document.querySelectorAll('.btn-attend-no').forEach(btn => {
            btn.addEventListener('click', async () => {
                const resId = btn.dataset.resid;
                if (confirm("❓ ¿Estás seguro de marcar a este usuario como AUSENTE (No asistió)?")) {
                    await window.DBHits.actualizarAsistenciaReserva(resId, 'No asistió');
                    cargarTablaReservas();
                }
            });
        });
    }

    /* ==========================================================================
       MÓDULO 3: EDICIÓN DE CONTENIDO (PUBLICAR NOTICIAS Y TORNEOS)
       ========================================================================== */
    const newsPublishForm = document.getElementById('newsPublishForm');
    const tournamentPublishForm = document.getElementById('tournamentPublishForm');

    if (newsPublishForm) {
        newsPublishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.getElementById('newsTitle').value.trim();
            const fecha = document.getElementById('newsDate').value.trim();
            const tag = document.getElementById('newsTag').value.trim();
            const contenido = document.getElementById('newsContent').value.trim();

            if (!titulo || !fecha || !contenido) {
                alert('Por favor, completa los campos requeridos para la noticia.');
                return;
            }

            try {
                alert('¡Noticia publicada con éxito! Ya se encuentra disponible para los usuarios en noticias.html.');
                newsPublishForm.reset();
            } catch (err) {
                alert(`Error al publicar la noticia: ${err.message}`);
            }
        });
    }

    if (tournamentPublishForm) {
        tournamentPublishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.getElementById('tournTitle').value.trim();
            const modalidad = document.getElementById('tournCategory').value.trim();
            const fecha = document.getElementById('tournDate').value.trim();
            const descripcion = document.getElementById('tournDesc').value.trim();

            if (!titulo || !modalidad || !fecha) {
                alert('Por favor, completa los campos obligatorios del torneo.');
                return;
            }

            try {
                alert('¡Torneo publicado con éxito! Ya se encuentra visible en la agenda de torneos.html.');
                tournamentPublishForm.reset();
            } catch (err) {
                alert(`Error al publicar el torneo: ${err.message}`);
            }
        });
    }

    /* ==========================================================================
       MÓDULO 4: EDICIÓN DE PRECIOS Y TARIFAS OFICIALES
       ========================================================================== */
    const pricingForm = document.getElementById('pricingForm');

    if (pricingForm) {
        try {
            const savedPricing = JSON.parse(localStorage.getItem('ath_pricing_db'));
            if (savedPricing) {
                if (document.getElementById('priceCourtDay')) document.getElementById('priceCourtDay').value = savedPricing.priceCourtDay || 8000;
                if (document.getElementById('priceCourtNight')) document.getElementById('priceCourtNight').value = savedPricing.priceCourtNight || 12000;
                if (document.getElementById('priceCourtDaySocio')) document.getElementById('priceCourtDaySocio').value = savedPricing.priceCourtDaySocio || 6000;
                if (document.getElementById('priceCourtNightSocio')) document.getElementById('priceCourtNightSocio').value = savedPricing.priceCourtNightSocio || 9000;
                if (document.getElementById('priceCourtDayAlumno')) document.getElementById('priceCourtDayAlumno').value = savedPricing.priceCourtDayAlumno || 5000;
                if (document.getElementById('priceCourtNightAlumno')) document.getElementById('priceCourtNightAlumno').value = savedPricing.priceCourtNightAlumno || 8000;
                if (document.getElementById('priceEscuela')) document.getElementById('priceEscuela').value = savedPricing.priceEscuela || 25000;
                if (document.getElementById('priceAltoRend')) document.getElementById('priceAltoRend').value = savedPricing.priceAltoRend || 45000;
                if (document.getElementById('priceClaseParticular')) document.getElementById('priceClaseParticular').value = savedPricing.priceClaseParticular || 15000;
                if (document.getElementById('configTimeOpen')) document.getElementById('configTimeOpen').value = savedPricing.timeOpen || '08:00';
                if (document.getElementById('configTimeClose')) document.getElementById('configTimeClose').value = savedPricing.timeClose || '23:00';
                if (document.getElementById('configTimeNight')) document.getElementById('configTimeNight').value = savedPricing.timeNight || '18:30';
            }
        } catch(e) {}

        pricingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPricing = {
                priceCourtDay: document.getElementById('priceCourtDay').value,
                priceCourtNight: document.getElementById('priceCourtNight').value,
                priceCourtDaySocio: document.getElementById('priceCourtDaySocio').value,
                priceCourtNightSocio: document.getElementById('priceCourtNightSocio').value,
                priceCourtDayAlumno: document.getElementById('priceCourtDayAlumno').value,
                priceCourtNightAlumno: document.getElementById('priceCourtNightAlumno').value,
                priceEscuela: document.getElementById('priceEscuela').value,
                priceAltoRend: document.getElementById('priceAltoRend').value,
                priceClaseParticular: document.getElementById('priceClaseParticular').value,
                timeOpen: document.getElementById('configTimeOpen') ? document.getElementById('configTimeOpen').value : '08:00',
                timeClose: document.getElementById('configTimeClose') ? document.getElementById('configTimeClose').value : '23:00',
                timeNight: document.getElementById('configTimeNight') ? document.getElementById('configTimeNight').value : '18:30'
            };
            localStorage.setItem('ath_pricing_db', JSON.stringify(newPricing));
            alert('¡Tarifas y matriz de roles actualizadas con éxito en todo el sistema ATH!');
        });
    }

    /* ==========================================================================
       MÓDULO 5: GESTIÓN Y BLOQUEO DE CANCHAS & LIBERACIÓN EN TIEMPO REAL
       ========================================================================== */
    const adminCourtLockForm = document.getElementById('adminCourtLockForm');
    const adminLocksTableBody = document.getElementById('adminLocksTableBody');
    const lockDateInput = document.getElementById('lockDate');

    if (lockDateInput) {
        lockDateInput.value = new Date().toISOString().split('T')[0];
    }

    async function cargarTablaBloqueosYReservas() {
        if (!adminLocksTableBody) return;
        adminLocksTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Cargando lista de bloqueos y reservas...</td></tr>';

        try {
            const todasReservas = await window.DBHits.listarReservas();

            if (todasReservas.length === 0) {
                adminLocksTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--color-text-muted);">No hay bloqueos ni reservas registradas.</td></tr>';
                return;
            }

            todasReservas.sort((a, b) => (b.id - a.id));

            adminLocksTableBody.innerHTML = todasReservas.map(r => {
                const isLock = r.tipo === 'bloqueo_admin';
                const hFin = r.horaFin || r.hora;
                const badgeTipo = isLock 
                    ? `<span class="user-role-tag tag-admin" style="background: rgba(239, 68, 68, 0.2); color: #EF4444; border-color: #EF4444;"><i class="fa-solid fa-ban"></i> ${r.motivoBloqueo || 'Bloqueo Admin'}</span>`
                    : `<span class="user-role-tag tag-usuario"><i class="fa-solid fa-calendar-check"></i> Reserva Usuario (${r.estadoPago})</span>`;

                const usuarioDetalle = isLock
                    ? `<strong>Administración ATH</strong>`
                    : `<strong>${r.usuarioNombre || 'Usuario'}</strong><br><small style="color:var(--color-text-muted);">${r.usuarioEmail || ''}</small>`;

                return `
                    <tr>
                        <td data-label="Cancha"><strong>Cancha ${r.canchaId}</strong></td>
                        <td data-label="Fecha & Horario">${r.fecha}<br><span style="font-weight:700; color:var(--color-ath-orange);">${r.horaInicio} a ${hFin} hs</span></td>
                        <td data-label="Detalle / Usuario">${usuarioDetalle}</td>
                        <td data-label="Tipo / Motivo">${badgeTipo}</td>
                        <td data-label="Acción">
                            <button class="btn-action btn-reject delete-lock-btn" data-lockid="${r.id}" style="padding: 6px 12px; font-size: 0.8rem;">
                                <i class="fa-solid fa-trash-can"></i> ${isLock ? 'Eliminar Bloqueo' : 'Cancelar Reserva'}
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            document.querySelectorAll('.delete-lock-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const lockId = btn.dataset.lockid;
                    if (confirm('¿Estás seguro de que deseas eliminar esta reserva/bloqueo? La cancha quedará libre en tiempo real para otros usuarios.')) {
                        try {
                            await window.DBHits.eliminarReservaOBloqueo(lockId);
                            alert('¡Horario liberado con éxito en el sistema!');
                            cargarTablaBloqueosYReservas();
                            cargarTablaReservas();
                        } catch (err) {
                            alert(`Error al eliminar: ${err.message}`);
                        }
                    }
                });
            });

        } catch (err) {
            console.error("Error al cargar bloqueos:", err);
            adminLocksTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Error al cargar datos.</td></tr>';
        }
    }

    if (adminCourtLockForm) {
        adminCourtLockForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const canchaId = document.getElementById('lockCourtSelect').value;
            const fecha = document.getElementById('lockDate').value;
            const horaInicio = document.getElementById('lockStartTime').value;
            const horaFin = document.getElementById('lockEndTime').value;
            const motivoInput = document.getElementById('lockReasonInput') ? document.getElementById('lockReasonInput').value.trim() : '';
            const motivo = motivoInput !== '' ? motivoInput : 'Bloqueo Excepcional';

            if (!fecha || !horaInicio || !horaFin) {
                alert('Por favor, completa la fecha y las horas de inicio y fin del bloqueo.');
                return;
            }

            try {
                await window.DBHits.crearBloqueoAdministrativo({
                    canchaId,
                    fecha,
                    horaInicio,
                    horaFin,
                    motivo
                });

                alert(`🚫 ¡Bloqueo administrativo registrado con éxito! El horario (${horaInicio} a ${horaFin} hs) ha sido bloqueado en el sitio público.`);
                adminCourtLockForm.reset();
                if (lockDateInput) lockDateInput.value = new Date().toISOString().split('T')[0];

                cargarTablaBloqueosYReservas();
            } catch (err) {
                alert(`Error al crear el bloqueo: ${err.message}`);
            }
        });
    }

    // Inicializar Datos de Tablas
    cargarTablaUsuarios();
    cargarTablaReservas();
    cargarTablaBloqueosYReservas();
});

// MÓDULO DE REPORTES FINANCIEROS Y CSV
document.addEventListener('DOMContentLoaded', () => {
    const reportStartDate = document.getElementById('reportStartDate');
    const reportEndDate = document.getElementById('reportEndDate');
    const btnQuickThisWeek = document.getElementById('btnQuickThisWeek');
    const btnQuickLastWeek = document.getElementById('btnQuickLastWeek');
    const btnGenerateReport = document.getElementById('btnGenerateReport');
    const btnDownloadCSV = document.getElementById('btnDownloadCSV');
    const reportResultsBox = document.getElementById('reportResultsBox');
    const panelReportes = document.getElementById('panel-reportes-financieros');
    const btnHistorial = document.getElementById('btn-subtab-historial');

    // Mostrar panel de reportes solo en la pestaña Historial
    if (btnHistorial) {
        btnHistorial.addEventListener('click', () => {
            if (panelReportes) panelReportes.style.display = 'block';
        });
        const btnActivas = document.getElementById('btn-subtab-activas');
        if (btnActivas) {
            btnActivas.addEventListener('click', () => {
                if (panelReportes) panelReportes.style.display = 'none';
            });
        }
    }

    // Función para setear el rango de fechas (Lunes a Domingo)
    function setDateRange(offsetWeeks = 0) {
        const now = new Date();
        const dayOfWeek = now.getDay() || 7; // 1 (Lun) a 7 (Dom)
        
        const start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek + 1 + (offsetWeeks * 7));
        
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        if (reportStartDate) reportStartDate.value = start.toISOString().split('T')[0];
        if (reportEndDate) reportEndDate.value = end.toISOString().split('T')[0];
    }

    // Setear semana actual por defecto al cargar
    if (reportStartDate && reportEndDate) setDateRange(0);
    if (btnQuickThisWeek) btnQuickThisWeek.addEventListener('click', () => setDateRange(0));
    if (btnQuickLastWeek) btnQuickLastWeek.addEventListener('click', () => setDateRange(-1));

    let ultimaDataReporte = [];

    if (btnGenerateReport) {
        btnGenerateReport.addEventListener('click', async () => {
            try {
                const startVal = reportStartDate.value;
                const endVal = reportEndDate.value;
                if (!startVal || !endVal) return alert('Por favor, seleccioná la fecha Desde y Hasta.');

                const reservas = await window.DBHits.listarReservas();
                const tarifas = window.DBHits.getPricingRaw();
                const precioDia = parseFloat(tarifas.priceCourtDay) || 8000;
                const precioNoche = parseFloat(tarifas.priceCourtNight) || 12000;
                const excedenteLuz = precioNoche - precioDia;

                let totalHoras = 0;
                let totalHorasNocturnas = 0;
                ultimaDataReporte = [];

                // BLINDAJE DE ZONA HORARIA: Parseo manual para forzar hora local
                const sParts = startVal.split('-');
                const startOfWeek = new Date(parseInt(sParts[0],10), parseInt(sParts[1],10)-1, parseInt(sParts[2],10), 0, 0, 0);
                const eParts = endVal.split('-');
                const endOfWeek = new Date(parseInt(eParts[0],10), parseInt(eParts[1],10)-1, parseInt(eParts[2],10), 23, 59, 59);

                if (startOfWeek > endOfWeek) {
                    return alert('La fecha de inicio (Desde) no puede ser posterior a la fecha final (Hasta).');
                }

                let statsRoles = { usuario: { turnos: 0, ingresos: 0 }, socio: { turnos: 0, ingresos: 0 }, alumno: { turnos: 0, ingresos: 0 } };
                let turnosConfirmados = 0;
                let turnosPendientes = 0;
                let ingresosTransferencia = 0;
                let ingresosEfectivoSecretaria = 0;

                reservas.forEach(r => {
                    if (r.tipo === 'bloqueo_admin') return;

                    // PARSEO MANUAL DE FECHA PARA EVITAR FALLOS DE NAVEGADOR
                    const fechaStr = r.fecha || '';
                    let fechaReserva = new Date(2000, 0, 1);
                    
                    if (fechaStr.includes('-')) {
                        const parts = fechaStr.split('-');
                        fechaReserva = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
                    } else if (fechaStr.includes('/')) {
                        const parts = fechaStr.split('/');
                        fechaReserva = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10), 12, 0, 0);
                    }

                    if (fechaReserva >= startOfWeek && fechaReserva <= endOfWeek) {
                        const estadoStr = String(r.estadoPago || '').toLowerCase();
                        const isConfirmed = estadoStr.includes('confirmado') || estadoStr.includes('aprobado') || estadoStr.includes('✅');
                        
                        if (!isConfirmed) {
                            turnosPendientes++;
                            return; // No sumar al ingreso contable si no está pagado
                        }
                        
                        turnosConfirmados++;
                        const dur = parseFloat(r.duracionHoras) || 1.5;
                        totalHoras += dur;
                        
                        let horasNocheTurno = 0;
                        if (r.desglosePrecio && r.desglosePrecio.horasNoche) horasNocheTurno = parseFloat(r.desglosePrecio.horasNoche);
                        totalHorasNocturnas += horasNocheTurno;

                        const ingresoReserva = parseFloat(r.precioTotal) || 0;
                        const esSecretaria = String(r.metodoPago).toLowerCase().includes('secretar');
                        if (esSecretaria) {
                            ingresosEfectivoSecretaria += ingresoReserva;
                        } else {
                            ingresosTransferencia += ingresoReserva;
                        }
                        const rolRaw = r.rolUsuario ? String(r.rolUsuario).toLowerCase() : 'usuario';
                        const rol = statsRoles[rolRaw] ? rolRaw : 'usuario';
                        
                        statsRoles[rol].turnos += 1;
                        statsRoles[rol].ingresos += ingresoReserva;

                        ultimaDataReporte.push({
                            Fecha: r.fecha, Cancha: r.canchaId, Horario: `${r.horaInicio} a ${r.horaFin}`,
                            Cliente: r.usuarioNombre, Rol: rol.toUpperCase(), Pago: r.metodoPago,
                            Horas_Totales: dur.toFixed(2), Horas_Nocturnas: horasNocheTurno.toFixed(2), Ingreso: ingresoReserva
                        });
                    }
                });

                // FEEDBACK VISUAL PARA TURNOS SIN APROBAR
                if (turnosConfirmados === 0) {
                    if (turnosPendientes > 0) {
                        reportResultsBox.innerHTML = `
                            <div style="background: rgba(239, 68, 68, 0.15); border: 2px solid #EF4444; padding: 20px; border-radius: 12px; color: #FFF; text-align: center;">
                                <i class="fa-solid fa-triangle-exclamation" style="color: #EF4444; font-size: 2.5rem; margin-bottom: 12px;"></i>
                                <h3 style="margin: 0 0 10px 0; color: #FCA5A5;">¡Encontramos ${turnosPendientes} turno(s) en esta semana!</h3>
                                <p style="font-size: 0.95rem; margin: 0; line-height: 1.5;">
                                    Pero <strong>no están sumando dinero a la caja</strong> porque su estado es "⏳ Pago esperando aprobación".<br>
                                    Ve a la tabla de reservas de arriba y presiona el botón verde <strong>"✅ Aprobar"</strong> en cada turno para que la calculadora los registre.
                                </p>
                            </div>
                        `;
                    } else {
                        reportResultsBox.innerHTML = `<div style="background: rgba(255, 170, 0, 0.1); border: 1px solid #FFAA00; padding: 16px; border-radius: 8px; color: #FFF;"><i class="fa-solid fa-circle-info" style="color: #FFAA00;"></i> <strong>No se encontraron ingresos.</strong><br><span style="font-size: 0.85rem; color: #CBD5E1;">No hay reservas registradas del ${startOfWeek.toLocaleDateString('es-AR')} al ${endOfWeek.toLocaleDateString('es-AR')}.</span></div>`;
                    }
                    reportResultsBox.style.display = 'block';
                    if (btnDownloadCSV) btnDownloadCSV.style.display = 'none';
                    return;
                }

                const ingresoBase = totalHoras * precioDia;
                const ingresoExcedenteLED = totalHorasNocturnas * excedenteLuz;
                const totalFacturado = ingresoBase + ingresoExcedenteLED;

                reportResultsBox.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                        <div style="border-left: 3px solid #3B82F6; padding-left: 10px;">
                            <span style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase;">Total Horas Vendidas</span>
                            <div style="font-size: 1.4rem; color: #FFF; font-weight: 800;">${totalHoras.toFixed(1)} hs</div>
                            <div style="font-size: 0.75rem; color: #60A5FA;">(${totalHorasNocturnas.toFixed(1)} hs con LED)</div>
                        </div>
                        <div style="border-left: 3px solid #FF8800; padding-left: 10px;">
                            <span style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase;">Ingreso Base (Diurno)</span>
                            <div style="font-size: 1.4rem; color: #FFF; font-weight: 800;">$${ingresoBase.toLocaleString('es-AR')}</div>
                            <div style="font-size: 0.75rem; color: #FFD700;">Cotizado a $${precioDia}/h</div>
                        </div>
                        <div style="border-left: 3px solid #10B981; padding-left: 10px;">
                            <span style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase;">Excedente Iluminación (LED)</span>
                            <div style="font-size: 1.4rem; color: #FFF; font-weight: 800;">+ $${ingresoExcedenteLED.toLocaleString('es-AR')}</div>
                            <div style="font-size: 0.75rem; color: #34D399;">Diferencia extra nocturna</div>
                        </div>
                        <div style="border-left: 3px solid #A855F7; padding-left: 10px;">
                            <span style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase;">Total Bruto Semanal</span>
                            <div style="font-size: 1.6rem; color: #A855F7; font-weight: 900;">$${totalFacturado.toLocaleString('es-AR')}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 12px; margin-bottom: 16px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; flex-wrap: wrap;">
                        <div style="flex: 1; border-left: 3px solid #3B82F6; padding-left: 10px; min-width: 150px;">
                            <span style="font-size: 0.75rem; color: #94A3B8;">Cobrado por Transferencia</span>
                            <div style="font-size: 1.2rem; color: #FFF; font-weight: 800;">$${ingresosTransferencia.toLocaleString('es-AR')}</div>
                        </div>
                        <div style="flex: 1; border-left: 3px solid #10B981; padding-left: 10px; min-width: 150px;">
                            <span style="font-size: 0.75rem; color: #94A3B8;">Cobrado en Secretaría (Físico)</span>
                            <div style="font-size: 1.2rem; color: #FFF; font-weight: 800;">$${ingresosEfectivoSecretaria.toLocaleString('es-AR')}</div>
                        </div>
                    </div>
                    
                    <h5 style="color: var(--color-ath-orange); margin-bottom: 10px;"><i class="fa-solid fa-chart-pie"></i> Desglose por Segmento de Cliente</h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: 0.8rem; color: #CBD5E1; font-weight: 700; margin-bottom: 4px;"><i class="fa-solid fa-user"></i> Usuarios (Estándar)</div>
                            <div style="font-size: 1.2rem; color: #FFF; font-weight: 800;">$${statsRoles.usuario.ingresos.toLocaleString('es-AR')}</div>
                            <div style="font-size: 0.75rem; color: #94A3B8;">${statsRoles.usuario.turnos} alquiler(es)</div>
                        </div>
                        <div style="background: rgba(59, 130, 246, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
                            <div style="font-size: 0.8rem; color: #60A5FA; font-weight: 700; margin-bottom: 4px;"><i class="fa-solid fa-id-card"></i> Socios ATH</div>
                            <div style="font-size: 1.2rem; color: #FFF; font-weight: 800;">$${statsRoles.socio.ingresos.toLocaleString('es-AR')}</div>
                            <div style="font-size: 0.75rem; color: #94A3B8;">${statsRoles.socio.turnos} alquiler(es)</div>
                        </div>
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
                            <div style="font-size: 0.8rem; color: #34D399; font-weight: 700; margin-bottom: 4px;"><i class="fa-solid fa-graduation-cap"></i> Alumnos</div>
                            <div style="font-size: 1.2rem; color: #FFF; font-weight: 800;">$${statsRoles.alumno.ingresos.toLocaleString('es-AR')}</div>
                            <div style="font-size: 0.75rem; color: #94A3B8;">${statsRoles.alumno.turnos} alquiler(es)</div>
                        </div>
                    </div>
                `;
                reportResultsBox.style.display = 'block';
                if (btnDownloadCSV) btnDownloadCSV.style.display = ultimaDataReporte.length > 0 ? 'inline-block' : 'none';

            } catch (error) {
                reportResultsBox.innerHTML = `<div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #EF4444; padding: 16px; border-radius: 8px; color: #FFF;"><i class="fa-solid fa-bug"></i> <strong>Error interno:</strong> ${error.message}</div>`;
                reportResultsBox.style.display = 'block';
            }
        });
    }

    if (btnDownloadCSV) {
        btnDownloadCSV.addEventListener('click', () => {
            if (ultimaDataReporte.length === 0) return;
            const headers = Object.keys(ultimaDataReporte[0]).join(',');
            const rows = ultimaDataReporte.map(obj => Object.values(obj).join(',')).join('\n');
            const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Reporte_Contable_ATH_${reportStartDate.value}_al_${reportEndDate.value}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } // <-- CIERRE CORRECTO DE btnDownloadCSV

    const btnSuspenderClima = document.getElementById('btnSuspenderClima');
    if (btnSuspenderClima) {
        btnSuspenderClima.addEventListener('click', async () => {
            const dateVal = document.getElementById('weatherDate')?.value;
            const reasonVal = document.getElementById('weatherReason')?.value || 'Lluvia intensa';
            if (!dateVal) return alert('⚠️ Seleccioná la fecha para aplicar la suspensión masiva.');
            if (confirm(`🚨 ¿Estás seguro de suspender TODOS los turnos del ${dateVal} por mal tiempo?\n\nSe notificará a los jugadores afectados.`)) {
                try {
                    const afectadas = await window.DBHits.suspenderCanchasPorClima(dateVal, reasonVal);
                    alert(`🌧️ SUSPENSIÓN PROCESADA: Se cancelaron ${afectadas} turno(s) activos para el ${dateVal} y se notificó a los usuarios.`);
                    if (typeof window.cargarTablaReservas === 'function') window.cargarTablaReservas();
                } catch (err) {
                    alert(`Error al aplicar suspensión climática: ${err.message}`);
                }
            }
        });
    }
}); // <-- CIERRE MAESTRO DEL document.addEventListener


    // Lógica de Filtros Rápidos (Hoy, Mañana, Limpiar)
    document.addEventListener('click', (e) => {
        const btnHoy = e.target.closest('.btn-filter-hoy');
        const btnManana = e.target.closest('.btn-filter-manana');
        const btnClear = e.target.closest('.btn-filter-clear');
        
        if (btnHoy || btnManana || btnClear) {
            e.preventDefault();
            const dateInputs = document.querySelectorAll('.agendaDateFilterInput');
            let targetDate = '';

            if (btnHoy) {
                const today = new Date();
                const offset = today.getTimezoneOffset() * 60000;
                targetDate = (new Date(today - offset)).toISOString().split('T')[0];
            } else if (btnManana) {
                const tmr = new Date();
                tmr.setDate(tmr.getDate() + 1);
                const offset = tmr.getTimezoneOffset() * 60000;
                targetDate = (new Date(tmr - offset)).toISOString().split('T')[0];
            } // Si es btnClear, targetDate queda vacío

            dateInputs.forEach(input => input.value = targetDate);
            if (typeof cargarTablaReservas === 'function') cargarTablaReservas();
            if (typeof cargarTablaBloqueosYReservas === 'function') cargarTablaBloqueosYReservas();
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('agendaDateFilterInput')) {
            const allInputs = document.querySelectorAll('.agendaDateFilterInput');
            allInputs.forEach(input => input.value = e.target.value); // Sincronizar todos los inputs
            if (typeof cargarTablaReservas === 'function') cargarTablaReservas();
            if (typeof cargarTablaBloqueosYReservas === 'function') cargarTablaBloqueosYReservas();
        }
    });


    

    // Controladores de Plantilla Semanal y Vacaciones
    const formReglaSemanal = document.getElementById('formReglaSemanal');
    const listaReglasSemanales = document.getElementById('listaReglasSemanales');
    const diasNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    function renderizarReglasSemanales() {
        if (!listaReglasSemanales) return;
        const reglas = window.DBHits.getWeeklyRules();
        if (reglas.length === 0) {
            listaReglasSemanales.innerHTML = '<span style="color: #94A3B8; font-size: 0.8rem; font-style: italic;">No hay clases fijas configuradas.</span>';
            return;
        }
        listaReglasSemanales.innerHTML = reglas.map(r => `
            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 0.8rem; color: #FFF; line-height: 1.3;">
                    <strong style="color: var(--color-ath-orange);">${diasNombres[r.day]}</strong> &bull; ${r.start} a ${r.end} hs<br>
                    <span style="color: #CBD5E1;"><i class="fa-solid fa-graduation-cap"></i> ${r.label} (${r.court === 'TODAS' ? 'Todas las canchas' : 'Cancha ' + r.court})</span>
                </div>
                <button class="btn-borrar-regla" data-id="${r.id}" style="background: none; border: none; color: #EF4444; font-size: 1.1rem; cursor: pointer;"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `).join('');

        document.querySelectorAll('.btn-borrar-regla').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                let rules = window.DBHits.getWeeklyRules();
                rules = rules.filter(r => String(r.id) !== String(id));
                window.DBHits.saveWeeklyRules(rules);
                renderizarReglasSemanales();
            });
        });
    }

    if (formReglaSemanal) {
        renderizarReglasSemanales();
        formReglaSemanal.addEventListener('submit', (e) => {
            e.preventDefault();
            const startMin = timeStringToMinutes(document.getElementById('reglaInicio').value);
            const endMin = timeStringToMinutes(document.getElementById('reglaFin').value);
            if(startMin >= endMin) return alert("La hora de inicio debe ser anterior a la de fin.");

            const rules = window.DBHits.getWeeklyRules();
            rules.push({
                id: Date.now(),
                day: parseInt(document.getElementById('reglaDia').value),
                court: document.getElementById('reglaCancha').value,
                start: document.getElementById('reglaInicio').value,
                end: document.getElementById('reglaFin').value,
                label: document.getElementById('reglaNombre').value
            });
            window.DBHits.saveWeeklyRules(rules);
            formReglaSemanal.reset();
            renderizarReglasSemanales();
        });
    }

    const btnGuardarVacaciones = document.getElementById('btnGuardarVacaciones');
    const btnQuitarVacaciones = document.getElementById('btnQuitarVacaciones');
    const inputVacDesde = document.getElementById('vacacionesDesde');
    const inputVacHasta = document.getElementById('vacacionesHasta');

    if (inputVacDesde && inputVacHasta) {
        const currentVacs = window.DBHits.getVacationsDates ? window.DBHits.getVacationsDates() : null;
        if (currentVacs) {
            inputVacDesde.value = currentVacs.desde || '';
            inputVacHasta.value = currentVacs.hasta || '';
        }
        
        if (btnGuardarVacaciones) {
            btnGuardarVacaciones.addEventListener('click', () => {
                if(!inputVacDesde.value || !inputVacHasta.value) return alert('Selecciona la fecha Desde y Hasta para el receso.');
                if(inputVacDesde.value > inputVacHasta.value) return alert('La fecha "Desde" no puede ser mayor que "Hasta".');
                
                if(window.DBHits.setVacationsDates) window.DBHits.setVacationsDates(inputVacDesde.value, inputVacHasta.value);
                alert(`🏖️ Modo Vacaciones Programado.\nLas canchas estarán liberadas para alquiler público desde el ${inputVacDesde.value} hasta el ${inputVacHasta.value} (inclusive).`);
            });
        }

        if (btnQuitarVacaciones) {
            btnQuitarVacaciones.addEventListener('click', () => {
                if(window.DBHits.setVacationsDates) window.DBHits.setVacationsDates(null, null);
                inputVacDesde.value = '';
                inputVacHasta.value = '';
                alert('▶️ Receso cancelado. La plantilla semanal está activa nuevamente.');
            });
        }
    }
