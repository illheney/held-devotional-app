import os
import shutil
import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

URL = os.environ.get("HELD_AUDIT_URL", "http://127.0.0.1:8765/.github/tests/smoke.html")

chromedriver = shutil.which("chromedriver")
if not chromedriver:
    raise SystemExit("chromedriver is not installed or not on PATH")

chrome_binary = (
    os.environ.get("HELD_CHROME_BINARY")
    or shutil.which("google-chrome")
    or shutil.which("google-chrome-stable")
    or shutil.which("chromium")
    or shutil.which("chromium-browser")
)
if not chrome_binary:
    raise SystemExit("Chrome/Chromium is not installed or not on PATH")

print(f"Using Chrome: {chrome_binary}")
print(f"Using ChromeDriver: {chromedriver}")

options = Options()
options.binary_location = chrome_binary
options.page_load_strategy = "eager"
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-gpu")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-background-networking")
options.add_argument("--disable-component-update")
options.add_argument("--disable-sync")
options.add_argument("--metrics-recording-only")
options.add_argument("--no-first-run")
options.add_argument("--window-size=390,844")

service = Service(executable_path=chromedriver)
driver = webdriver.Chrome(service=service, options=options)
driver.set_page_load_timeout(15)
driver.set_script_timeout(15)

try:
    driver.get(URL)
    WebDriverWait(driver, 20).until(lambda d: d.find_elements(By.ID, "audit-results"))
    body = driver.find_element(By.TAG_NAME, "body")
    status = body.get_attribute("data-audit-status")
    result = driver.find_element(By.ID, "audit-results").text
    print(result)
    print(f"HELD BROWSER AUDIT STATUS: {status}")
    if status != "pass":
        print("Browser console entries:")
        try:
            for entry in driver.get_log("browser"):
                print(entry)
        except Exception:
            pass
        sys.exit(1)
finally:
    driver.quit()
