/* Six Strings practice side: Today, Library, Exercise page (tab player, metronome, speed trainer, tempo log),
   Routines (with a timed runner), Progress (calendar, charts, backup) and Tools (metronome, tuner, recorder).
   Exercises come from exercises/*.js (window.SS_EXERCISES), format in exercises/README.md.
   Uses the app's shared helpers on window.SS. UI text lives in i18n/<lang>.js under px.* keys. */
(function(){
"use strict";
const S=window.SS,Tab=window.SSTab,$=S.$,store=S.store;
if(!S||!Tab)return;
const T=(k,v)=>S.t('px.'+k,v);
const X=o=>{if(o==null)return'';if(typeof o==='string')return S.fmt(o);const v=o[S.lang()]!=null?o[S.lang()]:o.en;return Array.isArray(v)?v.map(x=>S.fmt(x)):S.fmt(v||'');};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CATS=['warmup','left','right','rhythm','fretboard','scales','chords','ear','improv','styles'];
const EX=(window.SS_EXERCISES||[]).filter(e=>e&&e.id&&CATS.includes(e.cat));
const BY={};EX.forEach(e=>{BY[e.id]=e;});
EX.sort((a,b)=>CATS.indexOf(a.cat)-CATS.indexOf(b.cat)||a.level-b.level);
const LETTER={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function chordRoot(name){const m=/^([A-G])([#b♯♭]?)/.exec(name||'');if(!m)return 0;return (LETTER[m[1]]+(/[#♯]/.test(m[2])?1:/[b♭]/.test(m[2])?-1:0)+12)%12;}
function chordLabel(name){return S.fmt('{c:'+name.replace('♯','#').replace('♭','b')+'}');}

/* ---------- dates and the practice log ---------- */
function dayKey(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dayDiff(a,b){return Math.round((new Date(b+'T12:00')-new Date(a+'T12:00'))/864e5);}
function addDays(k,n){const d=new Date(k+'T12:00');d.setDate(d.getDate()+n);return dayKey(d);}
let LOG=store.get('px:log',{});     // id -> {takes:[{d,b,c,v}], best:{var:bpm}, box, last, fav, seen}
let DAYS=store.get('px:days',{});   // 'YYYY-MM-DD' -> seconds practised
let ROUT=store.get('px:routines',[]); // user routines [{id,name,items:[{id,min}]}]
let GOAL=store.get('px:goal',20);   // minutes a day
const saveLog=()=>store.set('px:log',LOG),saveDays=()=>store.set('px:days',DAYS),saveRout=()=>store.set('px:routines',ROUT);
const rec=id=>LOG[id]||(LOG[id]={takes:[],best:{},box:0});
const BOX_DAYS=[0,1,2,4,7,14];
function bestOf(id){const r=LOG[id];if(!r||!r.best)return 0;return Math.max(0,...Object.values(r.best));}
function atGoal(ex){const r=LOG[ex.id];if(!r)return false;if(!ex.tempo)return (r.box||0)>=3;return bestOf(ex.id)>=ex.tempo.goal;}
function practised(id){const r=LOG[id];return !!(r&&r.last);}
function dueIn(id){const r=LOG[id];if(!r||!r.last)return null;return dayDiff(dayKey(),addDays(r.last,BOX_DAYS[Math.min(5,r.box||1)]));}
function isDue(id){const d=dueIn(id);return d!=null&&d<=0;}
function logTake(ex,v,bpm,clean){const r=rec(ex.id),d=dayKey();r.takes.push({d,b:bpm||0,c:clean?1:0,v:v||0});if(r.takes.length>400)r.takes.splice(0,r.takes.length-400);
  if(clean&&bpm){const k=String(v||0);if(!(r.best[k]>=bpm))r.best[k]=bpm;}
  if(r.boxDay!==d){r.box=clean?Math.min(5,(r.box||0)+1):Math.max(1,(r.box||1)-1);r.boxDay=d;}else if(!clean&&r.box>1){r.box--;}
  r.last=d;saveLog();}
let secAcc=0;function addTime(sec){if(!(sec>0))return;const d=dayKey();DAYS[d]=(DAYS[d]||0)+sec;secAcc+=sec;if(secAcc>=10){secAcc=0;saveDays();}}
addEventListener('pagehide',()=>{saveDays();});
function streak(){let n=0,d=dayKey();if(!(DAYS[d]>=60))d=addDays(d,-1);while(DAYS[d]>=60){n++;d=addDays(d,-1);}return n;}
function bestStreak(){const ks=Object.keys(DAYS).filter(k=>DAYS[k]>=60).sort();let best=0,run=0,prev=null;ks.forEach(k=>{run=prev&&dayDiff(prev,k)===1?run+1:1;best=Math.max(best,run);prev=k;});return best;}
const mins=sec=>Math.round((sec||0)/60);
function fmtDur(sec){sec=Math.round(sec||0);const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);return h?T('dur.hm',{h,m}):T('dur.m',{m});}
function clock(sec){sec=Math.max(0,Math.round(sec));return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');}

/* ---------- audio: metronome click and noise bursts on the app's AudioContext ---------- */
let noiseBuf=null;
function clickAt(c,when,accent,soft){const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=accent?1760:soft?880:1175;
  const lv=(soft?.07:accent?.32:.2)*CLICKVOL;g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(lv,when+.002);g.gain.exponentialRampToValueAtTime(.0001,when+.045);
  o.connect(g).connect(c.destination);o.start(when);o.stop(when+.06);}
function noiseAt(c,when,gain){if(!noiseBuf){noiseBuf=c.createBuffer(1,Math.floor(c.sampleRate*.08),c.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);}
  const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuf;f.type='bandpass';f.frequency.value=1800;f.Q.value=.8;g.gain.value=gain;s.connect(f).connect(g).connect(c.destination);s.start(when);}
let CLICKVOL=store.get('px:clickVol',1);

/* ---------- tab rendering ---------- */
const COL=30,SG=14,TOP=34;
const COUNTS={1:['1'],2:['1','&'],3:['1','trip','let'],4:['1','e','&','a'],6:['1','','','&','','']};
function evLabel(ev){return ev.type==='notes'?ev.notes.map(n=>(n.mute?'x':n.f)+(n.bend?'b'+n.bend:'')):[];}
function renderTab(el,ex,tab){
  const p=Tab.parse(tab,ex),sub=ex.sub||1,beats=ex.beats||4,per=beats*sub,evs=p.events;
  const barSet=new Set(p.bars.length?p.bars:[]);if(!p.bars.length)for(let i=per;i<evs.length;i+=per)barSet.add(i);
  // split into bars, then lines of whole bars up to ~32 columns
  const bounds=[0,...[...barSet].filter(b=>b>0&&b<evs.length).sort((a,b)=>a-b),evs.length];const bars=[];for(let i=0;i<bounds.length-1;i++)if(bounds[i+1]>bounds[i])bars.push([bounds[i],bounds[i+1]]);
  const maxCols=Math.max(16,Math.min(40,per*Math.max(1,Math.floor(32/per))));const lines=[];let cur=[],cols=0;
  bars.forEach(b=>{const w=b[1]-b[0];if(cur.length&&cols+w>maxCols){lines.push(cur);cur=[];cols=0;}cur.push(b);cols+=w;});if(cur.length)lines.push(cur);
  const strum=evs.some(e=>e.type==='strum'),counts=COUNTS[sub]||null;
  let html='';
  lines.forEach(line=>{const n=line.reduce((a,b)=>a+b[1]-b[0],0),W=24+n*COL+12,H=TOP+5*SG+(counts?34:18);
    let h=`<svg viewBox="0 0 ${W} ${H}" style="max-width:${W*1.25}px" role="img" aria-label="${esc(T('tab.aria'))}">`;
    for(let s=0;s<6;s++)h+=`<line class="tb-str" x1="14" x2="${W-6}" y1="${TOP+s*SG}" y2="${TOP+s*SG}"/>`;
    h+=`<text class="tb-lab" x="2" y="${TOP+2.5*SG+4}">T</text>`;
    let x=24,lastChord=null;
    line.forEach(([a,b],bi)=>{h+=`<line class="tb-bar" x1="${x-6}" x2="${x-6}" y1="${TOP}" y2="${TOP+5*SG}"/>`;
      for(let i=a;i<b;i++){const ev=evs[i],cx=x+COL/2-6;
        h+=`<g data-ev="${i}"><rect class="tb-hi" x="${x-5}" y="${TOP-26}" width="${COL-2}" height="${5*SG+(counts?50:34)}" rx="5"/>`;
        if(ev.type==='notes'){ev.notes.forEach(nt=>{const y=TOP+(5-nt.s)*SG,lab=(nt.mute?'x':String(nt.f))+(nt.bend?'b'+nt.bend:nt.release?'r':'');
            const w=Math.max(10,lab.length*7+3);h+=`<rect class="tb-bg" x="${cx-w/2}" y="${y-7}" width="${w}" height="14"/><text class="tb-n" x="${cx}" y="${y+4}">${lab}</text>`;});
          const top=ev.notes[0],mk=[];ev.notes.forEach(nt=>{if(nt.tech&&!mk.includes(nt.tech))mk.push(nt.tech);if(nt.vib&&!mk.includes('~'))mk.push('~');if(nt.pm&&!mk.includes('PM'))mk.push('PM');if(nt.acc&&!mk.includes('>'))mk.push('>');});
          if(top&&mk.length)h+=`<text class="tb-mk" x="${cx}" y="${TOP-10}">${mk.join(' ')}</text>`;}
        else if(ev.type==='strum'){if(ev.chord&&ev.chord!==lastChord){h+=`<text class="tb-ch" x="${x-2}" y="${TOP-12}">${esc(chordLabel(ev.chord))}</text>`;lastChord=ev.chord;}
          const y1=TOP+4,y2=TOP+5*SG-4,cls='tb-arr'+(ev.ghost?' ghost':'')+(ev.acc?' acc':'');
          if(ev.mute)h+=`<text class="tb-n" x="${cx}" y="${TOP+2.5*SG+4}">✕</text>`;
          else if(ev.dir==='D')h+=`<path class="${cls}" d="M${cx} ${y1}V${y2}M${cx-4} ${y2-6}L${cx} ${y2}L${cx+4} ${y2-6}"/>`;
          else h+=`<path class="${cls}" d="M${cx} ${y2}V${y1}M${cx-4} ${y1+6}L${cx} ${y1}L${cx+4} ${y1+6}"/>`;
          if(ev.acc)h+=`<text class="tb-mk" x="${cx}" y="${TOP-2}">&gt;</text>`;}
        else if(ev.type==='hold')h+=`<text class="tb-rest" x="${cx}" y="${TOP+2.5*SG+4}">‿</text>`;
        if(counts){const k=(i-a)%sub,beat=Math.floor((i-a)/sub)%beats+1,c=k===0?String(beat):counts[k];if(c)h+=`<text class="tb-cnt${k===0?' b':''}" x="${cx}" y="${TOP+5*SG+20}">${c}</text>`;}
        h+='</g>';x+=COL;}
      if(bi===line.length-1)h+=`<line class="tb-bar" x1="${x-6}" x2="${x-6}" y1="${TOP}" y2="${TOP+5*SG}"/>`;});
    html+=h+'</svg>';});
  el.innerHTML=html;
  return p;}

/* ---------- the player: tab playback + click, count-in, loop, speed trainer ---------- */
const P={on:false,ex:null,v:0,bpm:80,click:store.get('px:click',true),guitar:store.get('px:guitar',true),countIn:store.get('px:countIn',true),
  trainer:false,every:store.get('px:every',2),cap:0,loops:0,evs:[],i:0,t:0,timer:0,raf:0,q:[],started:0,onLoop:null,el:null};
function playerStop(){if(!P.on)return;P.on=false;clearInterval(P.timer);cancelAnimationFrame(P.raf);P.q=[];
  if(P.started){addTime((performance.now()-P.started)/1000);P.started=0;saveDays();}
  if(P.el)P.el.querySelectorAll('.on').forEach(g=>g.classList.remove('on'));if(P.onStop)P.onStop();}
S.stopHooks.push(playerStop);
function schedEvent(c,ev,when,gain){
  if(!P.guitar)return;
  if(ev.type==='notes'){const many=ev.notes.length>1;ev.notes.slice().sort((a,b)=>a.s-b.s).forEach((n,k)=>{const at=when+(many?k*.012:0);
      if(n.mute){noiseAt(c,at,.18*gain);return;}const g=(n.acc?.5:n.pm?.26:.38)*gain;S.play(S.midiAt(n.s,n.bend||n.f),at-c.currentTime,g);});}
  else if(ev.type==='strum'){if(ev.ghost)return;if(ev.mute){noiseAt(c,when,.35*gain);return;}
    const sh=(P.ex.chords||{})[ev.chord];if(!sh)return;const ss=[0,1,2,3,4,5].filter(s=>sh[s]>=0);if(ev.dir==='U')ss.reverse();
    const used=ev.dir==='U'?ss.slice(0,Math.max(3,ss.length-2)):ss,sp=Math.min(.016,60/P.bpm/(P.ex.sub||1)/10);
    used.forEach((s,k)=>S.play(S.midiAt(s,sh[s]),when+k*sp-c.currentTime,(ev.acc?.34:ev.dir==='U'?.18:.25)*gain));}}
function playerStart(opts){const c=S.ac();if(!c)return;S.stopSeq();Object.assign(P,opts);
  const p=Tab.parse(P.tab,P.ex);P.evs=p.events;if(!P.evs.length)return;
  P.on=true;P.i=0;P.loops=0;P.q=[];P.started=performance.now();
  const sub=P.ex.sub||1,beats=P.ex.beats||4;P.t=c.currentTime+.08;
  if(P.countIn){const beat=60/P.bpm;for(let b=0;b<beats;b++){clickAt(c,P.t,b===0);P.q.push({t:P.t,i:-1,beat:b});P.t+=beat;}}
  const tick=()=>{if(!P.on)return;const step=60/P.bpm/sub;
    while(P.t<c.currentTime+.15){const i=P.i,ev=P.evs[i];
      if(P.click&&i%sub===0){const beat=Math.floor(i/sub)%beats;clickAt(c,P.t,beat===0);}
      else if(P.click&&P.subClick)clickAt(c,P.t,false,true);
      schedEvent(c,ev,P.t,1);P.q.push({t:P.t,i});P.t+=step;P.i++;
      if(P.i>=P.evs.length){P.i=0;P.loops++;
        if(P.trainer&&P.loops%P.every===0&&P.bpm<P.cap){P.bpm=Math.min(P.cap,P.bpm+P.step);if(P.onTempo)P.onTempo(P.bpm);}
        if(P.onLoop)P.onLoop(P.loops);}}};
  tick();P.timer=setInterval(tick,25);
  let lastOn=null;const draw=()=>{if(!P.on)return;const now=c.currentTime;let cur=null;while(P.q.length&&P.q[0].t<=now)cur=P.q.shift();
    if(cur&&P.el){if(lastOn)lastOn.classList.remove('on');if(cur.i>=0){const g=P.el.querySelector(`[data-ev="${cur.i}"]`);if(g){g.classList.add('on');lastOn=g;}}
      if(P.onBeat)P.onBeat(cur);}
    P.raf=requestAnimationFrame(draw);};P.raf=requestAnimationFrame(draw);}

/* ---------- standalone metronome (Tools page and routine fallback) ---------- */
const M={on:false,bpm:store.get('px:mBpm',80),beats:store.get('px:mBeats',4),sub:store.get('px:mSub',1),accent:true,
  trainer:false,tStart:60,tGoal:120,tStep:4,tEvery:4,bar:0,b:0,t:0,timer:0,raf:0,q:[],started:0,taps:[]};
function metroStop(){if(!M.on)return;M.on=false;clearInterval(M.timer);cancelAnimationFrame(M.raf);M.q=[];if(M.started){addTime((performance.now()-M.started)/1000);M.started=0;saveDays();}drawMetroState();}
S.stopHooks.push(metroStop);
function metroStart(){const c=S.ac();if(!c)return;S.stopSeq();M.on=true;M.b=0;M.bar=0;M.q=[];M.t=c.currentTime+.08;M.started=performance.now();if(M.trainer)M.bpm=M.tStart;
  const tick=()=>{if(!M.on)return;const step=60/M.bpm/M.sub;
    while(M.t<c.currentTime+.15){const beat=Math.floor(M.b/M.sub),k=M.b%M.sub;
      if(k===0)clickAt(c,M.t,M.accent&&beat===0);else clickAt(c,M.t,false,true);
      M.q.push({t:M.t,beat,k});M.t+=step;M.b++;
      if(M.b>=M.beats*M.sub){M.b=0;M.bar++;if(M.trainer&&M.bar%M.tEvery===0&&M.bpm<M.tGoal){M.bpm=Math.min(M.tGoal,M.bpm+M.tStep);drawMetroBpm();}}}};
  tick();M.timer=setInterval(tick,25);
  const draw=()=>{if(!M.on)return;const now=c.currentTime;let cur=null;while(M.q.length&&M.q[0].t<=now)cur=M.q.shift();
    if(cur&&cur.k===0){const dots=document.querySelectorAll('#mt-dots i');dots.forEach((d,i)=>d.classList.toggle('on',i===cur.beat));}
    M.raf=requestAnimationFrame(draw);};M.raf=requestAnimationFrame(draw);drawMetroState();}
function tapTempo(arr){const now=performance.now();arr.push(now);while(arr.length>6)arr.shift();if(arr.length>1&&now-arr[arr.length-2]>2000){arr.splice(0,arr.length-1);return null;}
  if(arr.length<2)return null;const d=(arr[arr.length-1]-arr[0])/(arr.length-1);return Math.max(30,Math.min(260,Math.round(60000/d)));}

/* ---------- small pieces of UI ---------- */
function lvlDots(n){let h='<span class="lvl" title="'+esc(T('level',{n}))+'" aria-label="'+esc(T('level',{n}))+'">';for(let i=1;i<=5;i++)h+=`<i class="${i<=n?'on':''}"></i>`;return h+'</span>';}
function card(ex){const r=LOG[ex.id],b=bestOf(ex.id),due=isDue(ex.id),goal=atGoal(ex);
  const meter=ex.tempo?`<span class="meter"><i style="width:${Math.min(100,b/ex.tempo.goal*100)}%"></i></span><span class="mono">${b?b:'–'}/${ex.tempo.goal}</span>`:'';
  const badge=goal?`<span class="tag good">${esc(T('st.goal'))}</span>`:due?`<span class="tag">${esc(T('st.due'))}</span>`:r&&r.last?'':`<span class="tag soft">${esc(T('st.new'))}</span>`;
  return `<a class="excard" href="#ex/${ex.id}" data-ex="${ex.id}"><div class="ec-top"><span class="eyebrow">${esc(T('cat.'+ex.cat))}</span>${lvlDots(ex.level)}</div>
    <h3>${r&&r.fav?'<span class="star" aria-label="'+esc(T('starred'))+'">★</span> ':''}${esc(X(ex.title))}</h3><p>${esc(X(ex.goal))}</p>
    <div class="ec-foot"><span class="muted">${T('min',{n:ex.minutes})}</span>${meter}${badge}</div></a>`;}
function catIcon(c){return `<span class="caticon c-${c}" aria-hidden="true"></span>`;}
function download(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}

/* ========== LIBRARY ========== */
const F=Object.assign({q:'',cat:'all',level:0,status:'all',tag:''},store.get('px:filter',{}));
const ALLTAGS=[...new Set(EX.flatMap(e=>e.tags||[]))].sort();
function filtered(){const q=F.q.trim().toLowerCase();return EX.filter(e=>{
  if(F.cat!=='all'&&e.cat!==F.cat)return false;if(F.level&&e.level!==F.level)return false;if(F.tag&&!(e.tags||[]).includes(F.tag))return false;
  const r=LOG[e.id];if(F.status==='new'&&r&&r.last)return false;if(F.status==='doing'&&!(r&&r.last&&!atGoal(e)))return false;
  if(F.status==='due'&&!isDue(e.id))return false;if(F.status==='goal'&&!atGoal(e))return false;if(F.status==='fav'&&!(r&&r.fav))return false;
  if(q){const hay=[X(e.title),X(e.goal),e.title.en,e.title.pt,(e.tags||[]).join(' '),T('cat.'+e.cat)].join(' ').toLowerCase();if(!q.split(/\s+/).every(w=>hay.includes(w)))return false;}
  return true;});}
function drawLibrary(){const el=$('library');
  el.innerHTML=`<div class="intro"><div><div class="eyebrow">${esc(T('lib.eyebrow'))}</div><h1>${esc(T('lib.h1'))}</h1><p class="lead">${esc(T('lib.lead',{n:EX.length}))}</p></div>
    <div class="panel catgrid" id="lib-cats"></div></div>
    <div class="panel filters"><div class="frow"><input type="search" id="lib-q" placeholder="${esc(T('lib.search'))}" aria-label="${esc(T('lib.search'))}" value="${esc(F.q)}">
      <select id="lib-tag" aria-label="${esc(T('lib.tag'))}"><option value="">${esc(T('lib.anyTag'))}</option>${ALLTAGS.map(t=>`<option value="${t}"${t===F.tag?' selected':''}>${esc(T('tag.'+t)!=='px.tag.'+t?T('tag.'+t):t.replace(/-/g,' '))}</option>`).join('')}</select></div>
      <div class="frow"><div class="ctl"><span>${esc(T('lib.level'))}</span><div class="seg" id="lib-level"></div></div><div class="ctl"><span>${esc(T('lib.status'))}</span><div class="seg" id="lib-status"></div></div></div></div>
    <div class="kicker"><p class="muted" id="lib-count"></p><button class="btn" type="button" id="lib-clear">${esc(T('lib.clear'))}</button></div>
    <div class="exgrid" id="lib-grid"></div>`;
  const cats=$('lib-cats');cats.innerHTML=['all',...CATS].map(c=>{const n=c==='all'?EX.length:EX.filter(e=>e.cat===c).length;
    return `<button type="button" class="catbtn" data-cat="${c}" aria-pressed="${F.cat===c}">${c==='all'?'':catIcon(c)}<span>${esc(c==='all'?T('lib.all'):T('cat.'+c))}</span><em>${n}</em></button>`;}).join('');
  cats.onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;F.cat=b.dataset.cat;cats.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));drawGrid();};
  S.seg($('lib-level'),[{label:T('lib.any'),value:0},...[1,2,3,4,5].map(n=>({label:String(n),value:n,title:T('level',{n})}))],F.level,v=>{F.level=v;drawGrid();});
  S.seg($('lib-status'),['all','new','doing','due','goal','fav'].map(v=>({label:T('lib.st.'+v),value:v})),F.status,v=>{F.status=v;drawGrid();});
  $('lib-q').oninput=e=>{F.q=e.target.value;drawGrid();};$('lib-tag').onchange=e=>{F.tag=e.target.value;drawGrid();};
  $('lib-clear').onclick=()=>{Object.assign(F,{q:'',cat:'all',level:0,status:'all',tag:''});drawLibrary();};
  drawGrid();}
function drawGrid(){store.set('px:filter',F);const list=filtered();$('lib-count').textContent=T('lib.count',{n:list.length,of:EX.length});
  $('lib-grid').innerHTML=list.length?list.map(card).join(''):`<div class="panel empty">${esc(T('lib.none'))}</div>`;}

/* ========== EXERCISE PAGE ========== */
let CUR=null;
function openEx(id,opts){const ex=BY[id];if(!ex){S.showTab('library');return;}CUR={ex,v:0};S.showTab('exercise','ex/'+id);drawEx();if(!(opts&&opts.keepScroll))window.scrollTo({top:0});}
function curTab(){const ex=CUR.ex;return CUR.v>0&&ex.vars&&ex.vars[CUR.v-1]?ex.vars[CUR.v-1].tab:ex.tab;}
function drawEx(){if(!CUR)return;const ex=CUR.ex,r=LOG[ex.id]||{},el=$('exercise');
  const sib=EX.filter(e=>e.cat===ex.cat),k=sib.indexOf(ex),prev=sib[k-1],next=sib[k+1];
  const tags=(ex.tags||[]).map(t=>`<button type="button" class="chip" data-tagjump="${t}">${esc(T('tag.'+t)!=='px.tag.'+t?T('tag.'+t):t.replace(/-/g,' '))}</button>`).join('');
  const how=X(ex.how)||[],tips=ex.tips?X(ex.tips):[];
  el.innerHTML=`<div class="crumbs"><button class="btn" type="button" data-go="library">← ${esc(T('lib.back'))}</button><span class="muted">${catIcon(ex.cat)} ${esc(T('cat.'+ex.cat))} · ${k+1}/${sib.length}</span></div>
  <div class="intro"><div><div class="eyebrow">${esc(T('cat.'+ex.cat))} · ${esc(T('level',{n:ex.level}))} · ${esc(T('min',{n:ex.minutes}))}</div><h1>${esc(X(ex.title))}</h1>
    <p class="lead">${esc(X(ex.goal))}</p><div class="chips">${tags}</div></div>
    <div class="panel" id="ex-player"></div></div>
  ${ex.tab?`<div class="panel"><div class="kicker"><h2>${esc(T('ex.tab'))}</h2>${ex.vars&&ex.vars.length?`<div class="seg" id="ex-vars"></div>`:''}</div><div class="tabwrap" id="ex-tab"></div>
    <p class="muted small">${esc(T('ex.tabHint'))}</p></div>`:''}
  <div class="grid2"><div class="panel"><h2>${esc(T('ex.how'))}</h2><ol class="how">${how.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
    ${tips.length?`<h3>${esc(T('ex.tips'))}</h3><ul class="tips">${tips.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}
    <div class="btnrow">${ex.tool?`<button class="btn primary" type="button" data-tool="${ex.tool}">${esc(T('tool.'+ex.tool))} →</button>`:''}${ex.learn?`<button class="btn" type="button" data-go="${ex.learn}">${esc(T('ex.learn',{name:S.t('tab.'+ex.learn)}))}</button>`:''}</div></div>
    <div class="panel" id="ex-side"></div></div>
  ${ex.tab?`<div class="panel"><h2>${esc(ex.chords&&Object.keys(ex.chords).length?T('ex.shapes'):T('ex.board'))}</h2><div id="ex-shapes"></div></div>`:''}
  <div class="panel"><div class="kicker"><h2>${esc(T('ex.history'))}</h2><span class="muted" id="ex-hsum"></span></div><div id="ex-chart"></div></div>
  <div class="exnav">${prev?`<a class="btn" href="#ex/${prev.id}" data-ex="${prev.id}">← ${esc(X(prev.title))}</a>`:'<span></span>'}${next?`<a class="btn" href="#ex/${next.id}" data-ex="${next.id}">${esc(X(next.title))} →</a>`:''}</div>`;
  if(ex.vars&&ex.vars.length)S.seg($('ex-vars'),[{label:T('ex.main'),value:0},...ex.vars.map((v,i)=>({label:X(v.name),value:i+1}))],CUR.v,v=>{playerStop();CUR.v=v;drawTabArea();drawPlayer();drawChart();});
  drawTabArea();drawPlayer();drawSide();drawChart();}
function drawTabArea(){const ex=CUR.ex;if(!ex.tab)return;const p=renderTab($('ex-tab'),ex,curTab());P.el=$('ex-tab');
  const box=$('ex-shapes');
  if(ex.chords&&Object.keys(ex.chords).length){box.className='shapes';box.innerHTML=Object.entries(ex.chords).map(([n,f])=>`<button type="button" class="shape" data-strum="${esc(n)}"><b>${esc(chordLabel(n))}</b>${S.chordBox(f,chordRoot(n),{aria:chordLabel(n)})}</button>`).join('');}
  else{const seen=new Map();let maxF=0;p.events.forEach(ev=>{if(ev.type==='notes')ev.notes.forEach(n=>{if(n.mute)return;const k=n.s+':'+n.f;if(!seen.has(k))seen.set(k,{s:n.s,f:n.f,first:seen.size===0});maxF=Math.max(maxF,n.f);});});
    const frets=maxF<=12?12:maxF<=15?15:Math.min(22,maxF+1);box.className='boardwrap';
    S.board(box,{frets,dots:[...seen.values()].map(d=>({s:d.s,f:d.f,cls:d.first?'iv-r':'plain',label:S.noteS(S.pcAt(d.s,d.f))})),aria:T('ex.board'),onClick:(s,f)=>S.play(S.midiAt(s,f))});}}
function bpmFor(ex){const r=LOG[ex.id];return (r&&r.lastBpm)||ex.tempo.start;}
function drawPlayer(){const ex=CUR.ex,el=$('ex-player'),r=LOG[ex.id]||{};
  if(!ex.tab){el.innerHTML=`<h2>${esc(T('ex.practise'))}</h2><p>${esc(T('ex.toolOnly'))}</p><div class="btnrow">${ex.tool?`<button class="btn primary" type="button" data-tool="${ex.tool}">${esc(T('tool.'+ex.tool))} →</button>`:''}<button class="btn" type="button" id="ex-did">✓ ${esc(T('ex.did'))}</button></div><p class="muted small" id="ex-saved"></p>`;
    $('ex-did').onclick=()=>{logTake(ex,CUR.v,0,true);$('ex-saved').textContent=T('ex.saved');drawSide();drawChart();refreshCounts();};return;}
  const tp=ex.tempo,best=r.best&&r.best[String(CUR.v)]||0;if(!P.on||P.ex!==ex)P.bpm=bpmFor(ex);
  el.innerHTML=`<div class="pl-top"><button class="btn primary big" type="button" id="pl-go"></button>
    <div class="bpm"><button class="btn" type="button" data-bpm="-5" aria-label="−5">−</button><div><b id="pl-bpm">${P.bpm}</b><small>${esc(T('bpm'))}</small></div><button class="btn" type="button" data-bpm="5" aria-label="+5">+</button></div>
    <button class="btn" type="button" id="pl-tap">${esc(T('tap'))}</button></div>
    <input type="range" id="pl-range" min="30" max="260" value="${P.bpm}" aria-label="${esc(T('bpm'))}">
    <div class="pl-goal"><span>${esc(T('ex.start'))} <b>${tp.start}</b></span><span>${esc(T('ex.best'))} <b id="pl-best">${best||'–'}</b></span><span>${esc(T('ex.goal'))} <b>${tp.goal}</b></span></div>
    <div class="meter wide"><i style="width:${Math.min(100,best/tp.goal*100)}%"></i><em style="left:${Math.min(100,tp.start/tp.goal*100)}%"></em></div>
    <div class="pl-opts"><label class="chk"><input type="checkbox" id="pl-click"${P.click?' checked':''}> ${esc(T('opt.click'))}</label><label class="chk"><input type="checkbox" id="pl-guitar"${P.guitar?' checked':''}> ${esc(T('opt.guitar'))}</label><label class="chk"><input type="checkbox" id="pl-count"${P.countIn?' checked':''}> ${esc(T('opt.countIn'))}</label></div>
    <details class="trainer"${P.trainer?' open':''}><summary><label class="chk"><input type="checkbox" id="pl-train"${P.trainer?' checked':''}> ${esc(T('opt.trainer'))}</label></summary>
      <p class="muted small" id="pl-train-p"></p><div class="seg" id="pl-every"></div></details>
    <div class="pl-log"><span>${esc(T('ex.how2'))}</span><div class="btnrow"><button class="btn good" type="button" id="pl-clean">✓ ${esc(T('ex.clean'))}</button><button class="btn" type="button" id="pl-sloppy">${esc(T('ex.sloppy'))}</button></div><p class="muted small" id="pl-msg" aria-live="polite"></p></div>`;
  const setBpm=v=>{P.bpm=Math.max(30,Math.min(260,Math.round(v)));$('pl-bpm').textContent=P.bpm;$('pl-range').value=P.bpm;const rr=rec(ex.id);rr.lastBpm=P.bpm;saveLog();};
  const goBtn=()=>{$('pl-go').innerHTML=P.on&&P.ex===ex?'■ '+esc(T('stop')):'<span class="ico"></span>'+esc(T('play'));};goBtn();
  P.onStop=goBtn;P.onTempo=v=>{$('pl-bpm').textContent=v;$('pl-range').value=v;};
  const trainP=()=>{$('pl-train-p').textContent=T('ex.trainer',{step:tp.step,n:P.every,goal:tp.goal});};trainP();
  S.seg($('pl-every'),[1,2,4,8].map(n=>({label:T('loops',{n}),value:n})),P.every,v=>{P.every=v;store.set('px:every',v);trainP();});
  $('pl-go').onclick=()=>{if(P.on&&P.ex===ex){S.stopSeq();return;}
    playerStart({ex,tab:curTab(),bpm:P.bpm,cap:tp.goal,step:tp.step,el:$('ex-tab')});rec(ex.id).seen=1;goBtn();};
  el.querySelectorAll('[data-bpm]').forEach(b=>b.onclick=()=>setBpm(P.bpm+(+b.dataset.bpm)));
  $('pl-range').oninput=e=>setBpm(+e.target.value);
  const taps=[];$('pl-tap').onclick=()=>{const v=tapTempo(taps);if(v)setBpm(v);};
  $('pl-click').onchange=e=>{P.click=e.target.checked;store.set('px:click',P.click);};
  $('pl-guitar').onchange=e=>{P.guitar=e.target.checked;store.set('px:guitar',P.guitar);};
  $('pl-count').onchange=e=>{P.countIn=e.target.checked;store.set('px:countIn',P.countIn);};
  $('pl-train').onchange=e=>{P.trainer=e.target.checked;e.target.closest('details').open=P.trainer;};
  const take=clean=>{logTake(ex,CUR.v,P.bpm,clean);const b=(LOG[ex.id].best||{})[String(CUR.v)]||0;
    let msg=clean?T('ex.savedClean',{bpm:P.bpm}):T('ex.savedSloppy',{bpm:Math.max(30,P.bpm-tp.step)});
    if(clean&&P.bpm>=tp.goal)msg=T('ex.atGoal');else if(clean){msg+=' '+T('ex.tryFaster',{bpm:Math.min(tp.goal,P.bpm+tp.step)});setBpm(Math.min(tp.goal,P.bpm+tp.step));}
    else setBpm(Math.max(30,P.bpm-tp.step));
    $('pl-msg').textContent=msg;$('pl-best').textContent=b||'–';el.querySelector('.meter.wide i').style.width=Math.min(100,b/tp.goal*100)+'%';drawSide();drawChart();refreshCounts();};
  $('pl-clean').onclick=()=>take(true);$('pl-sloppy').onclick=()=>take(false);}
function drawSide(){const ex=CUR.ex,r=LOG[ex.id]||{},d=dueIn(ex.id);
  const status=atGoal(ex)?T('st.goalLong'):r.last?(d<=0?T('st.dueNow'):T('st.dueIn',{n:d})):T('st.newLong');
  const opts=allRoutines().filter(x=>x.user).map(x=>`<option value="${x.id}">${esc(rName(x))}</option>`).join('');
  $('ex-side').innerHTML=`<h2>${esc(T('ex.status'))}</h2><p>${esc(status)}</p>${r.last?`<p class="muted small">${esc(T('ex.last',{d:fmtDate(r.last),n:r.takes.length}))}</p>`:''}
    <div class="btnrow"><button class="btn" type="button" id="ex-fav" aria-pressed="${!!r.fav}">${r.fav?'★ '+esc(T('unstar')):'☆ '+esc(T('star'))}</button></div>
    <h3 style="margin-top:16px">${esc(T('ex.addTo'))}</h3><div class="btnrow"><select id="ex-rsel" aria-label="${esc(T('ex.addTo'))}">${opts}<option value="new">${esc(T('rt.newOne'))}</option></select><button class="btn" type="button" id="ex-radd">${esc(T('add'))}</button></div><p class="muted small" id="ex-rmsg" aria-live="polite"></p>`;
  $('ex-fav').onclick=()=>{const rr=rec(ex.id);rr.fav=!rr.fav;saveLog();drawSide();};
  $('ex-radd').onclick=()=>{let id=$('ex-rsel').value;if(id==='new'){const name=prompt(T('rt.namePrompt'),T('rt.mine'));if(!name)return;const nr={id:'u'+Date.now().toString(36),name,items:[]};ROUT.push(nr);id=nr.id;}
    const rt=ROUT.find(x=>x.id===id);if(!rt)return;rt.items.push({id:ex.id,min:ex.minutes});saveRout();drawSide();$('ex-rmsg').textContent=T('rt.added',{name:rt.name});};}
function fmtDate(k){try{return new Date(k+'T12:00').toLocaleDateString(S.t('htmlLang')||undefined,{day:'numeric',month:'short'});}catch(e){return k;}}
function lineChart(points,goal,opts){opts=opts||{};if(!points.length)return `<p class="muted">${esc(opts.empty||T('ex.noHistory'))}</p>`;
  const W=640,H=180,pl=36,pr=12,pt=14,pb=26,ys=points.map(p=>p.y).concat(goal?[goal]:[]),lo=Math.max(0,Math.min(...ys)-10),hi=Math.max(...ys)+10;
  const xs=i=>pl+(points.length===1?(W-pl-pr)/2:i*(W-pl-pr)/(points.length-1)),yv=v=>pt+(H-pt-pb)*(1-(v-lo)/(hi-lo||1));
  let h=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.aria||T('ex.history'))}">`;
  [lo,(lo+hi)/2,hi].forEach(v=>{h+=`<line class="ch-grid" x1="${pl}" x2="${W-pr}" y1="${yv(v)}" y2="${yv(v)}"/><text class="ch-ax" x="${pl-6}" y="${yv(v)+4}" text-anchor="end">${Math.round(v)}</text>`;});
  if(goal)h+=`<line class="ch-goal" x1="${pl}" x2="${W-pr}" y1="${yv(goal)}" y2="${yv(goal)}"/><text class="ch-ax goal" x="${W-pr}" y="${yv(goal)-5}" text-anchor="end">${esc(T('ex.goal'))} ${goal}</text>`;
  h+=`<polyline class="ch-line" points="${points.map((p,i)=>xs(i)+','+yv(p.y)).join(' ')}"/>`;
  points.forEach((p,i)=>{h+=`<circle class="ch-dot" cx="${xs(i)}" cy="${yv(p.y)}" r="4"><title>${esc(p.label)}: ${p.y}</title></circle>`;});
  const step=Math.max(1,Math.ceil(points.length/6));points.forEach((p,i)=>{if(i%step===0||i===points.length-1)h+=`<text class="ch-ax" x="${xs(i)}" y="${H-6}" text-anchor="middle">${esc(p.label)}</text>`;});
  return h+'</svg>';}
function historyPoints(id,v){const r=LOG[id];if(!r)return[];const byDay={};r.takes.filter(t=>t.c&&t.b&&(v==null||t.v===v)).forEach(t=>{byDay[t.d]=Math.max(byDay[t.d]||0,t.b);});
  return Object.keys(byDay).sort().slice(-30).map(d=>({label:fmtDate(d),y:byDay[d]}));}
function drawChart(){const ex=CUR.ex,r=LOG[ex.id];const n=r?r.takes.length:0,clean=r?r.takes.filter(t=>t.c).length:0;
  $('ex-hsum').textContent=n?T('ex.takes',{n,c:clean}):'';$('ex-chart').innerHTML=ex.tab?lineChart(historyPoints(ex.id,CUR.v),ex.tempo&&ex.tempo.goal):
    (n?`<p>${esc(T('ex.daysDone',{n:new Set(r.takes.map(t=>t.d)).size}))}</p>`:`<p class="muted">${esc(T('ex.noHistory'))}</p>`);}

/* ========== ROUTINES ========== */
function pickEx(pred,used){return EX.find(e=>pred(e)&&!used.has(e.id));}
function builtin(){const defs=[
  {id:'b-daily',min:15,parts:[['warmup',1],['left',1],['chords',1],['rhythm',1],['fretboard',1]]},
  {id:'b-tech',min:20,parts:[['warmup',2],['left',2,'legato'],['right',2,'alternate-picking'],['left',2,'chromatic'],['right',3,'string-crossing']]},
  {id:'b-rhythm',min:15,parts:[['rhythm',1],['chords',1,'changes'],['rhythm',2],['rhythm',3]]},
  {id:'b-lead',min:30,parts:[['warmup',1],['left',2,'bends'],['scales',1,'pentatonic'],['scales',2,'sequences'],['improv',2],['styles',3,'blues'],['ear',1]]},
  {id:'b-finger',min:15,parts:[['right',1,'fingerstyle'],['right',2,'fingerstyle'],['styles',3,'folk']]},
  {id:'b-theory',min:15,parts:[['fretboard',1],['fretboard',2],['ear',1],['scales',1]]}];
  return defs.map(d=>{const used=new Set(),items=[];d.parts.forEach(([cat,lvl,tag])=>{
      const e=pickEx(e=>e.cat===cat&&e.level<=lvl&&(!tag||(e.tags||[]).includes(tag)),used)||pickEx(e=>e.cat===cat&&(!tag||(e.tags||[]).includes(tag)),used)||pickEx(e=>e.cat===cat,used);
      if(e){used.add(e.id);items.push({id:e.id,min:0});}});
    const per=Math.max(2,Math.round(d.min/Math.max(1,items.length)));items.forEach(it=>it.min=per);
    return {id:d.id,builtin:true,items};}).filter(r=>r.items.length);}
function todayMix(){const used=new Set(),items=[];const warm=pickEx(e=>e.cat==='warmup'&&!isDue(e.id),used);
  const due=EX.filter(e=>isDue(e.id)).sort((a,b)=>dueIn(a.id)-dueIn(b.id));
  if(warm&&!due.some(e=>e.cat==='warmup')){items.push({id:warm.id,min:3});used.add(warm.id);}
  due.slice(0,4).forEach(e=>{items.push({id:e.id,min:Math.min(6,e.minutes)});used.add(e.id);});
  suggestions(4-Math.min(4,due.length)+1).forEach(e=>{if(!used.has(e.id)){items.push({id:e.id,min:Math.min(6,e.minutes)});used.add(e.id);}});
  return {id:'b-today',builtin:true,today:true,items:items.slice(0,6)};}
function suggestions(n){const level=Math.max(1,Math.min(5,Math.round(avgLevel())));const doneCats={};EX.forEach(e=>{if(practised(e.id))doneCats[e.cat]=(doneCats[e.cat]||0)+1;});
  const fresh=EX.filter(e=>!practised(e.id)&&e.level<=level+0);fresh.sort((a,b)=>(doneCats[a.cat]||0)-(doneCats[b.cat]||0)||a.level-b.level);
  const out=[],cats=new Set();fresh.forEach(e=>{if(out.length<n&&!cats.has(e.cat)){out.push(e);cats.add(e.cat);}});fresh.forEach(e=>{if(out.length<n&&!out.includes(e))out.push(e);});return out;}
function avgLevel(){const g=EX.filter(e=>practised(e.id));if(!g.length)return 1;const s=g.reduce((a,e)=>a+e.level+(atGoal(e)?1:0),0)/g.length;return s;}
function allRoutines(){return [todayMix(),...builtin(),...ROUT.map(r=>Object.assign({user:true},r))];}
function rName(r){return r.user?r.name:T('rt.'+r.id+'.h');}
function rMins(r){return r.items.reduce((a,b)=>a+(+b.min||0),0);}
function drawRoutines(){const el=$('routines'),all=allRoutines();
  const row=r=>`<li class="panel rcard"><div><div class="eyebrow">${r.user?esc(T('rt.yours')):r.today?esc(T('rt.auto')):esc(T('rt.ready'))} · ${esc(T('min',{n:rMins(r)}))} · ${esc(T('rt.items',{n:r.items.length}))}</div><h3>${esc(rName(r))}</h3>
    ${r.user?'':`<p class="muted">${esc(T('rt.'+r.id+'.p'))}</p>`}<ol class="ritems">${r.items.map((it,i)=>{const e=BY[it.id];return e?`<li><a href="#ex/${e.id}" data-ex="${e.id}">${esc(X(e.title))}</a> <span class="muted">${esc(T('min',{n:it.min}))}</span>${r.user?` <span class="rbtns"><button type="button" class="mini" data-rmove="${r.id}:${i}:-1" aria-label="${esc(T('up'))}">↑</button><button type="button" class="mini" data-rmove="${r.id}:${i}:1" aria-label="${esc(T('down'))}">↓</button><button type="button" class="mini" data-rmin="${r.id}:${i}" aria-label="${esc(T('rt.setMin'))}">⏱</button><button type="button" class="mini" data-rdel="${r.id}:${i}" aria-label="${esc(T('remove'))}">✕</button></span>`:''}</li>`:'';}).join('')}</ol>
    ${!r.items.length?`<p class="muted">${esc(T('rt.empty'))}</p>`:''}</div>
    <div class="btnrow">${r.items.length?`<button class="btn primary" type="button" data-run="${r.id}"><span class="ico"></span>${esc(T('rt.start'))}</button>`:''}${r.user?`<button class="btn" type="button" data-rren="${r.id}">${esc(T('rename'))}</button><button class="btn" type="button" data-rkill="${r.id}">${esc(T('delete'))}</button>`:`<button class="btn" type="button" data-rcopy="${r.id}">${esc(T('rt.copy'))}</button>`}</div></li>`;
  el.innerHTML=`<div class="intro"><div><div class="eyebrow">${esc(T('rt.eyebrow'))}</div><h1>${esc(T('rt.h1'))}</h1><p class="lead">${esc(T('rt.lead'))}</p></div>
    <div class="panel"><h3>${esc(T('rt.how.h'))}</h3><p>${esc(T('rt.how.p'))}</p><button class="btn" type="button" id="rt-new">+ ${esc(T('rt.new'))}</button></div></div>
    <ol class="rlist">${all.map(row).join('')}</ol>`;
  $('rt-new').onclick=()=>{const name=prompt(T('rt.namePrompt'),T('rt.mine'));if(!name)return;ROUT.push({id:'u'+Date.now().toString(36),name,items:[]});saveRout();drawRoutines();};}
$('routines').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  const find=id=>ROUT.find(r=>r.id===id);
  if(d.run)runStart(allRoutines().find(r=>r.id===d.run));
  else if(d.rcopy){const src=allRoutines().find(r=>r.id===d.rcopy);ROUT.push({id:'u'+Date.now().toString(36),name:rName(src),items:src.items.map(x=>Object.assign({},x))});saveRout();drawRoutines();}
  else if(d.rkill){if(confirm(T('rt.delQ'))){ROUT=ROUT.filter(r=>r.id!==d.rkill);saveRout();drawRoutines();}}
  else if(d.rren){const r=find(d.rren),n=prompt(T('rt.namePrompt'),r.name);if(n){r.name=n;saveRout();drawRoutines();}}
  else if(d.rmove){const[id,i,dir]=d.rmove.split(':'),r=find(id),a=+i,b2=a+(+dir);if(b2<0||b2>=r.items.length)return;[r.items[a],r.items[b2]]=[r.items[b2],r.items[a]];saveRout();drawRoutines();}
  else if(d.rdel){const[id,i]=d.rdel.split(':'),r=find(id);r.items.splice(+i,1);saveRout();drawRoutines();}
  else if(d.rmin){const[id,i]=d.rmin.split(':'),r=find(id),v=prompt(T('rt.minPrompt'),r.items[+i].min);if(v&&+v>0){r.items[+i].min=Math.min(60,Math.round(+v));saveRout();drawRoutines();}}});

/* routine runner: a bar fixed to the bottom of the screen that steps through the items with a countdown */
const RUN={r:null,k:0,left:0,paused:false,timer:0,total:0};
const bar=document.createElement('div');bar.className='runbar';bar.id='runbar';bar.hidden=true;document.body.appendChild(bar);
function runStart(r){if(!r||!r.items.length)return;RUN.r=JSON.parse(JSON.stringify(r));RUN.r.title=rName(r);RUN.k=0;RUN.total=0;runItem();clearInterval(RUN.timer);RUN.timer=setInterval(runTick,1000);}
function runItem(){const it=RUN.r.items[RUN.k];RUN.left=it.min*60;RUN.paused=false;openEx(it.id);drawRunBar();}
function runTick(){if(!RUN.r||RUN.paused)return;RUN.left--;RUN.total++;if(!P.on&&!M.on)addTime(1);
  if(RUN.left<=0){chime();if(RUN.k<RUN.r.items.length-1){RUN.k++;runItem();}else runEnd(true);return;}drawRunBar();}
function chime(){const c=S.ac();if(!c)return;[0,.18,.36].forEach((d,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=[784,988,1319][i];g.gain.setValueAtTime(.0001,c.currentTime+d);g.gain.exponentialRampToValueAtTime(.2,c.currentTime+d+.02);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d+.5);o.connect(g).connect(c.destination);o.start(c.currentTime+d);o.stop(c.currentTime+d+.55);});}
function runEnd(finished){clearInterval(RUN.timer);const r=RUN.r;RUN.r=null;bar.hidden=true;document.body.classList.remove('running');saveDays();
  if(finished&&r){S.stopSeq();alert(T('run.done',{name:r.title,t:fmtDur(RUN.total)}));S.showTab('today');window.scrollTo({top:0});}}
function drawRunBar(){if(!RUN.r){bar.hidden=true;return;}const r=RUN.r,it=r.items[RUN.k],ex=BY[it.id];bar.hidden=false;document.body.classList.add('running');
  const frac=1-RUN.left/(it.min*60);
  bar.innerHTML=`<div class="rb-prog"><i style="width:${frac*100}%"></i></div><div class="rb-in"><div class="rb-txt"><span class="muted">${esc(r.title)} · ${RUN.k+1}/${r.items.length}</span><a href="#ex/${ex.id}" data-ex="${ex.id}">${esc(X(ex.title))}</a></div>
    <b class="rb-clock" aria-live="off">${clock(RUN.left)}</b><div class="btnrow"><button class="btn" type="button" data-rb="prev" aria-label="${esc(T('run.prev'))}" ${RUN.k?'':'disabled'}>⏮</button><button class="btn" type="button" data-rb="pause">${RUN.paused?'▶ '+esc(T('run.resume')):'⏸ '+esc(T('run.pause'))}</button><button class="btn" type="button" data-rb="next" aria-label="${esc(T('run.next'))}">⏭</button><button class="btn" type="button" data-rb="stop" aria-label="${esc(T('run.stop'))}">✕</button></div></div>`;}
bar.addEventListener('click',e=>{const b=e.target.closest('[data-rb]');if(!b)return;const a=b.dataset.rb;
  if(a==='pause'){RUN.paused=!RUN.paused;drawRunBar();}else if(a==='next'){if(RUN.k<RUN.r.items.length-1){RUN.k++;runItem();}else runEnd(true);}
  else if(a==='prev'&&RUN.k>0){RUN.k--;runItem();}else if(a==='stop'){if(confirm(T('run.stopQ')))runEnd(false);}});

/* ========== TODAY ========== */
function heatmap(weeks){const today=dayKey(),start=addDays(today,-(weeks*7-1)-((new Date(today+'T12:00').getDay()+6)%7)+6);let h='<div class="heat" role="img" aria-label="'+esc(T('pr.cal'))+'">';
  const first=addDays(start,-((new Date(start+'T12:00').getDay()+6)%7));let d=first;
  for(let w=0;w<weeks;w++){h+='<div class="hcol">';for(let k=0;k<7;k++){const m=mins(DAYS[d]||0),lv=m===0?0:m<10?1:m<GOAL?2:m<GOAL*2?3:4,fut=dayDiff(today,d)>0;
      h+=`<i class="h${lv}${fut?' fut':''}${d===today?' today':''}" title="${esc(fmtDate(d))}: ${esc(T('min',{n:m}))}"></i>`;d=addDays(d,1);}h+='</div>';}
  return h+'</div>';}
function drawToday(){const el=$('today'),m=mins(DAYS[dayKey()]||0),st=streak(),due=EX.filter(e=>isDue(e.id)),mix=todayMix();
  const recent=Object.keys(LOG).filter(id=>BY[id]&&LOG[id].last).sort((a,b)=>LOG[b].last.localeCompare(LOG[a].last)||(LOG[b].takes.length-LOG[a].takes.length)).slice(0,4).map(id=>BY[id]);
  const hr=new Date().getHours(),hello=T(hr<12?'td.morning':hr<19?'td.afternoon':'td.evening');
  el.innerHTML=`<div class="intro"><div><div class="eyebrow">${esc(new Date().toLocaleDateString(S.t('htmlLang')||undefined,{weekday:'long',day:'numeric',month:'long'}))}</div><h1>${esc(hello)}</h1>
      <p class="lead">${esc(practisedAny()?T('td.lead'):T('td.leadNew'))}</p>
      <div class="btnrow"><button class="btn primary big" type="button" data-run="b-today"><span class="ico"></span>${esc(T('td.start',{n:rMins(mix)}))}</button><button class="btn" type="button" data-go="library">${esc(T('td.browse'))}</button></div></div>
    <div class="panel stats"><div class="stat"><b>${st}</b><span>${esc(T('td.streak'))}</span></div><div class="stat"><b>${m}<small>/${GOAL}</small></b><span>${esc(T('td.minutes'))}</span></div><div class="stat"><b>${due.length}</b><span>${esc(T('td.due'))}</span></div>
      <div class="goalbar"><div class="bar"><i style="width:${Math.min(100,m/GOAL*100)}%"></i></div><div class="ctl"><span>${esc(T('td.goal'))}</span><div class="seg" id="td-goal"></div></div></div></div></div>
    <div class="panel"><div class="kicker"><h2>${esc(T('td.plan'))}</h2><span class="muted">${esc(T('td.planP'))}</span></div><ol class="plan">${mix.items.map((it,i)=>{const e=BY[it.id];return `<li><span class="pnum">${i+1}</span><a href="#ex/${e.id}" data-ex="${e.id}"><b>${esc(X(e.title))}</b><span class="muted">${esc(T('cat.'+e.cat))} · ${esc(T('min',{n:it.min}))}${isDue(e.id)?' · '+esc(T('st.due')):practised(e.id)?'':' · '+esc(T('st.new'))}</span></a></li>`;}).join('')}</ol></div>
    ${recent.length?`<div><div class="kicker"><h2>${esc(T('td.recent'))}</h2></div><div class="exgrid">${recent.map(card).join('')}</div></div>`:''}
    <div><div class="kicker"><h2>${esc(T('td.try'))}</h2><span class="muted">${esc(T('td.tryP'))}</span></div><div class="exgrid">${suggestions(10).filter(e=>!mix.items.some(it=>it.id===e.id)).slice(0,4).map(card).join('')}</div></div>
    <div class="panel"><div class="kicker"><h2>${esc(T('td.weeks'))}</h2><button class="btn" type="button" data-go="progress">${esc(T('td.allProgress'))} →</button></div>${heatmap(18)}</div>`;
  S.seg($('td-goal'),[10,20,30,45,60].map(n=>({label:String(n),value:n,title:T('min',{n})})),GOAL,v=>{GOAL=v;store.set('px:goal',v);drawToday();});}
function practisedAny(){return Object.values(LOG).some(r=>r.last);}

/* ========== PROGRESS ========== */
function drawProgress(){const el=$('progress'),total=Object.values(DAYS).reduce((a,b)=>a+b,0),week=[0,1,2,3,4,5,6].reduce((a,i)=>a+(DAYS[addDays(dayKey(),-i)]||0),0);
  const prac=EX.filter(e=>practised(e.id)),goal=EX.filter(atGoal),withTempo=prac.filter(e=>e.tempo&&historyPoints(e.id).length);
  el.innerHTML=`<div class="intro"><div><div class="eyebrow">${esc(T('pr.eyebrow'))}</div><h1>${esc(T('pr.h1'))}</h1><p class="lead">${esc(T('pr.lead'))}</p></div>
    <div class="panel stats"><div class="stat"><b>${streak()}</b><span>${esc(T('td.streak'))}</span></div><div class="stat"><b>${bestStreak()}</b><span>${esc(T('pr.bestStreak'))}</span></div>
      <div class="stat"><b>${esc(fmtDur(week))}</b><span>${esc(T('pr.week'))}</span></div><div class="stat"><b>${esc(fmtDur(total))}</b><span>${esc(T('pr.total'))}</span></div>
      <div class="stat"><b>${prac.length}</b><span>${esc(T('pr.practised'))}</span></div><div class="stat"><b>${goal.length}</b><span>${esc(T('pr.atGoal'))}</span></div></div></div>
    <div class="panel"><h2>${esc(T('pr.cal'))}</h2>${heatmap(26)}<div class="legend heat-lg"><span>${esc(T('pr.less'))}</span><i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i><span>${esc(T('pr.more'))}</span></div></div>
    <div class="panel"><h2>${esc(T('pr.cats'))}</h2><div class="catbars">${CATS.map(c=>{const all=EX.filter(e=>e.cat===c);if(!all.length)return'';const p=all.filter(e=>practised(e.id)).length,g=all.filter(atGoal).length;
      return `<button type="button" class="catbar" data-catjump="${c}">${catIcon(c)}<span class="cb-name">${esc(T('cat.'+c))}</span><span class="bar two"><i class="p" style="width:${p/all.length*100}%"></i><i class="g" style="width:${g/all.length*100}%"></i></span><span class="mono small">${g}/${p}/${all.length}</span></button>`;}).join('')}</div>
      <p class="muted small">${esc(T('pr.catsKey'))}</p></div>
    <div class="panel"><div class="kicker"><h2>${esc(T('pr.tempo'))}</h2>${withTempo.length?`<select id="pr-ex" aria-label="${esc(T('pr.pick'))}">${withTempo.map(e=>`<option value="${e.id}">${esc(X(e.title))}</option>`).join('')}</select>`:''}</div><div id="pr-chart">${withTempo.length?'':`<p class="muted">${esc(T('pr.noTempo'))}</p>`}</div></div>
    <div class="panel"><h2>${esc(T('pr.backup'))}</h2><p>${esc(T('pr.backupP'))}</p><div class="btnrow"><button class="btn" type="button" id="pr-export">⇩ ${esc(T('pr.export'))}</button><label class="btn file">⇧ ${esc(T('pr.import'))}<input type="file" id="pr-import" accept="application/json,.json" hidden></label><button class="btn" type="button" id="pr-reset">${esc(T('pr.reset'))}</button></div><p class="muted small" id="pr-msg" aria-live="polite"></p></div>`;
  const draw=()=>{const id=$('pr-ex').value,e=BY[id];$('pr-chart').innerHTML=lineChart(historyPoints(id),e.tempo.goal,{aria:X(e.title)})+`<p><a href="#ex/${id}" data-ex="${id}">${esc(T('pr.open'))} →</a></p>`;};
  if(withTempo.length){$('pr-ex').onchange=draw;draw();}
  $('pr-export').onclick=()=>{saveDays();const data={app:'six-strings',version:1,exported:new Date().toISOString(),data:{}};
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('sixstrings:'))data.data[k]=localStorage.getItem(k);}}catch(e){}
    download('six-strings-backup-'+dayKey()+'.json',JSON.stringify(data,null,1));$('pr-msg').textContent=T('pr.exported');};
  $('pr-import').onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const d=JSON.parse(rd.result);if(d.app!=='six-strings'||!d.data)throw 0;
      if(!confirm(T('pr.importQ')))return;Object.keys(d.data).forEach(k=>{if(k.startsWith('sixstrings:'))localStorage.setItem(k,d.data[k]);});location.reload();}catch(x){$('pr-msg').textContent=T('pr.badFile');}};rd.readAsText(f);};
  $('pr-reset').onclick=()=>{if(!confirm(T('pr.resetQ')))return;LOG={};DAYS={};saveLog();saveDays();drawProgress();refreshCounts();};}

