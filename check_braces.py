with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Count braces
opens = js.count('{')
closes = js.count('}')
print(f'db.js: Open braces: {opens}, Close braces: {closes}, Diff: {opens - closes}')

with open('script.js', 'r', encoding='utf-8') as f:
    js2 = f.read()

opens2 = js2.count('{')
closes2 = js2.count('}')
print(f'script.js: Open braces: {opens2}, Close braces: {closes2}, Diff: {opens2 - closes2}')

with open('admin.js', 'r', encoding='utf-8') as f:
    js3 = f.read()

opens3 = js3.count('{')
closes3 = js3.count('}')
print(f'admin.js: Open braces: {opens3}, Close braces: {closes3}, Diff: {opens3 - closes3}')