/* ---------- charts (shared): every chart has a table view ---------- */
function bars(id,rows,hiIdx,unit){
  return `<div class="bars" id="${id}" role="img" aria-label="${esc(rows.map(r=>r[0]+": "+r[1]+unit).join(", "))}">${rows.map((r,i)=>
    `<div class="bar-row" data-tip="${esc(r[2]||r[0])}: ${r[1]}${unit}"><span class="bl">${esc(r[0])}</span>
      <div class="track"><div class="fill ${i===hiIdx?'hi':''}" style="width:${r[1]}%"></div></div><span class="bv">${r[1]}${unit}</span></div>`).join("")}</div>`;
}
function table(rows,unit,cap){const t=T();return `<table class="data">${cap?`<caption class="sr-only">${cap}</caption>`:""}<thead><tr><th scope="col">${t.colItem}</th><th scope="col">${t.colVal}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r[2]||r[0])}</td><td>${r[1]}${unit}</td></tr>`).join("")}</tbody></table>`;}
function chartCard(key,title,sub,rows,hi){
  const t=T();
  return `<div class="card chart-card"><div class="chart-head"><div><h3>${title}</h3><div class="small muted">${sub}</div></div>
    <button class="linkbtn" data-toggle="${key}">${t.showTable}</button></div>
    <div data-chart="${key}">${bars("b-"+key,rows,hi,"%")}</div><div data-table="${key}" hidden>${table(rows,"%",title)}</div></div>`;
}

/* ---------- dashboard helpers (shared with admin) ---------- */
const pct=v=>v+(S.lang==="en"?"%":" %");
function subnav(label,page,items,cur){
  return `<nav class="subnav" aria-label="${esc(label)}"><ul>${items.map(([k,txt])=>
    `<li><a href="#${page}/${k}" ${k===cur?'aria-current="page"':''}>${txt}</a></li>`).join("")}</ul></nav>`;
}
function dashHead(ey,h,p,nav){
  return `<div class="dash-head"><div class="eyebrow">${ey}</div>
    <div class="dash-title"><h1>${h}</h1><span class="sample">${ic("alert")}${T().sampleLbl}</span></div>
    <p class="muted" style="max-width:76ch;margin-top:0">${p}</p>${nav}</div>`;
}
/* Responsive table: real table semantics, stacked cards on small screens (see .rtable in CSS). */
function rtable(cap,heads,rows){
  /* explicit ARIA roles keep table semantics when CSS turns rows into blocks on phones */
  return `<div class="card rwrap"><table class="rtable" role="table"><caption>${cap}</caption>
    <thead role="rowgroup"><tr role="row">${heads.map(h=>`<th scope="col" role="columnheader">${h}</th>`).join("")}</tr></thead>
    <tbody role="rowgroup">${rows.map(r=>`<tr role="row">${r.map((c,i)=>i===0?`<th scope="row" role="rowheader" data-label="${esc(heads[0])}">${c}</th>`:`<td role="cell" data-label="${esc(heads[i])}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

/* ---------- instructor dashboard ---------- */
const INSTR_SUBS=["insights","learners","preview"];
function instructor(){
  const x=R(), sub=INSTR_SUBS.includes(view.sub)?view.sub:"insights";
  const nav=subnav(x.sections,"instructor",[["insights",x.subIns],["learners",x.subLrn],["preview",x.subPrev]],sub);
  const course=PATHWAYS.find(p=>p.content);
  app.innerHTML=dashHead(x.dashEy,L(course.name),x.dashP,nav)+
    `<div class="dash-body">${({insights:insightsSection,learners:learnersSection,preview:previewSection})[sub]()}</div>`;
}

function insightsSection(){
  const t=T();
  const funnel=DATA.funnel.map((r,i)=>[r[0],r[1],L(LESSONS[i].t)]);
  const qs=DATA.questions.map((r,i)=>[r[0],r[1],r[0]+" · "+L(QUIZ[i].q)]);
  const reg=DATA.regionVals.map((v,i)=>[L(DATA.regions)[i],v]);
  return `<h2 class="sr-only">${R().subIns}</h2><div class="kpis">
      <div class="card kpi"><b>${(2480).toLocaleString(LOC())}</b><span>${t.kLearners}</span></div>
      <div class="card kpi"><b>${pct(55)}</b><span>${t.kComp}</span></div>
      <div class="card kpi"><b>${(4.4).toLocaleString(LOC())}</b><span>${t.kRating}</span></div>
      <div class="card kpi"><b>14 min</b><span>${t.kTime}</span></div></div>
    <div class="charts">${chartCard("f",t.c1,t.c1s,funnel,3)}${chartCard("q",t.c2,t.c2s,qs,1)}${chartCard("r",t.c3,t.c3s,reg,-1)}</div>
    <h2 style="margin-top:26px;font-size:1.25rem">${t.insH}</h2>
    <div class="insights">${t.ins.map(i=>`<div class="card ins"><div class="k">${i[0]}</div><div class="a">${i[1]}</div></div>`).join("")}</div>`;
}

function learnersSection(){
  const x=R(), n=LESSONS.length;
  const certs=DEMO_LEARNERS.filter(l=>l.done===n&&l.best!==null&&l.best>=70).length;
  const rows=DEMO_LEARNERS.map(l=>{
    const cert=l.done===n&&l.best!==null&&l.best>=70;
    return [`${esc(l.name)} <span class="fict">(${x.fict})</span>`, L(DATA.regions)[l.region],
      `<span class="mini" aria-hidden="true"><i style="width:${Math.round(l.done/n*100)}%"></i></span> ${l.done} / ${n}`,
      l.best===null?`<span class="muted">${x.notYet}</span>`:pct(l.best),
      cert?`${ic("check")} ${x.yes}`:`– ${x.no}`, x.ago(l.last)];});
  return `<h2 style="font-size:1.25rem">${x.subLrn}</h2><p class="muted small">${x.lrnSum(DEMO_LEARNERS.length,certs)}</p>`+
    rtable(x.lrnCap,[x.colName,x.colRegion,x.colLessons,x.colBest,x.colCert,x.colLast],rows);
}

function previewSection(){
  const x=R(), t=T(), sel=view.pv===undefined?0:view.pv;
  const pick=`<nav class="subnav small-tabs" aria-label="${esc(x.prevPick)}"><ul>${LESSONS.map((l,i)=>
      `<li><a href="#instructor/preview/${i}" ${sel===i?'aria-current="page"':''}>${i+1} · ${L(l.t)}</a></li>`).join("")}
      <li><a href="#instructor/preview/quiz" ${sel==="quiz"?'aria-current="page"':''}>${x.prevQuiz}</a></li></ul></nav>`;
  const langs=view.allLangs?["en","de","fr"]:[S.lang];
  const col=lg=>{
    const u=UI[lg], rx=RX[lg];
    if(sel==="quiz") return `<div class="pv-col" lang="${lg}">${view.allLangs?`<div class="eyebrow">${lg.toUpperCase()}</div>`:""}
      <h3>${u.quizT}</h3><div class="scenario"><div>${SCENARIO[lg]}</div></div>
      <ol class="pv-quiz">${QUIZ.map(q=>`<li><b>${q.q[lg]}</b><ul>${q.o[lg].map((o,oi)=>`<li class="${oi===q.a?'pv-right':''}">${oi===q.a?`${ic("check")} <span class="sr-only">${rx.answer}: </span>`:""}${o}</li>`).join("")}</ul>
        <p class="small muted">${q.w[lg]}</p></li>`).join("")}</ol></div>`;
    const l=LESSONS[sel];
    return `<div class="pv-col" lang="${lg}">${view.allLangs?`<div class="eyebrow">${lg.toUpperCase()}</div>`:""}
      <div class="eyebrow">${u.lessonOf(sel+1,LESSONS.length)} · ${l.when[lg]}</div><h3>${l.t[lg]}</h3><p>${l.b[lg]}</p>
      <div class="callout"><span class="sr-only">${rx.keyT}: </span>${l.k[lg]}</div></div>`;
  };
  return `<h2 style="font-size:1.25rem">${x.subPrev} <span class="badge in">${x.readOnly}</span></h2><p class="muted small" style="max-width:76ch">${x.prevP}</p>
    ${pick}
    <label class="check"><input type="checkbox" id="allLangs" ${view.allLangs?"checked":""}> ${x.allLangs}</label>
    <div class="card pad pv ${view.allLangs?'pv-3':''}">${langs.map(col).join("")}</div>`;
}
