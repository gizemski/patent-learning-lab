/* ---------- shell ---------- */
const app=document.getElementById("app");
const VIEWS={home,course,tutor,about,instructor,admin};
let notice=null;
const announce=msg=>{const a=document.getElementById("announce"); a.textContent=""; setTimeout(()=>{a.textContent=msg;},50);};
const navName=k=>T().nav[k]||R().nav[k];

function shell(){
  const t=T(), x=R(), r=role(); document.documentElement.lang=S.lang;
  document.getElementById("skip").textContent=t.skip;
  document.getElementById("nav").innerHTML=PAGES[r].map(k=>`<a href="#${k}" ${view.page===k?'aria-current="page"':''}>${navName(k)}</a>`).join("");
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===S.lang));
  document.getElementById("viewas").textContent=x.viewAs+":";
  document.querySelectorAll("[data-role]").forEach(b=>{b.textContent=x.roles[b.dataset.role];b.setAttribute("aria-pressed",b.dataset.role===r);});
  document.getElementById("demo").textContent=x.demo;
  const bn=document.getElementById("banner"); bn.hidden=r==="learner"; bn.innerHTML=r==="learner"?"":`<div>${x.banner(x.roles[r])}</div>`;
  document.getElementById("foot").textContent=t.foot;
}
function render(){
  if(!canView(view.page)) return route();
  shell(); VIEWS[view.page]();
  if(notice){ app.insertAdjacentHTML("afterbegin",`<div class="msgbox warn" role="status">${notice}</div>`); notice=null; }
}
const focusHeading=()=>{const h=app.querySelector("h1,h2"); if(h){h.tabIndex=-1; h.focus({preventScroll:true});}};

/* ---------- routing with access check ----------
   Hash format: #page or #page/sub or #instructor/preview/<lesson|quiz>.
   A page the current role may not open sends the visitor to that role's start page. */
function route(){
  const parts=location.hash.slice(1).split("/"); let p=parts[0]||ROLE_HOME[role()], sub=parts[1]||null;
  if(p==="insights"&&role()!=="learner"){ p="instructor"; sub="insights"; }   // old link to the insights page
  const known=[...new Set(Object.values(PAGES).flat()),"insights"].includes(p);
  if(!known||!canView(p)){
    if(known&&p!=="home") notice=R().denied(R().pg[p],R().roles[role()]);
    p=ROLE_HOME[role()]; sub=null;
    history.replaceState(null,"","#"+p);
  }
  const prev=view.page+"/"+view.sub+"/"+view.pv;
  view.page=p; view.sub=sub;
  if(p==="instructor"&&sub==="preview"){ const v=parts[2]; view.pv=v==="quiz"?"quiz":(v!==undefined&&LESSONS[+v]?+v:0); } else view.pv=undefined;
  /* activity log: record what instructors/admins open (demo) */
  if(p==="instructor"&&prev!==p+"/"+view.sub+"/"+view.pv){
    const s=sub||"insights";
    if(s==="insights") logEv("insights"); else if(s==="learners") logEv("learners");
    else if(s==="preview") view.pv==="quiz"?logEv("previewQuiz"):logEv("preview",{lesson:view.pv});
  }
  render();
}

/* ---------- events ---------- */
const tip=document.getElementById("tip");
document.addEventListener("mousemove",e=>{const r=e.target.closest&&e.target.closest("[data-tip]");
  if(r){tip.textContent=r.dataset.tip;tip.style.opacity=1;tip.style.left=Math.min(e.clientX+14,innerWidth-250)+"px";tip.style.top=(e.clientY+14)+"px";} else tip.style.opacity=0;});
document.addEventListener("click",e=>{
  const lg=e.target.closest("[data-lang]"); if(lg){S.lang=lg.dataset.lang;save();render();return;}
  const rl=e.target.closest("[data-role]"); if(rl){const r=rl.dataset.role; if(r===role()) return;
    S.role=r; save(); logEv("role",{role:r}); view.lesson=null;
    const target="#"+ROLE_HOME[r]; if(location.hash===target) route(); else location.hash=target;
    announce(R().switched(R().roles[r])); setTimeout(focusHeading,0); return;}
  const sw=e.target.closest("[data-pathsw]"); if(sw){const p=PATHWAYS.find(v=>v.id===sw.dataset.pathsw), on=!pathAvail(p);
    D.pathAvail[p.id]=on; logEv("path",{path:p.id,on}); render();
    announce(R().pathNow(L(p.name),on?P().avail:P().soon));
    const n=document.querySelector(`[data-pathsw="${p.id}"]`); if(n) n.focus(); return;}
  const pa=e.target.closest("[data-path]"); if(pa){S.path=pa.dataset.path;save();}
  const it=e.target.closest("[data-interest]"); if(it){const id=it.dataset.interest;S.interest[id]=!S.interest[id];save();
    it.setAttribute("aria-pressed",S.interest[id]);it.textContent=S.interest[id]?P().noted:P().notify;return;}
  const sc=e.target.closest("[data-scroll]"); if(sc){e.preventDefault();document.getElementById(sc.dataset.scroll).scrollIntoView({behavior:"smooth"});return;}
  const th=e.target.closest("[data-tohome]"); if(th&&view.page==="home"){e.preventDefault();document.getElementById("pathways").scrollIntoView({behavior:"smooth"});return;}
  if(th){e.preventDefault();location.hash="home";setTimeout(()=>{const el=document.getElementById("pathways");if(el)el.scrollIntoView();},60);return;}
  const gq=e.target.closest("[data-goquiz]"); if(gq){view.lesson="quiz";}
  const cp=e.target.closest("[data-complete]"); if(cp){const i=+cp.dataset.complete;if(!S.done[i])logEv("lesson",{lesson:i});S.done[i]=true;save();view.lesson=i<LESSONS.length-1?i+1:"quiz";render();scrollTo(0,0);return;}
  const op=e.target.closest("[data-open]"); if(op){const v=op.dataset.open;if(v==="")return;view.lesson=(v==="quiz"||v==="cert")?v:+v;
    if(view.page!=="course"){location.hash="course";} else {render();} scrollTo(0,0);return;}
  const ak=e.target.closest("[data-ask]"); if(ak){ask(ak.dataset.ask);return;}
  const tg=e.target.closest("[data-toggle]"); if(tg){const k=tg.dataset.toggle,c=document.querySelector(`[data-chart="${k}"]`),tb=document.querySelector(`[data-table="${k}"]`);
    const show=tb.hidden; tb.hidden=!show; c.hidden=show; tg.textContent=show?T().showChart:T().showTable;}
});
document.addEventListener("change",e=>{
  const ur=e.target.dataset&&e.target.dataset.userrole; if(ur){const u=DEMO_USERS.find(v=>v.id===ur),r=e.target.value;
    D.userRoles[ur]=r; logEv("user",{user:ur,role:r}); saveD(); announce(R().roleNow(u.name,R().roles[r])); return;}
  if(e.target.id==="allLangs"){view.allLangs=e.target.checked; render(); document.getElementById("allLangs").focus();}
});
document.addEventListener("input",e=>{if(e.target.id==="cn"){S.name=e.target.value;save();document.getElementById("cno").textContent=S.name||T().yourName;}});
addEventListener("hashchange",()=>{route();scrollTo(0,0);});
route();
