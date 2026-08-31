import glob, re

for filepath in glob.glob("*.html"):
    if "test_" in filepath:
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    html = html.replace(".0\"", "\"")  # Remove .0 from version
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)
print("Fixed .0 suffixes")