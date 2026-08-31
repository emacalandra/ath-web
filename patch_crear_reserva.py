import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """                const nuevaReserva = await window.DBHits.crearReserva({
                    usuarioId: isSecretaria ? 'mostrador' : activeUser.id,
                    usuarioNombre: finalNombre,
                    usuarioEmail: activeUser.email,
                    usuarioTelefono: finalTelefono,
                    usuarioRole: activeUser.role || 'usuario',"""

replacement = """                const nuevaReserva = await window.DBHits.crearReserva({
                    usuarioId: isSecretaria ? 'mostrador' : activeUser.id,
                    usuarioNombre: finalNombre,
                    usuarioEmail: activeUser.email,
                    usuarioTelefono: finalTelefono,
                    usuarioRole: finalUserRole,"""

if target in js:
    js = js.replace(target, replacement)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched crearReserva call")
else:
    print("crearReserva target not found")