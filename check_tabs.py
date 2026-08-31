with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'<div class="admin-tabs-nav">(.*?)</div>', html, re.DOTALL)
if match:
    print(match.group(1))