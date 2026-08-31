from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.on("console", lambda msg: print(f"CONSOLE: {msg.type} {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))
        
        print("Navigating...")
        url = "file:///c:/Users/Emanu/OneDrive/Documentos/prueba de pagina ath/index.html".replace("\\", "/")
        page.goto(url)
        time.sleep(2)
        
        print("Clicking menu...")
        try:
            page.click("#mobileToggle", timeout=2000)
            print("Menu clicked")
        except Exception as e:
            print("Could not click menu:", e)
            
        print("Clicking openModalBtn...")
        try:
            page.click("#openModalBtn", timeout=2000)
            print("Btn clicked")
        except Exception as e:
            print("Could not click btn:", e)
            
        time.sleep(1)
        browser.close()

run()