with open('admin.html', 'r', encoding='utf-8') as f:
    for line in f:
        if 'Correo Electr' in line:
            print(repr(line.strip()))
        if 'San Francisco, C' in line:
            print(repr(line.strip()))