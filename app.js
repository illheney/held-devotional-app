const HELD_VERSION = "1.0.0";
const STORAGE_KEY = "heldStateV1";

const DEVOTIONALS = [
  {id:"peace-1",theme:"peace",level:1,title:"You Can Put This Down",ref:"Matthew 11:28–30",thought:"Jesus does not ask tired people to impress Him. He invites them to come. Rest begins when you stop treating every burden as proof that you must carry it alone.",questions:["What feels heaviest today?","What would it look like to hand one piece of that weight to God?"],action:"Take five quiet minutes and name one burden you cannot control.",prayer:"God, meet me in what is heavy. Teach me to receive Your rest instead of carrying everything by myself."},
  {id:"peace-2",theme:"peace",level:2,title:"Peace Before Answers",ref:"Philippians 4:6–7",thought:"God's peace is not always an explanation. Sometimes it is the strength to stay steady while the explanation has not arrived yet.",questions:["What answer are you waiting for?","Would peace still matter even if the answer does not come today?"],action:"Write the sentence: “I do not need every answer to be held by God today.”",prayer:"God, guard my heart and mind while I wait. Give me peace that is deeper than certainty."},

  {id:"trust-1",theme:"trust",level:1,title:"One Step, Not the Whole Map",ref:"Proverbs 3:5–6",thought:"Trust rarely means seeing the whole road. It often means taking the next faithful step while letting God hold what you cannot see.",questions:["Where are you demanding a full plan before you move?","What is one faithful next step you already know?"],action:"Do the next clear thing instead of solving the next ten things.",prayer:"God, direct my path. Help me trust You with the parts I cannot see yet."},
  {id:"trust-2",theme:"trust",level:2,title:"When Control Feels Safer",ref:"Psalm 46:10",thought:"Control can feel like protection, but it can also become exhaustion. Being still is not giving up; it is remembering who God is and who you are not required to be.",questions:["What are you trying hardest to control?","What fear sits underneath that need for control?"],action:"Choose one thing today that you will intentionally stop rehearsing in your mind.",prayer:"God, loosen my grip where fear has made me controlling. Help me trust Your presence."},

  {id:"identity-1",theme:"identity",level:1,title:"More Than What Happened to You",ref:"2 Corinthians 5:17",thought:"Your story includes painful chapters, but pain does not get naming rights over your whole life. God can meet you in what happened and still call you toward something new.",questions:["What label from your past still follows you?","What would change if that label were not your identity?"],action:"Replace one harsh label with a truthful sentence about who you are becoming.",prayer:"God, help me see myself through truth instead of old wounds or other people's words."},
  {id:"identity-2",theme:"identity",level:2,title:"Loved Before You Perform",ref:"Romans 8:38–39",thought:"You do not earn God's love by being useful, calm, productive, or perfect. His love is not a prize for finally getting yourself together.",questions:["When do you feel most like you have to prove your worth?","What would receiving love without earning it feel like?"],action:"Do one small thing today simply because it brings healthy joy, not because it proves anything.",prayer:"God, teach me to live from being loved instead of living to become lovable."},

  {id:"hope-1",theme:"hope",level:1,title:"This Is Not the End of the Story",ref:"Romans 15:13",thought:"Hope is not pretending everything is fine. Biblical hope is the decision to believe that God can still work in a story that currently feels unfinished.",questions:["Where have you started assuming the worst?","What possibility have you stopped allowing yourself to hope for?"],action:"Write one sentence that begins, “God can still…”",prayer:"God of hope, meet me where I have become discouraged. Help me make room for possibility again."},
  {id:"hope-2",theme:"hope",level:2,title:"Small Light Still Counts",ref:"Psalm 30:5",thought:"Not every hopeful day feels dramatic. Sometimes hope is eating, resting, answering one message, praying one honest sentence, and believing morning can still come.",questions:["What tiny sign of life have you overlooked?","What would count as a small win today?"],action:"Choose one small win and let it be enough for today.",prayer:"God, help me notice the small mercies I usually rush past."},

  {id:"rest-1",theme:"rest",level:1,title:"Rest Is Not a Reward",ref:"Mark 6:31",thought:"Jesus told His disciples to rest before all the work was finished. Rest is not something you earn after becoming exhausted enough.",questions:["What makes you feel guilty for resting?","What is your body or mind asking for today?"],action:"Protect twenty minutes for real rest without multitasking.",prayer:"God, teach me to receive rest without guilt."},
  {id:"rest-2",theme:"rest",level:2,title:"You Are Allowed to Be Human",ref:"Psalm 103:13–14",thought:"God remembers our limits. You can stop treating normal human limits like moral failures.",questions:["Where are you expecting more from yourself than you would from someone you love?","What expectation needs to become more humane?"],action:"Lower one unnecessary expectation today.",prayer:"God, give me grace for my limits and wisdom for what truly matters."},

  {id:"relationships-1",theme:"relationships",level:1,title:"Love Without Losing Yourself",ref:"Galatians 6:2,5",thought:"Scripture makes room for both carrying one another's burdens and carrying our own responsibilities. Healthy love helps without erasing the person doing the helping.",questions:["Where are you carrying something that belongs to someone else?","What boundary would make love healthier, not colder?"],action:"Practice one kind, clear boundary today.",prayer:"God, help me love generously without disappearing inside other people's needs."},
  {id:"relationships-2",theme:"relationships",level:2,title:"Say the True Thing Kindly",ref:"Ephesians 4:15",thought:"Peace built on silence is fragile. Loving honesty can feel uncomfortable, but truth spoken with care gives relationships something real to stand on.",questions:["What have you been avoiding saying?","How can you say it without attacking or shrinking?"],action:"Write the honest sentence first. Then soften the delivery without weakening the truth.",prayer:"God, give me courage to be honest and wisdom to be gentle."},

  {id:"forgiveness-1",theme:"forgiveness",level:1,title:"Forgiveness Is Not Pretending",ref:"Colossians 3:13",thought:"Forgiveness does not require calling wrong things right. It means refusing to let another person's wrong become the permanent owner of your heart.",questions:["What do you think forgiveness would wrongly excuse?","What resentment is costing you the most energy?"],action:"Tell God exactly what hurt before asking for help releasing it.",prayer:"God, meet me in the real wound. Lead me toward freedom without asking me to deny what happened."},
  {id:"forgiveness-2",theme:"forgiveness",level:2,title:"Release Can Be a Process",ref:"Matthew 18:21–22",thought:"Some forgiveness happens in layers. Needing to release the same hurt again does not mean you failed the first time.",questions:["What hurt keeps resurfacing?","What part of it still needs attention?"],action:"Name the part that still stings instead of judging yourself for feeling it.",prayer:"God, keep working freedom into the places that still ache."},

  {id:"motherhood-1",theme:"motherhood",level:1,title:"You Do Not Have to Know Everything",ref:"Isaiah 40:11",thought:"Caring for a family can awaken a thousand questions at once. God's gentleness matters here: you are allowed to learn as you go.",questions:["What responsibility feels intimidating right now?","What would “learning as I go” free you from?"],action:"Choose one question to learn about today and release the rest for later.",prayer:"God, lead me gently. Give me wisdom for what I need today, not pressure to know everything at once."},
  {id:"motherhood-2",theme:"motherhood",level:2,title:"Love Grows in Ordinary Moments",ref:"Deuteronomy 6:6–7",thought:"Family faith is often built in ordinary moments—meals, rides, bedtime, apologies, laughter, repetition. Sacred does not have to look impressive.",questions:["What ordinary family moment feels meaningful lately?","What kind of atmosphere do you hope to build at home?"],action:"Create one tiny ritual of connection today.",prayer:"God, make our ordinary moments places where love and faith can grow."},

  {id:"purpose-1",theme:"purpose",level:1,title:"You Are Not Behind",ref:"Ephesians 2:10",thought:"Purpose is not a race against everyone else's timeline. The work God has for you is not made less meaningful because your path has been complicated.",questions:["Who are you comparing your timeline to?","What good work is already in front of you?"],action:"Give your attention to one meaningful thing already within reach.",prayer:"God, free me from comparison and help me recognize the purpose inside today's ordinary work."},
  {id:"purpose-2",theme:"purpose",level:2,title:"Faithful Is Bigger Than Impressive",ref:"Micah 6:8",thought:"A meaningful life is often built through small, faithful choices rather than constant big moments.",questions:["Where are you chasing impressive instead of faithful?","What small act would line up with your values today?"],action:"Choose the faithful thing even if nobody notices.",prayer:"God, shape my life through quiet faithfulness."},

  {id:"courage-1",theme:"courage",level:1,title:"Courage Can Shake",ref:"Joshua 1:9",thought:"Courage is not the absence of fear. It is deciding that fear does not get the final vote.",questions:["What are you afraid to face?","What would one brave step look like?"],action:"Take one step that fear has been delaying.",prayer:"God, be with me in the thing I am afraid to face."},
  {id:"courage-2",theme:"courage",level:2,title:"You Can Do Hard Things Slowly",ref:"Psalm 27:14",thought:"Waiting, healing, rebuilding, and changing often require a quieter form of courage: staying with the process when progress feels slow.",questions:["Where are you frustrated by slow progress?","What evidence shows you have not actually been standing still?"],action:"Write down three ways you have changed, even if they feel small.",prayer:"God, strengthen my heart for the slow work."},

  {id:"gratitude-1",theme:"gratitude",level:1,title:"Notice What Is Still Good",ref:"James 1:17",thought:"Gratitude does not cancel grief. It simply refuses to let pain become the only thing you can see.",questions:["What is hard right now?","What is still good alongside it?"],action:"Name three specific gifts from today, however small.",prayer:"God, keep my eyes open to goodness without asking me to deny what hurts."},
  {id:"gratitude-2",theme:"gratitude",level:2,title:"Receive the Moment You Are In",ref:"Psalm 118:24",thought:"Sometimes we miss today's goodness because our minds are already living in tomorrow's problems.",questions:["Where has your mind been spending most of its time?","What is one thing worth receiving fully today?"],action:"Put your phone away for ten minutes and be fully present for one good thing.",prayer:"God, bring me back to the life happening in front of me."},

  {id:"faith-1",theme:"faith",level:1,title:"Faith Can Be Honest",ref:"Mark 9:24",thought:"The Bible makes room for belief and doubt in the same sentence. Honest faith is still faith.",questions:["What are you struggling to believe right now?","What would an honest prayer sound like?"],action:"Pray without cleaning up your words first.",prayer:"God, I believe; help the parts of me that are struggling."},
  {id:"faith-2",theme:"faith",level:2,title:"When God Feels Quiet",ref:"Psalm 13",thought:"Silence does not automatically mean absence. Scripture includes people who kept speaking to God even when He felt far away.",questions:["When have you felt spiritually distant lately?","What keeps you from talking to God when you feel that way?"],action:"Tell God the truth about the distance instead of performing closeness.",prayer:"God, meet me even when I cannot feel You clearly."},

  {id:"grief-1",theme:"grief",level:1,title:"Grief Has No Perfect Schedule",ref:"Psalm 34:18",thought:"Grief can return in waves long after you thought you were doing better. That does not mean you are going backward.",questions:["What loss or disappointment is close to the surface today?","What do you need permission to feel?"],action:"Give the feeling a name instead of rushing to fix it.",prayer:"God, stay close to me in the places that still hurt."},
  {id:"grief-2",theme:"grief",level:2,title:"Love Leaves an Ache",ref:"John 11:35",thought:"Jesus wept. Tears are not a failure of faith. Sometimes grief is simply evidence that something mattered deeply.",questions:["What do you miss?","What memory feels worth honoring today?"],action:"Write one memory you want to keep.",prayer:"God, hold both my love and my ache."},
];

