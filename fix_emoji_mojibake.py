import re
import glob

files = glob.glob('*.html') + glob.glob('*.js') + glob.glob('*.css')

def fix_mojibake(match):
    s = match.group(0)
    try:
        # The characters are Latin-1 range but actually represent UTF-8 bytes
        return s.encode('latin-1').decode('utf-8')
    except:
        return s

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # Match sequences of characters in the U+0080 - U+00FF range
    # Specifically, a UTF-8 emoji starts with 0xF0 (U+00F0) or 0xE2 (U+00E2)
    # So let's just find sequences of 3 to 4 characters in \u00c2-\u00f4 followed by \u0080-\u00bf
    # A simple regex for mojibaked utf-8:
    pattern = r'[\u00c2-\u00f4][\u0080-\u00bf]+'
    
    modified_content = re.sub(pattern, fix_mojibake, content)
    
    if modified_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        print(f"Fixed mojibake emojis in {f}")
