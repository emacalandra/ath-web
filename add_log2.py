with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
old = r'window\.syncRealtimeUserUI = function\(\) \{'
new = '''window.syncRealtimeUserUI = function() {
        console.log("SYNC REALTIME USER UI TRIGGERED");'''
if 'SYNC REALTIME USER UI TRIGGERED' not in js:
    js = re.sub(old, new, js)
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Added logging to script.js")