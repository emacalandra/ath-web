with open("db.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines):
    opens = line.count("{")
    closes = line.count("}")
    depth += opens - closes
    if 58 <= i+1 <= 65:
        print(f"L{i+1} d={depth}: {line.rstrip()[:100]}")
        
# And at the very end
depth = 0
for i, line in enumerate(lines):
    opens = line.count("{")
    closes = line.count("}")
    depth += opens - closes
    if i+1 >= 1388:
        print(f"L{i+1} d={depth}: {line.rstrip()[:100]}")