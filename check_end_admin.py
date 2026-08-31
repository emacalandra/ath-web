with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()
lines = js.split('\n')
for i, l in enumerate(lines[-30:]):
    print(f"{len(lines)-30+i}: {l}")