/* ========== TOOLS: metronome, tuner, recorder ========== */
function drawTools(){const el=$('tools');
  el.innerHTML=`<div class="intro"><div><div class="eyebrow">${esc(T('tl.eyebrow'))}</div><h1>${esc(T('tl.h1'))}</h1><p class="lead">${esc(T('tl.lead'))}</p></div>
    <div class="panel"><div class="btnrow"><a class="btn" href="#tools" data-scroll="tl-metro">${esc(T('tl.metro'))}</a><a class="btn" href="#tools" data-scroll="tl-tuner">${esc(T('tl.tuner'))}</a><a class="btn" href="#tools" data-scroll="tl-rec">${esc(T('tl.rec'))}</a></div><p class="muted small" style="margin-top:12px">${esc(T('tl.note'))}</p></div></div>
  <div class="panel" id="tl-metro"><h2>${esc(T('tl.metro'))}</h2>
    <div class="metro"><div class="mt-dots" id="mt-dots"></div>
      <div class="pl-top"><button class="btn primary big" type="button" id="mt-go"></button><div class="bpm"><button class="btn" type="button" data-mb="-1" aria-label="−1">−</button><div><b id="mt-bpm"></b><small>${esc(T('bpm'))}</small></div><button class="btn" type="button" data-mb="1" aria-label="+1">+</button></div><button class="btn" type="button" id="mt-tap">${esc(T('tap'))}</button></div>
      <input type="range" id="mt-range" min="30" max="260" aria-label="${esc(T('bpm'))}">
      <div class="controls"><div class="ctl"><span>${esc(T('tl.beats'))}</span><div class="seg" id="mt-beats"></div></div><div class="ctl"><span>${esc(T('tl.sub'))}</span><div class="seg" id="mt-sub"></div></div><div class="ctl"><span>${esc(T('tl.vol'))}</span><div class="seg" id="mt-vol"></div></div></div>
      <details class="trainer"><summary><label class="chk"><input type="checkbox" id="mt-train"> ${esc(T('opt.trainer'))}</label></summary>
        <div class="controls nums"><label>${esc(T('ex.start'))} <input type="number" id="mt-ts" min="30" max="260" value="${M.tStart}"></label><label>${esc(T('ex.goal'))} <input type="number" id="mt-tg" min="30" max="260" value="${M.tGoal}"></label><label>+ <input type="number" id="mt-tp" min="1" max="20" value="${M.tStep}"> ${esc(T('bpm'))}</label><label>${esc(T('tl.every'))} <input type="number" id="mt-te" min="1" max="32" value="${M.tEvery}"> ${esc(T('tl.bars'))}</label></div></details></div></div>
  <div class="panel" id="tl-tuner"><h2>${esc(T('tl.tuner'))}</h2><p>${esc(T('tu.p'))}</p>
    <div class="tuner"><div class="tu-note" id="tu-note">–</div><div class="tu-meter"><div class="tu-scale"><span>−50</span><span>0</span><span>+50</span></div><div class="tu-track"><i id="tu-needle"></i></div></div><div class="tu-read" id="tu-read" aria-live="polite">${esc(T('tu.off'))}</div>
      <div class="btnrow"><button class="btn primary" type="button" id="tu-go">🎤 ${esc(T('tu.start'))}</button></div>
      <h3>${esc(T('tu.ref'))}</h3><div class="seg" id="tu-ref"></div></div></div>
  <div class="panel" id="tl-rec"><h2>${esc(T('tl.rec'))}</h2><p>${esc(T('rc.p'))}</p><div class="btnrow"><button class="btn primary" type="button" id="rc-go">● ${esc(T('rc.start'))}</button><label class="chk"><input type="checkbox" id="rc-click"> ${esc(T('rc.click'))}</label><span class="mono" id="rc-time"></span></div>
    <ol class="takes" id="rc-takes"></ol></div>`;
  drawMetroState();drawMetroBpm();
  S.seg($('mt-beats'),[2,3,4,5,6,7].map(n=>({label:String(n),value:n})),M.beats,v=>{M.beats=v;store.set('px:mBeats',v);drawDots();});
  S.seg($('mt-sub'),[[1,'♩'],[2,'♪♪'],[3,'3'],[4,'♬♬']].map(([v,l])=>({label:l,value:v,title:T('sub.'+v)})),M.sub,v=>{M.sub=v;store.set('px:mSub',v);});
  S.seg($('mt-vol'),[[.5,T('vol.low')],[1,T('vol.mid')],[1.8,T('vol.high')]].map(([v,l])=>({label:l,value:v})),CLICKVOL,v=>{CLICKVOL=v;store.set('px:clickVol',v);});
  $('mt-go').onclick=()=>{if(M.on)S.stopSeq();else metroStart();};
  document.querySelectorAll('[data-mb]').forEach(b=>b.onclick=()=>{setMBpm(M.bpm+(+b.dataset.mb));});
  $('mt-range').oninput=e=>setMBpm(+e.target.value);$('mt-tap').onclick=()=>{const v=tapTempo(M.taps);if(v)setMBpm(v);};
  $('mt-train').onchange=e=>{M.trainer=e.target.checked;e.target.closest('details').open=M.trainer;};
  [['mt-ts','tStart'],['mt-tg','tGoal'],['mt-tp','tStep'],['mt-te','tEvery']].forEach(([id,k])=>$(id).onchange=e=>{M[k]=Math.max(1,+e.target.value||1);});
  S.seg($('tu-ref'),[0,1,2,3,4,5].map(s=>({label:S.strName(s),value:s})),-1,s=>{S.play(S.midiAt(s,0),0,.5);});
  $('tu-go').onclick=()=>{if(TU.on)tunerStop();else tunerStart();};drawTuner();
  $('rc-go').onclick=()=>{if(RC.rec)recStop();else recStart();};drawTakes();}
