/* Held v1.7.1 — deterministic Guided Journey completion. */
(() => {
  if (window.__heldStableJourneyInstalled) return;
  window.__heldStableJourneyInstalled = true;

  document.addEventListener("click", event => {
    const completeButton = event.target.closest && event.target.closest("#complete-journey-day");
    if (!completeButton) return;

    const screen = state.journeys?.screen;
    const id = screen?.id;
    const day = Number(screen?.day || 0);
    if (!id || !day) return;

    const existing = state.journeys.progress?.[id] || {started:todayKey(),completed:[],currentDay:1};
    const completed = Array.isArray(existing.completed) ? [...existing.completed] : [];
    if (!completed.includes(day)) completed.push(day);
    completed.sort((a,b)=>a-b);

    const progress = {
      ...existing,
      started: existing.started || todayKey(),
      completed,
      currentDay: Math.min(7, Math.max(Number(existing.currentDay)||1, day+1))
    };

    if (completed.length >= 7) {
      progress.finishedAt = progress.finishedAt || todayKey();
      state.journeys.activeId = null;
    } else {
      state.journeys.activeId = id;
    }

    state.journeys.progress[id] = progress;
    state.journeys.screen = {id};
    save();
    render();
    if (typeof toast === "function") toast(completed.length >= 7 ? "Journey complete" : `Day ${day} complete`);
  }, true);
})();
