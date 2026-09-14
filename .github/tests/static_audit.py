from pathlib import Path
import json,re,sys

root=Path(__file__).resolve().parents[2]
errors=[]

def check(ok,msg):
    if not ok: errors.append(msg)

# Manifest parses.
try:
    manifest=json.loads((root/'manifest.webmanifest').read_text())
    check(manifest.get('display')=='standalone','manifest display must be standalone')
    check(bool(manifest.get('icons')),'manifest must define icons')
except Exception as e:
    errors.append(f'manifest parse failed: {e}')

index=(root/'index.html').read_text()
script_refs=re.findall(r'<script[^>]+src="([^"]+)"',index)
style_refs=re.findall(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"',index)
for ref in script_refs+style_refs:
    check((root/ref.split('?')[0]).exists(),f'missing index asset: {ref}')

sw=(root/'sw.js').read_text()
m=re.search(r'const ASSETS=(\[[\s\S]*?\]);',sw)
if not m:
    errors.append('service worker ASSETS list missing')
    sw_assets=[]
else:
    try: sw_assets=json.loads(m.group(1))
    except Exception as e:
        errors.append(f'service worker ASSETS parse failed: {e}')
        sw_assets=[]

for ref in sw_assets:
    if ref in ('./','./index.html'): continue
    path=ref[2:] if ref.startswith('./') else ref
    check((root/path).exists(),f'missing service-worker asset: {ref}')

for ref in script_refs+style_refs:
    normalized='./'+ref.split('?')[0].lstrip('./')
    check(normalized in sw_assets,f'index asset not cached for offline use: {ref}')

required=[
    'app.js','content.js','polish.js','onboarding-fix.js','scripture.js','journeys.js',
    'journey-translation.js','growth.js','memory-sources.js','memories-core.js',
    'memory-today.js','memory-actions.js','memory-journey.js','memory-settings.js',
    'stability.js','content-polish.js'
]
for ref in required:
    check(ref in script_refs,f'required runtime module not loaded by index: {ref}')

check('catch(()=>{})' not in (root/'content-polish.js').read_text(),'content-polish must not silently swallow module-load failures')
check('held-v1.7.0' in sw,'service worker cache version must be v1.7.0')

if errors:
    print('HELD STATIC AUDIT: FAIL')
    for error in errors: print(' -',error)
    sys.exit(1)
print('HELD STATIC AUDIT: PASS')
print(f' - {len(script_refs)} scripts wired')
print(f' - {len(style_refs)} stylesheets wired')
print(f' - {len(sw_assets)} offline assets verified')
