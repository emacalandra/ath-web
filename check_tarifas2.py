with open('admin.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines[297:350]):
    print(l.rstrip())