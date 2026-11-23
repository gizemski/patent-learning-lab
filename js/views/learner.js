/* ---------- home ---------- */
function home(){
  const t=T(), started=doneCount()>0;
  app.innerHTML=`<section class="hero">
    <div><div class="eyebrow">${t.heroEy}</div><h1>${t.heroT}</h1><p>${t.heroP}</p>
      <a class="btn" href="#pathways" data-scroll="pathways">${started?t.cont:t.start}</a></div>
    <div class="tiles">
      <a class="tile" href="#course"><span class="ico">${ic("book")}</span><b>${t.t1}</b><span>${t.t1s}</span></a>
      <a class="tile" href="#course/quiz"><span class="ico">${ic("quiz")}</span><b>${t.t2}</b><span>${t.t2s}</span></a>
      <a class="tile" href="#tutor"><span class="ico">${ic("chat")}</span><b>${t.t3}</b><span>${t.t3s}</span></a>
      <a class="tile" href="#course"><span class="ico">${ic("chart")}</span><b>${R().t4}</b><span>${R().t4s}</span></a>
    </div></section>
    <section id="pathways" style="margin-bottom:24px"><div class="eyebrow">${P().chooseEy}</div><h2>${P().chooseH}</h2>
      <p class="muted" style="max-width:70ch;margin-top:0">${P().chooseP}</p>
      <div class="paths">${PATHWAYS.map(pathCard).join("")}</div>
      <p class="small muted" style="margin-top:10px">${P().interestNote}</p></section>`;
}
/* ---------- completion of the selected course (the learner's own data only) ---------- */
const lessonPct=()=>Math.round(doneCount()/LESSONS.length*100);
const certOk=()=>S.best!==null&&S.best>=.7&&doneCount()===LESSONS.length;
const courseStatus=()=>certOk()?"done":(doneCount()>0||S.best!==null?"prog":"none");
function completion(){
  const x=R(), st=courseStatus(), p=lessonPct();
  return `<div class="completion"><div class="comp-row"><b>${x.mcPct(p)}</b><span class="badge ${st==="done"?"ok":st==="prog"?"prog":""}">${st==="done"?ic("check"):""}${x.mcStatus[st]}</span></div>
    <div class="progress" aria-hidden="true"><i style="width:${p}%"></i></div>
    <div class="small muted">${x.mcLessons(doneCount(),LESSONS.length)}</div></div>`;
}

