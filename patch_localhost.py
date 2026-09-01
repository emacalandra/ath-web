import re

with open("db_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace localhost with relative path so it works on Render
js = js.replace("fetch('http://localhost:3000/api/send-whatsapp'", "fetch('/api/send-whatsapp'")

with open("db_v3.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Patched localhost in db_v3.js")