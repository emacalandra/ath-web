import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """        try {
            const activeUser = getActiveUser();
            const userRole = activeUser ? activeUser.role : 'usuario';
            const calculo = window.DBHits.calcularPrecioReserva(horaInicio, duracionHoras, userRole);"""

replacement = """        try {
            const activeUser = getActiveUser();
            let userRole = activeUser ? activeUser.role : 'usuario';
            
            // Si es Secretaria/Admin reservando a un cliente, usar la tarifa seleccionada
            const secDiscount = document.getElementById('secInputRolDescuento');
            if (secDiscount && activeUser && (activeUser.role === 'admin' || activeUser.role === 'secretaria')) {
                userRole = secDiscount.value;
            }

            const calculo = window.DBHits.calcularPrecioReserva(horaInicio, duracionHoras, userRole);"""

if target in js:
    js = js.replace(target, replacement)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched calculateAndVerifyMinuteByMinute")
else:
    print("calculateAndVerifyMinuteByMinute target not found")