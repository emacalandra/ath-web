import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target1 = """                secFields = document.createElement('div');
                secFields.id = 'secretariaBookingFields';
                secFields.style.cssText = "background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; border-radius: 8px; padding: 12px; margin-bottom: 14px;";
                secFields.innerHTML = `
                    <div style="font-size: 0.85rem; color: #10B981; font-weight: bold; margin-bottom: 8px;"><i class="fa-solid fa-user-shield"></i> Modo Secretara: Cargar turno a cliente</div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="secInputNombre" placeholder="Nombre" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                        <input type="text" id="secInputApellido" placeholder="Apellido" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                    </div>
                    <input type="tel" id="secInputTelefono" placeholder="WhatsApp (Ej: 3564123456)" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff; margin-bottom: 8px;">
                    <select id="secInputMetodoPago" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                        <option value="Efectivo en Sede">Pago en Efectivo (Sede)</option>
                        <option value="Transferencia">Pago por Transferencia</option>
                        <option value="Abono Especial">Abono Especial / Bonificado</option>
                    </select>
                `;
                confirmBtnEl.parentNode.insertBefore(secFields, confirmBtnEl);
            }
        }"""

replacement1 = """                secFields = document.createElement('div');
                secFields.id = 'secretariaBookingFields';
                secFields.style.cssText = "background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; border-radius: 8px; padding: 12px; margin-bottom: 14px;";
                secFields.innerHTML = `
                    <div style="font-size: 0.85rem; color: #10B981; font-weight: bold; margin-bottom: 8px;"><i class="fa-solid fa-user-shield"></i> Modo Secretara: Cargar turno a cliente</div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="secInputNombre" placeholder="Nombre" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                        <input type="text" id="secInputApellido" placeholder="Apellido" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                    </div>
                    <input type="tel" id="secInputTelefono" placeholder="WhatsApp (Ej: 3564123456)" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff; margin-bottom: 8px;">
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <select id="secInputRolDescuento" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;" title="Aplicar descuento">
                            <option value="usuario">Invitado (Sin Descuento)</option>
                            <option value="socio">Tarifa Socio</option>
                            <option value="alumno">Tarifa Alumno ATH</option>
                        </select>
                        <select id="secInputMetodoPago" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;" title="Mtodo de pago">
                            <option value="Efectivo en Sede">Efectivo en Sede</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Abono Especial">Abono / Bonificado</option>
                        </select>
                    </div>
                `;
                confirmBtnEl.parentNode.insertBefore(secFields, confirmBtnEl);
                
                const descSelect = document.getElementById('secInputRolDescuento');
                if (descSelect) {
                    descSelect.addEventListener('change', calculateAndVerifyMinuteByMinute);
                }
            }
        }"""

if target1 in js:
    js = js.replace(target1, replacement1)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched target1")
else:
    print("target1 not found")