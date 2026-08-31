with open('script.js', 'rb') as f:
    content = f.read()

import re
match = re.search(b'Listo para tu pr(.*?)partido', content)
if match:
    print(match.group(1).hex())