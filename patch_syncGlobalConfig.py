import re

with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """    function syncGlobalConfig() {
        if (!window.DBHits || typeof window.DBHits.getClubConfig !== 'function') return;
        const cfg = window.DBHits.getClubConfig();
        
        // Sincronizar modal de reserva
        const timeStart = document.getElementById('appTimeStart');
        const timeEnd = document.getElementById('appTimeEnd');
        if (timeStart) {
            timeStart.min = cfg.apertura;
            timeStart.max = cfg.cierre;
            const startLabel = timeStart.previousElementSibling;
            if (startLabel && startLabel.tagName === 'LABEL') {
                startLabel.innerHTML = `Inicio (Desde ${cfg.apertura})`;
            }
        }
        if (timeEnd) {
            timeEnd.min = cfg.apertura;
            timeEnd.max = cfg.cierre;
            const endLabel = timeEnd.previousElementSibling;
            if (endLabel && endLabel.tagName === 'LABEL') {
                endLabel.innerHTML = `Fin (Hasta ${cfg.cierre})`;
            }
        }"""

replacement = """    function syncGlobalConfig() {
        if (!window.DBHits || typeof window.DBHits.getClubConfig !== 'function') return;
        const cfgContact = window.DBHits.getClubConfig();
        
        let apertura = cfgContact.apertura;
        let cierre = cfgContact.cierre;
        if (typeof window.DBHits.obtenerHorariosDelDia === 'function') {
            const horarios = window.DBHits.obtenerHorariosDelDia(typeof currentWidgetDate !== 'undefined' ? currentWidgetDate : null);
            apertura = horarios.apertura;
            cierre = horarios.cierre;
        }

        // Sincronizar modal de reserva
        const timeStart = document.getElementById('appTimeStart');
        const timeEnd = document.getElementById('appTimeEnd');
        if (timeStart) {
            timeStart.min = apertura;
            timeStart.max = cierre;
            const startLabel = timeStart.previousElementSibling;
            if (startLabel && startLabel.tagName === 'LABEL') {
                startLabel.innerHTML = `Inicio (Desde ${apertura})`;
            }
        }
        if (timeEnd) {
            timeEnd.min = apertura;
            timeEnd.max = cierre;
            const endLabel = timeEnd.previousElementSibling;
            if (endLabel && endLabel.tagName === 'LABEL') {
                endLabel.innerHTML = `Fin (Hasta ${cierre})`;
            }
        }"""

if target in js:
    js = js.replace(target, replacement)
    with open("script.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched syncGlobalConfig")
else:
    print("Target not found.")