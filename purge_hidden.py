import glob
import re

for filepath in glob.glob('*.html'):
    if 'test_' in filepath: continue
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Completely remove <li> tags containing href to noticias.html, torneos.html, clases.html, construccion.html, historia.html
    html = re.sub(r'<li[^>]*>\s*(<!--\s*)?<a[^>]*href="(noticias|torneos|clases|construccion|historia)\.html".*?</a>(\s*-->)?\s*</li>', '', html)
    
    # Clean up double comments if any
    html = html.replace('<!-- <!--', '<!--').replace('--> -->', '-->')
    
    # Completely remove any <li> that has .future-module just to be safe
    html = re.sub(r'<li[^>]*future-module[^>]*>.*?</li>', '', html, flags=re.DOTALL)
    
    # Remove any stray commented out <li> elements that contain those keywords
    html = re.sub(r'<!--\s*<li[^>]*>.*?href="(noticias|torneos|clases|construccion|historia)\.html".*?</li>\s*-->', '', html, flags=re.DOTALL)
    
    # In admin.html, remove future-module tabs completely
    if filepath == 'admin.html':
        html = re.sub(r'<!--\s*<button[^>]*future-module[^>]*>.*?</button>\s*-->', '', html, flags=re.DOTALL)
        html = re.sub(r'<button[^>]*future-module[^>]*>.*?</button>', '', html, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print(f"Purged future modules from {filepath}")