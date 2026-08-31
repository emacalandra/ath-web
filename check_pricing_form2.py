with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
match = re.search(r'const pricingForm = document\.getElementById\(\'pricingForm\'\);.*?\n    \}', js, re.DOTALL)
if match:
    print(match.group(0))