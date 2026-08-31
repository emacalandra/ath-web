with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()
if "script.js" in html and "db.js" in html:
    print("All scripts present in index.html")
    for line in html.split("\n"):
        if "<script" in line:
            print(line.strip())