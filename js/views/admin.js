/* ---------- admin area (demo): pathways, users and roles, activity log ----------
   Everything here is fictional demo data, saved only in this browser (see state.js). */
const ADMIN_SUBS=["pathways","users","log"];
function admin(){
  const x=R(), sub=ADMIN_SUBS.includes(view.sub)?view.sub:"pathways";
  const nav=subnav(x.admSections,"admin",[["pathways",x.subPaths],["users",x.subUsers],["log",x.subLog]],sub);
  app.innerHTML=dashHead(x.admEy,x.admH,x.admP+` ${x.alsoIns} <a href="#instructor">${x.nav.instructor}</a>.`,nav)+
    `<div class="dash-body">${({pathways:pathwaysSection,users:usersSection,log:logSection})[sub]()}</div>`;
  bindDemoReset();
}

function pathwaysSection(){
  const x=R(), px=P();
  const rows=PATHWAYS.map(p=>{const on=pathAvail(p);
    return [`${L(p.name)}`,`<span class="ob">${L(p.office)}</span>`,
      p.content?`${ic("check")} ${x.ready}`:`<span class="muted">${x.noContent}</span>`,
      `<button type="button" class="switch" role="switch" aria-checked="${on}" data-pathsw="${p.id}" aria-label="${esc(x.swLbl(L(p.name)))}">
        <span class="knob" aria-hidden="true"></span><span class="sw-txt">${on?px.avail:px.soon}</span></button>`];});
  return `<h2 style="font-size:1.25rem">${x.subPaths}</h2>`+rtable(x.pathsCap,[x.colPath,x.colOffice,x.colContent,x.colStatus],rows);
}

const userRole=u=>D.userRoles[u.id]||u.role;
function usersSection(){
  const x=R();
  const rows=DEMO_USERS.map(u=>{const r=userRole(u), path=PATHWAYS.find(p=>p.id===u.path);
    const me=u.name===PERSONAS.admin;
    const ctl=me?`${x.roles[r]} · <span class="muted">${x.meAdmin}</span>`:
      `<label class="sr-only" for="ur-${u.id}">${esc(x.roleOf(u.name))}</label><select id="ur-${u.id}" data-userrole="${u.id}">${ROLES.map(k=>`<option value="${k}" ${k===r?"selected":""}>${x.roles[k]}</option>`).join("")}</select>`;
    return [`${esc(u.name)} <span class="fict">(${x.fict})</span>`,ctl,L(path.name),x.ago(u.last)];});
  return `<h2 style="font-size:1.25rem">${x.subUsers}</h2>`+rtable(x.usersCap,[x.colName,x.colRole,x.colPath,x.colLast],rows);
}

function logText(e){
  const x=R(), p=e.params||{}, f=x.lg[e.type]; if(!f) return e.type;
  const u=p.user&&DEMO_USERS.find(v=>v.id===p.user), pa=p.path&&PATHWAYS.find(v=>v.id===p.path);
  return f({...p,roleName:p.role?x.roles[p.role]:"",userName:u?u.name:"",pathName:pa?L(pa.name):"",status:pa?(p.on?P().avail:P().soon):""});
}
function logActor(e){ const x=R(); return `${esc(e.actor||(e.who==="learner"?x.you:PERSONAS[e.who]))} <span class="muted">· ${x.roles[e.who]}</span>`; }
function logSection(){
  const x=R(), fmt=ts=>new Date(ts).toLocaleString(LOC(),{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
  const rows=D.log.map(e=>[`<time datetime="${new Date(e.ts).toISOString()}">${fmt(e.ts)}</time>`,logActor(e),logText(e)]);
  return `<div class="dash-row"><h2 style="font-size:1.25rem;margin:0">${x.subLog}</h2><button class="btn quiet" id="demoReset">${x.resetDemo}</button></div>`+
    (rows.length?rtable(x.logCap,[x.colTime,x.colWho,x.colAct],rows):`<p class="muted">${x.logEmpty}</p>`);
}
function bindDemoReset(){
  const b=document.getElementById("demoReset"); if(!b) return; let armed=false;
  b.addEventListener("click",()=>{ if(!armed){armed=true;b.textContent=R().resetDemoConfirm;return;}
    D=freshDemo(); logEv("reset"); render(); announce(R().resetDone); const h=app.querySelector("h1"); if(h){h.tabIndex=-1;h.focus();} });
}
