with open("script.js", "r", encoding="utf-8") as f:
    code = f.read()
opens = code.count("{")
closes = code.count("}")
print(f"script.js: opens={opens}, closes={closes}, diff={opens-closes}")

# Check for the openModal function
if "function openModal" in code:
    print("openModal function: FOUND")
else:
    print("openModal function: NOT FOUND")

# Check the last few lines
lines = code.split("\n")
print(f"\nTotal lines: {len(lines)}")
for l in lines[-5:]:
    print(f"  {l.rstrip()[:100]}")