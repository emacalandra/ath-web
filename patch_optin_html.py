import glob, re

target = """institucional del club.</p>"""
replacement = """institucional del club.</p>\n\n                <p><strong>Consentimiento de Notificaciones (Opt-in):</strong> Al registrarse, el usuario acepta expresamente recibir notificaciones transaccionales v&iacute;a WhatsApp (confirmaciones de reserva, alertas de pago y avisos de suspensi&oacute;n) al n&uacute;mero de tel&eacute;fono proporcionado, utilizando la API Oficial de Meta.</p>"""

for filepath in glob.glob("*.html"):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    if target in html:
        html = html.replace(target, replacement)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Patched {filepath}")

print("Opt-in added to HTML files.")