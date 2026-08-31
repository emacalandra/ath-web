with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = re.findall(r'<p style="color: var\(--color-text-muted\).*?</p>', html)
for m in matches:
    print(m)