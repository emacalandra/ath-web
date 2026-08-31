import glob
import re

for filepath in glob.glob('*.html'):
    if 'test_' in filepath: continue
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Hide footer/nav links for Noticias and Torneos
    html = re.sub(r'(<li[^>]*><a[^>]*href="noticias.html".*?</a></li>)', r'<!-- \1 -->', html)
    html = re.sub(r'(<li[^>]*><a[^>]*href="torneos.html".*?</a></li>)', r'<!-- \1 -->', html)
    
    # Also if they were already .future-module but not hidden
    html = re.sub(r'(<li class="nav-item future-module".*?</li>)', r'<!-- \1 -->', html)
    html = re.sub(r'(<li class="future-module".*?</li>)', r'<!-- \1 -->', html)

    # 2. Change Contacto y Staff to Contacto
    html = html.replace('Contacto y Staff', 'Contacto')

    # 3. In admin.html, hide the future modules completely
    if filepath == 'admin.html':
        html = re.sub(r'(<button class="admin-tab-btn future-module".*?</button>)', r'<!-- \1 -->', html, flags=re.DOTALL)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print(f"Cleaned up {filepath}")