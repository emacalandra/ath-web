with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add event listeners inside DOMContentLoaded for time inputs to clear error
listener_logic = '''
    const tStart = document.getElementById('appTimeStart');
    const tEnd = document.getElementById('appTimeEnd');
    const bError = document.getElementById('appBookingError');
    if (tStart && tEnd && bError) {
        const clearErr = () => {
            if (bError.style.display !== 'none') {
                // Re-check
                if (window.currentWidgetCourt) {
                    const dateInput = document.getElementById('appDateSelect');
                    const isAvailable = window.DBHits.verificarDisponibilidad(window.currentWidgetCourt, dateInput.value, tStart.value, tEnd.value);
                    if (isAvailable) bError.style.display = 'none';
                }
            }
        };
        tStart.addEventListener('input', clearErr);
        tEnd.addEventListener('input', clearErr);
    }
'''

if 'const clearErr =' not in js:
    idx = js.find('// Elementos del Modal Legal Secundario')
    if idx != -1:
        js = js[:idx] + listener_logic + '\n    ' + js[idx:]
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print("script.js patched with clear error logic")