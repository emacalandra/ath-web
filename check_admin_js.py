import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# Let's see where 'MÓDULO 7' is
idx = js.find('MÓDULO 7: GESTIÓN DE STAFF')
print("Index of MODULO 7:", idx)
print("Total length:", len(js))