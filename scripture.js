/* Held v1.7 Scripture layer — public-domain World English Bible, cached on-device. */
(() => {
  const STORE_KEY = "heldScriptureWEBv1";
  const API_BASE = "https://bible-api.com/";
  const DOWNLOAD_DELAY_MS = 2250;
  const REQUEST_TIMEOUT_MS = 12000;

  const readStore = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
    catch { return {}; }
  };
  const writeStore = store => localStorage.setItem(STORE_KEY, JSON.stringify(store));
  const normalizeRef = ref => String(ref || "").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  const cleanText = text => String(text || "").replace(/^\s+/gm, "").replace(/\n{3,}/g, "\n\n").trim();
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  window.heldScripture = {
    translation: "World English Bible",
    abbreviation: "WEB",
    publicDomain: true,
    getCached(ref) {
      return readStore()[normalizeRef(ref)] || null;
    },
    async get(ref) {
      const key = normalizeRef(ref);
      if (!key) throw new Error("Missing Scripture reference");
      const store = readStore();
      if (store[key]?.text) return store[key];

      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS) : null;
      let response;
      try {
        response = await fetch(`${API_BASE}${encodeURIComponent(key)}?translation=web`, {
          headers:{"Accept":"application/json"},
          signal:controller?.signal
        });
      } finally {
        if(timer) clearTimeout(timer);
      }
      if (!response.ok) throw new Error(`Scripture request failed (${response.status})`);
      const data = await response.json();
      const entry = {
        reference: data.reference || key,
        text: cleanText(data.text),
        translation: data.translation_name || "World English Bible",
        abbreviation: "WEB",
        savedAt: new Date().toISOString()
      };
      if (!entry.text) throw new Error("No Scripture text returned");
      store[key] = entry;
      writeStore(store);
      return entry;
    },
    count() { return Object.keys(readStore()).length; },
    clear() { localStorage.removeItem(STORE_KEY); },
    async downloadAll(onProgress) {
      const refs = [...new Set(DEVOTIONALS.map(d => normalizeRef(d.ref)).filter(Boolean))];
      const uncached = refs.filter(ref => !this.getCached(ref));
      let complete = refs.length - uncached.length, failed = 0;
      onProgress?.({complete,total:refs.length,failed,ref:null});
      for (let i=0;i<uncached.length;i++) {
        const ref = uncached[i];
        try { await this.get(ref); }
        catch { failed++; }
        complete++;
        onProgress?.({complete,total:refs.length,failed,ref});
        if (i < uncached.length-1) await sleep(DOWNLOAD_DELAY_MS);
      }
      return {complete,total:refs.length,failed};
    }
  };

  const renderScripture = async () => {
    const holder = document.querySelector(".premium-scripture");
    if (!holder || holder.dataset.scriptureReady === "1") return;
    const preview = state?.libraryReadingId ? DEVOTIONALS.find(d=>d.id===state.libraryReadingId) : null;
    const entry = !preview && typeof currentEntry === "function" ? currentEntry() : null;
    const devotional = preview || (entry ? DEVOTIONALS.find(d => d.id === entry.devotionalId) : null);
    if (!devotional?.ref) return;

    holder.dataset.scriptureReady = "1";
    const panel = document.createElement("div");
    panel.className = "held-scripture-text";
    panel.innerHTML = `<div class="scripture-loading"><span class="scripture-pulse"></span> Bringing the passage into Held…</div>`;
    holder.appendChild(panel);

    try {
      const scripture = await window.heldScripture.get(devotional.ref);
      panel.innerHTML = `<p>${escapeHtml(scripture.text).replace(/\n/g,"<br>")}</p><div class="scripture-credit"><span>${escapeHtml(scripture.reference)}</span><span>World English Bible · Public Domain</span></div>`;
      const hint = holder.querySelector(".muted.small");
      if (hint) hint.textContent = "Read slowly. Notice the word or phrase that keeps your attention.";
    } catch {
      panel.innerHTML = `<div class="scripture-offline"><strong>${escapeHtml(devotional.ref)}</strong><p>This passage has not been saved on this device yet. Connect once to load it here, then Held will keep it available offline.</p><button class="chip" id="retry-scripture">Try again</button></div>`;
      panel.querySelector("#retry-scripture")?.addEventListener("click",()=>{ holder.dataset.scriptureReady=""; panel.remove(); renderScripture(); });
    }
  };

  const addScriptureSettings = () => {
    if (state?.lastView !== "settings" || document.querySelector("#scripture-offline-card")) return;
    const privacy = [...document.querySelectorAll(".card")].find(card => (card.querySelector("h3")?.textContent||"").trim().startsWith("Privacy"));
    if (!privacy) return;
    const card = document.createElement("div");
    card.className = "card scripture-settings-card";
    card.id = "scripture-offline-card";
    const saved = window.heldScripture.count();
    card.innerHTML = `<div class="card-kicker"><span class="mini-mark">☁︎</span><span>Offline Scripture</span></div><h3>Keep the Bible text with Held.</h3><p class="muted">Held uses the public-domain World English Bible. Only Scripture references—not journal, prayer, check-in, or profile data—are requested when a passage is first loaded.</p><div class="scripture-download-status"><strong>${saved}</strong><span>passages saved on this device</span></div><button class="btn full" id="download-scripture">Download all current passages</button><p class="small muted">The free Scripture service limits request speed, so a full first-time download can take a few minutes. Keep Held open while it prepares the library.</p><button class="text-btn danger-text" id="clear-scripture-cache">Remove saved Scripture text</button>`;
    privacy.parentNode.insertBefore(card, privacy);

    card.querySelector("#download-scripture")?.addEventListener("click", async e => {
      const button = e.currentTarget;
      button.disabled = true;
      button.textContent = "Preparing offline Scripture…";
      const result = await window.heldScripture.downloadAll(({complete,total}) => {
        button.textContent = `Saving Scripture ${complete} / ${total}`;
      });
      button.disabled = false;
      button.textContent = result.failed ? `Saved ${result.total-result.failed} of ${result.total} passages` : `All ${result.total} passages saved ✓`;
      card.querySelector(".scripture-download-status strong").textContent = String(window.heldScripture.count());
    });
    card.querySelector("#clear-scripture-cache")?.addEventListener("click",()=>{
      if (confirm("Remove downloaded Scripture text from this device? Your Held journal, prayers, journeys, and progress will stay untouched.")) {
        window.heldScripture.clear();
        card.querySelector(".scripture-download-status strong").textContent = "0";
        toast?.("Saved Scripture removed");
      }
    });
  };

  const app = document.getElementById("app");
  if (app) new MutationObserver(() => { renderScripture(); addScriptureSettings(); }).observe(app,{childList:true,subtree:true});
  renderScripture();
  addScriptureSettings();
})();
