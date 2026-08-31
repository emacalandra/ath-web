with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_get = '''    getPricingRaw() {
        try {
            return JSON.parse(localStorage.getItem(PRICING_STORAGE_KEY)) || {
                priceCourtDay: 8000,'''

new_get = '''    getPricingRaw() {
        try {
            const raw = localStorage.getItem(PRICING_STORAGE_KEY);
            if (!raw || raw === 'undefined') throw new Error("no data");
            return JSON.parse(raw) || {
                priceCourtDay: 8000,'''

js = js.replace(old_get, new_get)

with open('db.js', 'w', encoding='utf-8') as f:
    f.write(js)