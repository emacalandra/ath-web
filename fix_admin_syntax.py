with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# Fix getHoyStr and getMananaStr
bad1 = r'return \$\{d\.getFullYear\(\)\}--;'
good1 = "return ${d.getFullYear()}--;"

js = re.sub(bad1, good1, js)

# Let's also check for any other stripped template literals in my turnos logic
# tbody.innerHTML = <tr><td colspan="4" style="text-align: center; color: #94A3B8;">No hay turnos próximos para los filtros seleccionados.</td></tr>;
# The string probably lost its backticks.
js = js.replace("tbody.innerHTML = <tr><td colspan=\"4\"", "tbody.innerHTML = <tr><td colspan=\"4\"")
js = js.replace("los filtros seleccionados.</td></tr>;", "los filtros seleccionados.</td></tr>;")

# tbody.innerHTML += 
#             <tr>
js = re.sub(r'tbody\.innerHTML \+= \s*<tr>', r'tbody.innerHTML += \n            <tr>', js)
js = re.sub(r'</tr>\s*;', r'</tr>\n        ;', js)

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(js)
    
print("Fixed admin.js syntax")