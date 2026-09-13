/* Held v1.1 polish layer — keeps v1 data fully compatible. */
(() => {
  const originalRender = render;
  const originalBind = bind;

  todayKey = function(){
    const d=new Date();
    const y=d.getFullYear();
    const m=String(d.getMonth()+1).padStart(2,"0");
    const day=String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  };

  if(!globalThis.crypto) globalThis.crypto={};
  if(!globalThis.crypto.randomUUID){
    globalThis.crypto.randomUUID=()=>`held-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
  }

  const themeLabel=t=>t?`${t[0].toUpperCase()}${t.slice(1)}`:"";

  recomputeWeights = function(){
    const scores={peace:0,trust:0,identity:0,hope:0,rest:0,relationships:0,forgiveness:0,motherhood:0,purpose:0,courage:0,gratitude:0,faith:0,grief:0};
    recentHistory(21).forEach((h,idx)=>{
      const freshness=Math.max(.35,1-(idx*.04));
      (h.needs||[]).forEach(n=>(NEED_THEME[n]||[]).forEach(t=>scores[t]+=2.6*freshness));
      Object.entries(analyzeText((h.reflection||"")+" "+(h.note||""))).forEach(([t,v])=>scores[t]+=v*.8*freshness);
      if(h.helpful==="yes") scores[h.theme]=(scores[h.theme]||0)+1.2*freshness;
      if(h.helpful==="some") scores[h.theme]=(scores[h.theme]||0)+.35*freshness;
      if(h.helpful==="no") scores[h.theme]=(scores[h.theme]||0)-.5*freshness;
      if(["very-low","low"].includes(h.mood)){ scores.peace+=.7*freshness; scores.hope+=.6*freshness; }
    });
    state.journal.slice(-20).forEach(j=>Object.entries(analyzeText(j.text)).forEach(([t,v])=>scores[t]+=v*.45));
    state.favorites.forEach(id=>{const d=DEVOTIONALS.find(x=>x.id===id); if(d)scores[d.theme]+=.35;});
    state.themeWeights=scores; save(); return scores;
  };

  insightCard = function(){
    const scores=recomputeWeights();
    const top=Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([t])=>themeLabel(t));
    const txt=top.length
      ? `Held is currently giving a little more attention to ${top.join(" and ")}.`
      : "Held is still learning your rhythm. A few check-ins and reflections will make this more personal.";
    return `<div class="notice"><strong>Held noticed:</strong> ${escapeHtml(txt)} <button class="chip" id="redo-checkin" style="margin-left:6px">Check in again</button></div>`;
  };

  journeyView = function(){
    const scores=recomputeWeights();
    const positive=Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const max=Math.max(1,...positive.map(([,v])=>v));
    const recent=recentHistory(10);
    const learning=positive.length
      ? positive.map(([t,v])=>`<div class="theme-bar"><span class="name">${themeLabel(t)}</span><div class="bar"><span style="width:${Math.max(4,(v/max)*100)}%"></span></div></div>`).join("")
      : `<div class="empty">Held will show meaningful patterns here after a few check-ins and reflections.</div>`;
    return `<section><div class="hero"><div class="eyebrow">Journey</div><h1>Look how far you've come.</h1></div>
      <div class="metric-grid"><div class="metric"><strong>${streak()}</strong><span class="small muted">day streak</span></div><div class="metric"><strong>${completedCount()}</strong><span class="small muted">completed</span></div><div class="metric"><strong>${state.favorites.length}</strong><span class="small muted">saved</span></div></div>
      <div class="card"><h3>What Held is learning</h3><p class="small muted">These are theme signals, not labels or diagnoses.</p>${learning}</div>
      <div class="card"><h3>Recent days</h3>${recent.length?recent.map(h=>{const d=DEVOTIONALS.find(x=>x.id===h.devotionalId);return `<div class="list-item"><div><strong>${fmtDate(h.date)}</strong><div>${d?escapeHtml(d.title):"Devotional"}</div><span class="small muted">${escapeHtml(h.theme||"")} ${h.completed?"· completed":""}</span></div></div>`}).join(""):`<div class="empty">Your journey starts with your first completed devotional.</div>`}</div></section>`;
  };

  settingsView = function(){
    return `<section><div class="hero"><div class="eyebrow">Settings</div><h1>Make Held yours.</h1></div>
      <div class="card"><label>Name</label><input id="settings-name" value="${escapeHtml(state.profile.name||"")}"/>
      <label>Text size</label><select id="text-scale"><option value=".92">Smaller</option><option value="1">Standard</option><option value="1.1">Larger</option><option value="1.2">Largest</option></select>
      <div class="toggle"><div><strong>Dark mode</strong><div class="small muted">Softer on your eyes at night.</div></div><input id="dark-mode" type="checkbox" ${state.profile.dark?"checked":""}></div>
      <div class="btn-row"><button class="btn" id="save-settings">Save settings</button></div></div>
      <div class="install-tip"><strong>Install on iPhone:</strong><p class="small">Open this site in Safari → tap Share → Add to Home Screen → turn on “Open as Web App” if shown → Add.</p></div>
      <div class="card"><h3>Privacy</h3><p>Held stores your devotional activity, journal, prayer list, and adaptation signals in this browser using local storage. It does not send that information to a server or AI model.</p>
      <p class="small muted">If you clear Safari website data or remove the app, local data can be lost. Use Export to make a backup.</p>
      <div class="btn-row"><button class="btn secondary" id="export-data">Export backup</button><label class="btn secondary" style="display:inline-flex;margin:0">Import backup<input id="import-data" type="file" accept=".json,application/json" hidden></label></div></div>
      <div class="card"><h3>Reset</h3><p class="small muted">This permanently removes Held data from this device.</p><button class="btn danger" id="reset-data">Delete all local data</button></div>
      <p class="center small muted">Held 1.1.0 · free, offline-first, private by default</p></section>`;
  };

  bind = function(){
    originalBind();
    document.querySelector("#save-checkin")?.addEventListener("click",()=>{
      const h=state.history.find(x=>x.date===todayKey());
      if(h && state.checkin){ h.note=state.checkin.note||""; save(); }
    });
    document.querySelectorAll("[data-open-devotional]").forEach(btn=>btn.addEventListener("click",()=>{
      const h=state.history.find(x=>x.date===todayKey());
      if(h && state.checkin){ h.note=state.checkin.note||""; save(); }
    }));
    document.querySelector("#dark-mode")?.addEventListener("change",e=>{
      state.profile.dark=!!e.target.checked; save(); render();
    });
  };

  render = function(){
    originalRender();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",state.profile.dark?"#20251f":"#7f8f7a");
  };

  render();
})();