const NEEDS = [
  ["overwhelmed","Overwhelmed"],["anxious","Anxious / worried"],["discouraged","Discouraged"],
  ["uncertain","Uncertain about the future"],["relationship","Relationship stress"],["guilt","Guilt / shame"],
  ["lonely","Lonely"],["angry","Angry / frustrated"],["exhausted","Exhausted"],["family","Family / motherhood"],
  ["faith","Faith feels distant"],["grateful","Grateful"]
];
const MOODS = [["very-low","Really hard"],["low","Heavy"],["okay","Okay"],["good","Good"],["great","Really good"]];

const KEYWORDS = {
  peace:["anxious","anxiety","worry","worried","panic","overwhelmed","stress","stressed","afraid","fear"],
  trust:["control","uncertain","future","unknown","what if","waiting","decision"],
  identity:["worthless","not enough","failure","ugly","broken","shame","unlovable","hate myself"],
  hope:["hopeless","discouraged","give up","pointless","stuck","never change"],
  rest:["tired","exhausted","burned out","sleep","drained","busy"],
  relationships:["relationship","fight","argument","partner","boyfriend","husband","friend","family","boundary"],
  forgiveness:["forgive","resent","resentment","betray","hurt me","angry at"],
  motherhood:["baby","mother","mom","pregnant","pregnancy","child","kids","family"],
  purpose:["purpose","behind","career","work","calling","future","direction"],
  courage:["afraid","scared","hard thing","brave","courage","avoid"],
  gratitude:["thankful","grateful","blessed","good today"],
  faith:["god feels","doubt","faith","pray","church","spiritual","believe"],
  grief:["grief","miss","died","death","loss","lost","funeral","mourning"]
};

