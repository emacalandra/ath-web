with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'(<div class="admin-tabs-nav">.*?</div>)', html, re.DOTALL)
if match:
    with open('tabs_nav.txt', 'w', encoding='utf-8') as out:
        out.write(match.group(1))