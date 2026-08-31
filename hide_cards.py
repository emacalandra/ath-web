import glob
import re

for filepath in glob.glob('*.html'):
    if 'test_' in filepath: continue
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Wrap <article class="court-card future-module">...</article> in comments
    html = re.sub(r'(<article class="court-card future-module".*?</article>)', r'<!-- \1 -->', html, flags=re.DOTALL)
    
    # Avoid nested comments if already commented
    html = html.replace('<!-- <!--', '<!--').replace('--> -->', '-->')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)