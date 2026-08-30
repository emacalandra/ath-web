with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# We will remove the broken syntax
js = re.sub(r'// ==========================================\n// MÓDULO: AGENDA OPERATIVA DE TURNOS.*', '', js, flags=re.DOTALL)

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(js)
    
print("Cleaned up broken admin.js")