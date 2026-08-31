import glob
import re

for filepath in glob.glob('*.html'):
    if filepath == 'old_admin.html': continue
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    new_html = re.sub(r'<script\s+src="([^"]+)"\s*></script>', r'<script src="\1" charset="UTF-8"></script>', html)
    
    if new_html != html:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Updated scripts in {filepath}")