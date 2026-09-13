/* Held v1.4 content presentation helpers + feature loader. */
(() => {
  const labelForLevel = level => ({1:"Foundation",2:"Growing",3:"Deeper",4:"Rooted"}[level] || "Deeper");
  const refreshContentDetails = () => {
    const today = typeof todayKey === "function" ? todayKey() : "";
    const entry = state?.history?.find(item => item.date === today);
    const devotional = entry ? DEVOTIONALS.find(item => item.id === entry.devotionalId) : null;
    const eyebrow = document.querySelector(".devotional-head .eyebrow");
    if (devotional && eyebrow) eyebrow.textContent = eyebrow.textContent.replace(/ · .*$/, ` · ${labelForLevel(devotional.level)}`);

    document.querySelectorAll("p,span,div").forEach(el => {
      if (el.children.length === 0 && /Held 1\.[23]\.0/.test(el.textContent || "")) {
        el.textContent = el.textContent.replace(/Held 1\.[23]\.0/, "Held 1.4.0");
      }
    });

    if (state?.lastView === "library") {
      const hero = document.querySelector(".library-page .hero p, .hero .muted");
      if (hero && !hero.textContent.includes("104")) hero.textContent = `${DEVOTIONALS.length} devotionals · search by theme, title, or Scripture.`;
    }
  };

  const loadStyle = href => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  };
  const loadScript = src => new Promise((resolve,reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  const app = document.getElementById("app");
  if (app) new MutationObserver(refreshContentDetails).observe(app,{childList:true,subtree:true});
  refreshContentDetails();

  loadStyle("journeys.css");
  loadScript("scripture.js")
    .then(() => loadScript("journeys.js"))
    .then(() => loadScript("journey-translation.js"))
    .catch(() => {});
})();