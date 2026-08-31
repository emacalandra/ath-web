lines = []
with open("script_v3.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "const secNombre = document.getElementById('secInputNombre')" in line:
        start_idx = i - 1
    if "const calculo = window.DBHits.calcularPrecioReserva(horaInicio, duracionHoras, userRole);" in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_block = """            // Capturar datos de secretaria si existen
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
            
            let finalEstadoPago = isSecretaria ? '\u23F3 Pago pendiente en Club' : '\u23F3 Pago esperando aprobacion';
            let finalMetodoPago = isSecretaria ? 'En Secretara (Efectivo/Fsico)' : selectedPaymentMethod;
            
            if (isSecretaria && secMetodoEl) {
                finalMetodoPago = secMetodoEl.value;
                if (finalMetodoPago === 'Pagado por Transferencia') {
                    finalEstadoPago = 'Aprobado';
                }
            }

            // DOBLE CONFIRMACION ANTI-ERROR
            const fechaFormateada = formatFriendlyDate(currentWidgetDate);
            const calculo = window.DBHits.calcularPrecioReserva(horaInicio, duracionHoras, finalUserRole);
"""
    lines[start_idx:end_idx+1] = [new_block]
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Patched block successfully.")
else:
    print("Could not find block.")