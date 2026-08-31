from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on('console', lambda msg: print(f'BROWSER_LOG: {msg.text}'))
        page.on('pageerror', lambda exc: print(f'BROWSER_ERROR: {exc}'))
        
        # Inyectar localStorage para admin
        page.goto('http://127.0.0.1:8000/admin.html')
        page.evaluate('''() => {
            localStorage.setItem('ath_active_user', JSON.stringify({id: "admin1", role: "admin", nombre: "Admin"}));
        }''')
        
        page.goto('http://127.0.0.1:8000/admin.html')
        time.sleep(3)
        
        body = page.evaluate('document.body.innerHTML')
        print(f"Body length: {len(body)}")
        
        # Screenshot
        page.screenshot(path='admin_screenshot.png')
        
        browser.close()

run()