function drawDots(){const d=$('mt-dots');if(d)d.innerHTML=Array.from({length:M.beats},(_,i)=>`<i class="${i===0?'acc':''}"></i>`).join('');}
function setMBpm(v){M.bpm=Math.max(30,Math.min(260,Math.round(v)));store.set('px:mBpm',M.bpm);drawMetroBpm();}
function drawMetroBpm(){if($('mt-bpm')){$('mt-bpm').textContent=M.bpm;$('mt-range').value=M.bpm;}}
function drawMetroState(){const b=$('mt-go');if(!b)return;b.innerHTML=M.on?'■ '+esc(T('stop')):'<span class="ico"></span>'+esc(T('play'));drawDots();}

/* tuner: autocorrelation pitch detection on the microphone */
const TU={on:false,stream:null,an:null,buf:null,raf:0,hist:[]};
async function tunerStart(){const c=S.ac();if(!c||!navigator.mediaDevices){$('tu-read').textContent=T('tu.noMic');return;}
  try{TU.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});}catch(e){$('tu-read').textContent=T('tu.denied');return;}
  const src=c.createMediaStreamSource(TU.stream);TU.an=c.createAnalyser();TU.an.fftSize=4096;src.connect(TU.an);TU.buf=new Float32Array(TU.an.fftSize);TU.on=true;TU.hist=[];drawTuner();
  const loop=()=>{if(!TU.on)return;TU.an.getFloatTimeDomainData(TU.buf);const f=detectPitch(TU.buf,c.sampleRate);
    if(f){TU.hist.push(f);if(TU.hist.length>5)TU.hist.shift();const sorted=TU.hist.slice().sort((a,b)=>a-b),fm=sorted[Math.floor(sorted.length/2)];showPitch(fm);}
    TU.raf=requestAnimationFrame(loop);};loop();}
