import sys

def check_brackets(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    stack = []
    lines = content.split('\n')
    for i, line in enumerate(lines):
        # Very naive, ignores strings/comments
        for j, char in enumerate(line):
            if char in '{[(':
                stack.append((char, i+1))
            elif char in '}])':
                if not stack:
                    print(f'{filename}: Unmatched {char} at line {i+1}')
                    return
                top, _ = stack.pop()
                if (top == '{' and char != '}') or (top == '[' and char != ']') or (top == '(' and char != ')'):
                    print(f'{filename}: Mismatched {top} and {char} at line {i+1}')
                    return
    if stack:
        print(f'{filename}: Unclosed {stack[-1][0]} from line {stack[-1][1]}')
    else:
        print(f'{filename}: OK')

check_brackets('db.js')
check_brackets('script.js')
check_brackets('admin.js')