with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
matches = re.finditer(r'((?:async )?function\s+\w*\s*\([^)]*\)\s*\{[^{}]*await)', js)
for m in matches:
    if 'async ' not in m.group(1):
        print(m.group(1))