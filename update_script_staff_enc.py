import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\script.js'
try:
    with open(filepath, 'r', encoding='utf-8') as f:
        js = f.read()
except UnicodeDecodeError:
    with open(filepath, 'r', encoding='latin-1') as f:
        js = f.read()

render_logic = '''
    // ==========================================
    // RENDERIZADO DE CONTACTO Y STAFF
    // ==========================================
    const publicStaffGrid = document.getElementById('publicStaffGrid');
    if (publicStaffGrid && window.DBHits) {
        const staff = window.DBHits.getStaffRaw ? window.DBHits.getStaffRaw() : [];
        publicStaffGrid.innerHTML = '';
        if (staff.length === 0) {
            publicStaffGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#94A3B8;">Próximamente...</div>';
        } else {
            staff.forEach(s => {
                const avatar = s.foto ? s.foto : 'assets/avatar.png';
                publicStaffGrid.innerHTML += 
                    <div class="class-card reveal-element" style="text-align: center; padding: 30px 20px;">
                        <img src="" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-ath-orange); margin-bottom: 16px; box-shadow: 0 4px 15px rgba(255, 102, 0, 0.3);" onerror="this.src='assets/avatar.png'">
                        <h3 style="color: #FFF; font-size: 1.25rem; margin-bottom: 4px;"></h3>
                        <div style="color: var(--color-ath-orange); font-size: 0.9rem; font-weight: 700; margin-bottom: 16px;"></div>
                        <p style="color: var(--color-text-muted); font-size: 0.88rem; line-height: 1.5;"></p>
                    </div>
                ;
            });
        }
    }

    const publicContactData = document.getElementById('publicContactData');
    if (publicContactData && window.DBHits) {
        const clubInfo = window.DBHits.getClubConfig ? window.DBHits.getClubConfig() : {
            email: 'contacto@academiatenishits.com',
            direccion: 'San Francisco, Córdoba, Argentina',
            whatsapp: '5493564000000'
        };
        
        publicContactData.innerHTML = 
            <div class="contact-card-item" style="background: rgba(255,255,255,0.03); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center; min-width: 250px;">
                <i class="fa-solid fa-envelope" style="font-size: 2rem; color: var(--color-ath-orange); margin-bottom: 16px;"></i>
                <h4 style="color: #FFF; margin-bottom: 8px;">Correo Electrónico</h4>
                <p style="color: #94A3B8; font-size: 0.9rem;"></p>
            </div>
            <div class="contact-card-item" style="background: rgba(255,255,255,0.03); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center; min-width: 250px;">
                <i class="fa-solid fa-location-dot" style="font-size: 2rem; color: var(--color-ath-orange); margin-bottom: 16px;"></i>
                <h4 style="color: #FFF; margin-bottom: 8px;">Ubicación</h4>
                <p style="color: #94A3B8; font-size: 0.9rem;"></p>
            </div>
            <div class="contact-card-item" style="background: rgba(255,255,255,0.03); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center; min-width: 250px;">
                <i class="fa-brands fa-whatsapp" style="font-size: 2rem; color: #10B981; margin-bottom: 16px;"></i>
                <h4 style="color: #FFF; margin-bottom: 8px;">WhatsApp Oficial</h4>
                <p style="color: #94A3B8; font-size: 0.9rem;">+</p>
                <a href="https://wa.me/" target="_blank" class="btn-submit" style="background: #10B981; padding: 8px 16px; border-radius: 20px; font-size: 0.8rem; margin-top: 12px; display: inline-flex; width: auto;"><i class="fa-solid fa-comment-dots"></i> Enviar Mensaje</a>
            </div>
        ;
    }
'''

if 'RENDERIZADO DE CONTACTO Y STAFF' not in js:
    # insert before the end of DOMContentLoaded
    idx = js.rfind('// Helper de fecha')
    if idx != -1:
        js = js[:idx] + render_logic + '\n' + js[idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(js)
        print('Updated script.js with contact/staff render logic')
    else:
        print('Could not find injection point in script.js')