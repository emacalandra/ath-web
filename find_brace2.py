with open('db.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Track depth more carefully, ignoring braces inside strings
depth = 0
for i, line in enumerate(lines):
    stripped = line.strip()
    # Skip comment lines
    if stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('/*'):
        continue
    
    in_string = None
    prev_char = ''
    for ch in line:
        if in_string:
            if ch == in_string and prev_char != '\\\\':
                in_string = None
        else:
            if ch in ['\"', \"'\", '\']:
                in_string = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
        prev_char = ch
    
    # Print where we're at depth 1 at the class level
    if depth == 2 and '{' in line:
        print(f'Line {i+1} (depth {depth}): {stripped[:100]}')

print(f'\\nFinal depth: {depth}')