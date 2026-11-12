#!/usr/bin/env node
/* Validates every exercises/*.js file: node tools/check-exercises.js [file ...] */
const fs=require('fs'),path=require('path'),vm=require('vm');
const Tab=require('../js/tab.js');
const CATS=['warmup','left','right','rhythm','fretboard','scales','chords','ear','improv','styles'];
const LEARN=['fretboard','intervals','scales','chords','keys','ear','jam'];
const TOOLS=['quiz','ear-iv','ear-chord','jam','tuner','record'];
const dir=path.join(__dirname,'..','exercises');
const files=process.argv.slice(2).length?process.argv.slice(2):fs.readdirSync(dir).filter(f=>f.endsWith('.js')).map(f=>path.join(dir,f));
let errors=0,total=0;const ids=new Map(),perCat={};
function err(id,msg){errors++;console.log('  ✗ '+id+': '+msg);}
function bi(o,k,id,arr){const v=o[k];if(!v||typeof v!=='object'){err(id,k+' must be {en,pt}');return;}
  ['en','pt'].forEach(l=>{const x=v[l];if(arr?!(Array.isArray(x)&&x.length&&x.every(s=>typeof s==='string'&&s.trim())):!(typeof x==='string'&&x.trim()))err(id,k+'.'+l+(arr?' must be a non-empty array of strings':' must be a non-empty string'));});
  if(arr&&v.en&&v.pt&&v.en.length!==v.pt.length)err(id,k+': en and pt have different lengths');}
for(const file of files){
  const ctx={window:{}};vm.createContext(ctx);
  try{vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});}catch(e){console.log(path.basename(file)+': fails to load: '+e.message);errors++;continue;}
  const list=ctx.window.SS_EXERCISES||[];console.log(path.basename(file)+': '+list.length+' exercises');
  for(const ex of list){total++;const id=ex.id||'(no id)';
    if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ex.id||''))err(id,'id must be kebab-case');
    if(ids.has(ex.id))err(id,'duplicate id (also in '+ids.get(ex.id)+')');ids.set(ex.id,path.basename(file));
    if(!CATS.includes(ex.cat))err(id,'cat must be one of '+CATS.join(', '));perCat[ex.cat]=(perCat[ex.cat]||0)+1;
    if(!(Number.isInteger(ex.level)&&ex.level>=1&&ex.level<=5))err(id,'level must be 1-5');
    if(!(Array.isArray(ex.tags)&&ex.tags.every(t=>/^[a-z0-9-]+$/.test(t))))err(id,'tags must be lowercase slugs');
    if(!(ex.minutes>0&&ex.minutes<=30))err(id,'minutes must be 1-30');
    bi(ex,'title',id);bi(ex,'goal',id);bi(ex,'how',id,true);if(ex.tips)bi(ex,'tips',id,true);
    if(ex.learn&&!LEARN.includes(ex.learn))err(id,'learn must be one of '+LEARN.join(', '));
    if(ex.tool&&!TOOLS.includes(ex.tool))err(id,'tool must be one of '+TOOLS.join(', '));
    if(!ex.tab&&!ex.tool)err(id,'needs a tab or a tool');
    if(ex.sub!=null&&![1,2,3,4,6].includes(ex.sub))err(id,'sub must be 1,2,3,4 or 6');
    if(ex.beats!=null&&![2,3,4,5,6,7,12].includes(ex.beats))err(id,'beats must be 2-7 or 12');
    if(ex.tab&&!ex.tempo)err(id,'an exercise with a tab needs tempo {start,goal,step}');
    if(ex.tempo){const t=ex.tempo;if(!(t.start>=30&&t.goal<=260&&t.start<t.goal&&t.step>=1&&t.step<=20))err(id,'tempo needs 30<=start<goal<=260 and step 1-20');}
    if(ex.chords)for(const[k,v]of Object.entries(ex.chords))if(!(Array.isArray(v)&&v.length===6&&v.every(f=>Number.isInteger(f)&&f>=-1&&f<=24)))err(id,'chord '+k+' must be 6 frets low E to high e, -1 = not played');
    const tabs=[];if(ex.tab)tabs.push(['tab',ex.tab]);(ex.vars||[]).forEach((v,i)=>{bi(v,'name',id+' vars['+i+']');if(!v.tab)err(id,'vars['+i+'] needs a tab');else tabs.push(['vars['+i+']',v.tab]);});
    for(const[where,tab]of tabs){const p=Tab.parse(tab,ex);p.errors.forEach(e=>err(id,where+': '+e));Tab.checkBars(p,ex).forEach(e=>err(id,where+': '+e));
      if(!p.events.length)err(id,where+' is empty');if(p.events.length>512)err(id,where+' is very long ('+p.events.length+' events)');}
  }}
console.log('\n'+total+' exercises, '+errors+' problems. By category: '+JSON.stringify(perCat));
process.exit(errors?1:0);
