with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
match = re.search(r'// Listener Tiempo Real: Contenido Visual CMS.*?(?:pricing|})', js, re.DOTALL)
if match:
    print(match.group(0)[:1500])