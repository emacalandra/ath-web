with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('initAdminStats();', '// initAdminStats(); // DESHABILITADO PORQUE NO ESTA DEFINIDO')

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(js)