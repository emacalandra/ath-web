with open("db.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines):
    opens = line.count("{")
    closes = line.count("}")
    new_depth = depth + opens - closes
    # Look for lines where depth drops to 0 (should be between top-level constructs)
    if depth == 0 and new_depth > 0 and i > 55:
        print(f"L{i+1} [0->{new_depth}] TOPLEVEL OPEN: {line.rstrip()[:100]}")
    if new_depth == 0 and depth > 0 and i > 55:
        print(f"L{i+1} [{depth}->0] TOPLEVEL CLOSE: {line.rstrip()[:100]}")
    depth = new_depth

print(f"\nFinal depth: {depth}")