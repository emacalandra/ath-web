import http.server
import socketserver
import json
import os
import urllib.parse

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CMSHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/save-html':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                filename = data.get('filename')
                html_content = data.get('html')
                
                # Basic security check
                if not filename or '..' in filename or not filename.endswith('.html'):
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Invalid filename")
                    return
                
                filepath = os.path.join(DIRECTORY, filename)
                
                # Escribir el nuevo HTML
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                    
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

with socketserver.TCPServer(("", PORT), CMSHandler) as httpd:
    print(f"✅ Servidor de Desarrollo ATH iniciado en http://localhost:{PORT}")
    print("💾 Listo para guardar los cambios visuales directamente en el codigo HTML.")
    httpd.serve_forever()
