with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# Find all functions containing await
matches = re.finditer(r'(function.*?\{.*?await.*?\})', js, re.DOTALL)
for m in matches:
    func_str = m.group(1)
    if 'async function' not in func_str and '=>' not in func_str[:func_str.find('{')]:
        print("FOUND NON-ASYNC AWAIT:")
        print(func_str[:150])