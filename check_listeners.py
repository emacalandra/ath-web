with open('admin.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'addEventListener' in line and not 'window' in line and not 'document' in line:
        print(f'{i+1}: {line.strip()}')