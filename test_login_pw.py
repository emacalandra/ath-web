from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.on('console', lambda msg: print(f'CONSOLE: {msg.type} {msg.text}'))
        page.on('pageerror', lambda exc: print(f'ERROR: {exc}'))
        
        print("Navigating to index.html...")
        page.goto('file:///' + 'c:/Users/Emanu/OneDrive/Documentos/prueba de pagina ath/index.html'.replace('\\', '/'))
        time.sleep(2)
        
        print("Clicking openModalBtn...")
        page.click('#openModalBtn', timeout=2000)
        time.sleep(1)
        
        print("Filling form...")
        page.fill('#loginEmail', 'admin@tenishits.com.ar')
        page.fill('#loginPassword', 'admin123')
        
        print("Submitting...")
        page.click('#loginForm button[type="submit"]')
        time.sleep(2)
        print("Done. Check console logs.")
        browser.close()

try:
    run()
except Exception as e:
    print("Playwright failed:", e)