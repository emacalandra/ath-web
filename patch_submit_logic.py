import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """            const activeUser = getActiveUser();
            let userRole = activeUser ? activeUser.role : 'usuario';
            let isSecretaria = false;

            // MODO SECRETARA REEMPLAZA DATOS DEL USUARIO ACTIVO (QUE ES EL ADMIN) POR LOS DEL INPUT
            const secNombre = document.getElementById('secInputNombre');
            const secApellido = document.getElementById('secInputApellido');
            const secTel = document.getElementById('secInputTelefono');
            const secMetodo = document.getElementById('secInputMetodoPago');

            if (secNombre && activeUser && (activeUser.role === 'admin' || activeUser.role === 'secretaria')) {"""

# Try to find the exact target by accounting for potential Unicode decoding differences (e.g. Secretara)
target_regex = re.compile(r"const activeUser = getActiveUser\(\);\s*let userRole = activeUser \? activeUser\.role : 'usuario';\s*let isSecretaria = false;\s*// MODO SECRETAR[^A-Z]+A REEMPLAZA DATOS DEL USUARIO ACTIVO \(QUE ES EL ADMIN\) POR LOS DEL INPUT\s*const secNombre = document\.getElementById\('secInputNombre'\);\s*const secApellido = document\.getElementById\('secInputApellido'\);\s*const secTel = document\.getElementById\('secInputTelefono'\);\s*const secMetodo = document\.getElementById\('secInputMetodoPago'\);\s*if \(secNombre && activeUser && \(activeUser\.role === 'admin' \|\| activeUser\.role === 'secretaria'\)\) {")

replacement = """            const activeUser = getActiveUser();
            let userRole = activeUser ? activeUser.role : 'usuario';
            let isSecretaria = false;

            // MODO SECRETARIA REEMPLAZA DATOS DEL USUARIO ACTIVO (QUE ES EL ADMIN) POR LOS DEL INPUT
            const secNombre = document.getElementById('secInputNombre');
            const secApellido = document.getElementById('secInputApellido');
            const secTel = document.getElementById('secInputTelefono');
            const secMetodo = document.getElementById('secInputMetodoPago');
            const secDiscount = document.getElementById('secInputRolDescuento');

            if (secNombre && activeUser && (activeUser.role === 'admin' || activeUser.role === 'secretaria')) {
                if (secDiscount) {
                    userRole = secDiscount.value;
                }"""

if target_regex.search(js):
    js = target_regex.sub(replacement, js)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched widgetConfirmBtn event")
else:
    print("widgetConfirmBtn target not found")