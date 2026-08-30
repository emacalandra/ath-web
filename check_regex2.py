with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# We see a huge block of duplicate inputs. Let's find exactly what text is repeated.
# Look for: <div class="form-group">\s*<label[^>]*>Hora de Apertura</label> ... all the way to button
# Actually, the user asked to fix the duplicate functions "como el horario de apertura y cierre".

# Let's extract the duplicated block
match = re.search(r'\s*<div class="form-group">\s*<label[^>]*>Hora de Apertura.*?(?=<div class="form-group">|<button|</div></div>)', content, re.DOTALL)
if match:
    print(match.group(0)[:200])
