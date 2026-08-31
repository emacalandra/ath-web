import glob, re

for filepath in glob.glob("*.html"):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    html = html.replace('src="db.js"', 'src="db_v3.js"')
    html = html.replace('src="script.js"', 'src="script_v3.js"')
    html = html.replace('src="admin.js"', 'src="admin_v3.js"')
    html = html.replace('href="styles.css"', 'href="styles_v3.css"')
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

print("Updated HTML files to point to _v3 files.")