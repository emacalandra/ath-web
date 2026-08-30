import glob

files = glob.glob('*.html') + glob.glob('*.js')
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            if '\ufffd' in content:
                print(f"U+FFFD found in {f}")
    except Exception as e:
        print(f"Error {f}")