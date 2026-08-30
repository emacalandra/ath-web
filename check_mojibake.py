with open('script.js', 'r', encoding='utf-8') as file:
    content = file.read()
    if 'Ã³' in content or 'Ã¡' in content or 'Ã©' in content or 'Ã' in content:
        print('Mojibake FOUND in script.js')
    else:
        print('No Mojibake in script.js')

with open('admin.html', 'r', encoding='utf-8') as file:
    content = file.read()
    if 'Ã³' in content or 'Ã¡' in content or 'Ã©' in content or 'Ã' in content:
        print('Mojibake FOUND in admin.html')
    else:
        print('No Mojibake in admin.html')
        