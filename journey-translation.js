/* Held v1.7.1 translation label sync for Guided Journeys. */
(() => {
  let scheduled=false;

  const setTextIfChanged=(el,next)=>{
    if(el && el.textContent!==next) el.textContent=next;
  };

  const sync = () => {
    scheduled=false;
    document.querySelectorAll(".journey-scripture .card-kicker span:last-child").forEach(el => {
      const text=(el.textContent||"").trim();
      if (text.startsWith("Scripture ·") && text!=="Scripture · WEB") setTextIfChanged(el,"Scripture · WEB");
    });
    document.querySelectorAll(".journey-scripture .scripture-credit span").forEach(el => {
      if ((el.textContent || "").trim() === "KJV · Public Domain") setTextIfChanged(el,"WEB · Public Domain");
    });
  };

  const scheduleSync=()=>{
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(sync);
  };

  const app = document.getElementById("app");
  if (app) new MutationObserver(scheduleSync).observe(app,{childList:true,subtree:true});
  sync();
})();
