with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
match = re.search(r'// Listener Tiempo Real: Contenido Visual CMS.*?\}\);(.*?// Listener Tiempo Real: Pricing y Horarios.*?\n            \}\);)', js, re.DOTALL)
if match:
    print(match.group(1))