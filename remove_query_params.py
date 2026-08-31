import glob, re

for filepath in glob.glob("*.html"):
    if "test_" in filepath:
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Remove ?v=... from .js files
    html = re.sub(r'\.js\?v=\d+', '.js', html)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

print("Removed query parameters from script tags.")