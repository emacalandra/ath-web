import re
import glob
import time

files = glob.glob('*.html')
v = str(int(time.time()))

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # Replace script.js and db.js and admin.js with a new version string
    content = re.sub(r'script\.js(\?v=\d+)?', f'script.js?v={v}', content)
    content = re.sub(r'db\.js(\?v=\d+)?', f'db.js?v={v}', content)
    content = re.sub(r'admin\.js(\?v=\d+)?', f'admin.js?v={v}', content)
    content = re.sub(r'styles\.css(\?v=\d+)?', f'styles.css?v={v}', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Busted cache in {f}")