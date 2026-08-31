with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('function renderWidgetDayTimelineGrid() {', 'async function renderWidgetDayTimelineGrid() {')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)