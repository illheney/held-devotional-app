const CACHE="held-v1.6.2";
const ASSETS=["./","./index.html","./styles.css","./polish.css","./onboarding-fix.css","./journeys.css","./growth.css","./memories.css","./app.js","./content.js","./polish.js","./onboarding-fix.js","./content-polish.js","./scripture.js","./journeys.js","./journey-translation.js","./growth.js","./memory-sources.js","./memories-core.js","./memory-today.js","./memory-actions.js","./memory-journey.js","./memory-settings.js","./manifest.webmanifest","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("held-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",event=>{
  const request=event.request;if(request.method!=="GET")return;
  if(request.mode==="navigate"){
    event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put("./index.html",copy));return response;}).catch(()=>caches.match("./index.html")));return;
  }
  event.respondWith(caches.match(request).then(cached=>{const network=fetch(request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>cached);return cached||network;}));
});
