/* Patent Learning Lab: fictional sample data only. Always label it as sample data in the UI.
   No real people, organisations, e-mail addresses or figures. */
const DATA = {
  funnel:[["L1",100],["L2",91],["L3",86],["L4",64],["L5",59],["L6",55]],
  questions:[["Q1",82],["Q2",47],["Q3",74],["Q4",58],["Q5",88],["Q6",91]],
  regions:{en:["Europe","Asia","Americas","Africa","Oceania"],de:["Europa","Asien","Amerika","Afrika","Ozeanien"],fr:["Europe","Asie","Amériques","Afrique","Océanie"]},
  regionVals:[58,21,13,5,3]
};

/* Demo personas: who "you" are in each role. Names are invented placeholders. */
const PERSONAS={learner:null,instructor:"Ines Example",admin:"Alex Sample"};

/* Fictional demo learners (instructor view). region = index into DATA.regions; last = days since last activity. */
const DEMO_LEARNERS=[
  {id:"u01",name:"Amara Example",region:1,done:6,best:83,last:0},
  {id:"u02",name:"Ben Sample",region:0,done:6,best:67,last:1},
  {id:"u03",name:"Chiara Demo",region:0,done:4,best:null,last:3},
  {id:"u04",name:"Daniel Placeholder",region:2,done:2,best:null,last:9},
  {id:"u05",name:"Elif Example",region:0,done:6,best:100,last:2},
  {id:"u06",name:"Farid Sample",region:3,done:3,best:null,last:14},
  {id:"u07",name:"Grace Demo",region:4,done:5,best:50,last:5},
  {id:"u08",name:"Hiro Example",region:1,done:1,best:null,last:21}
];

/* Fictional users (admin view). path = pathway id. */
const DEMO_USERS=[
  {id:"a01",name:"Alex Sample",role:"admin",path:"epo",last:0},
  {id:"i01",name:"Ines Example",role:"instructor",path:"epo",last:0},
  {id:"i02",name:"Jonas Sample",role:"instructor",path:"pct",last:4},
  ...DEMO_LEARNERS.map(l=>({id:l.id,name:l.name,role:"learner",path:"epo",last:l.last}))
];

/* Seed entries for the activity log. ago = minutes before the demo was first opened. */
const DEMO_LOG_SEED=[
  {ago:35,who:"instructor",actor:"Ines Example",type:"insights",params:{}},
  {ago:90,who:"learner",actor:"Amara Example",type:"quiz",params:{p:83}},
  {ago:140,who:"admin",actor:"Alex Sample",type:"path",params:{path:"pct",on:false}},
  {ago:300,who:"instructor",actor:"Jonas Sample",type:"preview",params:{lesson:3}},
  {ago:1500,who:"learner",actor:"Elif Example",type:"lesson",params:{lesson:5}},
  {ago:2900,who:"admin",actor:"Alex Sample",type:"user",params:{user:"i02",role:"instructor"}}
];
