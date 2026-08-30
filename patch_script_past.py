with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Let's insert the past time check in calculateAndVerifyMinuteByMinute
old_check = "if (startMins >= endMins || isNaN(startMins) || isNaN(endMins)) {"

new_check = '''
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        const todayStr = ${now.getFullYear()}--;
        
        if (currentWidgetDate === todayStr && startMins < currentMins) {
            if (summaryStatus) summaryStatus.innerHTML = ⚠️ Horario Pasado;
            if (summaryDetails) summaryDetails.innerHTML = <span style="color: #FCA5A5; font-size: 0.8rem;">No puedes reservar turnos en el pasado.</span>;
            if (courtBadge) courtBadge.innerHTML = '❌ Horario Pasado';
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            return;
        }

        if (startMins >= endMins || isNaN(startMins) || isNaN(endMins)) {'''

if '⚠️ Horario Pasado' not in js:
    js = js.replace(old_check, new_check)
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Added past time check in script.js")