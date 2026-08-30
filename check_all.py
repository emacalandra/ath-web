import glob

files = glob.glob('*.html') + glob.glob('*.js')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if '\ufffd' in content:
        print(f"U+FFFD STILL FOUND in {f}!!!")
    if 'Ã³' in content or 'Ã' in content:
        print(f"MOJIBAKE STILL FOUND in {f}!!!")

print("Check finished.")