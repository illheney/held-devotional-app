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
    state.journeys = state.journeys && typeof state.journeys === "object" ? state.journeys : {};
    state.journeys.progress = state.journeys.progress && typeof state.journeys.progress === "object" ? state.journeys.progress : {};
    state.journeys.notes = state.journeys.notes && typeof state.journeys.notes === "object" ? state.journeys.notes : {};
    state.growth = state.growth && typeof state.growth === "object" ? state.growth : {};
    state.memories = state.memories && typeof state.memories === "object" ? state.memories : state.memories;
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
      if(form){
        form.onsubmit=e=>{e.preventDefault();e.stopPropagation();finishOnboarding();};
      }
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
