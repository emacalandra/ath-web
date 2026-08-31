with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
lines = html.split('\n')
for i, line in enumerate(lines):
    if 'Guardar Datos de Sede' in line or 'Contacto' in line or 'Guardar Datos de Contacto' in line or 'datos del contacto' in line:
        print(f"{i+1}: {line.strip()}")