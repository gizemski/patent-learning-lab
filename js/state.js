/* ---------- state ---------- */
/* Learner state: the visitor's own progress, stored only in this browser. */
const KEY="patent-learning-lab-v1";
let S={lang:"en",done:{},best:null,name:"",path:"epo",interest:{},role:"learner"};
try{const raw=localStorage.getItem(KEY); if(raw) S=Object.assign(S,JSON.parse(raw));}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
const T=()=>UI[S.lang]; const L=o=>o[S.lang]; const P=()=>PX[S.lang]; const R=()=>RX[S.lang];
const LOC=()=>({en:"en-GB",de:"de-DE",fr:"fr-FR"}[S.lang]);
let view={page:"home",lesson:null,sub:null}; let chat=[];
const doneCount=()=>LESSONS.filter((_,i)=>S.done[i]).length;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- roles (DEMO MODE: no real login, no real access control) ----------
   The role switcher stands in for a login. This only controls what the UI shows;
   on a static site anyone can pick any role, and all code and demo data can be
   downloaded. Real access control needs a server with authentication. */
const ROLES=["learner","instructor","admin"];
const PAGES={learner:["home","course","tutor","about"],instructor:["instructor","about"],admin:["admin","instructor","about"]};
const ROLE_HOME={learner:"home",instructor:"instructor",admin:"admin"};
const role=()=>ROLES.includes(S.role)?S.role:"learner";
const canView=page=>PAGES[role()].includes(page);

/* ---------- demo state (admin changes and activity log), this browser only ---------- */
const DKEY="patent-learning-lab-demo-v1";
const freshDemo=()=>({pathAvail:{},userRoles:{},log:DEMO_LOG_SEED.map(x=>({...x,ts:Date.now()-x.ago*60000}))});
let D=freshDemo();
try{const raw=localStorage.getItem(DKEY); if(raw) D=Object.assign(freshDemo(),JSON.parse(raw));}catch(e){}
const saveD=()=>{try{localStorage.setItem(DKEY,JSON.stringify(D));}catch(e){}};
function logEv(type,params={}){ D.log.unshift({ts:Date.now(),who:role(),type,params}); D.log=D.log.slice(0,50); saveD(); }

/* ---------- pathways: availability (admin can override) and content readiness ---------- */
const pathAvail=p=>p.id in D.pathAvail?D.pathAvail[p.id]:!!p.avail;
const pathReady=p=>pathAvail(p)&&!!p.content;
const curPath=()=>PATHWAYS.find(p=>p.id===S.path)||PATHWAYS[0];
const pathPill=()=>{const p=curPath();return `<div class="pathpill"><span class="ob">${L(p.office)}</span><span>${P().pathLbl}: <b>${L(p.name)}</b></span>${role()==="learner"?`<a href="#home" data-tohome="1">${P().change}</a>`:""}</div>`;};
