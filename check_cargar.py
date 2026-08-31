with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()
import re
match = re.search(r'async function cargarTablaReservas.*?\}\n    \}', js, re.DOTALL)
if match:
    with open('cargar_reservas.txt', 'w', encoding='utf-8') as out:
        out.write(match.group(0))