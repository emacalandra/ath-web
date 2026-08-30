import chardet

for f in ['admin.html', 'script.js', 'db.js', 'admin.js', 'index.html', 'contacto.html']:
    with open(f, 'rb') as file:
        rawdata = file.read()
        result = chardet.detect(rawdata)
        print(f"{f}: {result['encoding']}")