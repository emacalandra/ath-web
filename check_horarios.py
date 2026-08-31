with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'(<h3 class="admin-card-title"><i class="fa-solid fa-clock" style="color: var\(--color-ath-orange\);"></i> Horarios de Apertura y Cierre</h3>\s*<p style="color: var\(--color-text-muted\).*?</p>\s*<p class="help-text".*?</p>\s*)(.*?)(<h3 class="admin-card-title">|<form id="formClubConfig")', html, re.DOTALL)
if match:
    with open('horarios.txt', 'w', encoding='utf-8') as out:
        out.write(match.group(2))