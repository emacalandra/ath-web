with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make cargarTablaUsuarios global
if 'window.cargarTablaUsuarios = cargarTablaUsuarios;' not in js:
    # insert at the end of the module or near the function
    idx = js.find('async function cargarTablaUsuarios')
    if idx != -1:
        # Find the end of the function block
        # Just append it to the window assignments
        idx2 = js.find('window.cargarTablaReservas = cargarTablaReservas;')
        if idx2 != -1:
            js = js[:idx2] + 'window.cargarTablaUsuarios = cargarTablaUsuarios;\n        ' + js[idx2:]
            with open('admin.js', 'w', encoding='utf-8') as f:
                f.write(js)
            print("admin.js patched with window.cargarTablaUsuarios")