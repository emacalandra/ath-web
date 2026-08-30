import json
with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()
    
idx = content.find('Bienvenido/a')
if idx != -1:
    snippet = content[max(0, idx-10):idx+15]
    print(json.dumps(snippet))