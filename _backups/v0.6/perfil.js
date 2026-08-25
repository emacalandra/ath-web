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
    document.getElementById('userRoleBadge').innerHTML = `<span class="user-role-tag tag-usuario"><i class="fa-solid fa-user"></i> ${(activeUser.role || 'usuario').toUpperCase()}</span>`;

    // Generar Credencial Digital QR
    const qrContainer = document.getElementById('qrcode-container');
    if (qrContainer && typeof QRCode !== 'undefined') {
        const qrData = `ATH-USER-${activeUser.id}-${activeUser.dni || 'SINDNI'}`;
        new QRCode(qrContainer, {
            text: qrData,
            width: 140,
            height: 140,
            colorDark: '#071c33',
            colorLight: '#FFFFFF',
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    async function cargarDatosPerfil() {
        const reservas = await window.DBHits.listarReservas();
        const misReservas = reservas.filter(r => String(r.usuarioId) === String(activeUser.id) && r.tipo !== 'bloqueo_admin');
        
        const tableBody = document.getElementById('userBookingsTableBody');
        if (tableBody) {
            if (misReservas.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Aún no tenés turnos registrados.</td></tr>';
            } else {
                tableBody.innerHTML = misReservas.map(r => `
                    <tr>
                        <td>Cancha ${r.canchaId}</td>
                        <td>${r.fecha} (${r.horaInicio} hs)</td>
                        <td>$${(r.precioTotal || 0).toLocaleString('es-AR')}</td>
                        <td>${r.estadoPago}</td>
                        <td>-</td>
                    </tr>
                `).join('');
            }
        }
        const unpaidList = document.getElementById('unpaidBookingsList');
        if (unpaidList) unpaidList.innerHTML = '<div style="text-align:center; color: #10B981;">No hay pagos pendientes de revisión.</div>';
        const notifList = document.getElementById('notificationsInboxList');
        if (notifList) notifList.innerHTML = '<div style="text-align:center; color: #94A3B8;">Tu bandeja de entrada está vacía.</div>';
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
    cargarDatosPerfil();
});