function tunerStop(){TU.on=false;cancelAnimationFrame(TU.raf);if(TU.stream)TU.stream.getTracks().forEach(t=>t.stop());TU.stream=null;drawTuner();}
S.tabHooks.push(t=>{if(t!=='tools'){if(TU.on)tunerStop();if(RC.rec)recStop();}});
function drawTuner(){const b=$('tu-go');if(!b)return;b.innerHTML=TU.on?'■ '+esc(T('tu.stop')):'🎤 '+esc(T('tu.start'));if(!TU.on){$('tu-note').textContent='–';$('tu-needle').style.left='50%';$('tu-needle').className='';$('tu-read').textContent=T('tu.off');}}
function detectPitch(buf,sr){let rms=0;for(let i=0;i<buf.length;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/buf.length);if(rms<.008)return null;
  const n=buf.length,minLag=Math.floor(sr/1400),maxLag=Math.floor(sr/60);let best=-1,bestLag=-1;const c=new Float32Array(maxLag+2);
  for(let lag=minLag;lag<=maxLag+1;lag++){let s=0,e1=0,e2=0;for(let i=0;i<n-lag;i++){s+=buf[i]*buf[i+lag];e1+=buf[i]*buf[i];e2+=buf[i+lag]*buf[i+lag];}c[lag]=s/Math.sqrt(e1*e2||1);}
  for(let lag=minLag+1;lag<=maxLag;lag++){if(c[lag]>c[lag-1]&&c[lag]>=c[lag+1]&&c[lag]>.85){bestLag=lag;best=c[lag];break;}}
  if(bestLag<0){for(let lag=minLag+1;lag<=maxLag;lag++)if(c[lag]>best){best=c[lag];bestLag=lag;}if(best<.75)return null;}
  const a=c[bestLag-1],b=c[bestLag],d=c[bestLag+1],shift=(a-d)/(2*(a-2*b+d)||1);return sr/(bestLag+(isFinite(shift)?shift:0));}
