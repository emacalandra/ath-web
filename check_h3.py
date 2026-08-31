with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = re.findall(r'<h3 class="admin-card-title".*?</h3>', html)
for m in matches:
    print(m)