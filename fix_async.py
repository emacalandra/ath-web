with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace("async async function", "async function")

with open("script.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Fixed async async syntax error.")