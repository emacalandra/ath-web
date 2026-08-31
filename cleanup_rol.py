import re

with open("script_v3.js", "r", encoding="utf-8") as f:
    js = f.read()

js = re.sub(r'rolUsuario: isSecretaria \? \'usuario\' : userRole,\n', '', js)

with open("script_v3.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Removed redundant rolUsuario")