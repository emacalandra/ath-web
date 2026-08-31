with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'Configuraci.n Global del Club.*?<div class="admin-card-actions">', html, re.DOTALL)
if match:
    print(match.group(0)[:1000])