with open('canchas_content.txt', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# We will wrap the sections in divs and add a subtabs-container.

subtabs = '''<div class="subtabs-container" style="margin-bottom: 24px;">
        <button class="subtab-btn active" data-subtab="canchas-horarios"><i class="fa-solid fa-calendar-week"></i> 1. Horarios Fijos</button>
        <button class="subtab-btn" data-subtab="canchas-controles"><i class="fa-solid fa-triangle-exclamation"></i> 2. Controles Especiales</button>
        <button class="subtab-btn" data-subtab="canchas-monitor"><i class="fa-solid fa-desktop"></i> 3. Monitor de Canchas</button>
    </div>'''

html = re.sub(
    r'(<div class="admin-tab-content" id="admin-tab-canchas">.*?)(<!-- SECCIÓN 1: GESTIÓN DE HORARIOS FIJOS -->)',
    r'\1' + subtabs + r'\n    <div id="subtab-canchas-horarios" class="subtab-content active">\n    \2',
    html,
    flags=re.DOTALL
)

html = re.sub(
    r'(<!-- SECCIÓN 2: CONTROLES ESPECIALES Y EMERGENCIAS -->)',
    r'</div>\n\n    <div id="subtab-canchas-controles" class="subtab-content">\n    \1',
    html
)

html = re.sub(
    r'(<!-- SECCIÓN 3: MONITOR EN VIVO \(TABLA MAESTRA\) -->)',
    r'</div>\n\n    <div id="subtab-canchas-monitor" class="subtab-content">\n    \1',
    html
)

# And at the end of the module:
html = re.sub(r'</div>\s*$', '    </div>\n</div>\n', html)

with open('canchas_content_new.txt', 'w', encoding='utf-8') as f:
    f.write(html)