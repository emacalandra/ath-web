import re

with open("server.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """app.use(cors());
app.use(express.json({ limit: '10mb' }));"""

replacement = """app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Servir archivos estáticos del frontend (HTML, CSS, JS, etc.)
app.use(express.static(__dirname));"""

if target in js:
    js = js.replace(target, replacement)
    with open("server.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Added static file serving to server.js")
else:
    print("Static serving target not found")