import re

with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """    function syncGlobalConfig() {
        if (!window.DBHits || typeof window.DBHits.getClubConfig !== 'function') return;
        const cfgContact = window.DBHits.getClubConfig();
        
        let apertura = cfgContact.apertura;
        let cierre = cfgContact.cierre;
        if (typeof window.DBHits.obtenerHorariosDelDia === 'function') {
            const horarios = window.DBHits.obtenerHorariosDelDia(typeof currentWidgetDate !== 'undefined' ? currentWidgetDate : null);"""

replacement = """    function syncGlobalConfig(overrideDate = null) {
        if (!window.DBHits || typeof window.DBHits.getClubConfig !== 'function') return;
        const cfgContact = window.DBHits.getClubConfig();
        
        let apertura = cfgContact.apertura;
        let cierre = cfgContact.cierre;
        if (typeof window.DBHits.obtenerHorariosDelDia === 'function') {
            const horarios = window.DBHits.obtenerHorariosDelDia(overrideDate);"""

if target in js:
    js = js.replace(target, replacement)
    
    # Now replace the call in the date pills listener
    js = js.replace(
        "if (typeof syncGlobalConfig === 'function') syncGlobalConfig();",
        "if (typeof syncGlobalConfig === 'function') syncGlobalConfig(currentWidgetDate);"
    )
    
    with open("script.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched TDZ issue in syncGlobalConfig")
else:
    print("Target not found.")