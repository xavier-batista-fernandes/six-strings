/* Six Strings exercise tab format: parser shared by the app and tools/check-exercises.js.

   An exercise's `tab` is a string of space-separated tokens. Each timed token lasts one subdivision
   (the exercise's `sub`: 1 = quarter notes, 2 = 8ths, 3 = triplets, 4 = 16ths, 6 = 16th-note sextuplets).
   Strings are numbered like real tab: 1 = high e ... 6 = low E. Internally s = 6 - string (0 = low E).

   Timed tokens:
     3.5        string 3, fret 5
     3.5+2.5    several notes at once (a double stop or chord shape)
     6.x        muted (dead) note on string 6
     3.7h  3.7p  3.7s   hammer-on / pull-off / slide INTO this note (from the previous one)
     3.7b9      fret 7 bent up until it sounds like fret 9 (b8 = half step, b9 = whole step)
     3.7r       release a bend back down to fret 7
     3.7v       vibrato on the note       3.7m  palm-muted note        3.7>  accented note
                (suffixes can be combined: 3.7hv, 6.3m>)
     -          rest (silence)
     =          hold / let the previous notes ring
     D  U       down / up strum of the current chord;  D> U> accented;  X = muted (chucked) strum
     d  u       "ghost" strum: the hand moves but misses the strings (keeps the motion going)
   Untimed tokens:
     |          bar line (only for reading; the app checks bars add up to beats*sub when present)
     @G         switch the current chord to the shape named G in the exercise's `chords` map
*/
(function(root){
"use strict";
const NOTE_RE=/^([1-6])\.(\d{1,2}|x)([hpsrvm>]|b\d{1,2})*$/;
const SUF_RE=/[hpsrvm>]|b\d{1,2}/g;
function parseNote(tok){
  const m=NOTE_RE.exec(tok);if(!m)return null;
  const str=+m[1],s=6-str,mute=m[2]==='x',f=mute?0:+m[2];
  const n={s,f,str};if(mute)n.mute=true;
  const sufs=tok.slice(m[1].length+1+m[2].length).match(SUF_RE)||[];
  sufs.forEach(x=>{if(x[0]==='b'){n.bend=+x.slice(1);}else if(x==='h')n.tech='h';else if(x==='p')n.tech='p';else if(x==='s')n.tech='s';
    else if(x==='r')n.release=true;else if(x==='v')n.vib=true;else if(x==='m')n.pm=true;else if(x==='>')n.acc=true;});
  if(f>24)return null;if(n.bend!=null&&(n.bend<=f||n.bend>f+4))return null;
  return n;}
/* Returns {events, bars, errors}. events: [{type:'notes',notes:[...]}|{type:'rest'}|{type:'hold'}|{type:'strum',dir:'D'|'U',acc,ghost,mute,chord:name}].
   bars: indices into events where a written bar line falls. */
function parse(tab,ex){
  ex=ex||{};const errors=[],events=[],bars=[];const chords=ex.chords||{};let chord=null;
  String(tab||'').trim().split(/\s+/).filter(Boolean).forEach(tok=>{
    if(tok==='|'){bars.push(events.length);return;}
    if(tok[0]==='@'){const name=tok.slice(1);if(!chords[name])errors.push('unknown chord "'+name+'" (add it to chords)');chord=name;return;}
    if(tok==='-'){events.push({type:'rest'});return;}
    if(tok==='='){events.push({type:'hold'});return;}
    const sm=/^([DUdu]|X)(>?)$/.exec(tok);
    if(sm){const c=sm[1];if(!chord&&c!=='X'){const names=Object.keys(chords);if(names.length===1)chord=names[0];else errors.push('strum "'+tok+'" before any @chord');}
      events.push({type:'strum',dir:c==='X'?'D':c.toUpperCase(),ghost:c==='d'||c==='u',mute:c==='X',acc:!!sm[2],chord});return;}
    const parts=tok.split('+'),notes=parts.map(parseNote);
    if(notes.some(n=>!n)){errors.push('bad token "'+tok+'"');return;}
    const seen=new Set();notes.forEach(n=>{if(seen.has(n.s))errors.push('token "'+tok+'" uses string '+n.str+' twice');seen.add(n.s);});
    events.push({type:'notes',notes});});
  return {events,bars,errors};}
/* Checks that written bar lines fall every beats*sub events. */
function checkBars(p,ex){const per=(ex.beats||4)*(ex.sub||1),errs=[];let prev=0;
  p.bars.forEach(b=>{if(b===0)return;if(b-prev!==per)errs.push('bar ending at event '+b+' has '+(b-prev)+' subdivisions, expected '+per);prev=b;});
  if(p.bars.length&&p.events.length!==prev&&p.events.length-prev!==per)errs.push('last bar has '+(p.events.length-prev)+' subdivisions, expected '+per);
  return errs;}
const api={parse,parseNote,checkBars};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SSTab=api;
})(typeof window!=='undefined'?window:this);
