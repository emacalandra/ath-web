with open("script.js", "rb") as f:
    raw = f.read()
try:
    raw.decode("utf-8")
    print("script.js is valid UTF-8")
except UnicodeDecodeError as e:
    print("script.js is NOT valid UTF-8:", e)