const NEED_THEME = {
  overwhelmed:["peace","rest"], anxious:["peace","trust"], discouraged:["hope","courage"],
  uncertain:["trust","hope"], relationship:["relationships","forgiveness"], guilt:["identity","forgiveness"],
  lonely:["identity","hope"], angry:["forgiveness","peace"], exhausted:["rest","peace"],
  family:["motherhood","relationships"], faith:["faith","trust"], grateful:["gratitude","faith"]
};

const DEFAULT_STATE = {
  profile:{name:"",started:null,textScale:1,dark:false},
  history:[],
  journal:[],
  prayers:[],
  favorites:[],
  checkin:null,
  themeWeights:{},
  lastView:"today",
  customNeed:"",
  installDismissed:false
};

function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw) return structuredClone(DEFAULT_STATE);
    return {...structuredClone(DEFAULT_STATE),...JSON.parse(raw)};
  }catch(e){ return structuredClone(DEFAULT_STATE); }
}
let state=loadState();
function save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
function todayKey(){ return new Date().toLocaleDateString("en-CA"); }
function fmtDate(d){ return new Date(d+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}); }
function escapeHtml(s=""){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m])); }
function toast(msg){ const t=document.querySelector(".toast"); if(!t)return; t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800); }

function recentHistory(n=14){ return [...state.history].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,n); }
function analyzeText(text){
  const scores={}; const lower=(text||"").toLowerCase();
  for(const [theme,words] of Object.entries(KEYWORDS)){
    for(const w of words){ if(lower.includes(w)) scores[theme]=(scores[theme]||0)+1; }
  }
  return scores;
}
function recomputeWeights(){
  const scores={peace:0,trust:0,identity:0,hope:0,rest:0,relationships:0,forgiveness:0,motherhood:0,purpose:0,courage:0,gratitude:0,faith:0,grief:0};
  recentHistory(21).forEach((h,idx)=>{
    const freshness=Math.max(.35,1-(idx*.04));
    (h.needs||[]).forEach(n=>(NEED_THEME[n]||[]).forEach(t=>scores[t]+=2.6*freshness));
    Object.entries(analyzeText((h.reflection||"")+" "+(h.note||""))).forEach(([t,v])=>scores[t]+=v*.8*freshness);
    if(h.helpful==="yes") scores[h.theme]=(scores[h.theme]||0)+1.2*freshness;
    if(h.helpful==="no") scores[h.theme]=(scores[h.theme]||0)-.5*freshness;
    if(["very-low","low"].includes(h.mood)){ scores.peace+=.7*freshness; scores.hope+=.6*freshness; }
  });
  state.journal.slice(-20).forEach(j=>Object.entries(analyzeText(j.text)).forEach(([t,v])=>scores[t]+=v*.45));
  state.favorites.forEach(id=>{const d=DEVOTIONALS.find(x=>x.id===id); if(d)scores[d.theme]+=.35;});
  state.themeWeights=scores; save(); return scores;
}
function themeCount(theme){ return state.history.filter(h=>h.theme===theme && h.completed).length; }

