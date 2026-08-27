with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace loading logic
load_old = '''
            const emailInput = document.getElementById('clubEmailInput');
            const addressInput = document.getElementById('clubAddressInput');
            const wppInput = document.getElementById('clubWppInput');
            
            if (cfg && emailInput && addressInput && wppInput) {
                emailInput.value = cfg.email || '';
                addressInput.value = cfg.direccion || '';
                wppInput.value = cfg.whatsapp || '';
            }
'''
load_new = '''
            const emailInput = document.getElementById('clubEmailInput');
            const addressInput = document.getElementById('clubAddressInput');
            const wppInput = document.getElementById('clubWppInput');
            const aperturaInput = document.getElementById('clubAperturaInput');
            const cierreInput = document.getElementById('clubCierreInput');
            
            if (cfg && emailInput && addressInput && wppInput) {
                emailInput.value = cfg.email || '';
                addressInput.value = cfg.direccion || '';
                wppInput.value = cfg.whatsapp || '';
                if(aperturaInput) aperturaInput.value = cfg.apertura || '08:00';
                if(cierreInput) cierreInput.value = cfg.cierre || '23:00';
            }
'''
if 'clubAperturaInput' not in js:
    js = js.replace(load_old.strip(), load_new.strip())

# Replace saving logic
save_old = '''
            const nwCfg = {
                email: document.getElementById('clubEmailInput').value.trim(),
                direccion: document.getElementById('clubAddressInput').value.trim(),
                whatsapp: document.getElementById('clubWppInput').value.trim()
            };
'''
save_new = '''
            const nwCfg = {
                email: document.getElementById('clubEmailInput').value.trim(),
                direccion: document.getElementById('clubAddressInput').value.trim(),
                whatsapp: document.getElementById('clubWppInput').value.trim(),
                apertura: document.getElementById('clubAperturaInput') ? document.getElementById('clubAperturaInput').value : '08:00',
                cierre: document.getElementById('clubCierreInput') ? document.getElementById('clubCierreInput').value : '23:00'
            };
'''
js = js.replace(save_old.strip(), save_new.strip())

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('admin.js patched')