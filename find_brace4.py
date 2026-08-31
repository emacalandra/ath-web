with open("db.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines):
    prev = depth
    for ch in line:
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
    if prev == 1 and depth == 2 and "{" in line:
        print(f"L{i+1} [1->2]: {line.strip()[:120]}")
    if prev == 2 and depth == 1 and "}" in line:
        print(f"L{i+1} [2->1]: {line.strip()[:120]}")
    if prev == 1 and depth == 0:
        print(f"L{i+1} [1->0]: {line.strip()[:120]}")

print(f"\nFinal: {depth}")