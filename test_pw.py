from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.on('console', lambda msg: print(f'CONSOLE: {msg.type} {msg.text}'))
        page.on('pageerror', lambda exc: print(f'ERROR: {exc}'))
        
        page.goto('http://127.0.0.1:8000/admin.html')
        page.evaluate('''() => {
            localStorage.setItem('ath_active_user', JSON.stringify({id: "admin1", role: "admin", nombre: "Admin"}));
        }''')
        page.goto('http://127.0.0.1:8000/admin.html')
        time.sleep(3)
        browser.close()

try:
    run()
except Exception as e:
    print("Playwright failed:", e)