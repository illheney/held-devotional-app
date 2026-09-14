/* Held v1.7 Remembered Grace: Today */
(() => {
  const ago=d=>{const n=heldMemories.age(d);if(n<28)return `${n} ${n===1?"day":"days"} ago`;if(n<330){const m=Math.max(1,Math.round(n/30));return `${m} ${m===1?"month":"months"} ago`;}const y=Math.max(1,Math.round(n/365));return `${y} ${y===1?"year":"years"} ago`;};
  const add=()=>{
    if(state.lastView!=="today"||state.libraryReadingId||document.querySelector("#remembered-grace-today")||!window.heldMemories)return;
    if(state.checkin?.date!==todayKey()&&!state.history?.find(h=>h.date===todayKey()&&h.completed))return;
    const m=heldMemories.choose(),host=document.querySelector(".today-page"),before=host?.querySelector(".devotional-card");
    if(!m||!host||!before)return;
    const card=document.createElement("div");card.id="remembered-grace-today";card.className="memory-card";
    card.innerHTML=`<div class="memory-top"><span class="memory-mark">${m.glyph}</span><div class="memory-copy"><div class="eyebrow">From another season · ${ago(m.date)}</div><strong>${escapeHtml(m.title)}</strong><p>${escapeHtml(m.detail||"")}</p></div></div><div class="memory-actions"><button class="btn secondary" data-memory-visit="${escapeHtml(m.id)}">Revisit gently →</button><button class="text-btn" data-memory-later="${escapeHtml(m.id)}">Not today</button></div>${m.private?`<div class="memory-private"><span>⌁</span><span>Your private words are not shown here.</span></div>`:""}`;
    before.parentNode.insertBefore(card,before);
  };
  const bind=()=>{
    document.querySelectorAll("[data-memory-later]").forEach(b=>{if(b.dataset.bound)return;b.dataset.bound="1";b.onclick=()=>{state.memories.seen[b.dataset.memoryLater]=todayKey();state.memories.todayId=null;save();document.querySelector("#remembered-grace-today")?.remove();};});
  };
  const run=()=>{add();bind();};const app=document.getElementById("app");if(app)new MutationObserver(run).observe(app,{childList:true,subtree:true});run();window.heldMemoryRun=run;
})();
