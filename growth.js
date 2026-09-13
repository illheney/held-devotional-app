/* Held v1.5 Long-Term Growth — additive, local-only reflection layer. */
(() => {
  const VERSION="1.5.0";
  state.growth=state.growth||{};
  state.growth.monthly=state.growth.monthly||{};
  state.growth.prayerRetrospectives=state.growth.prayerRetrospectives||{};
  state.growth.journeyReflections=state.growth.journeyReflections||{};
  save();

  const esc=v=>escapeHtml(String(v||""));
  const monthKey=(date=todayKey())=>String(date).slice(0,7);
  const monthLabel=key=>{const [y,m]=key.split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString(undefined,{month:"long",year:"numeric"});};
  const niceDate=date=>date?new Date(`${date}T12:00:00`).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}):"";
  const themeName=t=>({peace:"Peace",trust:"Trust",identity:"Identity",hope:"Hope",rest:"Rest",relationships:"Relationships",forgiveness:"Forgiveness",motherhood:"Family",purpose:"Purpose",courage:"Courage",gratitude:"Gratitude",faith:"Faith",grief:"Grief"}[t]||t||"");
  const journeys=()=>window.HELD_JOURNEYS||[];
  const journeyById=id=>journeys().find(j=>j.id===id);
  const finishedJourneys=()=>Object.entries(state.journeys?.progress||{}).filter(([,p])=>(p.completed||[]).length>=7).map(([id,p])=>({id,p,journey:journeyById(id)})).filter(x=>x.journey).sort((a,b)=>String(b.p.finishedAt||"").localeCompare(String(a.p.finishedAt||"")));

  const monthStats=key=>{
    const history=(state.history||[]).filter(h=>String(h.date||"").startsWith(key));
    const completed=history.filter(h=>h.completed);
    const journal=(state.journal||[]).filter(j=>String(j.date||"").startsWith(key));
    const answered=(state.prayers||[]).filter(p=>p.answered&&String(p.answeredDate||"").startsWith(key));
    const journeyDone=finishedJourneys().filter(x=>String(x.p.finishedAt||"").startsWith(key));
    const counts={};history.forEach(h=>h.theme&&(counts[h.theme]=(counts[h.theme]||0)+1));
    journal.forEach(j=>Object.entries(analyzeText(j.text||"")).forEach(([t,v])=>counts[t]=(counts[t]||0)+Math.min(2,v)));
    const themes=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t])=>t);
    return {completed,journal,answered,journeyDone,themes};
  };

  const monthSummary=(key,s)=>{
    const bits=[];
    if(s.completed.length)bits.push(`${s.completed.length} devotional ${s.completed.length===1?"day":"days"}`);
    if(s.themes.length)bits.push(`threads of ${s.themes.map(themeName).join(", ")}`);
    if(s.answered.length)bits.push(`${s.answered.length} answered ${s.answered.length===1?"prayer":"prayers"}`);
    if(s.journeyDone.length)bits.push(`${s.journeyDone.length} completed Guided ${s.journeyDone.length===1?"Journey":"Journeys"}`);
    return bits.length?`This month held ${bits.join("; ")}.`:"This month does not need to look impressive to be worth noticing.";
  };

  const milestones=()=>{
    const completed=[...new Map((state.history||[]).filter(h=>h.completed).sort((a,b)=>a.date.localeCompare(b.date)).map(h=>[h.date,h])).values()];
    const journal=[...(state.journal||[])].sort((a,b)=>String(a.date).localeCompare(String(b.date)));
    const answered=(state.prayers||[]).filter(p=>p.answered).sort((a,b)=>String(a.answeredDate||a.date).localeCompare(String(b.answeredDate||b.date)));
    const done=finishedJourneys().slice().sort((a,b)=>String(a.p.finishedAt||"").localeCompare(String(b.p.finishedAt||"")));
    const out=[],add=(glyph,title,line,date)=>out.push({glyph,title,line,date});
    if(completed[0])add("◌","You made room","Your first completed day in Held.",completed[0].date);
    if(completed[6])add("✦","Seven days of returning","Seven real days when you chose to come back.",completed[6].date);
    if(completed[29])add("◇","Thirty days of making room","Not thirty perfect days. Thirty real ones.",completed[29].date);
    if(completed[99])add("∞","A hundred days held","Ordinary days becoming part of a longer story.",completed[99].date);
    if(journal[0])add("✎","You wrote it honestly","Your first private journal entry.",journal[0].date);
    if(journal[9])add("⌁","Ten honest pages","Ten moments given words instead of carried silently.",journal[9].date);
    if(answered[0])add("†","A prayer became a memory","Your first prayer marked answered.",answered[0].answeredDate||answered[0].date);
    if(answered[4])add("✧","Five prayers remembered","Five prayers moved from asking into remembering.",answered[4].answeredDate||answered[4].date);
    if(done[0])add("→","You stayed with one thing","Your first Guided Journey reached its ending.",done[0].p.finishedAt);
    if(done[2])add("△","Three journeys walked","Three themes received enough time to go deeper.",done[2].p.finishedAt);
    return out.sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
  };

  const overlay=inner=>{
    document.querySelector("#growth-overlay")?.remove();
    const el=document.createElement("div");el.id="growth-overlay";el.className="growth-overlay";el.innerHTML=`<div class="growth-modal" role="dialog" aria-modal="true">${inner}</div>`;
    document.body.appendChild(el);document.body.classList.add("growth-modal-open");
    el.addEventListener("click",e=>{if(e.target===el||e.target.closest("[data-growth-close]")){el.remove();document.body.classList.remove("growth-modal-open");}});
    return el;
  };
  const closeOverlay=()=>{document.querySelector("#growth-overlay")?.remove();document.body.classList.remove("growth-modal-open");};

  const openMonth=key=>{
    const s=monthStats(key),saved=state.growth.monthly[key]||{};
    const box=overlay(`<button class="text-btn modal-close" data-growth-close>Close</button><div class="growth-screen-hero"><div class="growth-orbit large">◌</div><div class="eyebrow">Monthly reflection</div><h1>${monthLabel(key)}</h1><p class="lede">Not a report card. A place to notice what this month held.</p></div><div class="card month-summary"><div class="card-kicker"><span>✦</span><span>Held noticed</span></div><p>${esc(monthSummary(key,s))}</p>${s.themes.length?`<div class="mini-tags">${s.themes.map(t=>`<span>${esc(themeName(t))}</span>`).join("")}</div>`:""}</div><div class="reflection-stack">${[["attention","What did God keep bringing back to your attention?"],["grace","Where did you notice grace, even quietly?"],["different","What was hard, but different than it used to be?"],["carry","What do you want to carry into the next month?"]].map(([k,q],i)=>`<div class="card reflection-prompt"><span class="section-marker">0${i+1}</span><label>${esc(q)}</label><textarea data-month-field="${k}" placeholder="Write what feels true…">${esc(saved[k]||"")}</textarea></div>`).join("")}</div><button class="btn full premium-cta" id="save-month-growth">Save this reflection</button>`);
    box.querySelector("#save-month-growth")?.addEventListener("click",()=>{const value={month:key,savedAt:new Date().toISOString()};box.querySelectorAll("[data-month-field]").forEach(x=>value[x.dataset.monthField]=x.value.trim());state.growth.monthly[key]=value;save();toast?.("Monthly reflection saved");closeOverlay();enhance();});
  };

  const openPrayer=id=>{
    const p=(state.prayers||[]).find(x=>x.id===id);if(!p)return;const r=state.growth.prayerRetrospectives[id]||{};
    const box=overlay(`<button class="text-btn modal-close" data-growth-close>Close</button><div class="growth-screen-hero"><div class="growth-orbit large">†</div><div class="eyebrow">Answered prayer</div><h1>Pause before this becomes ordinary.</h1><p class="lede">The answer may have looked different than expected. This is a place to remember how it unfolded.</p></div><div class="card answered-prayer-quote"><span class="badge">Asked ${niceDate(p.date)}</span><p>${esc(p.text)}</p>${p.answeredDate?`<span class="small muted">Marked answered ${niceDate(p.answeredDate)}</span>`:""}</div>${[["unfolded","How did this prayer unfold?"],["surprised","What surprised you?"],["remember","What do you want to remember about God in this?"]].map(([k,q])=>`<div class="card reflection-prompt"><label>${esc(q)}</label><textarea data-prayer-field="${k}" placeholder="Write what you want future-you to remember…">${esc(r[k]||"")}</textarea></div>`).join("")}<button class="btn full premium-cta" id="save-prayer-growth">Keep this memory</button>`);
    box.querySelector("#save-prayer-growth")?.addEventListener("click",()=>{const value={savedAt:new Date().toISOString()};box.querySelectorAll("[data-prayer-field]").forEach(x=>value[x.dataset.prayerField]=x.value.trim());state.growth.prayerRetrospectives[id]=value;save();toast?.("Answered prayer remembered");closeOverlay();enhance();});
  };

  const openJourney=id=>{
    const j=journeyById(id),p=state.journeys?.progress?.[id];if(!j)return;const r=state.growth.journeyReflections[id]||{};
    const box=overlay(`<button class="text-btn modal-close" data-growth-close>Close</button><div class="completion-hero"><div class="journey-glyph large">${j.glyph}</div><div class="eyebrow">Journey complete</div><h1>You stayed with it.</h1><p class="lede">${esc(j.title)} was not something to finish fast. You gave it seven real days.</p></div><div class="card completion-note"><h3>Before you move on</h3><p>What changed may be small, unfinished, or hard to name. That still counts.</p><div class="completion-meta"><span>${p?.started?`Started ${niceDate(p.started)}`:""}</span><span>${p?.finishedAt?`Finished ${niceDate(p.finishedAt)}`:""}</span></div></div><div class="card reflection-prompt"><label>What do you want to remember from this journey?</label><textarea id="growth-journey-remember">${esc(r.remember||"")}</textarea></div><div class="card reflection-prompt"><label>What feels different now, even if it is only a little?</label><textarea id="growth-journey-change">${esc(r.change||"")}</textarea></div><button class="btn full premium-cta" id="save-journey-growth">Keep this reflection</button>`);
    box.querySelector("#save-journey-growth")?.addEventListener("click",()=>{state.growth.journeyReflections[id]={remember:box.querySelector("#growth-journey-remember")?.value.trim()||"",change:box.querySelector("#growth-journey-change")?.value.trim()||"",savedAt:new Date().toISOString()};save();toast?.("Journey reflection saved");closeOverlay();enhance();});
  };

  const enhanceJourney=()=>{
    if(document.querySelector("#growth-journey-section"))return;
    const page=document.querySelector("main .section-page")||document.querySelector("main");if(!page)return;
    const key=monthKey(),s=monthStats(key),saved=state.growth.monthly[key],marks=milestones(),done=finishedJourneys();
    const wrap=document.createElement("div");wrap.id="growth-journey-section";
    wrap.innerHTML=`<section class="growth-section"><div class="section-title growth-heading"><div><div class="eyebrow">Monthly reflection</div><h2>${monthLabel(key)}</h2></div><span class="badge">${saved?"Saved":"Open"}</span></div><div class="card growth-feature"><div class="growth-orbit">◌</div><div><h3>Notice before you move on.</h3><p>${esc(monthSummary(key,s))}</p><div class="growth-mini-stats"><span><strong>${s.completed.length}</strong> days</span><span><strong>${s.answered.length}</strong> answered</span><span><strong>${s.journal.length}</strong> entries</span></div><button class="btn secondary" data-growth-month="${key}">${saved?"Revisit reflection":"Reflect on this month"} →</button></div></div></section>${done.length?`<section class="growth-section"><div class="section-title growth-heading"><div><div class="eyebrow">Completed journeys</div><h2>What stayed with you?</h2></div></div><div class="completed-journeys">${done.map(({id,p,journey})=>{const r=state.growth.journeyReflections[id];return `<article class="completed-journey-card"><span class="journey-glyph">${journey.glyph}</span><div><time>${niceDate(p.finishedAt)}</time><h3>${esc(journey.title)}</h3><p>${r?.remember?esc(r.remember):"The ending is a good place to notice what changed."}</p><button class="text-btn" data-growth-journey="${id}">${r?"Revisit reflection":"Reflect on this journey"} →</button></div></article>`;}).join("")}</div></section>`:""}<section class="growth-section"><div class="section-title growth-heading"><div><div class="eyebrow">Markers</div><h2>Things worth remembering</h2></div><span class="badge">${marks.length||"Learning"}</span></div><p class="small muted marker-intro">These are memories, not achievements to collect.</p>${marks.length?`<div class="marker-grid">${marks.slice(0,6).map(m=>`<article class="marker-card"><span class="marker-glyph">${m.glyph}</span><div><time>${niceDate(m.date)}</time><h3>${esc(m.title)}</h3><p>${esc(m.line)}</p></div></article>`).join("")}</div>`:`<div class="empty premium-empty"><span>·</span><strong>Markers will appear naturally.</strong></div>`}</section>`;
    page.appendChild(wrap);
  };

  const enhancePrayer=()=>{
    if(document.querySelector("#growth-prayer-section"))return;const answered=(state.prayers||[]).filter(p=>p.answered).sort((a,b)=>String(b.answeredDate||b.date).localeCompare(String(a.answeredDate||a.date)));if(!answered.length)return;
    const page=document.querySelector("main .section-page")||document.querySelector("main");if(!page)return;const wrap=document.createElement("section");wrap.id="growth-prayer-section";wrap.className="growth-section answered-memory";wrap.innerHTML=`<div class="section-title growth-heading"><div><div class="eyebrow">Answered & remembered</div><h2>Look back without rushing past it.</h2></div><span class="badge">${answered.length}</span></div><div class="answered-grid">${answered.map(p=>{const r=state.growth.prayerRetrospectives[p.id];return `<article class="answered-card"><span class="marker-glyph">†</span><div><time>${niceDate(p.answeredDate||p.date)}</time><p>${esc(p.text)}</p>${r?.remember?`<blockquote>${esc(r.remember)}</blockquote>`:""}<button class="text-btn" data-growth-prayer="${p.id}">${r?"Revisit memory":"Pause & remember"} →</button></div></article>`;}).join("")}</div>`;page.appendChild(wrap);
  };

  const enhance=()=>{
    document.querySelectorAll("p,span,div").forEach(el=>{if(el.children.length===0&&/Held 1\.4\.0/.test(el.textContent||""))el.textContent=el.textContent.replace(/Held 1\.4\.0/,`Held ${VERSION}`);});
    if(state.lastView==="journey")enhanceJourney();
    if(state.lastView==="prayers")enhancePrayer();
  };

  document.addEventListener("click",e=>{
    const month=e.target.closest("[data-growth-month]");if(month){openMonth(month.dataset.growthMonth);return;}
    const prayer=e.target.closest("[data-growth-prayer]");if(prayer){openPrayer(prayer.dataset.growthPrayer);return;}
    const journey=e.target.closest("[data-growth-journey]");if(journey){openJourney(journey.dataset.growthJourney);return;}
    if(e.target.closest("#complete-journey-day")){
      const id=state.journeys?.screen?.id;
      setTimeout(()=>{const p=id&&state.journeys?.progress?.[id];if(id&&(p?.completed||[]).length>=7&&!state.growth.journeyReflections[id])openJourney(id);},0);
    }
  });

  const app=document.getElementById("app");if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
