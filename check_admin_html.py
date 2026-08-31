with open("admin.html", "r", encoding="utf-8") as f:
    html = f.read()
if "script.js" in html and "db.js" in html and "admin.js" in html:
    print("All scripts present in admin.html")
else:
    print("MISSING SCRIPTS IN ADMIN.HTML")
    
if "<script" in html:
    for line in html.split("\n"):
        if "<script" in line:
            print(line.strip())