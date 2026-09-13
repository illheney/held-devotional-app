/* Held v1.3 content presentation helpers. */
(() => {
  const labelForLevel = level => ({1:"Foundation",2:"Growing",3:"Deeper",4:"Rooted"}[level] || "Deeper");
  const refreshContentDetails = () => {
    const today = typeof todayKey === "function" ? todayKey() : "";
    const entry = state?.history?.find(item => item.date === today);
    const devotional = entry ? DEVOTIONALS.find(item => item.id === entry.devotionalId) : null;
    const eyebrow = document.querySelector(".devotional-head .eyebrow");
    if (devotional && eyebrow) eyebrow.textContent = eyebrow.textContent.replace(/ · .*$/, ` · ${labelForLevel(devotional.level)}`);

    document.querySelectorAll("p,span,div").forEach(el => {
      if (el.children.length === 0 && el.textContent?.includes("Held 1.2.0")) {
        el.textContent = el.textContent.replace("Held 1.2.0", "Held 1.3.0");
      }
    });

    if (state?.lastView === "library") {
      const hero = document.querySelector(".library-page .hero p, .hero .muted");
      if (hero && !hero.textContent.includes("104")) hero.textContent = `${DEVOTIONALS.length} devotionals · search by theme, title, or Scripture.`;
    }
  };

  const app = document.getElementById("app");
  if (app) new MutationObserver(refreshContentDetails).observe(app,{childList:true,subtree:true});
  refreshContentDetails();
})();