function showPitch(f){const m=69+12*Math.log2(f/440),near=Math.round(m),cents=Math.round((m-near)*100);
  const strs=[40,45,50,55,59,64],si=strs.reduce((bi,x,i)=>Math.abs(x-m)<Math.abs(strs[bi]-m)?i:bi,0),tgt=strs[si],tc=Math.round((m-tgt)*100);
  $('tu-note').textContent=S.noteS(near%12)+(Math.floor(near/12)-1);const nd=$('tu-needle');nd.style.left=(50+Math.max(-50,Math.min(50,cents)))+'%';nd.className=Math.abs(cents)<=5?'ok':'';
  $('tu-read').textContent=f.toFixed(1)+' Hz · '+(cents>0?'+':'')+cents+' cents · '+(Math.abs(tc)<=5?T('tu.inTune',{s:S.strName(si)}):Math.abs(tc)<300?T(tc<0?'tu.up':'tu.down',{s:S.strName(si)}):'');}

/* recorder: MediaRecorder takes, kept in memory until the page closes */
const RC={rec:null,stream:null,chunks:[],takes:[],t0:0,timer:0};
async function recStart(){if(!window.MediaRecorder||!navigator.mediaDevices){$('rc-time').textContent=T('tu.noMic');return;}
  try{RC.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});}catch(e){$('rc-time').textContent=T('tu.denied');return;}
  RC.chunks=[];RC.rec=new MediaRecorder(RC.stream);RC.rec.ondataavailable=e=>{if(e.data.size)RC.chunks.push(e.data);};
  RC.rec.onstop=()=>{const blob=new Blob(RC.chunks,{type:RC.rec&&RC.rec.mimeType||'audio/webm'}),sec=(performance.now()-RC.t0)/1000;RC.takes.unshift({url:URL.createObjectURL(blob),sec,at:new Date(),type:blob.type});RC.rec=null;drawTakes();};
  RC.rec.start();RC.t0=performance.now();if($('rc-click').checked)metroStart();
  RC.timer=setInterval(()=>{$('rc-time').textContent='● '+clock((performance.now()-RC.t0)/1000);},250);$('rc-go').innerHTML='■ '+esc(T('rc.stop'));}
