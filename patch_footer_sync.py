import re

with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """        // Sincronizar Footer
        const footerAddress = document.querySelector('.footer-social-wrapper p');
        if (footerAddress) {
            footerAddress.innerHTML = `<strong>Club Ciudad Verde</strong><br>${cfg.direccion}`;
        }
        const footerWpp = document.querySelector('.social-icon-btn.whatsapp');
        if (footerWpp) {
            footerWpp.href = `https://wa.me/${cfg.whatsapp}`;
        }"""

replacement = """        // Sincronizar Footer
        const footerAddress = document.querySelector('.footer-social-wrapper p');
        if (footerAddress) {
            footerAddress.innerHTML = `<strong>Club Ciudad Verde</strong><br>${cfgContact.direccion}`;
        }
        const footerWpp = document.querySelector('.social-icon-btn.whatsapp');
        if (footerWpp) {
            footerWpp.href = `https://wa.me/${cfgContact.whatsapp}`;
        }"""

if target in js:
    js = js.replace(target, replacement)
    with open("script.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched footer sync error")
else:
    print("Target not found.")