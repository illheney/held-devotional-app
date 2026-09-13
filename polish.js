/* Held v1.2 premium layer — preserves Held v1 data and stays fully on-device. */
(() => {
  const baseRender = render;
  const baseBind = bind;

  const VERSION = "1.2.0";
  const THEMES = ["peace","trust","identity","hope","rest","relationships","forgiveness","motherhood","purpose","courage","gratitude","faith","grief"];
  const META = {
    peace:{label:"Peace",glyph:"◌",line:"A quieter place to land."},
    trust:{label:"Trust",glyph:"⌁",line:"For what you cannot see yet."},
    identity:{label:"Identity",glyph:"◇",line:"Truth about who you are."},
    hope:{label:"Hope",glyph:"✦",line:"Light for unfinished stories."},
    rest:{label:"Rest",glyph:"☾",line:"Permission to stop striving."},
    relationships:{label:"Relationships",glyph:"∞",line:"Love with honesty and wisdom."},
    forgiveness:{label:"Forgiveness",glyph:"↺",line:"Freedom without pretending."},
    motherhood:{label:"Family",glyph:"⌂",line:"Grace for ordinary sacred moments."},
    purpose:{label:"Purpose",glyph:"→",line:"Faithfulness over pressure."},
    courage:{label:"Courage",glyph:"△",line:"A brave next step."},
    gratitude:{label:"Gratitude",glyph:"✧",line:"Notice what is still good."},
    faith:{label:"Faith",glyph:"†",line:"Honest room for belief and questions."},
    grief:{label:"Grief",glyph:"·",line:"Gentleness for what still hurts."}
  };

  todayKey = function(){
    const d=new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };

  if(!globalThis.crypto) globalThis.crypto={};
  if(!globalThis.crypto.randomUUID){
    globalThis.crypto.randomUUID=()=>`held-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
  }

  state.profile = state.profile || {};
  if(!Array.isArray(state.profile.focusThemes)) state.profile.focusThemes=[];
  if(typeof state.profile.dark!=="boolean") state.profile.dark=false;
  if(!("learningSince" in state.profile)) state.profile.learningSince=null;
  save();

  const themeMeta=t=>META[t]||{label:t?`${t[0].toUpperCase()}${t.slice(1)}`:"",glyph:"•",line:""};
  const localDateLabel=(date)=>new Date(`${date}T12:00:00`).toLocaleDateString(undefined,{month:"short",day:"numeric"});
  const daysAgo=(date)=>{
    const a=new Date(`${date}T12:00:00`), b=new Date(`${todayKey()}T12:00:00`);
    return Math.max(0,Math.round((b-a)/86400000));
  };
  const installed=()=>window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone===true;
  const signalCount=()=>Object.values(state.themeWeights||{}).filter(v=>v>0).length;
  const recentCompleted=(days=7)=>{
    const cutoff=new Date(); cutoff.setHours(12,0,0,0); cutoff.setDate(cutoff.getDate()-(days-1));
    return state.history.filter(h=>h.completed && new Date(`${h.date}T12:00:00`)>=cutoff);
  };
  const whyToday=(d)=>{
    const c=state.checkin?.date===todayKey()?state.checkin:null;
    if(c?.needs?.length){
      const labels=c.needs.slice(0,2).map(n=>NEEDS.find(([k])=>k===n)?.[1]||n.toLowerCase());
      return `Your check-in mentioned ${labels.join(" and ")}. Held brought forward ${themeMeta(d.theme).label.toLowerCase()} without treating one hard day like a permanent label.`;
    }
    const scores=recomputeWeights();
    const ranked=Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    if(ranked[0]?.[0]===d.theme) return `Recent reflections and choices have made ${themeMeta(d.theme).label.toLowerCase()} a meaningful thread. Held is gently revisiting it without locking you into it.`;
    return `Held balances your recent themes with variety, so today's devotional can be relevant without becoming repetitive.`;
  };

  recomputeWeights = function(){
    const scores=Object.fromEntries(THEMES.map(t=>[t,0]));
    recentHistory(28).filter(h=>!state.profile.learningSince || h.date>=state.profile.learningSince).forEach((h,idx)=>{
      const freshness=Math.max(.28,Math.pow(.93,idx));
      (h.needs||[]).forEach(n=>(NEED_THEME[n]||[]).forEach(t=>scores[t]+=2.5*freshness));
      Object.entries(analyzeText(`${h.reflection||""} ${h.note||""}`)).forEach(([t,v])=>scores[t]+=v*.75*freshness);
      if(h.helpful==="yes") scores[h.theme]+=1.25*freshness;
      if(h.helpful==="some") scores[h.theme]+=.4*freshness;
      if(h.helpful==="no") scores[h.theme]-=.8*freshness;
      if(["very-low","low"].includes(h.mood)){scores.peace+=.65*freshness;scores.hope+=.55*freshness;scores.rest+=.45*freshness;}
    });
    state.journal.filter(j=>!state.profile.learningSince || j.date>=state.profile.learningSince).slice(-24).forEach((j,idx)=>{
      const freshness=Math.max(.3,1-(idx*.025));
      Object.entries(analyzeText(j.text)).forEach(([t,v])=>scores[t]+=v*.35*freshness);
    });
    state.favorites.forEach(id=>{const d=DEVOTIONALS.find(x=>x.id===id);if(d)scores[d.theme]+=.3;});
    (state.profile.focusThemes||[]).forEach(t=>{if(t in scores)scores[t]+=1.15;});
    state.themeWeights=scores; save(); return scores;
  };

  chooseDevotional = function(force=false){
    const date=todayKey();
    const existing=state.history.find(h=>h.date===date&&h.devotionalId);
    if(existing&&!force) return DEVOTIONALS.find(d=>d.id===existing.devotionalId)||DEVOTIONALS[0];

    const scores={...recomputeWeights()};
    if(state.checkin?.date===date){
      (state.checkin.needs||[]).forEach(n=>(NEED_THEME[n]||[]).forEach(t=>scores[t]+=4));
      if(["very-low","low"].includes(state.checkin.mood)){scores.peace+=1.9;scores.hope+=1.35;scores.rest+=1;}
      if(["good","great"].includes(state.checkin.mood)){scores.gratitude+=.65;scores.faith+=.3;}
      Object.entries(analyzeText(state.checkin.note||"")).forEach(([t,v])=>scores[t]+=v*1.8);
    }

    const recent=recentHistory(4);
    recent.forEach((h,idx)=>{ if(h.theme in scores) scores[h.theme]-=[2.3,1.25,.7,.35][idx]||0; });
    const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([t])=>t);
    let preferred=ranked[0]||"peace";

    const completedIds=new Set(state.history.filter(h=>h.completed).map(h=>h.devotionalId));
    const desiredLevel=themeCount(preferred)>=1?2:1;
    let candidates=DEVOTIONALS.filter(d=>d.theme===preferred&&d.level<=desiredLevel&&!completedIds.has(d.id));
    if(!candidates.length)candidates=DEVOTIONALS.filter(d=>d.theme===preferred&&!completedIds.has(d.id));
    if(!candidates.length)candidates=DEVOTIONALS.filter(d=>!completedIds.has(d.id));
    if(!candidates.length)candidates=DEVOTIONALS;
    const pick=candidates[Math.abs(hashCode(`${date}-${preferred}`))%candidates.length];

    state.history=state.history.filter(h=>h.date!==date);
    state.history.push({
      date,devotionalId:pick.id,theme:pick.theme,completed:false,
      mood:state.checkin?.mood||"",needs:state.checkin?.needs||[],
      note:state.checkin?.note||"",reflection:"",helpful:""
    });
    save(); return pick;
  };

  topbar = function(){
    return `<header class="topbar"><div class="brand-row">
      <button class="brand-lockup" data-view="today" aria-label="Go to Today">
        <img src="icons/icon-192.png" alt="" class="brand-mark"/>
        <span><span class="brand">Held</span><span class="tagline">Scripture that meets you where you are.</span></span>
      </button>
      <button class="icon-btn" data-view="settings" aria-label="Settings"><span aria-hidden="true">•••</span></button>
    </div></header>`;
  };

  bottomNav = function(){
    const items=[
      ["today","<path d='M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5z'/><path d='M9 21v-7h6v7'/>","Today"],
      ["journal","<path d='M5 4h14v16H5z'/><path d='M8 8h8M8 12h8M8 16h5'/>","Journal"],
      ["prayers","<path d='M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z'/>","Prayer"],
      ["journey","<path d='M4 18c3-7 6-2 9-8s5-3 7-6'/><path d='M17 4h3v3'/>","Journey"],
      ["library","<path d='M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22z'/><path d='M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z'/>","Library"]
    ];
    return `<nav class="bottom-nav" aria-label="Primary"><div class="bottom-inner">${items.map(([v,path,l])=>`<button class="nav-btn ${state.lastView===v?"active":""}" data-view="${v}" aria-label="${l}"><svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg><span>${l}</span></button>`).join("")}</div></nav>`;
  };

  onboarding = function(){
    return `<section class="onboarding">
      <div class="onboard-orbit"><img src="icons/icon-192.png" alt="" /></div>
      <div class="eyebrow">Welcome to Held</div>
      <h1>Make room for what God is doing in you.</h1>
      <p class="lede">A quiet, private devotional that notices your rhythm and gently changes with you.</p>
      <div class="value-grid">
        <div class="value-card"><span>01</span><strong>Meet today</strong><p>Check in honestly. No pressure to perform.</p></div>
        <div class="value-card"><span>02</span><strong>Grow naturally</strong><p>Your path adapts from what actually helps.</p></div>
        <div class="value-card"><span>03</span><strong>Stay private</strong><p>Your journal and prayer life stay on this device.</p></div>
      </div>
      <div class="card onboarding-card">
        <label for="onboard-name">What should Held call you?</label>
        <input id="onboard-name" autocomplete="given-name" placeholder="First name (optional)"/>
        <p class="privacy-line">No account. No ads. No data sent to an AI service.</p>
        <button class="btn full premium-cta" id="start-held">Begin gently <span aria-hidden="true">→</span></button>
      </div>
    </section>`;
  };

  checkinCard = function(){
    return `<div class="card checkin-card">
      <div class="card-kicker"><span class="mini-mark">◌</span><span>Daily check-in</span></div>
      <h3>How are you arriving today?</h3>
      <p class="muted small">Choose what feels true. Held uses this for today, not as a label.</p>
      <label>How does today feel?</label>
      <div class="mood-row" id="mood-chips">${MOODS.map(([k,l])=>`<button class="chip mood-chip" data-mood="${k}">${l}</button>`).join("")}</div>
      <label>What's closest to the surface?</label>
      <div class="chips" id="need-chips">${NEEDS.map(([k,l])=>`<button class="chip" data-need="${k}">${l}</button>`).join("")}</div>
      <textarea id="checkin-note" rows="3" placeholder="Anything else on your mind? (optional)"></textarea>
      <button class="btn full premium-cta" id="save-checkin">Shape today's devotional <span aria-hidden="true">→</span></button>
    </div>`;
  };

  insightCard = function(){
    const scores=recomputeWeights();
    const top=Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([t])=>themeMeta(t).label);
    const txt=top.length
      ? `A few recent signals point toward ${top.join(" and ")}. Held is keeping those themes nearby without making them your whole story.`
      : "Held is still learning your rhythm. A few check-ins and reflections will make this more personal.";
    return `<div class="notice insight-notice"><div class="insight-icon">✦</div><div><strong>Held noticed</strong><p>${escapeHtml(txt)}</p></div><button class="text-btn" id="redo-checkin">Check in again</button></div>`;
  };

  todayView = function(){
    const d=chooseDevotional(), h=currentEntry(), meta=themeMeta(d.theme);
    const checked=state.checkin?.date===todayKey();
    const firstName=state.profile.name?`, ${escapeHtml(state.profile.name)}`:"";
    const reflectionDone=!!(h.reflection||"").trim();
    const steps=[checked, true, reflectionDone, h.completed];
    return `<section class="today-page" data-devotional-theme="${escapeHtml(d.theme)}">
      <div class="hero premium-hero">
        <div class="eyebrow">${new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</div>
        <h1>Good ${dayPart()}${firstName}.</h1>
        <p class="hero-whisper">${h.completed?"You showed up today. That is enough.":"Take what you need. Leave the pressure."}</p>
      </div>

      <div class="rhythm-strip" aria-label="Today's devotional progress">
        <div class="rhythm-copy"><strong>Today's rhythm</strong><span>${h.completed?"Complete":"A few quiet minutes"}</span></div>
        <div class="rhythm-steps">${["Check in","Read","Reflect","Rest"].map((s,i)=>`<span class="${steps[i]?"done":""}"><i></i>${s}</span>`).join("")}</div>
      </div>

      ${!checked?checkinCard():insightCard()}

      <article class="devotional-card">
        <div class="devotional-head">
          <div class="theme-emblem">${meta.glyph}</div>
          <div><div class="eyebrow">${meta.label} · ${d.level===1?"Foundation":"Deeper"}</div><h2>${escapeHtml(d.title)}</h2><p class="theme-line">${escapeHtml(meta.line)}</p></div>
          <button class="quiet-btn" id="quiet-mode" aria-label="Enter quiet reading mode">Quiet</button>
        </div>

        <div class="scripture premium-scripture">
          <span class="scripture-label">Scripture</span><strong>${escapeHtml(d.ref)}</strong>
          <button class="copy-ref" id="copy-ref" data-ref="${escapeHtml(d.ref)}">Copy reference</button>
          <p>Read the passage slowly in your preferred Bible, then return when you're ready.</p>
        </div>

        <div class="devotional-body"><p>${escapeHtml(d.thought)}</p></div>

        <details class="why-card"><summary>Why this today?</summary><p>${escapeHtml(whyToday(d))}</p></details>

        <div class="section-divider"><span>Reflect</span></div>
        <ol class="reflection-prompts">${d.questions.map(q=>`<li>${escapeHtml(q)}</li>`).join("")}</ol>
        <textarea id="reflection" class="reflection-box" placeholder="Write without editing yourself…">${escapeHtml(h.reflection||"")}</textarea>
        <div class="reflection-meta"><span>Your words stay on this device.</span><span id="reflection-count">${(h.reflection||"").trim()?`${(h.reflection||"").trim().split(/\s+/).length} words`:""}</span></div>

        <div class="practice-grid">
          <div class="practice-card"><span class="practice-icon">→</span><div><div class="eyebrow">Practice</div><p>${escapeHtml(d.action)}</p></div></div>
          <div class="practice-card prayer-card"><span class="practice-icon">◌</span><div><div class="eyebrow">Prayer</div><p>${escapeHtml(d.prayer)}</p></div></div>
        </div>

        <div class="devotional-actions">
          <button class="btn full premium-cta ${h.completed?"complete-state":""}" id="complete-today">${h.completed?"Held for today ✓":"Complete today's devotional"}</button>
          <div class="secondary-actions">
            <button class="btn secondary" id="favorite-today">${state.favorites.includes(d.id)?"Saved ♥":"Save for later ♡"}</button>
            <button class="text-btn" id="change-devotional">I need something different</button>
          </div>
        </div>
      </article>
      ${h.completed?helpfulCard(h):""}
    </section>`;
  };

  helpfulCard = function(h){
    return `<div class="card response-card"><div class="eyebrow">One last thing</div><h3>Did this meet you where you are?</h3>
      <div class="feedback-grid">
        <button class="${h.helpful==="yes"?"selected":""}" data-helpful="yes"><span>Yes</span><small>More like this</small></button>
        <button class="${h.helpful==="some"?"selected":""}" data-helpful="some"><span>Somewhat</span><small>Keep it balanced</small></button>
        <button class="${h.helpful==="no"?"selected":""}" data-helpful="no"><span>Not really</span><small>Adjust future picks</small></button>
      </div>
      <p class="small muted">Held learns from the signal, not from judging your answer.</p></div>`;
  };

  journalView = function(){
    const entries=[...state.journal].reverse();
    const existing=state.history.find(h=>h.date===todayKey());
    const d=existing?DEVOTIONALS.find(x=>x.id===existing.devotionalId):null;
    const prompt=d?.questions?.[0]||"What's on your heart today?";
    return `<section class="section-page">
      <div class="hero page-hero"><div class="eyebrow">Journal</div><h1>A place to tell the truth.</h1><p class="lede">No audience. No perfect wording.</p></div>
      <div class="card prompt-card"><div class="card-kicker"><span>✎</span><span>Today's prompt</span></div><p class="prompt">${escapeHtml(prompt)}</p>
        <textarea id="journal-text" placeholder="Start anywhere…"></textarea>
        <button class="btn full premium-cta" id="save-journal">Save privately</button></div>
      <div class="section-title"><h2>Entries</h2><span class="badge">${entries.length}</span></div>
      <div class="timeline-list">${entries.length?entries.map(j=>{
        const themes=Object.entries(analyzeText(j.text)).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([t])=>themeMeta(t).label);
        return `<article class="timeline-card"><time>${fmtDate(j.date)}</time>${themes.length?`<div class="mini-tags">${themes.map(t=>`<span>${escapeHtml(t)}</span>`).join("")}</div>`:""}<p>${escapeHtml(j.text)}</p></article>`;
      }).join(""):`<div class="empty premium-empty"><span>✎</span><strong>Your journal starts when you do.</strong><p>There is nothing to catch up on.</p></div>`}</div>
    </section>`;
  };

  prayersView = function(){
    const p=[...state.prayers].reverse();
    const answered=p.filter(x=>x.answered).length;
    return `<section class="section-page">
      <div class="hero page-hero"><div class="eyebrow">Prayer</div><h1>Bring it here.</h1><p class="lede">${p.length?`${p.length-answered} still being held · ${answered} answered`:"A quiet place for what you are carrying."}</p></div>
      <div class="card prayer-entry"><label>What are you praying about?</label><textarea id="prayer-text" placeholder="Write it simply…"></textarea><button class="btn full premium-cta" id="save-prayer">Add to prayer journal</button></div>
      <div class="prayer-list">${p.length?p.map(x=>`<article class="prayer-item ${x.answered?"answered":""}">
        <div class="prayer-top"><span class="badge">${x.answered?"Answered":"Praying"}</span><time>${fmtDate(x.date)}</time></div>
        <p>${escapeHtml(x.text)}</p>
        <div class="prayer-foot"><span class="small muted">${x.answered&&x.answeredDate?`Marked answered ${localDateLabel(x.answeredDate)}`:daysAgo(x.date)===0?"Added today":`${daysAgo(x.date)} days ago`}</span>
        <button class="text-btn" data-prayer-toggle="${x.id}">${x.answered?"Still praying":"Mark answered"}</button></div>
      </article>`).join(""):`<div class="empty premium-empty"><span>◌</span><strong>No prayer is too small to write down.</strong><p>Start with one sentence.</p></div>`}</div>
    </section>`;
  };

  journeyView = function(){
    const scores=recomputeWeights();
    const positive=Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const max=Math.max(1,...positive.map(([,v])=>v));
    const recent=recentHistory(12);
    const week=recentCompleted(7);
    const weekThemes=[...new Set(week.map(h=>themeMeta(h.theme).label))];
    const weekCopy=week.length
      ? `You made room ${week.length} ${week.length===1?"day":"days"} this week${weekThemes.length?` and spent time with ${weekThemes.slice(0,3).join(", ")}`:""}.`
      : "No score to protect. Your next day with Held can simply be your next day.";
    return `<section class="section-page">
      <div class="hero page-hero"><div class="eyebrow">Journey</div><h1>Growth without the scoreboard.</h1><p class="lede">Notice the patterns. Keep the grace.</p></div>
      <div class="metric-grid premium-metrics">
        <div class="metric"><strong>${streak()}</strong><span>days in a row</span></div>
        <div class="metric"><strong>${completedCount()}</strong><span>days completed</span></div>
        <div class="metric"><strong>${state.favorites.length}</strong><span>saved moments</span></div>
      </div>
      <div class="card weekly-card"><div class="card-kicker"><span>✦</span><span>This week</span></div><h3>${week.length?"You kept showing up.":"Begin again whenever you need."}</h3><p>${escapeHtml(weekCopy)}</p></div>
      <div class="card learning-card"><div class="section-title compact"><h3>What Held is learning</h3><span class="badge">${signalCount()?`${signalCount()} signals`:"Learning"}</span></div>
        <p class="small muted">These are changing signals, never permanent labels.</p>
        ${positive.length?positive.map(([t,v])=>`<div class="theme-bar premium-bar"><span class="theme-dot">${themeMeta(t).glyph}</span><span class="name">${themeMeta(t).label}</span><div class="bar"><span style="width:${Math.max(8,(v/max)*100)}%"></span></div></div>`).join(""):`<div class="empty">A few honest check-ins will make this meaningful.</div>`}
      </div>
      <div class="section-title"><h2>Recent days</h2></div>
      <div class="journey-timeline">${recent.length?recent.map(h=>{const d=DEVOTIONALS.find(x=>x.id===h.devotionalId);return `<div class="journey-row"><span class="journey-dot ${h.completed?"done":""}"></span><div><time>${fmtDate(h.date)}</time><strong>${d?escapeHtml(d.title):"Devotional"}</strong><span>${themeMeta(h.theme).label}${h.completed?" · completed":""}</span></div></div>`}).join(""):`<div class="empty premium-empty"><span>→</span><strong>Your journey starts with one day.</strong></div>`}</div>
    </section>`;
  };

  libraryView = function(){
    return `<section class="section-page">
      <div class="hero page-hero"><div class="eyebrow">Library</div><h1>Find what today needs.</h1><p class="lede">Browse by theme or search for a word that feels close.</p></div>
      <div class="library-tools"><div class="search-wrap"><span>⌕</span><input id="library-search" type="search" placeholder="Search devotionals, themes, Scripture…" autocomplete="off"/></div>
      <div class="theme-filter" id="theme-filter"><button class="chip selected" data-library-theme="all">All</button>${THEMES.map(t=>`<button class="chip" data-library-theme="${t}">${themeMeta(t).label}</button>`).join("")}</div></div>
      <div class="library-grid" id="library-grid">${DEVOTIONALS.map(d=>libraryCard(d)).join("")}</div>
      <div class="section-title"><h2>Saved</h2><span class="badge">${state.favorites.length}</span></div>
      <div class="saved-grid">${state.favorites.length?state.favorites.map(id=>{const d=DEVOTIONALS.find(x=>x.id===id);return d?libraryCard(d,true):""}).join(""):`<div class="empty premium-empty"><span>♡</span><strong>Save what you want to return to.</strong></div>`}</div>
    </section>`;
  };
  function libraryCard(d,saved=false){
    const m=themeMeta(d.theme);
    return `<article class="library-card" data-card-theme="${d.theme}" data-card-search="${escapeHtml(`${d.title} ${d.ref} ${m.label}`.toLowerCase())}">
      <div class="library-glyph">${m.glyph}</div><div class="library-content"><div class="eyebrow">${m.label}${saved?" · saved":""}</div><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.ref)}</p></div>
      <button class="open-arrow" data-open-devotional="${d.id}" aria-label="Open ${escapeHtml(d.title)}">→</button>
    </article>`;
  }

  settingsView = function(){
    const focus=state.profile.focusThemes||[];
    return `<section class="section-page">
      <div class="hero page-hero"><div class="eyebrow">Settings</div><h1>Make Held feel like yours.</h1></div>
      <div class="card settings-card"><h3>Personal</h3><label>Name</label><input id="settings-name" value="${escapeHtml(state.profile.name||"")}" autocomplete="given-name"/>
        <label>Text size</label><select id="text-scale"><option value=".92">Smaller</option><option value="1">Standard</option><option value="1.1">Larger</option><option value="1.2">Largest</option></select>
        <div class="toggle"><div><strong>Dark mode</strong><div class="small muted">A softer palette for evenings.</div></div><input id="dark-mode" type="checkbox" ${state.profile.dark?"checked":""}></div>
        <div class="btn-row"><button class="btn premium-cta" id="save-settings">Save changes</button></div></div>

      <div class="card settings-card"><h3>Gentle focus</h3><p class="small muted">Optional. These themes get a small boost, but Held still keeps variety.</p>
        <div class="chips focus-chips">${THEMES.map(t=>`<button class="chip ${focus.includes(t)?"selected":""}" data-focus-theme="${t}">${themeMeta(t).label}</button>`).join("")}</div>
        <button class="text-btn" id="reset-learning">Reset recommendation signals</button>
      </div>

      <div class="install-tip premium-install"><div><strong>${installed()?"Held is installed":"Install Held on your Home Screen"}</strong><p class="small">${installed()?"You are using the app-style experience.":"In Safari: Share → Add to Home Screen → Add."}</p></div><span>${installed()?"✓":"→"}</span></div>

      <div class="card settings-card"><h3>Privacy & backup</h3><p>Your devotional activity, journal, prayers, and recommendation signals stay in this browser on this device. Held v1.2 sends none of that to a server or AI model.</p>
        <div class="privacy-badges"><span>On-device</span><span>No account</span><span>No ads</span></div>
        <p class="small muted">Local data can be lost if Safari website data is cleared or the app is removed. Export a backup occasionally.</p>
        <div class="btn-row"><button class="btn secondary" id="export-data">Export backup</button><label class="btn secondary import-label">Import backup<input id="import-data" type="file" accept=".json,application/json" hidden></label></div>
      </div>

      <div class="card settings-card danger-zone"><h3>Start over</h3><p class="small muted">This removes journal entries, prayers, progress, and personalization from this device.</p><button class="text-btn danger-text" id="reset-data">Delete all local data</button></div>
      <p class="center small muted">Held ${VERSION} · private by design · made to be returned to, not kept up with</p>
    </section>`;
  };

  const enhancedBind = function(){
    baseBind();

    document.querySelector("#reflection")?.addEventListener("input",e=>{
      const t=e.target.value.trim();
      const c=document.querySelector("#reflection-count");
      if(c)c.textContent=t?`${t.split(/\s+/).length} words`:"";
    });

    document.querySelector("#copy-ref")?.addEventListener("click",async e=>{
      try{await navigator.clipboard.writeText(e.currentTarget.dataset.ref||"");toast("Scripture reference copied");}
      catch{toast("Select the reference to copy it");}
    });

    document.querySelector("#quiet-mode")?.addEventListener("click",()=>{
      document.body.classList.toggle("quiet-mode");
      const on=document.body.classList.contains("quiet-mode");
      document.querySelector("#quiet-mode").textContent=on?"Exit quiet":"Quiet";
      window.scrollTo({top:document.querySelector(".devotional-card")?.offsetTop||0,behavior:"smooth"});
    });

    document.querySelector("#dark-mode")?.addEventListener("change",e=>{
      state.profile.dark=!!e.target.checked;save();render();
    });

    document.querySelectorAll("[data-focus-theme]").forEach(btn=>btn.addEventListener("click",()=>{
      const t=btn.dataset.focusTheme, arr=state.profile.focusThemes||[];
      state.profile.focusThemes=arr.includes(t)?arr.filter(x=>x!==t):[...arr,t].slice(-4);
      save();render();toast("Focus themes updated");
    }));

    document.querySelector("#reset-learning")?.addEventListener("click",()=>{
      if(!confirm("Reset Held's recommendation signals? Your journal, prayers, saved devotionals, and completed days will stay."))return;
      state.themeWeights={};
      state.profile.focusThemes=[];
      state.profile.learningSince=todayKey();
      save();render();toast("Recent recommendation signals reset");
    });

    document.querySelectorAll("[data-prayer-toggle]").forEach(btn=>{
      btn.onclick=()=>{
        const p=state.prayers.find(x=>x.id===btn.dataset.prayerToggle);
        if(!p)return;
        p.answered=!p.answered;
        p.answeredDate=p.answered?todayKey():null;
        save();render();
        toast(p.answered?"Marked answered":"Moved back to praying");
      };
    });

    const search=document.querySelector("#library-search");
    const filters=[...document.querySelectorAll("[data-library-theme]")];
    let active="all";
    const applyLibrary=()=>{
      const q=(search?.value||"").trim().toLowerCase();
      document.querySelectorAll("#library-grid .library-card").forEach(card=>{
        const theme=card.dataset.cardTheme, hay=card.dataset.cardSearch||"";
        card.hidden=!((active==="all"||theme===active)&&(!q||hay.includes(q)));
      });
    };
    search?.addEventListener("input",applyLibrary);
    filters.forEach(btn=>btn.addEventListener("click",()=>{
      active=btn.dataset.libraryTheme;
      filters.forEach(x=>x.classList.toggle("selected",x===btn));
      applyLibrary();
    }));
  };

  bind = enhancedBind;

  render = function(){
    baseRender();
    document.body.classList.toggle("dark",!!state.profile.dark);
    document.body.dataset.view=state.lastView||"today";
    const h=state.history.find(x=>x.date===todayKey());
    if(h?.theme)document.body.dataset.theme=h.theme;else delete document.body.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",state.profile.dark?"#171b17":"#f4efe7");
    const toastEl=document.querySelector(".toast");
    if(toastEl){toastEl.setAttribute("role","status");toastEl.setAttribute("aria-live","polite");}
  };

  render();
})();