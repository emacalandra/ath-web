import js2py

try:
    with open("script.js", "r", encoding="utf-8") as f:
        js = f.read()
    
    # We just want to parse it to see if there are syntax errors. 
    # js2py.parse(js) doesn't exist, we can just try to compile it.
    
    # Remove DOM stuff that will crash on execution so we can evaluate it if possible.
    # Actually, compiling is enough to check for Syntax errors.
    print("Compiling...")
    js2py.compile(js)
    print("Compilation successful! No syntax errors.")
except Exception as e:
    print("Syntax Error:", e)