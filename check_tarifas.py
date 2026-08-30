import re
with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()
match = re.search(r'<form id="adminTarifasForm".*?</form>', content, re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Not found")