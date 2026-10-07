"""Static preview server with byte ranges for reliable MP4 and WAV seeking."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import re
import shutil

class MediaHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        self.remaining = None
        request = self.headers.get('Range')
        path = self.translate_path(self.path)
        if not request or not os.path.isfile(path):
            return super().send_head()
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', request)
        size = os.path.getsize(path)
        if not match or not any(match.groups()):
            self.send_error(416, 'Invalid byte range')
            return None
        first, last = match.groups()
        if first:
            start = int(first)
            end = min(int(last), size - 1) if last else size - 1
        else:
            start, end = max(0, size - int(last)), size - 1
        if start > end or start >= size:
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        stream = open(path, 'rb')
        stream.seek(start)
        self.remaining = end - start + 1
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Length', str(self.remaining))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.end_headers()
        return stream

    def copyfile(self, source, target):
        try:
            if self.remaining is None:
                shutil.copyfileobj(source, target)
            else:
                while self.remaining:
                    chunk = source.read(min(self.remaining, 64 * 1024))
                    if not chunk:
                        break
                    target.write(chunk)
                    self.remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass

if __name__ == '__main__':
    os.chdir(Path(__file__).resolve().parents[1])
    ThreadingHTTPServer(('0.0.0.0', 8000), MediaHandler).serve_forever()
