import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

pattern = re.compile(r'secFields\.innerHTML\s*=\s*`.*?`;', re.DOTALL)

replacement = """secFields.innerHTML = `
                    <div style="font-size: 0.85rem; color: #10B981; font-weight: bold; margin-bottom: 8px;"><i class="fa-solid fa-user-shield"></i> Modo Secretara: Cargar turno a cliente</div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="secInputNombre" placeholder="Nombre" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                        <input type="text" id="secInputApellido" placeholder="Apellido" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                    </div>
                    <input type="tel" id="secInputTelefono" placeholder="WhatsApp" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff; margin-bottom: 8px;">
                    
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <select id="secInputRolDescuento" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;" title="Aplicar descuento">
                            <option value="usuario">Tarifa Invitado</option>
                            <option value="socio">Tarifa Socio</option>
                            <option value="alumno">Tarifa Alumno</option>
                        </select>
                        <select id="secInputMetodoPago" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                            <option value="Efectivo en Sede">Pago Pendiente</option>
                            <option value="Pagado por Transferencia">Ya Pagado</option>
                        </select>
                    </div>
                    <div style="font-size: 0.75rem; color: #FCA5A5;"><i class="fa-solid fa-clock"></i> Selecciona la tarifa para calcular el cobro exacto en el resumen.</div>
                `;"""

if pattern.search(js):
    js = pattern.sub(replacement, js)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Replaced innerHTML via regex.")
else:
    print("Regex not found.")