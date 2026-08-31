with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
# Match from "MÓDULO 7" down to the next module or end of block
js = re.sub(r'/\* =+ \s*M[OÓ]DULO 7: GESTI[OÓ]N DE STAFF.*?/\* =+', '/* ==========================================================================\n       ', js, flags=re.DOTALL)

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(js)