with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
match = re.search(r'Listo para tu pr.*partido', js)
if match:
    print(repr(match.group(0)))