with open('db.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines):
    for ch in line:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
    if depth < 0:
        print(f'Line {i+1}: depth went negative ({depth}): {line.strip()}')
        break
    if i+1 == len(lines):
        print(f'End of file: depth = {depth}')
        
# Now find the extra open brace:
# Scan looking for where depth increases unusually
depth = 0
for i, line in enumerate(lines):
    prev_depth = depth
    for ch in line:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
    if depth - prev_depth > 2:
        print(f'Line {i+1}: depth jumped from {prev_depth} to {depth}: {line.strip()[:80]}')