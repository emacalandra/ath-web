with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'id="admin-tab-canchas".*?(id="admin-tab-staff"|<!-- MÓDULO)', html, re.DOTALL)
if match:
    for line in match.group(0).split('\n'):
        if '<p' in line and 'var(--color-text-muted)' in line:
            print(line.strip())