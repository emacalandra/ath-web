import os
import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace <script src="localfile.js"></script> with <script src="localfile.js" charset="UTF-8"></script>
    # Be careful not to replace if already there, or if it's an external URL (though external URL is fine too)
    # We'll specifically target db.js, script.js, admin.js, auth.js, perfil.js, etc.
    
    new_html = re.sub(r'<script\s+src="([^"]+\.js)"\s*></script>', r'<script src="\1" charset="UTF-8"></script>', html)
    
    if new_html != html:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Updated scripts in {filepath}")
