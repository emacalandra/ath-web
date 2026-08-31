import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """                confirmBtnEl.parentNode.insertBefore(secFields, confirmBtnEl);
            }
            if (paymentCardEl) paymentCardEl.style.display = 'none'; // Ocultar carga de comprobante"""

replacement = """                confirmBtnEl.parentNode.insertBefore(secFields, confirmBtnEl);
                
                const descSelect = document.getElementById('secInputRolDescuento');
                if (descSelect) {
                    descSelect.addEventListener('change', () => {
                        if (typeof calculateAndVerifyMinuteByMinute === 'function') calculateAndVerifyMinuteByMinute();
                    });
                }
            }
            if (paymentCardEl) paymentCardEl.style.display = 'none'; // Ocultar carga de comprobante"""

if target in js:
    js = js.replace(target, replacement)
    with open("script_v3.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Added event listener to UI.")
else:
    print("Target for event listener not found.")