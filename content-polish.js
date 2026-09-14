/* Held v1.7 content presentation helpers. Startup order now lives in index.html. */
(() => {
  const labelForLevel = level => ({1:"Foundation",2:"Growing",3:"Deeper",4:"Rooted"}[level] || "Deeper");
  const refreshContentDetails = () => {
    const today = typeof todayKey === "function" ? todayKey() : "";
    const entry = state?.history?.find(item => item.date === today);
    const devotional = entry ? DEVOTIONALS.find(item => item.id === entry.devotionalId) : null;
    const eyebrow = document.querySelector(".devotional-head .eyebrow");
    if (devotional && eyebrow) eyebrow.textContent = eyebrow.textContent.replace(/ · .*$/, ` · ${labelForLevel(devotional.level)}`);

    document.querySelectorAll("p,span,div").forEach(el => {
      if (el.children.length !== 0) return;
      const text=el.textContent||"";
      if (/Held 1\.\d+\.\d+/.test(text)) el.textContent=text.replace(/Held 1\.\d+\.\d+/,"Held 1.7.0");
      else if (/Held v1\.\d+(?:\.\d+)?/.test(text)) el.textContent=text.replace(/Held v1\.\d+(?:\.\d+)?/,"Held v1.7");
    });

    if (state?.lastView === "library") {
      const hero = document.querySelector(".library-page .hero p, .hero .muted");
      if (hero && !hero.textContent.includes(String(DEVOTIONALS.length))) hero.textContent = `${DEVOTIONALS.length} devotionals · search by theme, title, or Scripture.`;
    }
  };

  const app=document.getElementById("app");
  if(app)new MutationObserver(refreshContentDetails).observe(app,{childList:true,subtree:true});
  refreshContentDetails();
})();
