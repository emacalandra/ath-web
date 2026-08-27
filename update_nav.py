import os
import glob

# HTML files to update
html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We need to insert the new nav-item before the closing </ul> of .nav-list
    # The nav-list structure is something like:
    # <ul class="nav-list">
    #     <li class="nav-item"><a href="index.html"...>...</a></li>
    #     ...
    #     <li class="nav-item"><a href="historia.html"...>...</a></li>
    # </ul>
    
    # Let's search for "Historia" and insert after it
    if 'href="historia.html"' in content and 'href="contacto.html"' not in content:
        # Find the end of the list item containing historia.html
        hist_idx = content.find('href="historia.html"')
        if hist_idx != -1:
            li_end = content.find('</li>', hist_idx) + 5
            
            # Extract the indentation
            last_newline = content.rfind('\n', 0, hist_idx)
            indent = content[last_newline+1 : content.find('<', last_newline)]
            
            nav_item = f'\n{indent}<li class="nav-item"><a href="contacto.html" class="nav-link">Contacto y Staff</a></li>'
            
            content = content[:li_end] + nav_item + content[li_end:]
            
            # If the current file is contacto.html, make it active
            if filepath == 'contacto.html':
                content = content.replace('<a href="contacto.html" class="nav-link">', '<a href="contacto.html" class="nav-link active">')
                # Remove active from other links
                content = content.replace('class="nav-link active"', 'class="nav-link"')
                content = content.replace('<a href="contacto.html" class="nav-link">', '<a href="contacto.html" class="nav-link active">')

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated nav in {filepath}')