function recStop(){clearInterval(RC.timer);if(M.on)metroStop();if(RC.rec&&RC.rec.state!=='inactive')RC.rec.stop();if(RC.stream)RC.stream.getTracks().forEach(t=>t.stop());RC.stream=null;
  addTime((performance.now()-RC.t0)/1000);if($('rc-go')){$('rc-go').innerHTML='● '+esc(T('rc.start'));$('rc-time').textContent='';}}
function drawTakes(){const el=$('rc-takes');if(!el)return;el.innerHTML=RC.takes.length?RC.takes.map((tk,i)=>`<li><span class="mono">${tk.at.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} · ${clock(tk.sec)}</span><audio controls src="${tk.url}"></audio><a class="btn" href="${tk.url}" download="six-strings-take-${i+1}.${/ogg/.test(tk.type)?'ogg':/mp4|aac/.test(tk.type)?'m4a':'webm'}">⇩</a></li>`).join(''):`<li class="muted">${esc(T('rc.none'))}</li>`;}

/* ---------- routing and wiring ---------- */
function refreshCounts(){const due=EX.filter(e=>isDue(e.id)).length;$('cnt-today').textContent=due?String(due):'';$('cnt-library').textContent=String(EX.length);
  $('cnt-routines').textContent='';$('cnt-progress').textContent=streak()?'🔥'+streak():'';}
