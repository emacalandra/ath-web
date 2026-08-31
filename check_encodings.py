for file in ["db.js", "admin.js", "index.html", "admin.html"]:
    with open(file, "rb") as f:
        raw = f.read()
    try:
        raw.decode("utf-8")
        print(f"{file} is valid UTF-8")
    except UnicodeDecodeError as e:
        print(f"{file} is NOT valid UTF-8:", e)