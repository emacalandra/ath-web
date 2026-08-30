import re
with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

tabs = re.findall(r'<button class="admin-tab-btn.*?data-tab="(.*?)">(.*?)</button>', content, re.DOTALL)
for t in tabs:
    print(t[0], t[1].strip())