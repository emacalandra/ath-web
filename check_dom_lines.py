with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

lines = js.split('\n')
start = 0
for i, l in enumerate(lines):
    if 'DOMContentLoaded' in l:
        start = i
        break
for i in range(start, start+50):
    print(lines[i])