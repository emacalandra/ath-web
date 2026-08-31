import win32com.client
try:
    html = win32com.client.Dispatch("htmlfile")
    html.writeln("<html><head><script>window.onerror=function(msg, url, line){document.write('Error: '+msg+' at line '+line);};</script></head><body></body></html>")
    
    with open("db.js", "r", encoding="utf-8") as f:
        db_js = f.read()
    with open("script.js", "r", encoding="utf-8") as f:
        script_js = f.read()
    
    # We can't use ES6 in IE/htmlfile easily! It only supports ES5 or ES3.
    print("htmlfile does not support ES6.")
except Exception as e:
    print(e)