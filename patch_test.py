with open('run_admin_test_2.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));",
                    "page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));\n        page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));")

with open('run_admin_test_3.py', 'w', encoding='utf-8') as f:
    f.write(code)