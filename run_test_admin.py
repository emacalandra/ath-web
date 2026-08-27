import http.server
import socketserver
import threading
import time

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/log':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            print(f"BROWSER_LOG: {post_data}")
            self.send_response(200)
            self.end_headers()

PORT = 8083

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    def serve():
        httpd.serve_forever()
    t = threading.Thread(target=serve)
    t.daemon = True
    t.start()
    
    import urllib.request
    try:
        urllib.request.urlopen(f'http://localhost:{PORT}/test_admin_errors.html').read()
        time.sleep(2)
    except Exception as e:
        print(f"Failed to fetch: {e}")
    finally:
        httpd.shutdown()