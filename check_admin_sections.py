with open('admin.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

tarifas_idx = -1
canchas_idx = -1
for i, l in enumerate(lines):
    if 'id="admin-tab-tarifas"' in l:
        tarifas_idx = i
    if 'id="admin-tab-canchas"' in l:
        canchas_idx = i

print(f"Tarifas: {tarifas_idx}, Canchas: {canchas_idx}")