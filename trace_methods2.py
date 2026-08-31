with open("db.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Baseline: at line 61 (class open) depth becomes 1
# Each method at class level should go from 1 -> 2 and back to 1
# Find all lines where depth is exactly 1 (class level, between methods)
depth = 0
last_method_close = 0
for i, line in enumerate(lines):
    opens = line.count("{")
    closes = line.count("}")
    old = depth
    depth += opens - closes
    if i+1 >= 61 and old == 2 and depth == 1:
        last_method_close = i+1
        stripped = line.strip()[:80]
        # print(f"L{i+1} method close: {stripped}")
    if i+1 >= 61 and old == 1 and depth == 2:
        stripped = line.strip()[:80]
        print(f"L{i+1} method open (prev close L{last_method_close}): {stripped}")

print(f"\nFinal: {depth}")