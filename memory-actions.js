/* Held v1.6 Remembered Grace: actions */
(() => {
  const open=id=>{
    const m=heldMemories.find(id);if(!m)return;heldMemories.record(m);
    if(m.type==="journal")state.lastView="journal";
    else if(m.type==="prayer")state.lastView="prayers";
    else if(m.type==="journey"){
      state.lastView="library";state.journeys=state.journeys||{};state.journeys.screen={id:m.id.replace("journey:","")};
    } else state.lastView="library";
    save();render();
    if(m.private)toast?.("Opened privately in Held");
  };
  const bind=()=>document.querySelectorAll("[data-memory-visit]").forEach(b=>{if(b.dataset.visitBound)return;b.dataset.visitBound="1";b.onclick=()=>open(b.dataset.memoryVisit);});
  const app=document.getElementById("app");if(app)new MutationObserver(bind).observe(app,{childList:true,subtree:true});bind();
})();
