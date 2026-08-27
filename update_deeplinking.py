import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

logic = '''
    // Procesar parámetros de URL para deep-linking desde notificaciones
    const urlParams = new URLSearchParams(window.location.search);
    const targetTab = urlParams.get('tab');
    const targetResId = urlParams.get('resId');
    const targetSearch = urlParams.get('search');

    if (targetTab) {
        const tabBtn = document.querySelector(.admin-tab-btn[data-admintab=""]);
        if (tabBtn) tabBtn.click();
    }

    if (targetResId || targetSearch) {
        const query = targetResId || targetSearch;
        const searchInput = document.getElementById('adminBookingsSearchInput') || document.getElementById('userSearchInput');
        if (searchInput) {
            searchInput.value = query;
            if (typeof cargarTablaReservas === 'function') cargarTablaReservas();
        }

        // Resaltar visualmente la fila específica si existe en pantalla
        setTimeout(() => {
            const fila = document.querySelector([data-resid=""])?.closest('tr');
            if (fila) {
                fila.scrollIntoView({ behavior: 'smooth', block: 'center' });
                fila.style.transition = 'all 0.5s ease';
                fila.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.9)';
                fila.style.borderColor = '#FFD700';
                setTimeout(() => {
                    fila.style.boxShadow = '';
                    fila.style.borderColor = '';
                }, 4000);
            }
        }, 300);
    }
'''

idx = js.rfind("});")
if idx != -1:
    js = js[:idx] + logic + "\n" + js[idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js)
    print("Added deep-linking to admin.js")