document.addEventListener('DOMContentLoaded', async () => {
    const activeUser = window.DBHits ? window.DBHits.getActiveUser() : null;
    if (!activeUser) {
        alert('Acceso restringido. Debes iniciar sesión para acceder al portal.');
        window.location.href = 'index.html';
        return;
    }

    const userAvatarImg = document.getElementById('userAvatarImg');
    if (userAvatarImg) userAvatarImg.src = activeUser.avatarBase64 || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    document.getElementById('userNameDisplay').textContent = `${activeUser.nombre} ${activeUser.apellido || ''}`;
    document.getElementById('userDniDisplay').textContent = activeUser.dni || '-';
    document.getElementById('userEmailDisplay').textContent = activeUser.email || '-';
    document.getElementById('userPhoneDisplay').textContent = activeUser.telefono || '-';
    const roleStr = (activeUser.role || 'usuario').toLowerCase();
    let roleClass = 'tag-usuario';
    let roleIcon = 'fa-user';
    if (roleStr === 'admin') { roleClass = 'tag-admin'; roleIcon = 'fa-shield-halved'; }
    else if (roleStr === 'secretaria') { roleClass = 'tag-admin'; roleIcon = 'fa-address-book'; }
    else if (roleStr === 'socio') { roleClass = 'tag-socio'; roleIcon = 'fa-id-card'; }
    else if (roleStr === 'alumno') { roleClass = 'tag-alumno'; roleIcon = 'fa-graduation-cap'; }
    document.getElementById('userRoleBadge').innerHTML = `<span class="user-role-tag ${roleClass}"><i class="fa-solid ${roleIcon}"></i> ${(activeUser.role || 'usuario').toUpperCase()}</span>`;

    // Llenar Formulario de Ajustes
    const editNombre = document.getElementById('editNombre');
    const editApellido = document.getElementById('editApellido');
    const editDni = document.getElementById('editDni');
    const editTelefono = document.getElementById('editTelefono');
    const editEmail = document.getElementById('editEmail');
    
    if (editNombre) editNombre.value = activeUser.nombre || '';
    if (editApellido) editApellido.value = activeUser.apellido || '';
    if (editDni) editDni.value = activeUser.dni || '';
    if (editTelefono) editTelefono.value = activeUser.telefono || '';
    if (editEmail) editEmail.value = activeUser.email || '';

    async function cargarDatosPerfil() {
        if (typeof renderizarMisTurnos === 'function') renderizarMisTurnos();
        const reservas = await window.DBHits.listarReservas();
        const misReservas = reservas.filter(r => String(r.usuarioId) === String(activeUser.id) && r.tipo !== 'bloqueo_admin');
        misReservas.sort((a, b) => b.id - a.id);
        
        const tableBody = document.getElementById('userBookingsTableBody');
        if (tableBody) {
            if (misReservas.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Aún no tenés turnos registrados.</td></tr>';
            } else {
                tableBody.innerHTML = misReservas.map(r => `
                    <tr>
                        <td data-label="Cancha">Cancha ${r.canchaId}</td>
                        <td data-label="Fecha">${r.fecha} (${r.horaInicio} hs)</td>
                        <td data-label="Monto">$${(r.precioTotal || 0).toLocaleString('es-AR')}</td>
                        <td data-label="Estado">${r.estadoPago}</td>
                        <td data-label="Acción">-</td>
                    </tr>
                `).join('');
            }
        }

        const pendientes = misReservas.filter(r => r.estadoPago && r.estadoPago.includes('esperando'));
        const unpaidList = document.getElementById('unpaidBookingsList');
        if (unpaidList) {
            if (pendientes.length === 0) {
                unpaidList.innerHTML = '<div style="text-align:center; color: #10B981;">No hay pagos pendientes de revisión.</div>';
            } else {
                unpaidList.innerHTML = pendientes.map(p => `
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 8px; border-radius: 8px; border-left: 3px solid #FFD700;">
                        <strong>Cancha ${p.canchaId}</strong> - ${p.fecha} (${p.horaInicio} hs)
                        <div style="color: #FFD700; font-size: 0.8rem; margin-top: 4px;">⏳ Esperando verificación de Secretaría</div>
                    </div>
                `).join('');
            }
        }

        const notifList = document.getElementById('notificationsInboxList');
        const notifs = activeUser.notificaciones || [];
        if (notifList) {
            if (notifs.length === 0) {
                notifList.innerHTML = '<div style="text-align:center; color: #94A3B8;">Tu bandeja de entrada está vacía.</div>';
            } else {
                notifList.innerHTML = notifs.map(n => `
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 8px; border-radius: 8px; border-left: 3px solid ${n.tipo === 'success' ? '#10B981' : (n.tipo === 'error' ? '#EF4444' : '#3B82F6')};">
                        <div style="font-size: 0.9rem; color: #FFF;">${n.mensaje}</div>
                        <div style="color: #94A3B8; font-size: 0.75rem; margin-top: 4px;">${new Date(n.fecha).toLocaleString('es-AR')}</div>
                    </div>
                `).join('');
                window.DBHits.marcarNotificacionesLeidas(activeUser.id);
            }
        }
    }
    
    document.querySelectorAll('.admin-tab-btn[data-profiletab]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-btn[data-profiletab]').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.profile-tab-content').forEach(c => c.style.display = 'none');
            btn.classList.add('active');
            const target = document.getElementById(`profile-tab-${btn.dataset.profiletab}`);
            if (target) target.style.display = 'block';
        });
    });

    const profileUpdateForm = document.getElementById('profileUpdateForm');
    if (profileUpdateForm) {
        profileUpdateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const datosNuevos = {
                    nombre: editNombre.value,
                    apellido: editApellido.value,
                    dni: editDni.value,
                    telefono: editTelefono.value,
                    email: editEmail.value
                };
                await window.DBHits.actualizarPerfilUsuario(activeUser.id, datosNuevos);
                alert("¡Perfil actualizado con éxito!");
                window.location.reload();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const passwordChangeForm = document.getElementById('passwordChangeForm');
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPass = document.getElementById('newPassword').value;
            if (newPass.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");
            try {
                await window.DBHits.actualizarPasswordUsuario(activeUser.id, newPass);
                alert("Contraseña actualizada con éxito.");
                passwordChangeForm.reset();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    cargarDatosPerfil();
});