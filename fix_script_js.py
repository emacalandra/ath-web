with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# Fix calculateAndVerifyMinuteByMinute
new_calc = '''        const appDateSelect = document.getElementById('appDateSelect');
        const dateVal = appDateSelect ? appDateSelect.value : (typeof currentWidgetDate !== 'undefined' ? currentWidgetDate : null);
        const horarios = getHorariosParaFecha(dateVal);
        const openMin = horarios.openMin;
        const closeMin = horarios.closeMin;
        const pricingConfig = window.DBHits.getPricingRaw();

        if (startMin < openMin || endMin > closeMin) {
            priceSummary.className = 'booking-summary-card occupied status-busy';
            if (summaryStatus) summaryStatus.innerHTML = ❌ El club opera entre las  y  hs;'''

js = re.sub(r'        const pricingConfig = window\.DBHits\.getPricingRaw\(\);\s*const openMin = timeStringToMinutes\(pricingConfig\.timeOpen \|\| \'08:00\'\);\s*const closeMin = timeStringToMinutes\(pricingConfig\.timeClose \|\| \'23:00\'\);\s*if \(startMin < openMin \|\| endMin > closeMin\) \{\s*priceSummary\.className = \'booking-summary-card occupied status-busy\';\s*if \(summaryStatus\) summaryStatus\.innerHTML = .*? hs;', new_calc, js)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Fixed script.js")