/* Held v1.7 — deterministic daily check-in controls. */
(() => {
  const attach = () => {
    document.querySelectorAll("[data-mood]").forEach(button => {
      if (button.dataset.checkinStable) return;
      button.dataset.checkinStable="1";
      button.addEventListener("click", e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        document.querySelectorAll("[data-mood]").forEach(item => {
          const selected=item===button;
          item.classList.toggle("selected",selected);
          item.setAttribute("aria-pressed",String(selected));
        });
      }, {capture:true});
    });

    document.querySelectorAll("[data-need]").forEach(button => {
      if (button.dataset.checkinStable) return;
      button.dataset.checkinStable="1";
      button.addEventListener("click", e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const selected=!button.classList.contains("selected");
        button.classList.toggle("selected",selected);
        button.setAttribute("aria-pressed",String(selected));
      }, {capture:true});
    });

    const saveButton=document.querySelector("#save-checkin");
    if(saveButton&&!saveButton.dataset.checkinStable){
      saveButton.dataset.checkinStable="1";
      saveButton.addEventListener("click", e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const mood=document.querySelector("[data-mood].selected")?.dataset.mood||"okay";
        const needs=[...document.querySelectorAll("[data-need].selected")].map(item=>item.dataset.need).filter(Boolean);
        const note=document.querySelector("#checkin-note")?.value.trim()||"";
        state.checkin={date:todayKey(),mood,needs,note};
        state.history=state.history.filter(h=>h.date!==todayKey());
        save();
        chooseDevotional(true);
        render();
        toast?.("Today's path adjusted");
      }, {capture:true});
    }
  };

  const priorBind=bind;
  bind=function(){
    priorBind();
    attach();
  };

  attach();
})();
