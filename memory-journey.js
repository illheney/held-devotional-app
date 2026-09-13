/* Held v1.6 Remembered Grace: Journey shelf */
(() => {
  const nice=d=>d?new Date(`${d}T12:00:00`).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}):"";
  const add=()=>{
    if(state.lastView!=="journey"||document.querySelector("#remembered-grace-shelf"))return;
    const host=document.querySelector("main .section-page");if(!host)return;
    const rows=(state.memories?.history||[]).slice(0,6),sec=document.createElement("section");sec.id="remembered-grace-shelf";sec.className="growth-section memory-shelf";
    sec.innerHTML=`<div class="section-title growth-heading"><div><div class="eyebrow">Remembered Grace</div><h2>Things Held has brought back.</h2></div><span class="badge">${rows.length||"Quiet"}</span></div>${rows.length?`<div class="memory-shelf-grid">${rows.map(v=>{const m=heldMemories.find(v.id);return `<article class="memory-shelf-card"><span class="memory-mark">${m?.glyph||"·"}</span><div><strong>${escapeHtml(v.title)}</strong><span>${nice(v.date)} · resurfaced ${nice(v.shown)}</span></div>${m?`<button class="text-btn" data-memory-visit="${escapeHtml(v.id)}">Revisit →</button>`:""}</article>`;}).join("")}</div>`:`<div class="memory-empty">Nothing has been resurfaced yet. Held waits until enough time has passed for looking back to be useful.</div>`}`;
    host.appendChild(sec);
  };
  const app=document.getElementById("app");if(app)new MutationObserver(add).observe(app,{childList:true,subtree:true});add();
})();
