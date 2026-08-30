with open('admin.js', 'r', encoding='utf-8') as f:
    content = f.read()

turnos_logic = '''
// ==========================================
// MÓDULO: AGENDA OPERATIVA DE TURNOS
// ==========================================
function initAgendaTurnos() {
    const btnHoy = document.getElementById('btnFilterHoy');
    const btnManana = document.getElementById('btnFilterManana');
    const inputFecha = document.getElementById('inputFilterFecha');
    const btnClear = document.getElementById('btnFilterClear');

    const getHoyStr = () => {
        const d = new Date();
        return ${d.getFullYear()}--;
    };
    const getMananaStr = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return ${d.getFullYear()}--;
    };

    if(btnHoy) btnHoy.addEventListener('click', () => { inputFecha.value = getHoyStr(); cargarAgendaTurnos(); });
    if(btnManana) btnManana.addEventListener('click', () => { inputFecha.value = getMananaStr(); cargarAgendaTurnos(); });
    if(inputFecha) inputFecha.addEventListener('change', cargarAgendaTurnos);
    if(btnClear) btnClear.addEventListener('click', () => { inputFecha.value = ''; cargarAgendaTurnos(); });

    // Cargar por defecto hoy
    if(inputFecha && !inputFecha.value) inputFecha.value = getHoyStr();
    
    // Auto-update every 30s
    setInterval(cargarAgendaTurnos, 30000);
}

function timeToMinutes(tStr) {
    if(!tStr) return 0;
    const p = tStr.split(':');
    return parseInt(p[0])*60 + parseInt(p[1]);
}

window.cargarAgendaTurnos = function() {
    const tbody = document.getElementById('turnosTableBody');
    const inputFecha = document.getElementById('inputFilterFecha');
    if (!tbody || !window.DBHits) return;

    let reservas = window.DBHits.getReservasRaw().filter(r => r.estado === 'confirmada' || r.estado === 'pendiente_pago' || r.estado === 'bloqueada');
    
    if (inputFecha && inputFecha.value) {
        reservas = reservas.filter(r => r.fecha === inputFecha.value);
    }

    // Sort: closest date first, then closest time first
    reservas.sort((a, b) => {
        if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
        return timeToMinutes(a.horaInicio) - timeToMinutes(b.horaInicio);
    });

    // Remove past bookings if today
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const todayStr = ${now.getFullYear()}--;

    const filtered = reservas.filter(r => {
        if (r.fecha < todayStr) return false;
        if (r.fecha === todayStr && timeToMinutes(r.horaInicio) < currentMins) return false; // Ya pasó
        return true;
    });

    tbody.innerHTML = '';
    if (filtered.length === 0) {
        tbody.innerHTML = <tr><td colspan="4" style="text-align: center; color: #94A3B8;">No hay turnos próximos para los filtros seleccionados.</td></tr>;
        return;
    }

    filtered.forEach(r => {
        const isBloqueo = r.estado === 'bloqueada';
        const nombreStr = isBloqueo ? <span style="color: #EF4444;"><i class="fa-solid fa-lock"></i> Bloqueo: </span> : r.usuarioNombre;
        const colorHora = r.fecha === todayStr && (timeToMinutes(r.horaInicio) - currentMins < 60) ? '#34D399' : '#FFF'; // Verde si es en menos de 1 hr

        tbody.innerHTML += 
            <tr>
                <td></td>
                <td style="font-weight: 700; color: ;"> - </td>
                <td><span class="user-role-tag tag-socio" style="background: rgba(255,215,0,0.1); color: #FFD700; border: 1px solid rgba(255,215,0,0.3);">Cancha </span></td>
                <td style="font-weight: 600;"></td>
            </tr>
        ;
    });
}
'''
if 'initAgendaTurnos' not in content:
    content = content.replace('initAdminStats();', 'initAdminStats();\n    initAgendaTurnos();\n    if(typeof cargarAgendaTurnos==="function") cargarAgendaTurnos();')
    content += '\n' + turnos_logic
    with open('admin.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added turnos logic to admin.js")