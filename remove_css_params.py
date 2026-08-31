import glob, re

for filepath in glob.glob("*.html"):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    html = re.sub(r'\.css\?v=[\d\.]+', '.css', html)
    html = re.sub(r'\.js\?v=[\d\.]+', '.js', html)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

print("Removed query parameters from all CSS and JS tags.")