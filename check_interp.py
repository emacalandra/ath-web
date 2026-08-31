with open("db.js", "r", encoding="utf-8") as f:
    code = f.read()

# Count ${...} template literal interpolations
import re
interpolations = re.findall(r'\$\{', code)
print(f"Template interpolations (${{...}}): {len(interpolations)}")

opens = code.count('{')
closes = code.count('}')
print(f"Raw braces: opens={opens}, closes={closes}, diff={opens-closes}")
print(f"Adjusted (subtracting interpolation braces): opens={opens - len(interpolations)}, closes={closes - len(interpolations)}, diff={opens - closes}")