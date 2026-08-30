with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()
import re
# Count occurrences of 'Configuraci\u00f3n Global del Club'
count = len(re.findall(r'Configuraci.n Global del Club', content))
print('Count of config blocks:', count)