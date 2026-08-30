import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find all the tab buttons
tabs = re.findall(r'<button class="tab-btn" data-tab="(.*?)">(.*?)</button>', content)
print("Tabs:", tabs)

# Find where 'clubAperturaInput' is located
idx = content.find('id="clubAperturaInput"')
while idx != -1:
    print("Found clubAperturaInput at:", idx)
    idx = content.find('id="clubAperturaInput"', idx + 1)