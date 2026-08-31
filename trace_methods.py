with open("db.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines):
    prev = depth
    opens_here = line.count("{")
    closes_here = line.count("}")
    depth = depth + opens_here - closes_here
    
    # Show every line where depth transitions around method/class level
    if prev != depth and (prev <= 2 or depth <= 2):
        if i >= 60:  # skip helper functions, start at class
            if prev == 2 and depth == 1:
                print(f"L{i+1} [2->1] CLOSE: {line.strip()[:100]}")
            if prev == 1 and depth == 2:
                print(f"L{i+1} [1->2] OPEN:  {line.strip()[:100]}")

print(f"\nFinal depth: {depth}")