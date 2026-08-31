with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
js = re.sub(r'\(r.estadoPago && \(r\.estadoPago\.includes', r'(r.estadoPago && (String(r.estadoPago).includes', js)
js = re.sub(r'\|\| r\.estadoPago\.includes', r'|| String(r.estadoPago).includes', js)

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(js)