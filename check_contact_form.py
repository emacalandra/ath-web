with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'(<form id="clubContactForm".*?</form>)', html, re.DOTALL)
if match:
    print(match.group(1))