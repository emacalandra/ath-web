import re
with open("admin.html", "r", encoding="utf-8") as f:
    html = f.read()
forms = re.findall(r'<form[^>]+id="([^"]+)"', html)
print("Forms:", forms)