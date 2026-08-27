import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\script.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

logic = '''            const cancheroPanelBtn = document.getElementById('cancheroPanelBtn');
            if (cancheroPanelBtn) {
                cancheroPanelBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'canchero.html';
                });
            }'''

if 'cancheroPanelBtn.addEventListener' not in js:
    js = js.replace("const adminPanelBtn = document.getElementById('adminPanelBtn');", logic + "\n            const adminPanelBtn = document.getElementById('adminPanelBtn');")
    
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated script.js with canchero panel btn")