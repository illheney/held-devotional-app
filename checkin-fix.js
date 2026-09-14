/* Held v1.7 — deterministic daily check-in controls. */
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

  document.addEventListener("click", event => {
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
