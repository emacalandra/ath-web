import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """                secFields.innerHTML = `
                    <div style="font-size: 0.85rem; color: #10B981; font-weight: bold; margin-bottom: 8px;"><i class="fa-solid fa-user-shield"></i> Modo Secretara: Cargar turno a cliente</div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="secInputNombre" placeholder="Nombre" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                        <input type="text" id="secInputApellido" placeholder="Apellido" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                    </div>
                    <input type="tel" id="secInputTelefono" placeholder="Telfono" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                    <div style="margin-top: 8px; font-size: 0.75rem; color: #FCA5A5;"><i class="fa-solid fa-clock"></i> El turno se agendar y el pago quedar <strong>Pendiente</strong> hasta que el cliente abone en el club.</div>
                `;
                confirmBtnEl.parentNode.insertBefore(secFields, confirmBtnEl);"""

replacement = """                secFields.innerHTML = `
                    <div style="font-size: 0.85rem; color: #10B981; font-weight: bold; margin-bottom: 8px;"><i class="fa-solid fa-user-shield"></i> Modo Secretara: Cargar turno a cliente</div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="secInputNombre" placeholder="Nombre" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                        <input type="text" id="secInputApellido" placeholder="Apellido" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                    </div>
                    <input type="tel" id="secInputTelefono" placeholder="Telfono" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff; margin-bottom: 8px;">
                    
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <select id="secInputRolDescuento" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                            <option value="usuario">Invitado (Tarifa Normal)</option>
                            <option value="socio">Tarifa Socio</option>
                            <option value="alumno">Tarifa Alumno ATH</option>
                        </select>
                        <select id="secInputMetodoPago" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                            <option value="Efectivo en Sede">Pago Pendiente (Efectivo)</option>
                            <option value="Pagado por Transferencia">Pagado por Transferencia</option>
                        </select>
                    </div>

                    <div style="font-size: 0.75rem; color: #FCA5A5;"><i class="fa-solid fa-clock"></i> Selecciona la tarifa del cliente para calcular el cobro exacto.</div>
                `;
                confirmBtnEl.parentNode.insertBefore(secFields, confirmBtnEl);
                
                const descSelect = document.getElementById('secInputRolDescuento');
                if (descSelect) {
                    descSelect.addEventListener('change', calculateAndVerifyMinuteByMinute);
                }"""

if target in js:
    js = js.replace(target, replacement)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched secFields UI")
else:
    print("UI target not found")