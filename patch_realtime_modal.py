with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

new_sync_logic = '''
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
                    errorEl.innerHTML = <i class="fa-solid fa-triangle-exclamation"></i> ATENCIN! Otro usuario acaba de reservar este horario. Por favor, selecciona otro.;
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
'''

# Find the old window.syncRealtimeBookingUI and replace it
import re
js = re.sub(r'window\.syncRealtimeBookingUI = function\(\) \{.*?\n\};', new_sync_logic.strip(), js, flags=re.DOTALL)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("script.js patched with real-time modal warning")