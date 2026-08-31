import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

pattern = re.compile(r'// Capturar datos de secretar\S+ si existen\s+const secNombre = document\.getElementById\(\'secInputNombre\'\)\?\.value\.trim\(\);\s+const secApellido = document\.getElementById\(\'secInputApellido\'\)\?\.value\.trim\(\);\s+const secTelefono = document\.getElementById\(\'secInputTelefono\'\)\?\.value\.trim\(\);\s+const finalNombre =.*?\s+const finalTelefono =.*?\s+const finalEstadoPago =.*?\s+const finalMetodoPago =.*?\s+// DOBLE CONFIRMACI\S+ ANTI-ERROR\s+const fechaFormateada =.*?\s+const userRole = activeUser \? activeUser\.role : \'usuario\';\s+const calculo = window\.DBHits\.calcularPrecioReserva\(horaInicio, duracionHoras, userRole\);')

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

if pattern.search(js):
    js = pattern.sub(replacement, js)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Replaced variables successfully!")
else:
    print("Regex failed to match!")