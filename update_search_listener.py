import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

logic = '''
    const adminSearch = document.getElementById('adminBookingsSearchInput');
    if (adminSearch) {
        adminSearch.addEventListener('input', () => {
            if (typeof cargarTablaReservas === 'function') {
                cargarTablaReservas();
            }
        });
    }
'''

# insert logic before the final line });
idx = js.rfind("});")
if idx != -1:
    js = js[:idx] + logic + "\n" + js[idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js)
    print("Added search input listener")