with open('db.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

depth = 0
suspect_lines = []
for i, line in enumerate(lines):
    for ch in line:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
    # At class boundaries (depth 1), methods should close back to depth 1
    # If we see depth stay at 2 for a while, there's a missing }
    if depth == 1 and '}' in line and '{' not in line:
        # potential method close
        pass
    if i > 60 and i < 1395 and depth == 1 and '}' in line:
        suspect_lines.append((i+1, line.strip()[:80]))

# Report final 
print(f'Final depth: {depth}')

# Find the region: look for where depth goes to 2 and never comes back to 1
depth = 0
last_depth1_line = 0
for i, line in enumerate(lines):
    prev = depth
    for ch in line:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
    if depth == 1 and prev >= 1:
        last_depth1_line = i + 1
    if i + 1 == len(lines):
        print(f'Last time depth returned to 1: line {last_depth1_line}')