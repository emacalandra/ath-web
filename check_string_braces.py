# Also count braces inside regular strings like startsWith('{')
import re
with open("db.js", "r", encoding="utf-8") as f:
    code = f.read()

# Find { inside single quotes
sq = re.findall(r"'[^']*\{[^']*'", code)
print(f"Single-quoted strings containing {{: {len(sq)}")
for s in sq:
    print(f"  {s[:60]}")

# Find { inside double quotes
dq = re.findall(r'"[^"]*\{[^"]*"', code)
print(f"Double-quoted strings containing {{: {len(dq)}")
for s in dq:
    print(f"  {s[:60]}")