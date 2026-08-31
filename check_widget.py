with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
match = re.search(r'function renderWidgetDayTimelineGrid\(\) \{.*?\}\s*function', js, re.DOTALL)
if match:
    with open('render_widget_code.txt', 'w', encoding='utf-8') as out:
        out.write(match.group(0))