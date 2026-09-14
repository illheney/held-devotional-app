/* Held v1.7 content presentation helpers. Startup order now lives in index.html. */
(() => {
  const labelForLevel = level => ({1:"Foundation",2:"Growing",3:"Deeper",4:"Rooted"}[level] || "Deeper");
  let scheduled=false;

  const setTextIfChanged=(el,next)=>{
    if(el && el.textContent!==next) el.textContent=next;
  };

  const refreshContentDetails = () => {
    scheduled=false;
    const today = typeof todayKey === "function" ? todayKey() : "";
    const entry = state?.history?.find(item => item.date === today);
    const devotional = entry ? DEVOTIONALS.find(item => item.id === entry.devotionalId) : null;
    const eyebrow = document.querySelector(".devotional-head .eyebrow");
    if (devotional && eyebrow) {
      const next=eyebrow.textContent.replace(/ · .*$/, ` · ${labelForLevel(devotional.level)}`);
      setTextIfChanged(eyebrow,next);
    }

    document.querySelectorAll("p,span,div").forEach(el => {
      if (el.children.length !== 0) return;
      const text=el.textContent||"";
      let next=text;
      if (/Held 1\.\d+\.\d+/.test(text)) next=text.replace(/Held 1\.\d+\.\d+/,"Held 1.7.0");
      else if (/Held v1\.\d+(?:\.\d+)?/.test(text)) next=text.replace(/Held v1\.\d+(?:\.\d+)?/,"Held v1.7");
      setTextIfChanged(el,next);
    });

    if (state?.lastView === "library") {
      const hero = document.querySelector(".library-page .hero p, .hero .muted");
      if (hero && !hero.textContent.includes(String(DEVOTIONALS.length))) {
        setTextIfChanged(hero,`${DEVOTIONALS.length} devotionals · search by theme, title, or Scripture.`);
      }
    }
  };

  const scheduleRefresh=()=>{
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(refreshContentDetails);
  };

  const app=document.getElementById("app");
  if(app)new MutationObserver(scheduleRefresh).observe(app,{childList:true,subtree:true});
  refreshContentDetails();
})();
