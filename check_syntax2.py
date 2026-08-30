with open('admin.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines[1345:]):
    print(f"{i+1346}: {l.rstrip()}")