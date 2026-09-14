import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request
import websocket

URL = os.environ.get("HELD_AUDIT_URL", "http://127.0.0.1:8765/.github/tests/smoke.html")
PORT = 9222
chrome = (
    os.environ.get("HELD_CHROME_BINARY")
    or shutil.which("google-chrome")
    or shutil.which("google-chrome-stable")
    or shutil.which("chromium")
    or shutil.which("chromium-browser")
)
if not chrome:
    raise SystemExit("Chrome/Chromium is not installed or not on PATH")

profile = tempfile.mkdtemp(prefix="held-chrome-")
process = subprocess.Popen([
    chrome,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    "--metrics-recording-only",
    "--no-first-run",
    "--remote-allow-origins=*",
    f"--remote-debugging-port={PORT}",
    f"--user-data-dir={profile}",
    "about:blank",
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

next_id = 0

def http_json(path, method="GET"):
    req = urllib.request.Request(f"http://127.0.0.1:{PORT}{path}", method=method)
    with urllib.request.urlopen(req, timeout=3) as response:
        return json.load(response)

def command(ws, method, params=None, timeout=5):
    global next_id
    next_id += 1
    ident = next_id
    ws.send(json.dumps({"id": ident, "method": method, "params": params or {}}))
    deadline = time.time() + timeout
    while time.time() < deadline:
        message = json.loads(ws.recv())
        if message.get("id") == ident:
            if "error" in message:
                raise RuntimeError(message["error"])
            return message.get("result", {})
    raise TimeoutError(f"CDP command timed out: {method}")

def evaluate(ws, expression):
    result = command(ws, "Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
    return result.get("result", {}).get("value")

try:
    deadline = time.time() + 12
    while True:
        try:
            http_json("/json/version")
            break
        except Exception:
            if time.time() >= deadline:
                raise RuntimeError("Chrome DevTools endpoint did not start")
            time.sleep(0.2)

    encoded = urllib.parse.quote(URL, safe=":/?=&")
    page = http_json(f"/json/new?{encoded}", method="PUT")
    ws = websocket.create_connection(page["webSocketDebuggerUrl"], timeout=5, origin="http://127.0.0.1")
    try:
        command(ws, "Runtime.enable")
        command(ws, "Page.enable")
        deadline = time.time() + 25
        status = ""
        while time.time() < deadline:
            status = evaluate(ws, "document.body && document.body.dataset.auditStatus || ''") or ""
            if status in ("pass", "fail"):
                break
            time.sleep(0.15)
        result = evaluate(ws, "document.getElementById('audit-results')?.innerText || ''") or ""
        print(result)
        print(f"HELD BROWSER AUDIT STATUS: {status or 'timeout'}")
        if status != "pass":
            boot_errors = evaluate(ws, "JSON.stringify(window.__heldBootErrors || [])") or "[]"
            print(f"Boot errors: {boot_errors}")
            sys.exit(1)
    finally:
        ws.close()
finally:
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
