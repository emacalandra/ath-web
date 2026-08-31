import glob, re

for filepath in glob.glob("*.html"):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    if "?v=" in html:
        print(f"FOUND ?v= in {filepath}")
        for line in html.split("\n"):
            if "?v=" in line:
                print(line.strip())