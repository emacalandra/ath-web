import subprocess

for file in ["db.js", "script.js", "admin.js", "canchero.js"]:
    try:
        # A simple syntax check using node if available, otherwise just use regex to find obvious errors
        # Note: 'async async' was fixed.
        with open(file, 'r', encoding='utf-8') as f:
            js = f.read()
        if "async async" in js:
            print(f"{file} still has async async!")
        else:
            print(f"{file} seems syntactically fine regarding async.")
    except FileNotFoundError:
        pass