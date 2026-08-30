with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
old = r'window\.syncRealtimeUserUI = function\(\) \{[\s\S]*?const user = getActiveUser\(\);'
new = '''window.syncRealtimeUserUI = function() {
        console.log("SYNC REALTIME USER UI TRIGGERED");
        const user = getActiveUser();
        
        if (window.__ath_role_changed) {
            window.__ath_role_changed = false;
            // Mostramos un toast nativo de la app si existe, o un alert simple, y recargamos
            if (typeof showCmsToast === 'function') {
                showCmsToast('🎾 Tus permisos han sido actualizados. Aplicando cambios...');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                alert('🎾 Tus permisos han sido actualizados por la Administración. La página se recargará.');
                window.location.reload();
            }
            return;
        }
'''
if 'window.__ath_role_changed' not in js:
    js = re.sub(old, new, js)
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Patched script.js with reload logic")