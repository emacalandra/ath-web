import http.server
import socketserver
import threading
import sys
import subprocess
import time

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        print("BROWSER_LOG:", post_data)
        self.send_response(200)
        self.end_headers()

socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("", 8085), Handler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
try:
    subprocess.run([edge_path, "--headless", "--disable-gpu", "--no-sandbox", "http://localhost:8085/admin.html"], timeout=5)
except subprocess.TimeoutExpired:
    pass