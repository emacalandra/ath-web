with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()
if "async async" in js:
    print("YES, async async found!")
else:
    print("No async async.")