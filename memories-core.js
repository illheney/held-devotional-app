/* Held v1.6 Remembered Grace */
(() => {
  const DAY=86400000,t=()=>todayKey(),dt=d=>new Date(`${d}T12:00:00`),age=d=>d?Math.max(0,Math.round((dt(t())-dt(d))/DAY)):0;
  state.memories={enabled:true,frequency:"gentle",seen:{},muted:{},history:[],todayId:null,todayDate:null,lastShown:null,...(state.memories||{})};
  state.memories.seen||={};state.memories.muted||={};state.memories.history||=[];save();
  const ann=d=>{const n=age(d);if(n<350)return false;const y=Math.round(n/365);return Math.abs(n-y*365)<=3;};
  const all=()=>typeof window.heldMemorySources==="function"?window.heldMemorySources().filter(x=>age(x.date)>=21&&!state.memories.muted[x.id]):[];
  const find=id=>all().find(x=>x.id===id)||null;
  const score=x=>{let s=ann(x.date)?100:0;if(!state.memories.seen[x.id])s+=12;if(x.answered)s+=8;if(x.type==="journey")s+=6;if(x.type==="devotional")s+=5;return s+(Math.abs(hashCode(`${t()}-${x.id}`))%7);};
  const choose=()=>{
    if(!state.memories.enabled)return null;
    if(state.memories.todayDate===t()&&state.memories.todayId){const same=find(state.memories.todayId);if(same)return same;}
    let items=all();if(!items.length)return null;
    const anns=items.filter(x=>ann(x.date));const gap={gentle:5,regular:3,often:1}[state.memories.frequency]||5;
    if(!anns.length&&state.memories.lastShown&&age(state.memories.lastShown)<gap)return null;
    const fresh=items.filter(x=>ann(x.date)||!state.memories.seen[x.id]||age(state.memories.seen[x.id])>=45);if(fresh.length)items=fresh;
    items.sort((a,b)=>score(b)-score(a));const pick=anns.sort((a,b)=>score(b)-score(a))[0]||items[0];
    state.memories.todayId=pick.id;state.memories.todayDate=t();state.memories.lastShown=t();save();return pick;
  };
  const record=x=>{state.memories.seen[x.id]=t();state.memories.history.unshift({id:x.id,title:x.title,type:x.type,date:x.date,shown:t()});state.memories.history=state.memories.history.filter((v,i,a)=>a.findIndex(z=>z.id===v.id)===i).slice(0,24);save();};
  window.heldMemories={age,ann,all,find,choose,record};
})();
