with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

import re

# Look for 'cfg.' since we renamed it to 'cfgContact.'
matches = re.findall(r'cfg\.\w+', js)
if matches:
    print("Found 'cfg.' used:", set(matches))
else:
    print("No 'cfg.' usages found.")