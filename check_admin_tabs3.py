import re
with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

tabs = re.findall(r'onclick="showAdminTab\(\'(.*?)\'\)"', content)
print(set(tabs))