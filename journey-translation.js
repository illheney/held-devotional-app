/* Held v1.4 translation label sync for Guided Journeys. */
(() => {
  const sync = () => {
    document.querySelectorAll(".journey-scripture .card-kicker span:last-child").forEach(el => {
      if ((el.textContent || "").startsWith("Scripture ·")) el.textContent = "Scripture · WEB";
    });
    document.querySelectorAll(".journey-scripture .scripture-credit span").forEach(el => {
      if ((el.textContent || "").trim() === "KJV · Public Domain") el.textContent = "WEB · Public Domain";
    });
  };
  const app = document.getElementById("app");
  if (app) new MutationObserver(sync).observe(app,{childList:true,subtree:true});
  sync();
})();