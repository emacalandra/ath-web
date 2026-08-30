import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\s*<div class="form-group">\s*<label[^>]*>Hora de Apertura</label>.*?id="clubCierreInput".*?</div>'
matches = list(re.finditer(pattern, content, re.DOTALL))
print(f"Found {len(matches)} duplicates of Apertura/Cierre inputs")

# I will remove ALL of them, and then explicitly insert ONE pair where it belongs.
# Wait, they are inside a <form>?