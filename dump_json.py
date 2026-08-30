import json
with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()
    
idx = content.find('Bienvenido/a')
if idx != -1:
    snippet = content[max(0, idx-10):idx+15]
    print(json.dumps(snippet))
    
idx2 = content.find('ATENCI')
if idx2 != -1:
    snippet2 = content[max(0, idx2-10):idx2+10]
    print(json.dumps(snippet2))