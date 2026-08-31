with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

js = js.replace("r.fecha.split('-').reverse().join('/')", "(r.fecha || '').split('-').reverse().join('/')")

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(js)