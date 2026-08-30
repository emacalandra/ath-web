with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()
import re
pattern = r'(\s*<div class="form-group">\s*<label[^>]*>Hora de Apertura</label>.*?saveClubConfigBtn.*?</div>\s*)'
matches = re.findall(pattern, content, re.DOTALL)
print('Number of matches:', len(matches))