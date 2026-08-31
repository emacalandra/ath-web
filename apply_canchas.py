with open('admin.html', 'r', encoding='utf-8') as f:
    full_html = f.read()

with open('canchas_content_new.txt', 'r', encoding='utf-8') as f:
    new_canchas = f.read()

import re
full_html = re.sub(
    r'<div class="admin-tab-content" id="admin-tab-canchas">.*?<!-- MÓDULO',
    new_canchas + '<!-- MÓDULO',
    full_html,
    flags=re.DOTALL
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(full_html)