function chooseDevotional(force=false){
  const date=todayKey();
  const existing=state.history.find(h=>h.date===date && h.devotionalId);
  if(existing && !force) return DEVOTIONALS.find(d=>d.id===existing.devotionalId) || DEVOTIONALS[0];

  const scores=recomputeWeights();
  if(state.checkin?.date===date){
    (state.checkin.needs||[]).forEach(n=>(NEED_THEME[n]||[]).forEach(t=>scores[t]+=4));
    if(["very-low","low"].includes(state.checkin.mood)){ scores.peace+=2;scores.hope+=1.5;scores.rest+=1; }
    Object.entries(analyzeText(state.checkin.note||"")).forEach(([t,v])=>scores[t]+=v*2);
  }
  const recentThemes=recentHistory(3).map(h=>h.theme);
  const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
  let preferred=ranked[0] || "peace";
  if(recentThemes.filter(t=>t===preferred).length>=2) preferred=ranked.find(t=>t!==preferred) || preferred;

  const completedIds=new Set(state.history.filter(h=>h.completed).map(h=>h.devotionalId));
  const desiredLevel=Math.min(2,1+Math.floor(themeCount(preferred)/2));
  let candidates=DEVOTIONALS.filter(d=>d.theme===preferred && d.level<=desiredLevel && !completedIds.has(d.id));
  if(!candidates.length) candidates=DEVOTIONALS.filter(d=>d.theme===preferred && !completedIds.has(d.id));
  if(!candidates.length) candidates=DEVOTIONALS.filter(d=>!completedIds.has(d.id));
  if(!candidates.length) candidates=DEVOTIONALS;
  const pick=candidates[Math.abs(hashCode(date+preferred))%candidates.length];

  state.history=state.history.filter(h=>h.date!==date);
  state.history.push({date,devotionalId:pick.id,theme:pick.theme,completed:false,mood:state.checkin?.mood||"",needs:state.checkin?.needs||[],reflection:"",helpful:""});
  save(); return pick;
}
function hashCode(s){ let h=0; for(let i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i)|0; return h; }

