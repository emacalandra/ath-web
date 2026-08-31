import re

with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """                currentWidgetDate = btn.dataset.date;
                pintarBotonSeleccionado(dateBtns, btn);
                renderWidgetDatePills();
                renderWidgetDayTimelineGrid();
                calculateAndVerifyMinuteByMinute();"""

replacement = """                currentWidgetDate = btn.dataset.date;
                pintarBotonSeleccionado(dateBtns, btn);
                renderWidgetDatePills();
                if (typeof syncGlobalConfig === 'function') syncGlobalConfig();
                renderWidgetDayTimelineGrid();
                calculateAndVerifyMinuteByMinute();"""

if target in js:
    js = js.replace(target, replacement)
    with open("script.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched date pill listener")
else:
    print("Target not found.")