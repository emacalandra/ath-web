import glob

for filepath in glob.glob('*.html'):
    with open(filepath, 'rb') as f:
        header = f.read(4)
        if header.startswith(b'\xff\xfe') or header.startswith(b'\xfe\xff'):
            print(f"{filepath} is UTF-16")