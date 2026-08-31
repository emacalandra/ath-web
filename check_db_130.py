with open('db.js', 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')
for i in range(max(0, 125), min(len(lines), 135)):
    print(f"{i+1}: {lines[i]}")