const DRAW={today:drawToday,library:drawLibrary,routines:drawRoutines,progress:drawProgress,tools:drawTools};
S.tabHooks.push(t=>{if(DRAW[t])DRAW[t]();if(t!=='exercise'&&!RUN.r)P.onStop=null;refreshCounts();});
S.RENDER.push(()=>{const cur=S.TABS.find(x=>!$(x).hidden);if(cur==='exercise')drawEx();else if(DRAW[cur])DRAW[cur]();drawRunBar();refreshCounts();});
document.addEventListener('click',e=>{const a=e.target.closest('[data-ex],[data-go],[data-tool],[data-tagjump],[data-catjump],[data-scroll],[data-strum],#today [data-run]');if(!a)return;
  if(a.dataset.ex){e.preventDefault();openEx(a.dataset.ex);if(document.body.classList.contains('nav-open'))S.$('scrim').click();}
  else if(a.dataset.go){e.preventDefault();S.showTab(a.dataset.go);window.scrollTo({top:0});}
  else if(a.dataset.tool){if(a.dataset.tool==='tuner'||a.dataset.tool==='record'){S.showTab('tools');const id=a.dataset.tool==='tuner'?'tl-tuner':'tl-rec';requestAnimationFrame(()=>$(id).scrollIntoView({block:'start'}));}else S.openTool(a.dataset.tool);}
  else if(a.dataset.tagjump){Object.assign(F,{q:'',cat:'all',level:0,status:'all',tag:a.dataset.tagjump});S.showTab('library');window.scrollTo({top:0});}
  else if(a.dataset.catjump){Object.assign(F,{q:'',cat:a.dataset.catjump,level:0,status:'all',tag:''});S.showTab('library');window.scrollTo({top:0});}
  else if(a.dataset.scroll){e.preventDefault();$(a.dataset.scroll).scrollIntoView({behavior:'smooth',block:'start'});}
  else if(a.dataset.strum){const sh=CUR&&CUR.ex.chords[a.dataset.strum];if(sh)S.strum(sh);}
  else if(a.dataset.run){runStart(allRoutines().find(r=>r.id===a.dataset.run));}});
function route(){const h=decodeURIComponent((location.hash||'').slice(1)),m=/^ex\/(.+)$/.exec(h);if(m&&BY[m[1]]){if(!CUR||CUR.ex.id!==m[1])openEx(m[1]);return true;}return false;}
addEventListener('hashchange',route);
document.addEventListener('keydown',e=>{if(e.code!=='Space'||$('exercise').hidden||/INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY/.test(e.target.tagName))return;const b=$('pl-go');if(b){e.preventDefault();b.click();}});
if(!route()){const cur=S.TABS.find(x=>!$(x).hidden);if(!cur||cur==='exercise')S.showTab('today');else if(DRAW[cur])DRAW[cur]();}
refreshCounts();
})();
