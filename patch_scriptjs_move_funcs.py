with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# Remove the previously injected sync_functions outside DOMContentLoaded
sync_funcs_pattern = r'window\.syncRealtimeBookingUI = function\(\) \{.*?\n\};\n\nwindow\.syncRealtimeUserUI = function\(\) \{.*?\n\};\n'
js = re.sub(sync_funcs_pattern, '', js, flags=re.DOTALL)

# Re-inject them INSIDE DOMContentLoaded (right after 'document.addEventListener("DOMContentLoaded", () => {')
sync_functions = '''
    window.syncRealtimeBookingUI = function() {
        // 1. Refrescar la grilla de agenda si existe
        if (typeof window.renderWidgetDayTimelineGrid === "function") {
            window.renderWidgetDayTimelineGrid();
        }
        
        // 2. Avisar en tiempo real si el usuario tiene el modal abierto y le acaban de ganar el turno
        const modalApp = document.getElementById('modalReservaApp') || document.getElementById('modalReservaUnificada');
        if (modalApp && modalApp.style.display !== 'none' && window.DBHits) {
            const timeStart = document.getElementById('appTimeStart');
            const timeEnd = document.getElementById('appTimeEnd');
            const dateInput = document.getElementById('appDateSelect');
            const errorEl = document.getElementById('appBookingError');
            
            if (timeStart && timeEnd && dateInput && window.currentWidgetCourt) {
                const isAvailable = window.DBHits.verificarDisponibilidad(
                    window.currentWidgetCourt,
                    dateInput.value,
                    timeStart.value,
                    timeEnd.value
                );
                if (!isAvailable) {
                    if (errorEl) {
                        errorEl.innerHTML = <i class="fa-solid fa-triangle-exclamation"></i> ¡ATENCIÓN! Otro usuario acaba de reservar este horario. Por favor, selecciona otro.;
                        errorEl.style.display = 'block';
                        errorEl.style.background = 'rgba(239, 68, 68, 0.2)';
                        errorEl.style.border = '1px solid #EF4444';
                        errorEl.style.color = '#FFF';
                    }
                } else {
                    if (errorEl && errorEl.innerHTML.includes('Otro usuario acaba de reservar')) {
                        errorEl.style.display = 'none';
                    }
                }
            }
        }
    };

    window.syncRealtimeUserUI = function() {
        const user = getActiveUser();
        renderUserNavbarState(user);
        initCmsVisualEditor(user);
        if (typeof window.cargarTablaUsuarios === "function") {
            const userSearchInput = document.getElementById('userSearchInput');
            window.cargarTablaUsuarios(userSearchInput ? userSearchInput.value : '');
        }
        
        // Ensure Admin Panel visibility rules apply if on admin.html
        if (window.location.pathname.toLowerCase().includes('admin.html')) {
            if (!user || (user.role !== 'admin' && user.role !== 'secretaria')) {
                alert('ACCESO DENEGADO: Tus permisos han sido revocados o modificados.');
                window.location.href = 'index.html';
            }
        }
    };
'''

idx = js.find('document.addEventListener(\'DOMContentLoaded\', () => {')
if idx != -1:
    # insert right after the opening brace
    insertion_point = js.find('{', idx) + 1
    js = js[:insertion_point] + '\n' + sync_functions + js[insertion_point:]
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("script.js patched to move sync functions inside DOMContentLoaded")