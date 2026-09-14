/* Held v1.7.1 — deterministic primary interaction controls. */
(() => {
  if (window.__heldStableCheckinInstalled) return;
  window.__heldStableCheckinInstalled = true;

  function selectMood(button) {
    document.querySelectorAll("[data-mood]").forEach(item => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
  }

  function toggleNeed(button) {
    const selected = !button.classList.contains("selected");
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  }

  function saveCurrentCheckin() {
    const mood = document.querySelector("[data-mood].selected")?.dataset.mood || "okay";
    const needs = Array.from(document.querySelectorAll("[data-need].selected"))
      .map(item => item.dataset.need)
      .filter(Boolean);
    const note = document.querySelector("#checkin-note")?.value.trim() || "";

    state.checkin = { date: todayKey(), mood, needs, note };
    state.history = (state.history || []).filter(item => item.date !== todayKey());
    save();
    chooseDevotional(true);
    render();
    if (typeof toast === "function") toast("Today's path adjusted");
  }

  function toggleQuiet(button) {
    const on = !document.body.classList.contains("quiet-mode");
    document.body.classList.toggle("quiet-mode", on);
    button.textContent = on ? "Exit quiet" : "Quiet";
    button.setAttribute("aria-pressed", String(on));
    if (on) button.setAttribute("aria-label", "Exit quiet reading mode");
    else button.setAttribute("aria-label", "Enter quiet reading mode");
    const devotional=document.querySelector(".devotional-card");
    if (devotional && typeof window.scrollTo === "function") {
      try { window.scrollTo({top:devotional.offsetTop||0,behavior:"smooth"}); } catch {}
    }
  }

  document.addEventListener("click", event => {
    const quietButton = event.target.closest && event.target.closest("#quiet-mode");
    if (quietButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleQuiet(quietButton);
      return;
    }

    const moodButton = event.target.closest && event.target.closest("[data-mood]");
    if (moodButton) {
      event.preventDefault();
      event.stopPropagation();
      selectMood(moodButton);
      return;
    }

    const needButton = event.target.closest && event.target.closest("[data-need]");
    if (needButton) {
      event.preventDefault();
      event.stopPropagation();
      toggleNeed(needButton);
      return;
    }

    const saveButton = event.target.closest && event.target.closest("#save-checkin");
    if (saveButton) {
      event.preventDefault();
      event.stopPropagation();
      saveCurrentCheckin();
    }
  }, true);
})();