/* ---------- My courses: the selected course, its completion and the learner's own progress ---------- */
function myCourses(){
  const t=T(),x=R(),st=courseStatus(),next=LESSONS.findIndex((_,i)=>!S.done[i]);
  const nextTxt=st==="done"?x.mcDoneNote:next<0?x.mcNextQuiz:x.mcNext(L(LESSONS[next].t));
  const go=st==="done"?`<button class="btn ghost" data-open="cert">${ic("award")}${x.viewCert}</button>`:
    `<button class="btn" data-open="${next<0?"quiz":next}">${st==="none"?t.start:t.cont}</button>`;
  app.innerHTML=`<div class="page-head"><h1>${x.mcH}</h1><p class="muted">${x.mcP}</p></div>
    <section class="card pad mycourse" aria-labelledby="mc-t">
      <div class="mc-top"><span class="eyebrow">${x.mcCourse}</span>${pathPill()}</div>
      <h2 id="mc-t">${L(COURSE_TITLE)}</h2>
      ${completion()}
      <div class="mc-foot"><span class="small">${nextTxt}</span>${go}</div></section>
    <section class="card pad" id="progress" aria-labelledby="prog-h" style="margin-top:16px"><h2 id="prog-h" class="sec-h">${t.yourProg}</h2>
      ${timeline()}${myProgress()}</section>`;
  bindReset();
}
/* The learner's own progress only: never other learners' data. */
function myProgress(){
  const t=T(),x=R(),best=S.best===null?"–":Math.round(S.best*100)+(S.lang==="en"?"%":" %");
  const cert=certOk();
  return `<div class="myprog"><ul>
      <li>${x.myLessons(doneCount(),LESSONS.length)}</li><li>${x.myQuiz(best)}</li>
      <li>${cert?x.myCertOk+` · <button class="linkbtn" data-open="cert">${x.viewCert}</button>`:x.myCertNo}</li></ul>
    <div class="myprog-foot"><span class="small muted">${x.myNote}</span><button class="btn quiet" id="reset">${t.reset}</button></div></div>`;
}
function bindReset(){
  const r=document.getElementById("reset"); if(!r) return; let armed=false;
  r.addEventListener("click",()=>{if(!armed){armed=true;r.textContent=T().resetConfirm;return;} S.done={};S.best=null;save();render();});
}
/* Shown for a pathway that is available but has no content yet, or that has been switched to "coming soon". */
function prepView(){
  const p=curPath(),x=R(),px=P(),on=pathAvail(p),int=!!S.interest[p.id];
  app.innerHTML=`<section class="card pad prep"><div class="eyebrow">${on?x.prepEy:x.offEy}</div>
    <div style="margin:6px 0 10px">${pathPill()}</div>
    <h1>${on?x.prepH(L(p.name)):x.offH(L(p.name))}</h1><p style="max-width:68ch">${on?x.prepP:x.offP}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
      <button class="btn quiet" data-interest="${p.id}" aria-pressed="${int}">${int?px.noted:px.notify}</button>
      <a class="btn ghost" href="#home" data-tohome="1">${x.chooseOther}</a></div></section>`;
}
function pathCard(p){
  const x=P(), av=pathAvail(p), sel=av&&S.path===p.id, int=!!S.interest[p.id];
  return `<div class="path card ${av?'':'soon'} ${sel?'sel':''}">
    <div class="path-top"><span class="ob">${L(p.office)}</span><span class="badge ${av?'ok':''}">${av?x.avail:x.soon}</span></div>
    <b>${L(p.name)}</b><span class="small muted">${p.desc?L(p.desc):x.soonDesc}</span>
    ${av?`<a class="btn ${sel?'':'ghost'}" href="#course" data-path="${p.id}">${sel?ic("check")+x.selected:x.startPath}</a>`
      :`<button class="btn quiet" data-interest="${p.id}" aria-pressed="${int}">${int?x.noted:x.notify}</button>`}</div>`;
}
function timeline(){
  return `<div class="tl-wrap"><div class="timeline" role="list">${LESSONS.map((l,i)=>{
    const cls=S.done[i]?"done":(view.page==="course"&&view.lesson===i?"cur":"");
    return `<button class="step ${cls}" role="listitem" data-open="${i}" aria-label="${esc(L(l.t))}${S.done[i]?' ✓':''}"><span class="node">${S.done[i]?ic("check"):i+1}</span><span class="lbl">${L(l.t)}</span><span class="when">${L(l.when)}</span></button>`;}).join("")}</div></div>`;
}

/* ---------- course ---------- */
function course(){
  if(!pathReady(curPath())) return prepView();
  if(view.lesson===null) return myCourses();
  const t=T(),x=R();
  let body="";
  if(view.lesson==="quiz") body=quizView();
  else if(view.lesson==="cert") body=certView();
  else{
    const i=view.lesson,l=LESSONS[i],last=i===LESSONS.length-1;
    body=`<div class="lesson"><div class="eyebrow">${t.lessonOf(i+1,LESSONS.length)} · ${L(l.when)}</div>
      <h2>${L(l.t)}</h2><p>${L(l.b)}</p><div class="callout">${L(l.k)}</div>
      <div class="nav-row"><button class="btn quiet" data-open="${i-1}" ${i===0?'disabled':''}>${t.prev}</button>
      <button class="btn" data-complete="${i}">${last?t.toQuiz:(S.done[i]?t.next:t.markNext)}</button></div></div>`;
  }
  app.innerHTML=`<a class="backlink" href="#course">${x.mcBack}</a>
    <section class="card pad">
    <div class="course-head"><div><div class="eyebrow">${L(COURSE_TITLE)}</div>${completion()}</div>
      <div class="course-acts">
        <button class="btn ${view.lesson==='quiz'?'':'ghost'}" data-open="quiz">${ic("quiz")}${t.quizTab}</button>
        ${certOk()?`<button class="btn ${view.lesson==='cert'?'':'ghost'}" data-open="cert">${ic("award")}${t.certTab}</button>`:""}
      </div></div>
    <div style="margin-top:16px">${timeline()}</div>${body}</section>`;
  if(view.lesson==="quiz") bindQuiz();
}

