import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

logic = '''
    // ==========================================
    // RESTRICCIONES DE ACCESO POR ROL
    // ==========================================
    const currentUser = window.DBHits ? window.DBHits.getCurrentUser() : null;
    if (currentUser && currentUser.role === 'canchero') {
        // Ocultar todas las pestañas excepto 'canchas'
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-admintab') !== 'canchas') {
                btn.style.display = 'none';
            }
        });
        
        // Forzar cambio a la pestaña 'canchas'
        const canchasBtn = document.querySelector('.admin-tab-btn[data-admintab="canchas"]');
        if (canchasBtn) canchasBtn.click();
    }
'''

# Find the start of DOMContentLoaded
if 'RESTRICCIONES DE ACCESO' not in js:
    # Insert right after DOMContentLoaded starts
    idx = js.find("document.addEventListener('DOMContentLoaded', () => {")
    if idx != -1:
        # Find the end of the line
        end_idx = js.find('\n', idx)
        js = js[:end_idx+1] + logic + js[end_idx+1:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(js)
        print("Added role restriction to admin.js")
    else:
        print("DOMContentLoaded not found")