with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

injection = '''<script>
window.onerror = function(msg, url, lineNo, columnNo, error) {
    const err = msg + ' at ' + lineNo + ':' + columnNo;
    let errs = JSON.parse(localStorage.getItem('admin_errors') || '[]');
    errs.push(err);
    localStorage.setItem('admin_errors', JSON.stringify(errs));
    return false;
};
window.addEventListener('unhandledrejection', function(event) {
    let errs = JSON.parse(localStorage.getItem('admin_errors') || '[]');
    errs.push('Promise: ' + event.reason);
    localStorage.setItem('admin_errors', JSON.stringify(errs));
});
</script>'''

if 'window.onerror' not in html:
    html = html.replace('<head>', '<head>\n' + injection)
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(html)