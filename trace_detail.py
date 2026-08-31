with open("db.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines):
    opens = line.count("{")
    closes = line.count("}")
    depth += opens - closes
    if 105 <= i+1 <= 145:
        print(f"L{i+1} d={depth} (+{opens}/-{closes}): {line.rstrip()[:100]}")