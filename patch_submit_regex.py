import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """            // Capturar datos de secretara si existen
            const secNombre = document.getElementById('secInputNombre')?.value.trim();
            const secApellido = document.getElementById('secInputApellido')?.value.trim();
            const secTelefono = document.getElementById('secInputTelefono')?.value.trim();

            const finalNombre = isSecretaria && secNombre ? `${secNombre} ${secApellido || ''}`.trim() : (activeUser ? `${activeUser.nombre} ${activeUser.apellido || ''}` : 'Usuario');
            const finalTelefono = isSecretaria && secTelefono ? secTelefono : (activeUser ? activeUser.telefono : '');
            const finalEstadoPago = isSecretaria ? '? Pago pendiente en Club' : '? Pago esperando aprobacin';
            const finalMetodoPago = isSecretaria ? 'En Secretara (Efectivo/Fsico)' : selectedPaymentMethod;

            // DOBLE CONFIRMACI"N ANTI-ERROR
            const fechaFormateada = formatFriendlyDate(currentWidgetDate);
            const userRole = activeUser ? activeUser.role : 'usuario';
            const calculo = window.DBHits.calcularPrecioReserva(horaInicio, duracionHoras, userRole);"""

# The  chars can be tricky, so let's use regex
target_regex = re.compile(r"            // Capturar datos de secretar.a si existen\s*const secNombre = document\.getElementById\('secInputNombre'\)\?\.value\.trim\(\);\s*const secApellido = document\.getElementById\('secInputApellido'\)\?\.value\.trim\(\);\s*const secTelefono = document\.getElementById\('secInputTelefono'\)\?\.value\.trim\(\);\s*const finalNombre = isSecretaria && secNombre \? `\$\{secNombre\} \$\{secApellido \|\| ''\}`\.trim\(\) : \(activeUser \? `\$\{activeUser\.nombre\} \$\{activeUser\.apellido \|\| ''\}` : 'Usuario'\);\s*const finalTelefono = isSecretaria && secTelefono \? secTelefono : \(activeUser \? activeUser\.telefono : ''\);\s*const finalEstadoPago = isSecretaria \? '[^']*' : '[^']*';\s*const finalMetodoPago = isSecretaria \? '[^']*' : selectedPaymentMethod;\s*// DOBLE CONFIRMACI.\"N ANTI-ERROR\s*const fechaFormateada = formatFriendlyDate\(currentWidgetDate\);\s*const userRole = activeUser \? activeUser\.role : 'usuario';\s*const calculo = window\.DBHits\.calcularPrecioReserva\(horaInicio, duracionHoras, userRole\);")

replacement = """            // Capturar datos de secretaria si existen
            const secNombre = document.getElementById('secInputNombre')?.value.trim();
            const secApellido = document.getElementById('secInputApellido')?.value.trim();
            const secTelefono = document.getElementById('secInputTelefono')?.value.trim();
            const secDiscountEl = document.getElementById('secInputRolDescuento');
            const secMetodoEl = document.getElementById('secInputMetodoPago');

            let finalUserRole = activeUser ? activeUser.role : 'usuario';
            if (isSecretaria && secDiscountEl) {
                finalUserRole = secDiscountEl.value;
            }

            const finalNombre = isSecretaria && secNombre ? `${secNombre} ${secApellido || ''}`.trim() : (activeUser ? `${activeUser.nombre} ${activeUser.apellido || ''}` : 'Usuario');
            const finalTelefono = isSecretaria && secTelefono ? secTelefono : (activeUser ? activeUser.telefono : '');
            
            let finalEstadoPago = isSecretaria ? 'Pago pendiente en Club' : 'Pago esperando aprobacion';
            let finalMetodoPago = isSecretaria ? 'En Secretara (Efectivo/Fsico)' : selectedPaymentMethod;
            
            if (isSecretaria && secMetodoEl) {
                finalMetodoPago = secMetodoEl.value;
                if (finalMetodoPago === 'Pagado por Transferencia') {
                    finalEstadoPago = 'Aprobado';
                }
            }

            // DOBLE CONFIRMACION ANTI-ERROR
            const fechaFormateada = formatFriendlyDate(currentWidgetDate);
            const calculo = window.DBHits.calcularPrecioReserva(horaInicio, duracionHoras, finalUserRole);"""

if target_regex.search(js):
    js = target_regex.sub(replacement, js)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched widgetConfirmBtn event")
else:
    print("Regex target not found")