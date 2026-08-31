import re

with open("db.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """    verificarDisponibilidad(canchaId, fecha, horaInicio, horaFin) {
        // Verificar margen de 15 minutos de descanso/reacondicionamiento
        const reservas = this.getReservasRaw();"""

replacement = """    verificarDisponibilidad(canchaId, fecha, horaInicio, horaFin) {
        // 1. Validacion de tiempo pasado
        const now = new Date();
        const strFechaActual = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        const startNuevo = timeStringToMinutes(horaInicio);
        
        if (fecha < strFechaActual) {
            return { disponible: false, mensaje: '⛔ No se pueden reservar turnos en fechas pasadas.' };
        } else if (fecha === strFechaActual) {
            const minActuales = now.getHours() * 60 + now.getMinutes();
            if (startNuevo <= minActuales) {
                return { disponible: false, mensaje: '⛔ Este horario ya ha transcurrido en el día de hoy.' };
            }
        }

        // Verificar margen de 15 minutos de descanso/reacondicionamiento
        const reservas = this.getReservasRaw();"""

if target in js:
    js = js.replace(target, replacement)
    with open("db.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched verificarDisponibilidad.")
else:
    print("Could not find target string.")