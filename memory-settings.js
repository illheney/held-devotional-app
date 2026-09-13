/* Held v1.6 Remembered Grace: settings */
(() => {
  const add=()=>{
    if(state.lastView!=="settings"||document.querySelector("#memory-settings-card"))return;
    const cards=[...document.querySelectorAll("main .card")],anchor=cards.find(c=>c.querySelector("h3")?.textContent?.trim()==="Gentle focus")||cards[0];if(!anchor)return;
    const card=document.createElement("div");card.id="memory-settings-card";card.className="card settings-card memory-settings";
    card.innerHTML=`<h3>Remembered Grace</h3><p class="small muted">Held can gently bring older moments back after enough time has passed. Private journal and prayer text is never previewed on Today.</p><div class="toggle"><div><strong>Resurface old moments</strong><div class="small muted">Turn this off any time without deleting anything.</div></div><input id="memory-enabled" type="checkbox" ${state.memories?.enabled!==false?"checked":""}></div><p class="small muted memory-settings-note">How often?</p><div class="memory-frequency">${[["gentle","Gentle · about every 5 days"],["regular","Regular · about every 3 days"],["often","Often · up to daily"]].map(([k,l])=>`<button class="chip ${state.memories?.frequency===k?"selected":""}" data-memory-frequency="${k}">${l}</button>`).join("")}</div>`;
    anchor.parentNode.insertBefore(card,anchor.nextSibling);
    card.querySelector("#memory-enabled").onchange=e=>{state.memories.enabled=!!e.target.checked;state.memories.todayId=null;save();};
    card.querySelectorAll("[data-memory-frequency]").forEach(b=>b.onclick=()=>{state.memories.frequency=b.dataset.memoryFrequency;save();card.querySelectorAll("[data-memory-frequency]").forEach(x=>x.classList.toggle("selected",x===b));});
  };
  const app=document.getElementById("app");if(app)new MutationObserver(add).observe(app,{childList:true,subtree:true});add();
})();
