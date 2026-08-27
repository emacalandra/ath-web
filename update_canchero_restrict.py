import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# Remove the block I added earlier
block_to_remove = '''
    // ==========================================
    // RESTRICCIONES DE ACCESO POR ROL
    // ==========================================
    const currentUser = window.DBHits ? window.DBHits.getCurrentUser() : null;
    if (currentUser && currentUser.role === 'canchero') {
        // Ocultar todas las pestañas excepto 'canchas'
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-admintab') !== 'canchas') {
                btn.style.display = 'none';
            }
        });
        
        // Forzar cambio a la pestaña 'canchas'
        const canchasBtn = document.querySelector('.admin-tab-btn[data-admintab="canchas"]');
        if (canchasBtn) canchasBtn.click();
    }
'''
if block_to_remove in js:
    js = js.replace(block_to_remove, '')

canchero_logic = '''
        if (currentUser.role === 'canchero' || currentUser.role === 'encargado') {
            const navTabs = document.querySelector('.admin-tabs-nav');
            if (navTabs) navTabs.style.display = 'none';
            
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            const tabCanchas = document.getElementById('admin-tab-canchas');
            if (tabCanchas) {
                tabCanchas.classList.add('active');
            }
        }
'''

# insert after "if (currentUser.role === 'secretaria') { ... }"
# search for "                }
#            }, 100);
#        }"

search_str = "            }, 100);\n        }"
if search_str in js:
    js = js.replace(search_str, search_str + "\n" + canchero_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated admin.js restrictions properly")