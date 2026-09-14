/* Held v1.6.2 — resilient first-run onboarding */
(() => {
  const originalBind = bind;

  onboarding = function(){
    const savedName = state?.profile?.name || "";
    return `<section class="onboarding" aria-labelledby="held-welcome-title">
      <div class="onboard-orbit"><img src="icons/icon-192.png" alt="" /></div>
      <div class="eyebrow">Welcome to Held</div>
      <h1 id="held-welcome-title">Make room for what God is doing in you.</h1>
      <p class="lede">A quiet, private devotional that notices your rhythm and gently changes with you.</p>
      <div class="value-grid">
        <div class="value-card"><span>01</span><strong>Meet today</strong><p>Check in honestly. No pressure to perform.</p></div>
        <div class="value-card"><span>02</span><strong>Grow naturally</strong><p>Your path adapts from what actually helps.</p></div>
        <div class="value-card"><span>03</span><strong>Stay private</strong><p>Your journal and prayer life stay on this device.</p></div>
      </div>
      <form class="card onboarding-card" id="held-onboarding-form" novalidate>
        <label for="onboard-name">What should Held call you?</label>
        <input id="onboard-name" name="name" type="text" autocomplete="given-name" autocapitalize="words" enterkeyhint="done" maxlength="40" value="${escapeHtml(savedName)}" placeholder="First name (optional)" />
        <p class="small muted onboarding-name-help">You can change this later in Settings.</p>
        <p class="privacy-line">No account. No ads. Your personal devotional data stays on this device.</p>
        <button class="btn full premium-cta" id="start-held" type="submit">Begin gently <span aria-hidden="true">→</span></button>
      </form>
    </section>`;
  };

  const finishOnboarding = () => {
    const input = document.querySelector("#onboard-name");
    if (!input || state?.profile?.started) return;
    state.profile = state.profile || {};
    state.profile.name = String(input.value || "").trim().slice(0,40);
    state.profile.started = todayKey();
    state.lastView = "today";
    save();
    document.body.classList.remove("onboarding-mode");
    render();
    toast?.(state.profile.name ? `Welcome, ${state.profile.name}` : "Welcome to Held");
  };

  const bindFirstRun = () => {
    const form = document.querySelector("#held-onboarding-form");
    const input = document.querySelector("#onboard-name");
    if (!form || !input) return;
    input.disabled = false;
    input.readOnly = false;
    input.setAttribute("aria-label", "First name");
    form.onsubmit = e => {
      e.preventDefault();
      e.stopPropagation();
      finishOnboarding();
    };
  };

  bind = function(){
    if (!state?.profile?.started) {
      bindFirstRun();
      return;
    }
    originalBind();
  };

  const originalRender = render;
  render = function(){
    originalRender();
    const firstRun = !state?.profile?.started;
    document.body.classList.toggle("onboarding-mode", firstRun);
    if (firstRun) bindFirstRun();
  };

  render();
})();
