/* Held v1.6 privacy-first memory sources */
(() => {
  window.heldMemorySources=()=>{
    const items=[];
    (state.history||[]).forEach(h=>{const d=DEVOTIONALS.find(x=>x.id===h.devotionalId);if(h.completed&&d)items.push({id:`devotional:${h.date}-${d.id}`,type:"devotional",date:h.date,title:d.title,detail:d.ref,glyph:"◌",theme:d.theme});});
    (state.journal||[]).forEach((j,i)=>items.push({id:`journal:${j.id||`${j.date}-${i}`}`,type:"journal",date:j.date,title:"A journal moment",detail:"Your private words stay in Journal.",glyph:"✎",private:true}));
    (state.prayers||[]).forEach((p,i)=>items.push({id:`prayer:${p.id||`${p.date}-${i}`}`,type:"prayer",date:p.answeredDate||p.date,title:p.answered?"An answered prayer":"A prayer you carried",detail:"Open Prayer to revisit it privately.",glyph:"†",private:true,answered:!!p.answered}));
    Object.entries(state.journeys?.progress||{}).forEach(([id,p])=>{const j=(window.HELD_JOURNEYS||[]).find(x=>x.id===id);if(j&&(p.completed||[]).length>=7&&p.finishedAt)items.push({id:`journey:${id}`,type:"journey",date:p.finishedAt,title:j.title,detail:"A Guided Journey you completed.",glyph:j.glyph||"→",theme:j.theme});});
    return items;
  };
})();
