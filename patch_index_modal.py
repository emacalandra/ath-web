with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find modal-grid-flow
idx = html.find('<div class="modal-grid-flow">')
if idx != -1:
    div_html = '''            
            <div id="appBookingError" style="display: none; padding: 12px; margin: 15px 20px 0 20px; border-radius: 8px; font-weight: 700; font-size: 0.9rem;"></div>
'''
    if 'id="appBookingError"' not in html:
        html = html[:idx] + div_html.strip() + '\n            ' + html[idx:]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("index.html patched with appBookingError div")