function currentEntry(){
  const date=todayKey(); let h=state.history.find(x=>x.date===date);
  if(!h){ chooseDevotional();h=state.history.find(x=>x.date===date); }
  return h;
}
function streak(){
  const done=new Set(state.history.filter(h=>h.completed).map(h=>h.date));
  let s=0,d=new Date(); 
  for(let i=0;i<365;i++){ const k=d.toLocaleDateString("en-CA"); if(done.has(k)){s++;d.setDate(d.getDate()-1)} else if(i===0){d.setDate(d.getDate()-1)} else break; }
  return s;
}
function completedCount(){ return state.history.filter(h=>h.completed).length; }

function render(){
  document.documentElement.style.setProperty("--text-scale",state.profile.textScale||1);
  document.body.classList.toggle("dark",!!state.profile.dark);
  const app=document.getElementById("app");
  app.innerHTML=`<div class="app-shell">
    ${topbar()}
    <main>${view(state.lastView||"today")}</main>
  </div>${bottomNav()}<div class="toast"></div>`;
  bind();
}
function topbar(){
  return `<header class="topbar"><div class="brand-row"><div><div class="brand">Held</div><div class="tagline">Scripture that meets you where you are.</div></div><button class="icon-btn" data-view="settings" aria-label="Settings">⚙︎</button></div></header>`;
}
function bottomNav(){
  const items=[["today","⌂","Today"],["journal","✎","Journal"],["prayers","♡","Prayer"],["journey","◌","Journey"],["library","☰","Library"]];
  return `<nav class="bottom-nav"><div class="bottom-inner">${items.map(([v,i,l])=>`<button class="nav-btn ${state.lastView===v?"active":""}" data-view="${v}"><span class="emoji">${i}</span><span>${l}</span></button>`).join("")}</div></nav>`;
}
function view(v){
  if(!state.profile.started) return onboarding();
  if(v==="journal") return journalView();
  if(v==="prayers") return prayersView();
  if(v==="journey") return journeyView();
  if(v==="library") return libraryView();
  if(v==="settings") return settingsView();
  return todayView();
}
function onboarding(){
  return `<section class="hero"><div class="eyebrow">Welcome</div><h1>A devotional that grows with you.</h1>
  <div class="card"><p>Held is private by default. Your check-ins, journal entries, prayers, and devotional history stay on this device.</p>
  <label>Your first name (optional)</label><input id="onboard-name" placeholder="Your name"/>
  <div class="notice small"><strong>How adaptation works:</strong> Held uses simple on-device scoring from what you choose, write, save, and mark helpful. Nothing is sent to an AI service.</div>
  <button class="btn full" id="start-held">Start Held</button></div></section>`;
}
function todayView(){
  const d=chooseDevotional();
  const h=currentEntry();
  const firstName=state.profile.name?`, ${escapeHtml(state.profile.name)}`:"";
  const checked=state.checkin?.date===todayKey();
  return `<section class="hero"><div class="eyebrow">${new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</div><h1>Good ${dayPart()}${firstName}.</h1>
  ${!checked?checkinCard():insightCard()}
  <article class="card">
    <div class="eyebrow">${escapeHtml(d.theme)} · ${d.level===1?"foundation":"deeper"}</div>
    <h2>${escapeHtml(d.title)}</h2>
    <div class="scripture"><strong>${escapeHtml(d.ref)}</strong><p class="muted small">Read this passage slowly in your Bible or Bible app, then come back here.</p></div>
    <p>${escapeHtml(d.thought)}</p>
    <hr/><h3>Reflect</h3>
    <ol>${d.questions.map(q=>`<li><p>${escapeHtml(q)}</p></li>`).join("")}</ol>
    <textarea id="reflection" placeholder="Write anything that comes up…">${escapeHtml(h.reflection||"")}</textarea>
    <h3>Today</h3><p>${escapeHtml(d.action)}</p>
    <h3>Prayer</h3><p class="quote">${escapeHtml(d.prayer)}</p>
    <div class="btn-row">
      <button class="btn ${h.completed?"secondary":""}" id="complete-today">${h.completed?"Completed ✓":"Complete today"}</button>
      <button class="btn secondary" id="favorite-today">${state.favorites.includes(d.id)?"Saved ♥":"Save ♡"}</button>
      <button class="btn secondary" id="change-devotional">I need something else</button>
    </div>
  </article>
  ${h.completed?helpfulCard(h):""}
  </section>`;
}
function dayPart(){const h=new Date().getHours();return h<12?"morning":h<17?"afternoon":"evening"}
function checkinCard(){
  return `<div class="card soft"><h3>What do you need today?</h3><p class="muted small">This changes what Held brings forward.</p>
  <label>How does today feel?</label><div class="chips" id="mood-chips">${MOODS.map(([k,l])=>`<button class="chip" data-mood="${k}">${l}</button>`).join("")}</div>
  <label>What's closest to the surface?</label><div class="chips" id="need-chips">${NEEDS.map(([k,l])=>`<button class="chip" data-need="${k}">${l}</button>`).join("")}</div>
  <textarea id="checkin-note" placeholder="Optional: anything else on your mind?"></textarea>
  <button class="btn full" id="save-checkin">Choose today's devotional</button></div>`;
}
function insightCard(){
  const scores=recomputeWeights();
  const top=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
  const txt=top.length?`Held is currently giving a little more attention to ${top.join(" and ")}.`:"Held is learning your rhythm as you use it.";
  return `<div class="notice"><strong>Held noticed:</strong> ${escapeHtml(txt)} <button class="chip" id="redo-checkin" style="margin-left:6px">Check in again</button></div>`;
}
function helpfulCard(h){
  return `<div class="card soft"><h3>Did this meet you where you are?</h3><div class="btn-row">
    <button class="btn ${h.helpful==="yes"?"gold":"secondary"}" data-helpful="yes">Yes, it helped</button>
    <button class="btn ${h.helpful==="some"?"gold":"secondary"}" data-helpful="some">Somewhat</button>
    <button class="btn ${h.helpful==="no"?"gold":"secondary"}" data-helpful="no">Not really</button>
  </div><p class="small muted">Your answer helps Held choose future themes. It never sends this information anywhere.</p></div>`;
}
function journalView(){
  const entries=[...state.journal].reverse();
  return `<section><div class="hero"><div class="eyebrow">Journal</div><h1>A place to be honest.</h1></div>
  <div class="card"><label>New journal entry</label><textarea id="journal-text" placeholder="What's on your heart?"></textarea><button class="btn full" id="save-journal">Save privately</button></div>
  <div class="section-title"><h2>Past entries</h2><span class="badge">${entries.length}</span></div>
  <div class="card">${entries.length?entries.map(j=>`<div class="list-item"><div><strong>${fmtDate(j.date)}</strong><p>${escapeHtml(j.text)}</p></div></div>`).join(""):`<div class="empty">Your journal will appear here.</div>`}</div></section>`;
}
function prayersView(){
  const p=[...state.prayers].reverse();
  return `<section><div class="hero"><div class="eyebrow">Prayer journal</div><h1>Bring it here.</h1></div>
  <div class="card"><label>Prayer request</label><textarea id="prayer-text" placeholder="What are you praying about?"></textarea><button class="btn full" id="save-prayer">Add prayer</button></div>
  <div class="card">${p.length?p.map(x=>`<div class="list-item"><div style="flex:1"><span class="badge">${x.answered?"Answered":"Praying"}</span><strong style="margin-left:8px">${fmtDate(x.date)}</strong><p>${escapeHtml(x.text)}</p><button class="chip" data-prayer-toggle="${x.id}">${x.answered?"Mark still praying":"Mark answered"}</button></div></div>`).join(""):`<div class="empty">Prayer requests will appear here.</div>`}</div></section>`;
}
function journeyView(){
  const scores=recomputeWeights(); const max=Math.max(1,...Object.values(scores));
  const top=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const recent=recentHistory(10);
  return `<section><div class="hero"><div class="eyebrow">Journey</div><h1>Look how far you've come.</h1></div>
  <div class="metric-grid"><div class="metric"><strong>${streak()}</strong><span class="small muted">day streak</span></div><div class="metric"><strong>${completedCount()}</strong><span class="small muted">completed</span></div><div class="metric"><strong>${state.favorites.length}</strong><span class="small muted">saved</span></div></div>
  <div class="card"><h3>What Held is learning</h3><p class="small muted">These are theme signals, not labels or diagnoses.</p>${top.map(([t,v])=>`<div class="theme-bar"><span class="name">${t}</span><div class="bar"><span style="width:${Math.max(4,(v/max)*100)}%"></span></div></div>`).join("")}</div>
  <div class="card"><h3>Recent days</h3>${recent.length?recent.map(h=>{const d=DEVOTIONALS.find(x=>x.id===h.devotionalId);return `<div class="list-item"><div><strong>${fmtDate(h.date)}</strong><div>${d?escapeHtml(d.title):"Devotional"}</div><span class="small muted">${escapeHtml(h.theme||"")} ${h.completed?"· completed":""}</span></div></div>`}).join(""):`<div class="empty">Your journey starts with your first completed devotional.</div>`}</div></section>`;
}
function libraryView(){
  const themes=[...new Set(DEVOTIONALS.map(d=>d.theme))];
  return `<section><div class="hero"><div class="eyebrow">Library</div><h1>Meet the day you're actually having.</h1><p class="muted">Pick a theme any time. This does not erase your normal daily path.</p></div>
  ${themes.map(t=>`<details class="card"><summary>${t[0].toUpperCase()+t.slice(1)}</summary>${DEVOTIONALS.filter(d=>d.theme===t).map(d=>`<div class="list-item"><div style="flex:1"><strong>${escapeHtml(d.title)}</strong><div class="small muted">${escapeHtml(d.ref)}</div></div><button class="chip" data-open-devotional="${d.id}">Open</button></div>`).join("")}</details>`).join("")}
  <div class="card"><h3>Saved</h3>${state.favorites.length?state.favorites.map(id=>{const d=DEVOTIONALS.find(x=>x.id===id);return d?`<div class="list-item"><div><strong>${escapeHtml(d.title)}</strong><div class="small muted">${escapeHtml(d.ref)} · ${d.theme}</div></div></div>`:""}).join(""):`<div class="empty">Saved devotionals will appear here.</div>`}</div></section>`;
}
function settingsView(){
  return `<section><div class="hero"><div class="eyebrow">Settings</div><h1>Make Held yours.</h1></div>
  <div class="card"><label>Name</label><input id="settings-name" value="${escapeHtml(state.profile.name||"")}"/>
  <label>Text size</label><select id="text-scale"><option value=".92">Smaller</option><option value="1">Standard</option><option value="1.1">Larger</option><option value="1.2">Largest</option></select>
  <div class="btn-row"><button class="btn" id="save-settings">Save settings</button></div></div>
  <div class="install-tip"><strong>Install on iPhone:</strong><p class="small">Open this site in Safari → tap Share → Add to Home Screen → turn on “Open as Web App” if shown → Add.</p></div>
  <div class="card"><h3>Privacy</h3><p>Held stores your devotional activity, journal, prayer list, and adaptation signals in this browser using local storage. Version 1 does not send that information to a server or AI model.</p>
  <p class="small muted">If you clear Safari website data or remove the app, local data can be lost. Use Export to make a backup.</p>
  <div class="btn-row"><button class="btn secondary" id="export-data">Export backup</button><label class="btn secondary" style="display:inline-flex;margin:0">Import backup<input id="import-data" type="file" accept=".json,application/json" hidden></label></div></div>
  <div class="card"><h3>Reset</h3><p class="small muted">This permanently removes Held data from this device.</p><button class="btn danger" id="reset-data">Delete all local data</button></div>
  <p class="center small muted">Held ${HELD_VERSION} · free, offline-first, private by default</p></section>`;
}

