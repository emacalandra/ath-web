import glob, time

ts = int(time.time())
for filepath in glob.glob("*.html"):
    if "test_" in filepath:
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Update version strings for cache busting
    import re
    html = re.sub(r'db\.js\?v=\d+', f'db.js?v={ts}', html)
    html = re.sub(r'script\.js\?v=\d+', f'script.js?v={ts}', html)
    html = re.sub(r'admin\.js\?v=\d+', f'admin.js?v={ts}', html)
    html = re.sub(r'perfil\.js\?v=\d+', f'perfil.js?v={ts}', html)
    
    # Also handle tags without version
    html = re.sub(r'src="db\.js"', f'src="db.js?v={ts}"', html)
    html = re.sub(r'src="script\.js"', f'src="script.js?v={ts}"', html)
    html = re.sub(r'src="admin\.js"', f'src="admin.js?v={ts}"', html)
    html = re.sub(r'src="perfil\.js"', f'src="perfil.js?v={ts}"', html)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

print(f"Cache busted with timestamp: {ts}")