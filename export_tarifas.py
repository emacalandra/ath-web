with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'(<div class="admin-tab-content" id="admin-tab-tarifas">.*?)(<div class="admin-tab-content" id="admin-tab-usuarios">)', html, re.DOTALL)
if match:
    with open('tarifas.txt', 'w', encoding='utf-8') as out:
        out.write(match.group(1))