let picks={};
function quizView(){
  const t=T();
  return `<div class="lesson"><div class="eyebrow">${t.quizEy}</div><h2>${t.quizT}</h2>
    <div class="scenario">${L(SCENARIO)}</div>
    <div id="quiz">${QUIZ.map((q,qi)=>`<fieldset class="q"><legend>${qi+1}. ${L(q.q)}</legend>
      ${L(q.o).map((o,oi)=>`<button class="opt" data-q="${qi}" data-o="${oi}" aria-pressed="false">${o}</button>`).join("")}
      <div class="fb" id="fb${qi}" aria-live="polite"></div></fieldset>`).join("")}</div>
    <button class="btn" id="submitQuiz">${t.submit}</button><div id="qres" aria-live="polite"></div></div>`;
}
function bindQuiz(){
  picks={}; const qz=document.getElementById("quiz"),t=T();
  qz.addEventListener("click",e=>{const b=e.target.closest(".opt"); if(!b||qz.dataset.locked) return;
    qz.querySelectorAll(`.opt[data-q="${b.dataset.q}"]`).forEach(x=>x.setAttribute("aria-pressed","false"));
    b.setAttribute("aria-pressed","true"); picks[b.dataset.q]=+b.dataset.o;});
  document.getElementById("submitQuiz").addEventListener("click",()=>{
    const res=document.getElementById("qres");
    if(Object.keys(picks).length<QUIZ.length){res.innerHTML=`<div class="result fail">${t.answerAll(QUIZ.length)}</div>`;return;}
    qz.dataset.locked=1; let r=0;
    QUIZ.forEach((q,qi)=>{const ok=picks[qi]===q.a; if(ok) r++;
      qz.querySelector(`.opt[data-q="${qi}"][data-o="${q.a}"]`).classList.add("right");
      if(!ok) qz.querySelector(`.opt[data-q="${qi}"][data-o="${picks[qi]}"]`).classList.add("wrong");
      document.getElementById("fb"+qi).innerHTML=(ok?ic("check")+t.correct:ic("x")+t.notQuite)+" "+esc(L(q.w));});
    const sc=r/QUIZ.length,pass=sc>=.7; S.best=Math.max(S.best||0,sc); save(); logEv("quiz",{p:Math.round(sc*100)});
    const all=doneCount()===LESSONS.length;
    res.innerHTML=`<div class="result ${pass?'pass':'fail'}"><b>${t.score(r,QUIZ.length,Math.round(sc*100))}</b> ${pass?t.passed:t.failed}
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      ${pass&&all?`<button class="btn" data-open="cert">${t.getCert}</button>`:""}
      ${pass&&!all?`<span class="small muted">${t.finishLessons}</span>`:""}
      <button class="btn ghost" data-open="quiz">${t.retake}</button></div></div>`;
    document.getElementById("submitQuiz").disabled=true;
  });
}
function certView(){
  const t=T(),loc={en:"en-GB",de:"de-DE",fr:"fr-FR"}[S.lang];
  const d=new Date().toLocaleDateString(loc,{day:"numeric",month:"long",year:"numeric"});
  return `<div class="lesson"><h2>${t.certTab}</h2><label class="muted small" for="cn">${t.certHint}</label><br>
    <input type="text" id="cn" placeholder="${t.yourName}" value="${esc(S.name)}" style="margin-top:6px">
    <div class="cert"><div class="eyebrow">${t.certEy}</div><h2>${L(COURSE_TITLE)}</h2>
    <div>${t.certFor}</div><div class="name" id="cno">${esc(S.name||t.yourName)}</div>
    <div>${t.certDid(Math.round((S.best||0)*100))}</div><p class="muted small" style="margin-top:16px">Patent Learning Lab · ${d}</p></div></div>`;
}

