import http.server
import socketserver
import threading
import sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        print(post_data)
        self.send_response(200)
        self.end_headers()
        if post_data == 'DONE':
            sys.exit(0)

socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("", 9999), Handler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()

# Now launch edge headless to open the file
import os
import subprocess
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    print("Edge not found")
    sys.exit(1)

html_path = os.path.abspath("test_js_errors.html")
subprocess.run([edge_path, "--headless", "--disable-gpu", "--no-sandbox", "file://" + html_path], timeout=5)