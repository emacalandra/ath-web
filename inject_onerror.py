import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

if 'window.onerror' not in html:
    error_trap = '''<script>
window.onerror = function(msg, url, lineNo, columnNo, error) {
    fetch('/log', { method: 'POST', body: 'ERROR: ' + msg + ' at ' + url + ':' + lineNo + ':' + columnNo });
};
</script>'''
    html = html.replace('<head>', '<head>\n' + error_trap)
    with open('test_admin_debug.html', 'w', encoding='utf-8') as f:
        f.write(html)