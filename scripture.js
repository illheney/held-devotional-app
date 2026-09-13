/* Held v1.4 Scripture layer — public-domain KJV, cached on-device. */
(() => {
  const STORE_KEY = "heldScriptureKJVv1";
  const API_BASE = "https://bible-api.com/";

  const readStore = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
    catch { return {}; }
  };
  const writeStore = store => localStorage.setItem(STORE_KEY, JSON.stringify(store));
  const normalizeRef = ref => String(ref || "").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  const cleanText = text => String(text || "").replace(/^\s+/gm, "").replace(/\n{3,}/g, "\n\n").trim();

  window.heldScripture = {
    translation: "King James Version",
    abbreviation: "KJV",
    publicDomain: true,
    getCached(ref) {
      return readStore()[normalizeRef(ref)] || null;
    },
    async get(ref) {
      const key = normalizeRef(ref);
      if (!key) throw new Error("Missing Scripture reference");
      const store = readStore();
      if (store[key]?.text) return store[key];
      const response = await fetch(`${API_BASE}${encodeURIComponent(key)}?translation=kjv`, {headers:{"Accept":"application/json"}});
      if (!response.ok) throw new Error(`Scripture request failed (${response.status})`);
      const data = await response.json();
      const entry = {
        reference: data.reference || key,
        text: cleanText(data.text),
        translation: data.translation_name || "King James Version",
        abbreviation: "KJV",
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
      const refs = [...new Set((window.DEVOTIONALS || DEVOTIONALS || []).map(d => normalizeRef(d.ref)).filter(Boolean))];
      let complete = 0, failed = 0;
      const queue = [...refs];
      const worker = async () => {
        while (queue.length) {
          const ref = queue.shift();
          try { await this.get(ref); }
          catch { failed++; }
          complete++;
          onProgress?.({complete,total:refs.length,failed,ref});
        }
      };
      await Promise.all(Array.from({length:4}, worker));
      return {complete,total:refs.length,failed};
    }
  };

  const renderScripture = async () => {
    const holder = document.querySelector(".premium-scripture");
    if (!holder || holder.dataset.scriptureReady === "1") return;
    const entry = typeof currentEntry === "function" ? currentEntry() : null;
    const devotional = entry ? DEVOTIONALS.find(d => d.id === entry.devotionalId) : null;
    if (!devotional?.ref) return;

    holder.dataset.scriptureReady = "1";
    const panel = document.createElement("div");
    panel.className = "held-scripture-text";
    panel.innerHTML = `<div class="scripture-loading"><span class="scripture-pulse"></span> Bringing the passage into Held…</div>`;
    holder.appendChild(panel);

    try {
      const scripture = await window.heldScripture.get(devotional.ref);
      panel.innerHTML = `<p>${escapeHtml(scripture.text).replace(/\n/g,"<br>")}</p><div class="scripture-credit"><span>${escapeHtml(scripture.reference)}</span><span>King James Version · Public Domain</span></div>`;
      const hint = holder.querySelector(".muted.small");
      if (hint) hint.textContent = "Read slowly. Notice the word or phrase that keeps your attention.";
    } catch (error) {
      panel.innerHTML = `<div class="scripture-offline"><strong>${escapeHtml(devotional.ref)}</strong><p>This passage has not been saved on this device yet. Connect once to load it here, then Held will keep it available offline.</p><button class="chip" id="retry-scripture">Try again</button></div>`;
      panel.querySelector("#retry-scripture")?.addEventListener("click",()=>{ holder.dataset.scriptureReady=""; panel.remove(); renderScripture(); });
    }
  };

  const addScriptureSettings = () => {
    if (state?.lastView !== "settings" || document.querySelector("#scripture-offline-card")) return;
    const privacy = [...document.querySelectorAll(".card")].find(card => card.querySelector("h3")?.textContent?.trim() === "Privacy");
    if (!privacy) return;
    const card = document.createElement("div");
    card.className = "card scripture-settings-card";
    card.id = "scripture-offline-card";
    const saved = window.heldScripture.count();
    card.innerHTML = `<div class="card-kicker"><span class="mini-mark">☁︎</span><span>Offline Scripture</span></div><h3>Keep the Bible text with Held.</h3><p class="muted">Held uses the public-domain King James Version. Scripture references—not journal or prayer data—are requested when a passage is first loaded.</p><div class="scripture-download-status"><strong>${saved}</strong><span>passages saved on this device</span></div><button class="btn full" id="download-scripture">Download all current passages</button><button class="text-btn danger-text" id="clear-scripture-cache">Remove saved Scripture text</button>`;
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
      if (confirm("Remove downloaded Scripture text from this device? Your Held journal, prayers, and progress will stay untouched.")) {
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
