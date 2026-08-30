import glob

for f in ['script.js', 'db.js', 'admin.js', 'index.html']:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # search for 'Bienvenido'
    idx = content.find('Bienvenido')
    if idx != -1:
        snippet = content[max(0, idx-10):idx+15]
        print(f"Found in {f}: {repr(snippet)}")
        
    # search for 'Reservas sujetas'
    idx2 = content.find('Reservas sujetas')
    if idx2 != -1:
        snippet = content[max(0, idx2-15):idx2+20]
        print(f"Found in {f}: {repr(snippet)}")