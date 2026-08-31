import re

with open("db_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """        administradores.forEach(admin => {
            this.notificarUsuario(
                admin.id, 
                textoNotificacion, 
                esMostrador ? 'info' : 'warning', 
                `admin.html?tab=reservas&resId=${nuevaReserva.id}`
            );
        });"""

replacement = """        administradores.forEach(admin => {
            this.notificarUsuario(
                admin.id, 
                textoNotificacion, 
                esMostrador ? 'info' : 'warning', 
                `admin.html?tab=reservas&resId=${nuevaReserva.id}`
            );
        });

        // Disparar WhatsApp automtico va Servidor Node.js
        try {
            const payloadWA = {
                usuarioNombre: usuarioNombre || 'Usuario ATH',
                canchaId: String(canchaId),
                fecha: typeof formatFechaArg === 'function' ? formatFechaArg(fecha) : fecha,
                horaInicio: horaInicio,
                horaFin: horaFin,
                destino: "NUMERO_DE_PRUEBA" // Reemplazar en pruebas por el numero autorizado
            };

            fetch('http://localhost:3000/api/send-whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadWA)
            }).then(res => res.json())
              .then(data => console.log(" [WhatsApp API Node] Disparado:", data))
              .catch(e => console.error(" [WhatsApp API] Servidor Node apagado o error:", e));
        } catch(e) {
            console.warn("Servidor Node no disponible.");
        }"""

if target in js:
    js = js.replace(target, replacement)
    with open("db_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched WhatsApp notification logic in db_v3.js")
else:
    print("WhatsApp logic target not found")