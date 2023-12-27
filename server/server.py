from http.server import HTTPServer
from .handlers import SimpleHTTPRequestHandler
import signal


def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)

    def signal_handler(signal, frame):
        print('Stopping server...')
        httpd.shutdown()

    signal.signal(signal.SIGINT, signal_handler)

    try:
        print(f"Server started at http://localhost:{port}")
        httpd.serve_forever()
    except Exception as e:
        print(f"Server error: {e}")