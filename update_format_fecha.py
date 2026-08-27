import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\db.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

helper_logic = '''
function formatFechaArg(isoDate) {
    if (!isoDate) return '-';
    if (isoDate.includes('/')) return isoDate;
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return ${parts[2]}//;
}
'''

if 'function formatFechaArg(' not in js:
    # insert before const USERS_STORAGE_KEY
    idx = js.find('const USERS_STORAGE_KEY =')
    if idx != -1:
        js = js[:idx] + helper_logic + "\n" + js[idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(js)
        print("Added formatFechaArg helper")