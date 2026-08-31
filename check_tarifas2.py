with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'id="admin-tab-tarifas".*?id="admin-tab-usuarios"', html, re.DOTALL)
if match:
    with open('tarifas.txt', 'w', encoding='utf-8') as out:
        out.write(match.group(0))