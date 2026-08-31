with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

def safe_parse_replacement(match):
    key = match.group(1)
    fallback = match.group(2)
    return f'''let localData = {fallback};
                try {{
                    const raw = localStorage.getItem({key});
                    if (raw && raw !== 'undefined') localData = JSON.parse(raw) || {fallback};
                }} catch(e) {{
                    console.warn("Error parsing {key}", e);
                }}'''

# Pattern to find: const localData = JSON.parse(localStorage.getItem(XYZ)) || ABC;
js = re.sub(r'const localData = JSON\.parse\(localStorage\.getItem\((.*?)\)\) \|\| (.*?);', safe_parse_replacement, js)

with open('db.js', 'w', encoding='utf-8') as f:
    f.write(js)