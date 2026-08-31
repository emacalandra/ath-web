with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()
import re
match = re.search(r'async function cargarTablaReservas.*?bookingsTableBody\.innerHTML = activeHtml \+ histHtml;', js, re.DOTALL)
if match:
    for i, l in enumerate(match.group(0).split('\n')):
        if '.split(' in l or '.length' in l or '.replace(' in l:
            print(f"{i}: {l.strip()}")