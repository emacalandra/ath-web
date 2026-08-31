with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'Controles Especiales y Emergencias.*?Monitor de Canchas', html, re.DOTALL)
if match:
    lines = match.group(0).split('\n')
    for i, line in enumerate(lines):
        if 'class="admin-card-title"' in line or 'var(--color-text-muted)' in line:
            print(f"{i}: {line.strip()}")