/* ---------- tutor ---------- */
function answer(q){
  const s=q.toLowerCase(); let best=null,score=0;
  KB.forEach(k=>{const n=k.kw.filter(w=>s.includes(w)).length; if(n>score){score=n;best=k;}});
  return best?{text:L(best.a),src:SRC[best.src]}:{text:T().fallback,src:null};
}
function tutor(){
  if(!pathReady(curPath())) return prepView();
  const t=T();
  if(!chat.length) chat=[{bot:true,hello:true}];
  app.innerHTML=`<section class="card pad"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center"><div class="eyebrow">${t.tutorEy}</div>${pathPill()}</div><h2>${t.tutorT}</h2>
    <p class="muted" style="max-width:70ch">${t.tutorP}</p>
    <div class="chat" id="chat" aria-live="polite"></div>
    <div class="chips">${t.chips.map(c=>`<button class="chip" data-ask="${esc(c)}">${c}</button>`).join("")}</div>
    <form class="ask" id="askf"><input type="text" id="askq" placeholder="${esc(t.askPh)}" aria-label="${esc(t.askPh)}"><button class="btn" type="submit">${t.send}</button></form>
    <div class="notice">${t.tutorNote}</div></section>`;
  drawChat();
  document.getElementById("askf").addEventListener("submit",e=>{e.preventDefault();const i=document.getElementById("askq");if(i.value.trim()){ask(i.value.trim());i.value="";}});
}
function ask(q){ chat.push({me:q}); chat.push({bot:true,...answer(q)}); drawChat(); }
function drawChat(){
  const c=document.getElementById("chat"); if(!c) return; const t=T();
  c.innerHTML=chat.map(m=>m.me?`<div class="msg me">${esc(m.me)}</div>`:
    `<div class="msg bot">${m.hello?t.hello:esc(m.text)}${m.src?`<span class="cite">${ic("file")}<span>${t.srcLbl}: <a href="${m.src.u}" target="_blank" rel="noopener">${m.src.t}</a></span></span>`:""}</div>`).join("");
  c.scrollTop=c.scrollHeight;
}

/* ---------- about ---------- */
function about(){
  const t=T();
  app.innerHTML=`<section class="card pad"><div class="eyebrow">${t.aboutEy}</div><h1>${t.aboutT}</h1><p class="muted" style="max-width:72ch">${t.aboutP}</p>
    <table class="map"><thead><tr><th>${t.mapH[0]}</th><th>${t.mapH[1]}</th></tr></thead><tbody>${t.map.map(m=>`<tr><td><b>${m[0]}</b></td><td>${m[1]}</td></tr>`).join("")}</tbody></table></section>
    <section class="card pad" style="margin-top:16px"><h2>${t.pipeH}</h2>
    <div class="pipe">${t.pipe.map(p=>`<div class="${p[2]?'human':''}"><b>${p[0]}</b>${p[1]}</div>`).join("")}</div>
    <p class="small muted" style="max-width:72ch">${t.pipeNote}</p></section>
    <section class="card pad" style="margin-top:16px"><h3>${t.srcH}</h3><ul>${Object.values(SRC).map(s=>`<li><a href="${s.u}" target="_blank" rel="noopener">${s.t}</a></li>`).join("")}</ul></section>`;
}
