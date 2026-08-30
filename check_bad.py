import glob, re
for f in glob.glob('*.html') + glob.glob('*.js'):
    with open(f, 'r', encoding='utf-8') as file:
        c = file.read()
    bad = re.findall(r'[\u00c2-\u00f4][\u0080-\u00bf]+', c)
    if bad:
        print(f"Found {len(bad)} potential mojibake in {f}")