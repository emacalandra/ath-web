with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update getClubConfig default
js = js.replace('''
            return JSON.parse(localStorage.getItem('ath_club_config')) || {
                email: 'contacto@academiatenishits.com',
                direccion: 'San Francisco, Córdoba, Argentina',
                whatsapp: '5493564000000'
            };
'''.strip(), '''
            let cfg = JSON.parse(localStorage.getItem('ath_club_config'));
            if (!cfg) {
                cfg = {
                    email: 'contacto@academiatenishits.com',
                    direccion: 'San Francisco, Córdoba, Argentina',
                    whatsapp: '5493564000000',
                    apertura: '08:00',
                    cierre: '23:00'
                };
            }
            if (!cfg.apertura) cfg.apertura = '08:00';
            if (!cfg.cierre) cfg.cierre = '23:00';
            return cfg;
'''.strip())

# 2. Update verificarDisponibilidad
# find: if (startNuevo < 8 * 60 || endNuevo > 23 * 60) {
old_val = "if (startNuevo < 8 * 60 || endNuevo > 23 * 60) {"
new_val = '''
        const cfg = this.getClubConfig();
        const startClub = timeStringToMinutes(cfg.apertura);
        const endClub = timeStringToMinutes(cfg.cierre);
        if (startNuevo < startClub || endNuevo > endClub) {
'''
js = js.replace(old_val, new_val.strip())

# 3. Update generarHorariosPosibles
# find: let startMin = 8 * 60; // 08:00
# find: const endMin = 23 * 60; // 23:00
old_start = "let startMin = 8 * 60; // 08:00"
new_start = '''
        const cfg = this.getClubConfig();
        let startMin = timeStringToMinutes(cfg.apertura);
'''
js = js.replace(old_start, new_start.strip())

old_end = "const endMin = 23 * 60; // 23:00"
new_end = "const endMin = timeStringToMinutes(cfg.cierre);"
js = js.replace(old_end, new_end)

with open('db.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('db.js patched')