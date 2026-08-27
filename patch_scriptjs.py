with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

sync_logic = '''
    // Sincronizar configuraciones globales (horarios, footer, modal)
    function syncGlobalConfig() {
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
                startLabel.innerHTML = Inicio (Desde );
            }
        }
        if (timeEnd) {
            timeEnd.min = cfg.apertura;
            timeEnd.max = cfg.cierre;
            const endLabel = timeEnd.previousElementSibling;
            if (endLabel && endLabel.tagName === 'LABEL') {
                endLabel.innerHTML = Fin (Hasta );
            }
        }
        
        // Sincronizar Footer
        const footerAddress = document.querySelector('.footer-social-wrapper p');
        if (footerAddress) {
            footerAddress.innerHTML = <strong>Club Ciudad Verde</strong><br>;
        }
        const footerWpp = document.querySelector('.social-icon-btn.whatsapp');
        if (footerWpp) {
            footerWpp.href = https://wa.me/;
        }
    }
    syncGlobalConfig();
'''

if 'syncGlobalConfig()' not in js:
    lines = js.split('\n')
    lines.insert(55, sync_logic)
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print("script.js patched")