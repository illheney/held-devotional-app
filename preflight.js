/* Held v1.7 preflight — runs before the app to protect startup and old local state. */
(() => {
  if(typeof globalThis.structuredClone!=="function"){
    globalThis.structuredClone=value=>JSON.parse(JSON.stringify(value));
  }

  const KEY="heldStateV1";
  try{
    const raw=localStorage.getItem(KEY);
    if(raw){
      const parsed=JSON.parse(raw);
      if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)) throw new Error("Invalid Held state root");
      if(!parsed.profile||typeof parsed.profile!=="object"||Array.isArray(parsed.profile)) parsed.profile={};
      ["history","journal","prayers","favorites"].forEach(key=>{if(!Array.isArray(parsed[key]))parsed[key]=[];});
      if(!parsed.themeWeights||typeof parsed.themeWeights!=="object"||Array.isArray(parsed.themeWeights))parsed.themeWeights={};
      if(typeof parsed.lastView!=="string")parsed.lastView="today";
      localStorage.setItem(KEY,JSON.stringify(parsed));
    }
  }catch(error){
    try{
      const raw=localStorage.getItem(KEY);
      if(raw)localStorage.setItem(`heldCorruptBackup-${Date.now()}`,raw);
      localStorage.removeItem(KEY);
    }catch{}
  }

  window.__heldBootErrors=[];
  const record=(message,source,line)=>{
    window.__heldBootErrors.unshift({at:new Date().toISOString(),message:String(message||"Unknown error"),source:String(source||"").split("/").pop(),line:Number(line||0)});
    window.__heldBootErrors=window.__heldBootErrors.slice(0,20);
  };
  window.addEventListener("error",event=>record(event.message,event.filename,event.lineno));
  window.addEventListener("unhandledrejection",event=>record(event.reason?.message||event.reason,"promise",0));
})();
