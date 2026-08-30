import sys
for f in ['admin.html', 'script.js', 'db.js', 'admin.js', 'index.html', 'contacto.html']:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            print(f"{f}: UTF-8 OK")
    except UnicodeDecodeError:
        print(f"{f}: UnicodeDecodeError in UTF-8")
        try:
            with open(f, 'r', encoding='latin-1') as file:
                content = file.read()
                print(f"{f}: Latin-1 OK")
        except Exception:
            pass