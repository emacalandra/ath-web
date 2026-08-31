with open("db.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """    getPricingRaw() {"""

replacement = """    obtenerHorariosDelDia(fecha = null) {
        let dateObj = fecha ? new Date(fecha + 'T12:00:00') : new Date();
        const pricing = this.getPricingRaw();
        const isFeriado = false; // Aquí se podría integrar lógica de feriados reales
        const dayOfWeek = dateObj.getDay(); // 0: Dom, 1: Lun, ..., 6: Sab

        let openTime, closeTime;

        if (isFeriado) {
            openTime = pricing.timeOpenF || '09:00';
            closeTime = pricing.timeCloseF || '21:00';
        } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Fin de semana
            openTime = pricing.timeOpenSD || '08:00';
            closeTime = pricing.timeCloseSD || '22:00';
        } else { // Lunes a Viernes
            openTime = pricing.timeOpenLV || '08:00';
            closeTime = pricing.timeCloseLV || '23:00';
        }
        return { apertura: openTime, cierre: closeTime, noche: pricing.timeNight || '18:30' };
    }

    getPricingRaw() {"""

if target in js:
    js = js.replace(target, replacement)
    with open("db.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Added obtenerHorariosDelDia")
else:
    print("Target not found.")