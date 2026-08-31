with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Remove the exact 4 injected lines
pattern = r'<p class="help-text"[^>]*>Ejemplo: Si el club cierra siempre a las 23:00.*?</p>\s*<p class="help-text"[^>]*>Ejemplo: Del 01/10 al 15/10.*?</p>\s*<p class="help-text"[^>]*>Ejemplo: Selecciona Cancha 1, fecha de hoy, de 14:00 a 16:00.*?</p>\s*<p class="help-text"[^>]*>Ejemplo: Agrega "Cancha 4" si construyeron una nueva.*?</p>\s*'

html_clean = re.sub(pattern, '', html, flags=re.DOTALL)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html_clean)