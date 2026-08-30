with open('script.js', 'rb') as f:
    raw = f.read()

try:
    print(raw[106650:106750])
except Exception as e:
    print(e)