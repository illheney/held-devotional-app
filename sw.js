const CACHE="held-v1.7.2-mobile";
const ASSETS=["./","./index.html","./styles.css","./polish.css","./onboarding-fix.css","./journeys.css","./growth.css","./memories.css","./mobile-fix.css","./preflight.js","./app.js","./content.js","./polish.js","./onboarding-fix.js","./scripture.js","./journeys.js","./journey-translation.js","./growth.js","./memory-sources.js","./memories-core.js","./memory-today.js","./memory-actions.js","./memory-journey.js","./memory-settings.js","./stability.js","./content-polish.js","./checkin-fix.js","./journey-fix.js","./manifest.webmanifest","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith("held-")&&key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

const currentCacheMatch=request=>caches.open(CACHE).then(cache=>cache.match(request,{ignoreSearch:true}));
const cacheResponse=(request,response)=>{
  if(!response||!response.ok)return response;
  const copy=response.clone();
  caches.open(CACHE).then(cache=>cache.put(request,copy));
  return response;
};

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin){
    event.respondWith(fetch(request));
    return;
  }

  if(request.mode==="navigate"){
    event.respondWith(
      fetch(request)
        .then(response=>cacheResponse("./index.html",response))
        .catch(()=>currentCacheMatch("./index.html"))
    );
    return;
  }

  const freshFirst=["script","style","manifest"].includes(request.destination);
  if(freshFirst){
    event.respondWith(
      fetch(request)
        .then(response=>cacheResponse(request,response))
        .catch(()=>currentCacheMatch(request))
    );
    return;
  }

  event.respondWith(
    currentCacheMatch(request).then(cached=>cached||fetch(request).then(response=>cacheResponse(request,response)))
  );
});
