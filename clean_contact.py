with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Remove ALL "Guardar Datos del Contacto" buttons
html = re.sub(r'<button type="submit" class="btn-submit" style="background: var\(--color-ath-orange\); justify-content: center;"><i class="fa-solid fa-floppy-disk"></i> Guardar Datos del Contacto</button>\s*', '', html)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)