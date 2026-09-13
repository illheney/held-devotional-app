/* Held v1.6 Remembered Grace: Today */
(() => {
  const add=()=>{
    if(state.lastView!=="today"||document.querySelector("#remembered-grace-today")||!window.heldMemories)return;
    if(state.checkin?.date!==todayKey()&&!state.history?.find(h=>h.date===todayKey()&&h.completed))return;
    const m=heldMemories.choose(),host=document.querySelector(".today-page"),before=host?.querySelector(".devotional-card");
    if(!m||!host||!before)return;
    const card=document.createElement("div");card.id="remembered-grace-today";card.className="memory-card";
    card.innerHTML=`<div class="memory-top"><span class="memory-mark">${m.glyph}</span><div class="memory-copy"><div class="eyebrow">From another season</div><strong>${escapeHtml(m.title)}</strong><p>${escapeHtml(m.detail||"")}</p></div></div><div class="memory-actions"><button class="btn secondary" data-memory-visit="${escapeHtml(m.id)}">Revisit gently →</button><button class="text-btn" data-memory-later="${escapeHtml(m.id)}">Not today</button></div>${m.private?`<div class="memory-private"><span>⌁</span><span>Your private words are not shown here.</span></div>`:""}`;
    before.parentNode.insertBefore(card,before);
  };
  const bind=()=>{
    document.querySelectorAll("[data-memory-later]").forEach(b=>{if(b.dataset.bound)return;b.dataset.bound="1";b.onclick=()=>{state.memories.seen[b.dataset.memoryLater]=todayKey();state.memories.todayId=null;save();document.querySelector("#remembered-grace-today")?.remove();};});
  };
  const run=()=>{add();bind();};const app=document.getElementById("app");if(app)new MutationObserver(run).observe(app,{childList:true,subtree:true});run();window.heldMemoryRun=run;
})();
