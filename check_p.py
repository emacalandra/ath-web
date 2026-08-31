with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'id="admin-tab-canchas".*?id="admin-tab-staff"', html, re.DOTALL)
if match:
    for line in match.group(0).split('\n'):
        if '<p style="color: var(--color-text-muted); font-size: 0.88rem; margin-bottom: 16px;">' in line:
            print(line.strip())