with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'(<div class="admin-tab-content" id="admin-tab-tarifas">.*?)</form>', html, re.DOTALL)
if match:
    for line in match.group(0).split('\n'):
        if 'admin-card-title' in line or 'help-text' in line or 'color: var(--color-text-muted)' in line:
            print(line.strip())