import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

mod7_marker = '/* ==========================================================================\n       MÓDULO 7: GESTIÓN DE STAFF\n       ========================================================================== */'

if mod7_marker in js:
    # Remove it from wherever it is
    js_without = js.split(mod7_marker)[0]
    mod7_content = mod7_marker + js.split(mod7_marker)[1]
    
    # Check if there is a closing }); at the end of js_without
    # The original admin.js ended with:
    #     }); // Cierre de DOMContentLoaded
    # or just });
    
    # We will insert mod7_content right before the last });
    last_brace = js_without.rfind('});')
    
    if last_brace != -1:
        new_js = js_without[:last_brace] + '\n' + mod7_content + '\n' + js_without[last_brace:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_js)
        print("Fixed admin.js scoping")
    else:
        print("Could not find closing brace")