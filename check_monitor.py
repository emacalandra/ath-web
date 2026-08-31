with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()
import re
match = re.search(r'Monitor de Canchas.*?</form>', html, re.DOTALL)
if match:
    for line in match.group(0).split('\n'):
        if 'class="admin-card-title"' in line or 'var(--color-text-muted)' in line:
            print(line.strip())