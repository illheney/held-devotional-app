/* Held v1.4 Guided Journeys — local progress, notes, and adaptive suggestions. */
(() => {
  const JOURNEYS = [
    {id:"peace-mind",theme:"peace",title:"Peace When Your Mind Won’t Stop",subtitle:"Seven days of bringing racing thoughts back to God without demanding instant calm.",glyph:"◌",days:["peace-1","peace-3","peace-4","peace-5","peace-6","peace-7","peace-8"]},
    {id:"trust-again",theme:"trust",title:"Learning to Trust Again",subtitle:"For uncertainty, control, waiting, and the slow work of letting God hold the outcome.",glyph:"⌁",days:["trust-1","trust-3","trust-4","trust-5","trust-6","trust-7","trust-8"]},
    {id:"healthy-love",theme:"relationships",title:"Healthy Love",subtitle:"Seven days of honest love, wise boundaries, forgiveness, and staying present without losing yourself.",glyph:"∞",days:["relationships-1","relationships-2","relationships-3","relationships-5","forgiveness-1","forgiveness-3","relationships-7"]},
    {id:"who-god-says",theme:"identity",title:"Who God Says I Am",subtitle:"Untangle worth from performance, old labels, shame, and the approval of other people.",glyph:"◇",days:["identity-1","identity-3","identity-4","identity-5","identity-6","identity-7","identity-8"]},
    {id:"god-feels-quiet",theme:"faith",title:"When God Feels Quiet",subtitle:"A gentle week for doubt, distance, unanswered prayer, and faith that can still be honest.",glyph:"†",days:["faith-1","faith-3","faith-4","faith-5","faith-6","faith-7","faith-8"]},
    {id:"grief-remembering",theme:"grief",title:"Grief & Remembering",subtitle:"Make room for love, memory, sadness, and hope without putting grief on a deadline.",glyph:"·",days:["grief-1","grief-3","grief-4","grief-5","grief-6","grief-7","grief-8"]},
    {id:"becoming-mother",theme:"motherhood",title:"Becoming a Mother",subtitle:"Seven days of grace for change, responsibility, uncertainty, ordinary family life, and the woman you are becoming.",glyph:"⌂",days:["motherhood-1","motherhood-3","motherhood-4","motherhood-5","motherhood-6","motherhood-7","motherhood-8"]}
  ];
  window.HELD_JOURNEYS = JOURNEYS;

  state.journeys = state.journeys || {};
  state.journeys.progress = state.journeys.progress || {};
  state.journeys.notes = state.journeys.notes || {};
  state.journeys.screen = state.journeys.screen || null;
  state.journeys.activeId = state.journeys.activeId || null;
  save();

  const baseLibraryView = libraryView;
  const baseBind = bind;
  const journeyById = id => JOURNEYS.find(j => j.id === id);
  const devotionalById = id => DEVOTIONALS.find(d => d.id === id);
  const progressFor = id => state.journeys.progress[id] || null;
  const noteKey = (id,day) => `${id}:${day}`;
  const pct = p => p ? Math.round(((p.completed || []).length / 7) * 100) : 0;
  const themeLabel = t => ({peace:"Peace",trust:"Trust",relationships:"Relationships",identity:"Identity",faith:"Faith",grief:"Grief",motherhood:"Family"}[t] || t);

  const suggestedJourney = () => {
    if (state.journeys.activeId) return journeyById(state.journeys.activeId);
    const scores = typeof recomputeWeights === "function" ? recomputeWeights() : {};
    const top = Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1])[0]?.[0];
    const map = {peace:"peace-mind",rest:"peace-mind",hope:"peace-mind",trust:"trust-again",purpose:"trust-again",courage:"trust-again",relationships:"healthy-love",forgiveness:"healthy-love",identity:"who-god-says",faith:"god-feels-quiet",grief:"grief-remembering",motherhood:"becoming-mother"};
    return journeyById(map[top] || "peace-mind");
  };

  const journeyCard = (journey, featured=false) => {
    const p = progressFor(journey.id);
    const completed = p?.completed?.length || 0;
    const isFinished = completed >= 7;
    const label = isFinished ? "Revisit journey" : p ? `Continue · Day ${Math.min(7,p.currentDay||1)}` : "View journey";
    return `<article class="journey-card ${featured?"featured":""}" data-journey-theme="${journey.theme}">
      <div class="journey-card-top"><span class="journey-glyph">${journey.glyph}</span><span class="badge">7 days</span></div>
      <div class="eyebrow">${themeLabel(journey.theme)}</div><h3>${escapeHtml(journey.title)}</h3><p>${escapeHtml(journey.subtitle)}</p>
      <div class="journey-progress"><span style="width:${pct(p)}%"></span></div>
      <div class="journey-card-foot"><span>${completed ? `${completed} of 7 complete` : "Begin when you're ready"}</span><button class="text-btn" data-open-journey="${journey.id}">${label} →</button></div>
    </article>`;
  };

  const shelfView = () => {
    const suggested = suggestedJourney();
    const rest = JOURNEYS.filter(j=>j.id!==suggested.id);
    return `<section class="journeys-shelf">
      <div class="section-title journey-heading"><div><div class="eyebrow">Guided Journeys</div><h2>Stay with one thing for a little while.</h2><p class="muted">Seven-day paths when a theme needs more room than one devotional.</p></div></div>
      <div class="journey-suggestion-label"><span>✦</span> ${state.journeys.activeId?"Your current journey":"Suggested for you"}</div>
      ${journeyCard(suggested,true)}
      <div class="journey-grid">${rest.map(j=>journeyCard(j)).join("")}</div>
    </section>`;
  };

  const detailView = journey => {
    const p = progressFor(journey.id);
    const completed = p?.completed || [];
    const current = p?.currentDay || 1;
    const finished = completed.length >= 7;
    return `<section class="journey-detail" data-journey-theme="${journey.theme}">
      <button class="text-btn back-link" data-close-journey>← All journeys</button>
      <div class="journey-detail-hero"><div class="journey-glyph large">${journey.glyph}</div><div class="eyebrow">7-day journey · ${themeLabel(journey.theme)}</div><h1>${escapeHtml(journey.title)}</h1><p class="lede">${escapeHtml(journey.subtitle)}</p></div>
      ${p?`<div class="journey-overall"><div><strong>${finished?"Journey complete":"Your progress"}</strong><span>${completed.length} of 7 days</span></div><div class="journey-progress"><span style="width:${pct(p)}%"></span></div></div>`:""}
      <div class="journey-days">${journey.days.map((id,i)=>{
        const day=i+1, d=devotionalById(id), done=completed.includes(day), unlocked=!p || day<=Math.max(1,current) || done;
        return `<button class="journey-day-row ${done?"done":""} ${!unlocked?"locked":""}" ${unlocked?`data-open-journey-day="${day}"`:"disabled"}>
          <span class="day-number">${done?"✓":String(day).padStart(2,"0")}</span><span class="day-copy"><small>Day ${day}</small><strong>${escapeHtml(d?.title||"Devotional")}</strong><span>${escapeHtml(d?.ref||"")}</span></span><span class="day-arrow">${unlocked?"→":"·"}</span>
        </button>`;
      }).join("")}</div>
      <div class="journey-actions">${!p?`<button class="btn full premium-cta" data-start-journey="${journey.id}">Begin this journey →</button>`:finished?`<button class="btn full secondary" data-restart-journey="${journey.id}">Walk through it again</button>`:`<button class="btn full premium-cta" data-open-journey-day="${current}">Continue with Day ${current} →</button>`}</div>
    </section>`;
  };

  const dayView = (journey,day) => {
    const d = devotionalById(journey.days[day-1]);
    const p = progressFor(journey.id) || {completed:[],currentDay:1};
    const done = p.completed.includes(day);
    const note = state.journeys.notes[noteKey(journey.id,day)] || "";
    return `<section class="journey-reading" data-journey-theme="${journey.theme}">
      <button class="text-btn back-link" data-back-to-journey="${journey.id}">← ${escapeHtml(journey.title)}</button>
      <div class="journey-reading-head"><div class="eyebrow">Day ${day} of 7 · ${themeLabel(journey.theme)}</div><h1>${escapeHtml(d?.title||"Today's reading")}</h1><p class="muted">There is no catch-up. Come back to the next day when you are ready.</p></div>
      <div class="journey-scripture card"><div class="card-kicker"><span class="mini-mark">†</span><span>Scripture · KJV</span></div><strong class="journey-ref">${escapeHtml(d?.ref||"")}</strong><div class="journey-scripture-body" data-journey-scripture="${escapeHtml(d?.ref||"")}"><div class="scripture-loading"><span class="scripture-pulse"></span> Bringing the passage into Held…</div></div></div>
      <article class="devotional-card journey-devotional"><div class="reading-section"><div class="section-marker">01</div><div><h3>Stay here</h3><p class="devotional-thought">${escapeHtml(d?.thought||"")}</p></div></div>
      <div class="reading-section"><div class="section-marker">02</div><div><h3>Reflect</h3><ol class="reflection-list">${(d?.questions||[]).map(q=>`<li><p>${escapeHtml(q)}</p></li>`).join("")}</ol><textarea id="journey-note" placeholder="Write what feels important…">${escapeHtml(note)}</textarea><div class="field-meta"><span>Saved only on this device</span></div></div></div>
      <div class="reading-section action-section"><div class="section-marker">03</div><div><h3>Carry this into today</h3><p>${escapeHtml(d?.action||"")}</p></div></div>
      <div class="prayer-block"><span class="prayer-label">A prayer for today</span><p>${escapeHtml(d?.prayer||"")}</p></div></article>
      <div class="journey-day-actions">${done?`<div class="journey-complete-note"><strong>Day ${day} is complete.</strong><span>You can revisit it anytime.</span></div>${day<7?`<button class="btn full premium-cta" data-open-next-journey-day="${day+1}">Go to Day ${day+1} →</button>`:""}`:`<button class="btn full premium-cta" id="complete-journey-day">Complete Day ${day} ✓</button>`}</div>
    </section>`;
  };

  const journeyScreen = () => {
    const screen = state.journeys.screen;
    const journey = screen ? journeyById(screen.id) : null;
    if (!journey) return null;
    return screen.day ? dayView(journey,screen.day) : detailView(journey);
  };

  libraryView = function(){
    const screen = journeyScreen();
    if (screen) return screen;
    return `${shelfView()}${baseLibraryView()}`;
  };

  const loadJourneyScripture = async () => {
    const holder = document.querySelector("[data-journey-scripture]");
    if (!holder || holder.dataset.loaded === "1") return;
    holder.dataset.loaded = "1";
    const ref = holder.dataset.journeyScripture;
    try {
      const scripture = await window.heldScripture.get(ref);
      holder.innerHTML = `<p>${escapeHtml(scripture.text).replace(/\n/g,"<br>")}</p><div class="scripture-credit"><span>${escapeHtml(scripture.reference)}</span><span>KJV · Public Domain</span></div>`;
    } catch {
      holder.innerHTML = `<div class="scripture-offline"><p>This passage is not saved yet. Connect once to load it, then Held will keep it available offline.</p><button class="chip" id="retry-journey-scripture">Try again</button></div>`;
      holder.querySelector("#retry-journey-scripture")?.addEventListener("click",()=>{holder.dataset.loaded="";loadJourneyScripture();});
    }
  };

  bind = function(){
    baseBind();
    document.querySelector('[data-view="library"]')?.addEventListener("click",()=>{ state.journeys.screen=null; save(); },{capture:true});
    document.querySelectorAll("[data-open-journey]").forEach(btn=>btn.addEventListener("click",()=>{state.journeys.screen={id:btn.dataset.openJourney};save();render();}));
    document.querySelectorAll("[data-close-journey]").forEach(btn=>btn.addEventListener("click",()=>{state.journeys.screen=null;save();render();}));
    document.querySelectorAll("[data-start-journey]").forEach(btn=>btn.addEventListener("click",()=>{
      const id=btn.dataset.startJourney; state.journeys.progress[id]={started:todayKey(),completed:[],currentDay:1}; state.journeys.activeId=id; state.journeys.screen={id,day:1}; save(); render();
    }));
    document.querySelectorAll("[data-restart-journey]").forEach(btn=>btn.addEventListener("click",()=>{
      const id=btn.dataset.restartJourney; state.journeys.progress[id]={started:todayKey(),completed:[],currentDay:1}; state.journeys.activeId=id; state.journeys.screen={id,day:1}; save(); render();
    }));
    document.querySelectorAll("[data-open-journey-day]").forEach(btn=>btn.addEventListener("click",()=>{
      const id=state.journeys.screen?.id; if(!id)return; state.journeys.screen={id,day:Number(btn.dataset.openJourneyDay)};save();render();
    }));
    document.querySelectorAll("[data-back-to-journey]").forEach(btn=>btn.addEventListener("click",()=>{state.journeys.screen={id:btn.dataset.backToJourney};save();render();}));
    document.querySelectorAll("[data-open-next-journey-day]").forEach(btn=>btn.addEventListener("click",()=>{const id=state.journeys.screen?.id;if(!id)return;state.journeys.screen={id,day:Number(btn.dataset.openNextJourneyDay)};save();render();}));
    document.querySelector("#journey-note")?.addEventListener("input",e=>{const s=state.journeys.screen;if(!s?.id||!s.day)return;state.journeys.notes[noteKey(s.id,s.day)]=e.target.value;save();});
    document.querySelector("#complete-journey-day")?.addEventListener("click",()=>{
      const s=state.journeys.screen;if(!s?.id||!s.day)return; const p=progressFor(s.id)||{started:todayKey(),completed:[],currentDay:1};
      if(!p.completed.includes(s.day))p.completed.push(s.day);p.completed.sort((a,b)=>a-b);p.currentDay=Math.min(7,Math.max(p.currentDay||1,s.day+1));
      if(p.completed.length>=7){p.finishedAt=todayKey();state.journeys.activeId=null;}else state.journeys.activeId=s.id;
      state.journeys.progress[s.id]=p; state.journeys.screen={id:s.id}; save(); render(); toast?.(p.completed.length>=7?"Journey complete":"Day complete");
    });
    loadJourneyScripture();
  };

  render();
})();
