import re

with open("db.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """        // Verificar margen de 15 minutos de descanso/reacondicionamiento
        const reservas = this.getReservasRaw();
        const startNuevo = timeStringToMinutes(horaInicio);
        const endNuevo = timeStringToMinutes(horaFin);
        const canchaStr = String(canchaId);"""

replacement = """        // Verificar margen de 15 minutos de descanso/reacondicionamiento
        const reservas = this.getReservasRaw();
        const endNuevo = timeStringToMinutes(horaFin);
        const canchaStr = String(canchaId);"""

if target in js:
    js = js.replace(target, replacement)
    with open("db.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched db.js syntax error")
else:
    print("Target not found.")