from http.server import HTTPServer
from .handlers import SimpleHTTPRequestHandler

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, port=8000):
    try:
        server_address = ('', port)
        httpd = server_class(server_address, handler_class)
        print(f"Server started at http://localhost:{port}")
        httpd.serve_forever()
    except Exception as e:
        print(f"Server error: {e}")
