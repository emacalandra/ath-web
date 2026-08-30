with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make renderWidgetDayTimelineGrid global
if 'window.renderWidgetDayTimelineGrid = renderWidgetDayTimelineGrid;' not in js:
    # insert before window.location logic inside DOMContentLoaded
    idx = js.find('// 8. CONTROLADOR DE MODAL DE RESERVA INTERACTIVA ATH')
    if idx != -1:
        js = js[:idx] + 'window.renderWidgetDayTimelineGrid = renderWidgetDayTimelineGrid;\n    ' + js[idx:]

# Define sync functions globally
sync_functions = '''
window.syncRealtimeBookingUI = function() {
    // Si el usuario est viendo el modal de reserva unificada (cancha + hora)
    if (typeof window.generarHorariosUnificados === "function") {
        const inputFecha = document.getElementById("unifiedDateSelect");
        if (inputFecha && inputFecha.value) {
            window.generarHorariosUnificados();
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
};
'''

if 'window.syncRealtimeBookingUI' not in js:
    idx2 = js.find('document.addEventListener(\'DOMContentLoaded\', () => {')
    if idx2 != -1:
        js = js[:idx2] + sync_functions + '\n' + js[idx2:]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("script.js patched for realtime UI")