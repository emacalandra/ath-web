import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """                    usuarioRole: finalUserRole,
                    canchaId: currentWidgetCourt,
                    fecha: currentWidgetDate,
                    horaInicio: horaInicio,
                    duracionHoras: duracionHoras,
                    metodoPago: finalMetodoPago,
                    comprobanteBase64: comprobanteBase64
                });"""

replacement = """                    usuarioRole: finalUserRole,
                    canchaId: currentWidgetCourt,
                    fecha: currentWidgetDate,
                    horaInicio: horaInicio,
                    duracionHoras: duracionHoras,
                    metodoPago: finalMetodoPago,
                    comprobanteBase64: comprobanteBase64,
                    overrideEstadoPago: finalEstadoPago
                });"""

if target in js:
    js = js.replace(target, replacement)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched overrideEstadoPago call")
else:
    print("crearReserva target 2 not found")