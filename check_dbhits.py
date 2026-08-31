with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
match = re.search(r'window\.DBHits = new FirebaseDB\(\);', js)
if match:
    print("Found window.DBHits init")
else:
    print("NOT FOUND")