function bind(){
  document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{state.lastView=b.dataset.view;save();render()});
  document.querySelector("#start-held")?.addEventListener("click",()=>{state.profile.name=document.querySelector("#onboard-name").value.trim();state.profile.started=todayKey();state.lastView="today";save();render()});

  let chosenMood="", chosenNeeds=[];
  document.querySelectorAll("[data-mood]").forEach(b=>b.onclick=()=>{chosenMood=b.dataset.mood;document.querySelectorAll("[data-mood]").forEach(x=>x.classList.toggle("selected",x===b))});
  document.querySelectorAll("[data-need]").forEach(b=>b.onclick=()=>{const n=b.dataset.need; chosenNeeds=chosenNeeds.includes(n)?chosenNeeds.filter(x=>x!==n):[...chosenNeeds,n];b.classList.toggle("selected")});
  document.querySelector("#save-checkin")?.addEventListener("click",()=>{
    state.checkin={date:todayKey(),mood:chosenMood||"okay",needs:chosenNeeds,note:document.querySelector("#checkin-note").value.trim()};
    state.history=state.history.filter(h=>h.date!==todayKey()); save(); chooseDevotional(true); render(); toast("Today's path adjusted");
  });
  document.querySelector("#redo-checkin")?.addEventListener("click",()=>{state.checkin=null;state.history=state.history.filter(h=>h.date!==todayKey());save();render()});
  document.querySelector("#reflection")?.addEventListener("input",e=>{const h=currentEntry();h.reflection=e.target.value;save()});
  document.querySelector("#complete-today")?.addEventListener("click",()=>{const h=currentEntry();h.completed=true;h.reflection=document.querySelector("#reflection")?.value||h.reflection||"";save();recomputeWeights();render();toast("Completed for today")});
  document.querySelector("#favorite-today")?.addEventListener("click",()=>{const d=chooseDevotional();state.favorites=state.favorites.includes(d.id)?state.favorites.filter(x=>x!==d.id):[...state.favorites,d.id];save();render()});
  document.querySelector("#change-devotional")?.addEventListener("click",()=>{state.checkin=null;state.history=state.history.filter(h=>h.date!==todayKey());save();render()});
  document.querySelectorAll("[data-helpful]").forEach(b=>b.onclick=()=>{const h=currentEntry();h.helpful=b.dataset.helpful;save();recomputeWeights();render();toast("Held learned from that")});

  document.querySelector("#save-journal")?.addEventListener("click",()=>{const t=document.querySelector("#journal-text").value.trim();if(!t)return;state.journal.push({id:crypto.randomUUID(),date:todayKey(),text:t});save();recomputeWeights();render();toast("Saved privately")});
  document.querySelector("#save-prayer")?.addEventListener("click",()=>{const t=document.querySelector("#prayer-text").value.trim();if(!t)return;state.prayers.push({id:crypto.randomUUID(),date:todayKey(),text:t,answered:false});save();render();toast("Prayer added")});
  document.querySelectorAll("[data-prayer-toggle]").forEach(b=>b.onclick=()=>{const p=state.prayers.find(x=>x.id===b.dataset.prayerToggle);if(p){p.answered=!p.answered;save();render()}});
  document.querySelectorAll("[data-open-devotional]").forEach(b=>b.onclick=()=>{const d=DEVOTIONALS.find(x=>x.id===b.dataset.openDevotional); if(!d)return; state.history=state.history.filter(h=>h.date!==todayKey());state.history.push({date:todayKey(),devotionalId:d.id,theme:d.theme,completed:false,mood:state.checkin?.mood||"",needs:state.checkin?.needs||[],reflection:"",helpful:""});state.lastView="today";save();render()});

  const ts=document.querySelector("#text-scale"); if(ts) ts.value=String(state.profile.textScale||1);
  document.querySelector("#save-settings")?.addEventListener("click",()=>{state.profile.name=document.querySelector("#settings-name").value.trim();state.profile.textScale=parseFloat(document.querySelector("#text-scale").value)||1;save();render();toast("Settings saved")});
  document.querySelector("#export-data")?.addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`held-backup-${todayKey()}.json`;a.click();URL.revokeObjectURL(a.href);
  });
  document.querySelector("#import-data")?.addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;try{const imported=JSON.parse(await f.text());state={...structuredClone(DEFAULT_STATE),...imported};save();render();toast("Backup imported")}catch{alert("That backup file could not be read.")}});
  document.querySelector("#reset-data")?.addEventListener("click",()=>{if(confirm("Delete all Held data from this device? This cannot be undone unless you exported a backup.")){localStorage.removeItem(STORAGE_KEY);state=structuredClone(DEFAULT_STATE);render()}});
}

if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{})); }
render();
