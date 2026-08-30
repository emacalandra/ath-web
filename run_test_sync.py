import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on('console', lambda msg: print(f"LOG: {msg.text}"))
        await page.goto('http://localhost:8087/test_sync.html')
        await asyncio.sleep(3)
        await browser.close()

asyncio.run(main())