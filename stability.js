/* Held v1.7 — stability layer and defensive state migration. */
(() => {
  const VERSION = "1.7.0";

  const normalizeState = () => {
    state = state && typeof state === "object" ? state : {};
    state.profile = {name:"",started:null,textScale:1,dark:false,focusThemes:[],learningSince:null,...(state.profile||{})};
    if(!Array.isArray(state.profile.focusThemes)) state.profile.focusThemes=[];
    state.history = Array.isArray(state.history) ? state.history : [];
    state.journal = Array.isArray(state.journal) ? state.journal : [];
    state.prayers = Array.isArray(state.prayers) ? state.prayers : [];
    state.favorites = Array.isArray(state.favorites) ? state.favorites : [];
    state.themeWeights = state.themeWeights && typeof state.themeWeights === "object" ? state.themeWeights : {};
    state.lastView = typeof state.lastView === "string" ? state.lastView : "today";
    state.libraryReadingId = typeof state.libraryReadingId === "string" ? state.libraryReadingId : null;
    state.journeys = state.journeys && typeof state.journeys === "object" ? state.journeys : {};
    state.journeys.progress = state.journeys.progress && typeof state.journeys.progress === "object" ? state.journeys.progress : {};
    state.journeys.notes = state.journeys.notes && typeof state.journeys.notes === "object" ? state.journeys.notes : {};
    state.growth = state.growth && typeof state.growth === "object" ? state.growth : {};
    state.memories = state.memories && typeof state.memories === "object" ? state.memories : {};
  };

  normalizeState();
  save();

  streak = function(){
    const done = new Set((state.history||[]).filter(h=>h.completed).map(h=>h.date));
    let total=0;
    const d=new Date(); d.setHours(12,0,0,0);
    for(let i=0;i<3650;i++){
      const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      if(done.has(key)){total++;d.setDate(d.getDate()-1);continue;}
      if(i===0){d.setDate(d.getDate()-1);continue;}
      break;
    }
    return total;
  };

  const finishOnboarding = () => {
    if(state.profile.started) return;
    const input=document.querySelector("#onboard-name");
    state.profile.name=String(input?.value||"").trim().slice(0,40);
    state.profile.started=todayKey();
    state.lastView="today";
    save();
    render();
    toast?.(state.profile.name?`Welcome, ${state.profile.name}`:"Welcome to Held");
  };

  const dailyTodayView=todayView;
  const labelTheme=t=>({peace:"Peace",trust:"Trust",identity:"Identity",hope:"Hope",rest:"Rest",relationships:"Relationships",forgiveness:"Forgiveness",motherhood:"Family",purpose:"Purpose",courage:"Courage",gratitude:"Gratitude",faith:"Faith",grief:"Grief"}[t]||t||"");
  const libraryPreviewView=()=>{
    const d=DEVOTIONALS.find(x=>x.id===state.libraryReadingId);
    if(!d){state.libraryReadingId=null;save();return dailyTodayView();}
    return `<section class="today-page library-preview-page">
      <div class="hero premium-hero"><div class="eyebrow">Library reading · ${escapeHtml(labelTheme(d.theme))}</div><h1>${escapeHtml(d.title)}</h1><p class="hero-whisper">A reading for right now. Your daily devotional stays exactly where you left it.</p></div>
      <button class="text-btn" id="return-daily">← Return to today's devotional</button>
      <article class="devotional-card">
        <div class="devotional-head"><div class="theme-emblem">◌</div><div><div class="eyebrow">${escapeHtml(labelTheme(d.theme))} · Library</div><h2>${escapeHtml(d.title)}</h2><p class="theme-line">Browse without changing today's progress.</p></div></div>
        <div class="premium-scripture"><span class="scripture-label">Scripture</span><strong>${escapeHtml(d.ref)}</strong><button class="copy-ref" id="copy-ref" data-ref="${escapeHtml(d.ref)}">Copy</button><p class="muted small">Read slowly. Held will load the passage here when available.</p></div>
        <div class="devotional-body"><p>${escapeHtml(d.thought)}</p></div>
        <div class="section-divider"><span>Reflect</span></div>
        <ol class="reflection-prompts">${(d.questions||[]).map(q=>`<li>${escapeHtml(q)}</li>`).join("")}</ol>
        <div class="practice-grid"><div class="practice-card"><span class="practice-icon">→</span><div><div class="eyebrow">Practice</div><p>${escapeHtml(d.action)}</p></div></div><div class="practice-card prayer-card"><span class="practice-icon">◌</span><div><div class="eyebrow">Prayer</div><p>${escapeHtml(d.prayer)}</p></div></div></div>
        <div class="devotional-actions"><button class="btn full premium-cta" id="favorite-preview">${state.favorites.includes(d.id)?"Saved ♥":"Save for later ♡"}</button><button class="text-btn" id="return-daily-bottom">Return to today's devotional</button></div>
      </article>
    </section>`;
  };

  todayView=function(){ return state.libraryReadingId ? libraryPreviewView() : dailyTodayView(); };

  const openLibraryPreview=id=>{
    if(!DEVOTIONALS.some(d=>d.id===id))return;
    state.libraryReadingId=id;
    state.lastView="today";
    save();
    render();
  };
  const closeLibraryPreview=()=>{state.libraryReadingId=null;save();render();};

  const priorBind = bind;
  bind = function(){
    priorBind();

    if(!state.profile.started){
      const form=document.querySelector("#held-onboarding-form");
      const input=document.querySelector("#onboard-name");
      const button=document.querySelector("#start-held");
      if(input){ input.disabled=false; input.readOnly=false; input.style.pointerEvents="auto"; }
      if(button){
        button.disabled=false;
        button.style.pointerEvents="auto";
        button.onclick=e=>{e.preventDefault();e.stopPropagation();finishOnboarding();};
      }
      if(form){ form.onsubmit=e=>{e.preventDefault();e.stopPropagation();finishOnboarding();}; }
    }

    document.querySelectorAll("[data-open-devotional]").forEach(button=>{
      button.addEventListener("click",e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        openLibraryPreview(button.dataset.openDevotional);
      },{capture:true});
    });

    document.querySelectorAll("[data-view]").forEach(button=>{
      button.addEventListener("click",()=>{
        if(state.libraryReadingId){state.libraryReadingId=null;save();}
      },{capture:true});
    });

    document.querySelector("#return-daily")?.addEventListener("click",closeLibraryPreview);
    document.querySelector("#return-daily-bottom")?.addEventListener("click",closeLibraryPreview);
    document.querySelector("#favorite-preview")?.addEventListener("click",()=>{
      const id=state.libraryReadingId;if(!id)return;
      state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];
      save();render();
    });

    const reset=document.querySelector("#reset-data");
    if(reset){
      reset.addEventListener("click",e=>{
        e.preventDefault();e.stopImmediatePropagation();
        if(!confirm("Delete all Held data from this device? This cannot be undone unless you exported a backup."))return;
        ["heldStateV1","heldScriptureWEBv1","heldDiagnosticsV1"].forEach(key=>localStorage.removeItem(key));
        state=structuredClone(DEFAULT_STATE);
        render();
      },{capture:true});
    }
  };

  const priorRender = render;
  render = function(){
    normalizeState();
    priorRender();
    document.documentElement.dataset.heldVersion=VERSION;
  };

  window.addEventListener("error",event=>{
    try{
      const errors=JSON.parse(localStorage.getItem("heldDiagnosticsV1")||"[]");
      errors.unshift({at:new Date().toISOString(),message:String(event.message||"Unknown error"),source:String(event.filename||"").split("/").pop(),line:event.lineno||0});
      localStorage.setItem("heldDiagnosticsV1",JSON.stringify(errors.slice(0,20)));
    }catch{}
  });

  window.addEventListener("unhandledrejection",event=>{
    try{
      const errors=JSON.parse(localStorage.getItem("heldDiagnosticsV1")||"[]");
      errors.unshift({at:new Date().toISOString(),message:String(event.reason?.message||event.reason||"Unhandled promise rejection"),source:"promise",line:0});
      localStorage.setItem("heldDiagnosticsV1",JSON.stringify(errors.slice(0,20)));
    }catch{}
  });

  render();
})();
