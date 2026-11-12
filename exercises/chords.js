/* Chords: open changes, progressions, barre, power chords, CAGED, triads, sevenths, arpeggios, colours. */
(function(){
"use strict";
const CH={
  G:[3,2,0,0,0,3], C:[-1,3,2,0,1,0], D:[-1,-1,0,2,3,2], A:[-1,0,2,2,2,0], E:[0,2,2,1,0,0],
  Em:[0,2,2,0,0,0], Am:[-1,0,2,2,1,0], Dm:[-1,-1,0,2,3,1],
  E7:[0,2,0,1,0,0], A7:[-1,0,2,0,2,0], D7:[-1,-1,0,2,1,2], G7:[3,2,0,0,0,1], C7:[-1,3,2,3,1,0], B7:[-1,2,1,2,0,2],
  Cmaj7:[-1,3,2,0,0,0], Fmaj7:[-1,-1,3,2,1,0], Am7:[-1,0,2,0,1,0], Em7:[0,2,0,0,0,0], Dm7:[-1,-1,0,2,1,1],
  F:[1,3,3,2,1,1], Bm:[-1,2,4,4,3,2], 'F#m':[2,4,4,2,2,2],
  Dsus4:[-1,-1,0,2,3,3], Dsus2:[-1,-1,0,2,3,0], Asus4:[-1,0,2,2,3,0], Asus2:[-1,0,2,2,0,0], Esus4:[0,2,2,2,0,0],
  Cadd9:[-1,3,2,0,3,0]
};
function pick(){const o={};for(const n of arguments)o[n]=CH[n];return o;}
function prog(chords,pat){return chords.map(c=>'@'+c+' '+pat+' |').join(' ');}
function rep(s,n){return Array(n).fill(s).join(' ');}
/* frets low E -> high e (-1 = not played) to a '6.3+5.2+...' token */
function sh(fr){return fr.map((f,i)=>f<0?null:(6-i)+'.'+f).filter(Boolean).join('+');}
/* each shape held for one 4/4 bar of quarter notes: struck on 1 and 3 */
function held(shapes){return shapes.map(s=>sh(s)+' = '+sh(s)+' = |').join(' ');}
/* strings one by one, then together (sub 1, 4/4) */
function check(fr){const notes=fr.map((f,i)=>f<0?null:(6-i)+'.'+f).filter(Boolean);
  while(notes.length%4)notes.push('=');const bars=[];for(let i=0;i<notes.length;i+=4)bars.push(notes.slice(i,i+4).join(' ')+' |');
  return bars.join(' ')+' '+sh(fr)+' = = = |';}
/* triad: three notes one by one, then together */
function tri(a){return a.join(' ')+' '+a.join('+')+' |';}

function changes(id,level,a,b,others,extraTips){
  const all=[a,b].concat(...others);const chords={};all.forEach(n=>chords[n]=CH[n]);
  const t=(x,y)=>prog([x,y,x,y],'D D D D');
  return {
    id:'chords-change-'+id, cat:'chords', level, tags:['open-chords','changes'], minutes:5,
    title:{en:'Changes: {c:'+a+'} and {c:'+b+'}',pt:'Mudanças: {c:'+a+'} e {c:'+b+'}'},
    goal:{en:'Switch between {c:'+a+'} and {c:'+b+'} on the beat without stopping the strum.',pt:'Mudar entre {c:'+a+'} e {c:'+b+'} a tempo sem parar a batida.'},
    how:{en:['Strum {c:'+a+'} four times, then {c:'+b+'} four times, one strum per click.','Lift all fingers together and place them together, landing on beat 1.','One-minute challenge: with no click, switch back and forth for one minute and count the clean changes.','Write the number down and try to beat it next time.'],
         pt:['Toca {c:'+a+'} quatro vezes e depois {c:'+b+'} quatro vezes, uma batida por clique.','Levanta os dedos todos juntos e pousa-os juntos, a cair no tempo 1.','Desafio de um minuto: sem metrónomo, muda de um para o outro durante um minuto e conta as mudanças limpas.','Escreve o número e tenta batê-lo na próxima vez.']},
    tips:{en:['Look for a finger that stays put or slides along a string: it is your anchor.'].concat(extraTips?[extraTips.en]:[]),
          pt:['Procura um dedo que fica no sítio ou desliza pela mesma corda: é a tua âncora.'].concat(extraTips?[extraTips.pt]:[])},
    sub:1, tempo:{start:50,goal:100,step:5}, chords, learn:'chords',
    tab:t(a,b),
    vars:others.map(p=>({name:{en:p[0]+' - '+p[1],pt:p[0]+' - '+p[1]},tab:t(p[0],p[1])}))
  };}

window.SS_EXERCISES=window.SS_EXERCISES||[];
window.SS_EXERCISES.push(
changes('em-am',1,'Em','Am',[['E','Am'],['Em','D']],{en:'From {c:Em} to {c:Am} the shape keeps its form and moves one string over.',pt:'De {c:Em} para {c:Am} a forma mantém-se e passa uma corda para baixo.'}),
changes('a-d',1,'A','D',[['A','E'],['D','E']]),
changes('g-c',1,'G','C',[['G','Em'],['C','Am']],{en:'{c:C} to {c:Am}: only one finger moves.',pt:'De {c:C} para {c:Am}: só um dedo se mexe.'}),
changes('c-d',2,'C','D',[['G','D'],['D','Em']]),
changes('am-dm',2,'Am','Dm',[['Dm','E'],['C','Dm']]),
changes('sevenths',2,'A7','D7',[['E7','A'],['B7','Em'],['G7','C']],{en:'For {c:B7} to {c:Em}, the 2nd finger stays on fret 2 of the 5th string.',pt:'De {c:B7} para {c:Em}, o dedo 2 fica no traste 2 da 5.ª corda.'}),
{
  id:'chords-change-half-bar', cat:'chords', level:3, tags:['open-chords','changes','strumming'], minutes:6,
  title:{en:'Two chords per bar',pt:'Dois acordes por compasso'},
  goal:{en:'Change chords every two beats while keeping an 8th-note strum going.',pt:'Mudar de acorde a cada dois tempos mantendo uma batida em colcheias.'},
  how:{en:['Strum "down, down-up" on each chord: two beats each.','The last up strum before each change can be played on open strings while the fingers move.','Keep the hand moving no matter what.'],
       pt:['Toca "baixo, baixo-cima" em cada acorde: dois tempos cada.','A última batida para cima antes de cada mudança pode ser em cordas soltas enquanto os dedos se mexem.','Mantém a mão a mexer aconteça o que acontecer.']},
  tips:{en:['Open strings on that last up strum are normal: everyone does it.'],pt:['As cordas soltas nessa última batida para cima são normais: toda a gente o faz.']},
  sub:2, tempo:{start:50,goal:110,step:5}, chords:pick('G','C','D','Em','Am'),
  tab:'@G D - D U @C D - D U | @D D - D U @G D - D U | @Em D - D U @C D - D U | @D D - D U @G D - D U |',
  vars:[{name:{en:'Am-C-G-D',pt:'Am-C-G-D'},tab:'@Am D - D U @C D - D U | @G D - D U @D D - D U | @Am D - D U @C D - D U | @G D - D U @Em D - D U |'}]
},
{
  id:'chords-prog-pop', cat:'chords', level:2, tags:['open-chords','changes','strumming'], minutes:8,
  title:{en:'I-V-vi-IV progression',pt:'Progressão I-V-vi-IV'},
  goal:{en:'Play the most common four-chord progression in more than one key.',pt:'Tocar a progressão de quatro acordes mais comum em mais do que uma tonalidade.'},
  how:{en:['In the key of {n:G} the chords are {c:G}, {c:D}, {c:Em} and {c:C}.','Play one bar of each with "down, down-up, up-down-up".','The roman numerals say which step of the scale each chord is built on, so the same pattern works in any key.'],
       pt:['Na tonalidade de {n:G} os acordes são {c:G}, {c:D}, {c:Em} e {c:C}.','Toca um compasso de cada um com "baixo, baixo-cima, cima-baixo-cima".','Os números romanos dizem em que grau da escala está cada acorde, por isso o mesmo padrão funciona em qualquer tonalidade.']},
  sub:2, tempo:{start:60,goal:120,step:5}, learn:'keys', chords:pick('G','D','Em','C','Am','Fmaj7','A','Bm'),
  tab:prog(['G','D','Em','C'],'D - D U - U D U'),
  vars:[
    {name:{en:'Key of C (with Fmaj7)',pt:'Tonalidade de C (com Fmaj7)'},tab:prog(['C','G','Am','Fmaj7'],'D - D U - U D U')},
    {name:{en:'Key of D (with Bm)',pt:'Tonalidade de D (com Bm)'},tab:prog(['D','A','Bm','G'],'D - D U - U D U')},
    {name:{en:'vi-IV-I-V order',pt:'Ordem vi-IV-I-V'},tab:prog(['Em','C','G','D'],'D - D U - U D U')}
  ]
},
{
  id:'chords-prog-ballad', cat:'chords', level:2, tags:['open-chords','changes'], minutes:6,
  title:{en:'I-vi-IV-V progression',pt:'Progressão I-vi-IV-V'},
  goal:{en:'Play the classic ballad progression smoothly in 3/4 and 4/4 feel.',pt:'Tocar a progressão clássica de balada de forma fluida.'},
  how:{en:['In {n:G}: {c:G}, {c:Em}, {c:C}, {c:D}.','Strum a big down stroke on 1 then light 8ths.','Try the variation in {n:C} with {c:Dm} instead of {c:F}.'],
       pt:['Em {n:G}: {c:G}, {c:Em}, {c:C}, {c:D}.','Faz uma batida forte para baixo no 1 e depois colcheias leves.','Experimenta a variação em {n:C} com {c:Dm} em vez de {c:F}.']},
  sub:2, tempo:{start:60,goal:110,step:5}, learn:'keys', chords:pick('G','Em','C','D','Am','Dm','G7'),
  tab:prog(['G','Em','C','D'],'D> - D U D U D U'),
  vars:[{name:{en:'Key of C: C-Am-Dm-G7',pt:'Tonalidade de C: C-Am-Dm-G7'},tab:prog(['C','Am','Dm','G7'],'D> - D U D U D U')}]
},
{
  id:'chords-prog-minor', cat:'chords', level:2, tags:['open-chords','changes','minor'], minutes:6,
  title:{en:'Descending minor progression',pt:'Progressão menor descendente'},
  goal:{en:'Play a minor-key progression that ends on a strong dominant chord.',pt:'Tocar uma progressão em tom menor que acaba num acorde dominante forte.'},
  how:{en:['In {n:A} minor: {c:Am}, {c:G}, {c:Fmaj7}, {c:E}.','Listen to how {c:E} pulls back to {c:Am}.','Keep the strum steady and let the last chord ring for a whole bar.'],
       pt:['Em {n:A} menor: {c:Am}, {c:G}, {c:Fmaj7}, {c:E}.','Ouve como o {c:E} puxa de volta para o {c:Am}.','Mantém a batida regular e deixa o último acorde soar um compasso inteiro.']},
  sub:2, tempo:{start:60,goal:110,step:5}, learn:'keys', chords:pick('Am','G','Fmaj7','E','Em','D','C','B7'),
  tab:prog(['Am','G','Fmaj7','E'],'D - D U - U D U'),
  vars:[{name:{en:'Em-D-C-B7',pt:'Em-D-C-B7'},tab:prog(['Em','D','C','B7'],'D - D U - U D U')}]
},
{
  id:'chords-prog-blues-e', cat:'chords', level:2, tags:['open-chords','blues','sevenths','changes'], minutes:8,
  title:{en:'12-bar blues in E',pt:'Blues de 12 compassos em E'},
  goal:{en:'Play the 12-bar blues form with open seventh chords.',pt:'Tocar a forma do blues de 12 compassos com acordes de sétima abertos.'},
  how:{en:['The chords are {c:E7}, {c:A7} and {c:B7}.','Order: four bars {c:E7}, two {c:A7}, two {c:E7}, then {c:B7}, {c:A7}, {c:E7}, {c:B7}.','Count the bars out loud the first few times.'],
       pt:['Os acordes são {c:E7}, {c:A7} e {c:B7}.','Ordem: quatro compassos de {c:E7}, dois de {c:A7}, dois de {c:E7}, depois {c:B7}, {c:A7}, {c:E7}, {c:B7}.','Conta os compassos em voz alta nas primeiras vezes.']},
  tips:{en:['The last {c:B7} is the "turnaround": it sends you back to the top.'],pt:['O último {c:B7} é a "volta": manda-te de novo para o início.']},
  sub:2, tempo:{start:60,goal:120,step:5}, learn:'keys', chords:pick('E7','A7','B7','D7','G7','C7'),
  tab:prog(['E7','E7','E7','E7','A7','A7','E7','E7','B7','A7','E7','B7'],'D - D U D - D U'),
  vars:[{name:{en:'In G: G7-C7-D7',pt:'Em G: G7-C7-D7'},tab:prog(['G7','G7','G7','G7','C7','C7','G7','G7','D7','C7','G7','D7'],'D - D U D - D U')}]
},
{
  id:'chords-keys-three-chord', cat:'chords', level:2, tags:['open-chords','changes'], minutes:6,
  title:{en:'I-IV-V in five keys',pt:'I-IV-V em cinco tonalidades'},
  goal:{en:'Find the three main chords of a key and play them in several keys.',pt:'Encontrar os três acordes principais de uma tonalidade e tocá-los em várias tonalidades.'},
  how:{en:['The I, IV and V chords are built on the 1st, 4th and 5th notes of the major scale.','In {n:G} they are {c:G}, {c:C} and {c:D}.','Play I-IV-I-V, then try the other keys in the variations.'],
       pt:['Os acordes I, IV e V estão construídos sobre a 1.ª, a 4.ª e a 5.ª notas da escala maior.','Em {n:G} são {c:G}, {c:C} e {c:D}.','Toca I-IV-I-V e depois experimenta as outras tonalidades nas variações.']},
  sub:2, tempo:{start:60,goal:120,step:5}, learn:'keys', chords:pick('G','C','D','A','E','B7','F'),
  tab:prog(['G','C','G','D'],'D - D U - U D U'),
  vars:[
    {name:{en:'Key of D',pt:'Tonalidade de D'},tab:prog(['D','G','D','A'],'D - D U - U D U')},
    {name:{en:'Key of A',pt:'Tonalidade de A'},tab:prog(['A','D','A','E'],'D - D U - U D U')},
    {name:{en:'Key of E',pt:'Tonalidade de E'},tab:prog(['E','A','E','B7'],'D - D U - U D U')},
    {name:{en:'Key of C (barre F)',pt:'Tonalidade de C (F com pestana)'},tab:prog(['C','F','C','G'],'D - D U - U D U')}
  ]
},
{
  id:'chords-keys-diatonic-g', cat:'chords', level:3, tags:['open-chords','barre','major'], minutes:8,
  title:{en:'Every chord in the key of G',pt:'Todos os acordes da tonalidade de G'},
  goal:{en:'Play and hear the seven chords that belong to the key of {n:G}.',pt:'Tocar e ouvir os sete acordes que pertencem à tonalidade de {n:G}.'},
  how:{en:['Walk up the scale with one chord per bar: {c:G}, {c:Am}, {c:Bm}, {c:C}, {c:D}, {c:Em}, {c:F#m7b5}, {c:G}.','Notice the pattern: major, minor, minor, major, major, minor, diminished.','This pattern is the same in every major key.'],
       pt:['Sobe pela escala com um acorde por compasso: {c:G}, {c:Am}, {c:Bm}, {c:C}, {c:D}, {c:Em}, {c:F#m7b5}, {c:G}.','Repara no padrão: maior, menor, menor, maior, maior, menor, diminuto.','Este padrão é igual em todas as tonalidades maiores.']},
  sub:1, tempo:{start:60,goal:110,step:5}, learn:'keys',
  chords:{G:CH.G,Am:CH.Am,Bm:CH.Bm,C:CH.C,D:CH.D,Em:CH.Em,'F#m7b5':[2,-1,2,2,1,-1]},
  tab:prog(['G','Am','Bm','C','D','Em','F#m7b5','G'],'D D D D'),
  vars:[{name:{en:'Back down',pt:'A descer'},tab:prog(['G','F#m7b5','Em','D','C','Bm','Am','G'],'D D D D')}]
},
{
  id:'chords-barre-f-check', cat:'chords', level:3, tags:['barre'], minutes:5,
  title:{en:'F barre string check',pt:'Verificar o F com pestana corda a corda'},
  goal:{en:'Make every string of the {c:F} barre chord ring clearly.',pt:'Fazer soar limpa cada corda do acorde {c:F} com pestana.'},
  how:{en:['Lay the 1st finger flat across fret 1 and add the {c:E} shape with fingers 2, 3 and 4.','Pick each string on its own, from the 6th to the 1st.','If one buzzes, adjust that finger and play it again, then strum all six.'],
       pt:['Deita o dedo 1 sobre o traste 1 e junta a forma de {c:E} com os dedos 2, 3 e 4.','Toca cada corda sozinha, da 6.ª à 1.ª.','Se alguma zumbir, ajusta esse dedo e volta a tocá-la; depois toca as seis juntas.']},
  tips:{en:['Roll the 1st finger slightly onto its bony side.','Pull back with the arm a little instead of squeezing harder with the thumb.','Keep the barre close to the fret wire.'],
        pt:['Roda um pouco o dedo 1 para o lado mais ossudo.','Puxa ligeiramente com o braço em vez de apertar mais com o polegar.','Mantém a pestana perto do traste.']},
  sub:1, tempo:{start:40,goal:80,step:4}, learn:'chords',
  tab:check([1,3,3,2,1,1]),
  vars:[{name:{en:'{c:Bm} (A-minor shape)',pt:'{c:Bm} (forma de Am)'},tab:check([-1,2,4,4,3,2])},{name:{en:'{c:F#m} (E-minor shape)',pt:'{c:F#m} (forma de Em)'},tab:check([2,4,4,2,2,2])}]
},
{
  id:'chords-barre-f-build', cat:'chords', level:2, tags:['barre','open-chords'], minutes:5,
  title:{en:'Building up to F',pt:'Chegar ao F aos poucos'},
  goal:{en:'Get to the full {c:F} barre in three steps, each a little harder.',pt:'Chegar ao {c:F} completo com pestana em três passos, cada um um pouco mais difícil.'},
  how:{en:['Bar 1: {c:Fmaj7}, no barre at all.','Bar 2: small {c:F}, the 1st finger covers only strings 1 and 2.','Bar 3: full {c:F}, the 1st finger covers all six strings.','Stay on the step that sounds clean and move on when it is easy.'],
       pt:['Compasso 1: {c:Fmaj7}, sem pestana.','Compasso 2: {c:F} pequeno, o dedo 1 só prende a 1.ª e a 2.ª cordas.','Compasso 3: {c:F} completo, o dedo 1 prende as seis cordas.','Fica no passo que soa limpo e avança quando estiver fácil.']},
  sub:1, tempo:{start:50,goal:90,step:5}, learn:'chords',
  tab:held([[-1,-1,3,2,1,0],[-1,-1,3,2,1,1],[1,3,3,2,1,1],[-1,3,2,0,1,0]])
},
changes('c-f',3,'C','F',[['Am','F'],['F','G'],['Dm','F']],{en:'Keep the 3rd and 2nd fingers in the same relative shape when moving from {c:C} to {c:F}.',pt:'Mantém os dedos 3 e 2 na mesma forma ao passar de {c:C} para {c:F}.'}),
{
  id:'chords-barre-e-shape', cat:'chords', level:3, tags:['barre','changes'], minutes:8,
  title:{en:'E-shape barre up the neck',pt:'Pestana com forma de E pelo braço acima'},
  goal:{en:'Move one barre shape to make different chords, naming each from the 6th-string root.',pt:'Mudar uma forma de pestana para fazer acordes diferentes, nomeando cada um pela tónica na 6.ª corda.'},
  how:{en:['The note under your 1st finger on the 6th string names the chord.','Fret 1 is {c:F}, fret 3 is {c:G}, fret 5 is {c:A}, fret 8 is {c:C}.','Keep the hand shape frozen while you slide between frets.','Ease the pressure during the move, squeeze again when you land.'],
       pt:['A nota debaixo do dedo 1 na 6.ª corda dá o nome ao acorde.','Traste 1 é {c:F}, traste 3 é {c:G}, traste 5 é {c:A}, traste 8 é {c:C}.','Mantém a forma da mão congelada enquanto deslizas entre trastes.','Alivia a pressão durante a mudança e aperta de novo quando chegares.']},
  sub:2, tempo:{start:50,goal:100,step:5}, learn:'fretboard',
  chords:{F:[1,3,3,2,1,1],G:[3,5,5,4,3,3],A:[5,7,7,6,5,5],C:[8,10,10,9,8,8],'F#m':[2,4,4,2,2,2],Gm:[3,5,5,3,3,3],Am:[5,7,7,5,5,5],Bm:[7,9,9,7,7,7]},
  tab:prog(['F','G','A','C'],'D - D U - U D U'),
  vars:[
    {name:{en:'Minor shape: F#m-Gm-Am-Bm',pt:'Forma menor: F#m-Gm-Am-Bm'},tab:prog(['F#m','Gm','Am','Bm'],'D - D U - U D U')},
    {name:{en:'Major to minor: A-Am-G-Gm',pt:'Maior para menor: A-Am-G-Gm'},tab:prog(['A','Am','G','Gm'],'D - D U - U D U')}
  ]
},
{
  id:'chords-barre-a-shape', cat:'chords', level:3, tags:['barre','changes'], minutes:8,
  title:{en:'A-shape barre up the neck',pt:'Pestana com forma de A pelo braço acima'},
  goal:{en:'Play major and minor barre chords with the root on the 5th string.',pt:'Tocar acordes maiores e menores com pestana e tónica na 5.ª corda.'},
  how:{en:['Barre with the 1st finger from the 5th string and fret the {c:A} shape two frets higher.','Many players use the 3rd finger flat across strings 4, 3 and 2.','Fret 1 is {c:Bb}, fret 3 is {c:C}, fret 5 is {c:D}.','In the minor variation the shape is {c:Am} with a barre.'],
       pt:['Faz pestana com o dedo 1 a partir da 5.ª corda e a forma de {c:A} dois trastes acima.','Muitos guitarristas deitam o dedo 3 sobre a 4.ª, 3.ª e 2.ª cordas.','Traste 1 é {c:Bb}, traste 3 é {c:C}, traste 5 é {c:D}.','Na variação menor a forma é a do {c:Am} com pestana.']},
  tips:{en:['Mute the 6th string with the tip of the 1st finger.'],pt:['Abafa a 6.ª corda com a ponta do dedo 1.']},
  sub:2, tempo:{start:50,goal:100,step:5}, learn:'fretboard',
  chords:{Bb:[-1,1,3,3,3,1],C:[-1,3,5,5,5,3],D:[-1,5,7,7,7,5],Bm:[-1,2,4,4,3,2],Cm:[-1,3,5,5,4,3],Dm:[-1,5,7,7,6,5],Em:[-1,7,9,9,8,7]},
  tab:prog(['C','D','Bb','C'],'D - D U - U D U'),
  vars:[{name:{en:'Minor shape: Bm-Cm-Dm-Em',pt:'Forma menor: Bm-Cm-Dm-Em'},tab:prog(['Bm','Cm','Dm','Em'],'D - D U - U D U')}]
},
{
  id:'chords-barre-mixed', cat:'chords', level:4, tags:['barre','changes'], minutes:8,
  title:{en:'Barre chords only',pt:'Só acordes com pestana'},
  goal:{en:'Change between E-shape and A-shape barre chords in a real progression.',pt:'Mudar entre pestanas com forma de E e de A numa progressão a sério.'},
  how:{en:['{c:Bm} at fret 2 (A-minor shape), {c:G} at fret 3 (E shape), {c:D} at fret 5 (A shape), {c:A} at fret 5 (E shape).','Find the shortest route between shapes: the 1st finger moves the least.','Strum the pattern and change on beat 1.'],
       pt:['{c:Bm} no traste 2 (forma de Am), {c:G} no traste 3 (forma de E), {c:D} no traste 5 (forma de A), {c:A} no traste 5 (forma de E).','Procura o caminho mais curto entre formas: o dedo 1 é o que menos se mexe.','Toca o padrão e muda no tempo 1.']},
  sub:2, tempo:{start:60,goal:110,step:5},
  chords:{Bm:[-1,2,4,4,3,2],G:[3,5,5,4,3,3],D:[-1,5,7,7,7,5],A:[5,7,7,6,5,5],'F#m':[2,4,4,2,2,2],E:[-1,7,9,9,9,7]},
  tab:prog(['Bm','G','D','A'],'D - D U - U D U'),
  vars:[{name:{en:'D-A-Bm-F#m-G-D-G-A',pt:'D-A-Bm-F#m-G-D-G-A'},tab:prog(['D','A','Bm','F#m','G','D','G','A'],'D - D U - U D U')}]
},
{
  id:'chords-barre-seventh-blues', cat:'chords', level:4, tags:['barre','sevenths','blues'], minutes:8,
  title:{en:'Blues with barre seventh chords',pt:'Blues com acordes de sétima com pestana'},
  goal:{en:'Play a 12-bar blues in {n:A} with movable seventh shapes around fret 5.',pt:'Tocar um blues de 12 compassos em {n:A} com formas móveis de sétima à volta do traste 5.'},
  how:{en:['{c:A7}: E shape at fret 5 with the 4th finger off. {c:D7}: A shape at fret 5. {c:E7}: A shape at fret 7.','All three chords sit within three frets: the hand barely moves.','Use a shuffle-like feel, accenting beats 2 and 4.'],
       pt:['{c:A7}: forma de E no traste 5 sem o dedo 4. {c:D7}: forma de A no traste 5. {c:E7}: forma de A no traste 7.','Os três acordes estão em três trastes: a mão quase não se mexe.','Toca com sensação de shuffle, com acentos no 2 e no 4.']},
  sub:2, tempo:{start:60,goal:120,step:5},
  chords:{A7:[5,7,5,6,5,5],D7:[-1,5,7,5,7,5],E7:[-1,7,9,7,9,7]},
  tab:prog(['A7','A7','A7','A7','D7','D7','A7','A7','E7','D7','A7','E7'],'D U D> U D U D> U'),
  vars:[{name:{en:'Quick change to IV in bar 2',pt:'Mudança rápida para o IV no compasso 2'},tab:prog(['A7','D7','A7','A7','D7','D7','A7','A7','E7','D7','A7','E7'],'D U D> U D U D> U')}]
},
{
  id:'chords-barre-minor7-groove', cat:'chords', level:4, tags:['barre','sevenths','minor','funk'], minutes:6,
  title:{en:'Minor 7 barre groove',pt:'Groove com m7 e pestana'},
  goal:{en:'Switch between movable minor 7 shapes with a muted-chuck groove.',pt:'Mudar entre formas móveis de m7 com um groove de abafados.'},
  how:{en:['{c:Am7}: E-minor shape at fret 5 with the 4th finger off.','{c:Dm7} at fret 5 and {c:Em7} at fret 7: A-minor 7 shape.','Chuck (X) on 2 and 4 and keep the chords short.'],
       pt:['{c:Am7}: forma de Em no traste 5 sem o dedo 4.','{c:Dm7} no traste 5 e {c:Em7} no traste 7: forma de Am7.','Abafa (X) no 2 e no 4 e mantém os acordes curtos.']},
  sub:2, tempo:{start:70,goal:120,step:5},
  chords:{Am7:[5,7,5,5,5,5],Dm7:[-1,5,7,5,6,5],Em7:[-1,7,9,7,8,7]},
  tab:prog(['Am7','Dm7','Am7','Em7'],'D - X U - U X U'),
  vars:[{name:{en:'Two chords per bar',pt:'Dois acordes por compasso'},tab:'@Am7 D - X U @Dm7 - U X U | @Am7 D - X U @Em7 - U X U |'}]
},
{
  id:'chords-power-root6', cat:'chords', level:1, tags:['rock','muting'], minutes:5,
  title:{en:'Power chords on the 6th string',pt:'Power chords na 6.ª corda'},
  goal:{en:'Play two-note power chords and move them along the 6th string.',pt:'Tocar power chords de duas notas e mudá-los ao longo da 6.ª corda.'},
  how:{en:['Put the 1st finger on the 6th string and the 3rd finger two frets higher on the 5th string.','Pick only those two strings with down strokes.','The 6th-string note names the chord: fret 3 is {c:G5}, fret 5 is {c:A5}, fret 8 is {c:C5}.'],
       pt:['Põe o dedo 1 na 6.ª corda e o dedo 3 dois trastes acima na 5.ª corda.','Toca só essas duas cordas com palhetadas para baixo.','A nota da 6.ª corda dá o nome ao acorde: traste 3 é {c:G5}, traste 5 é {c:A5}, traste 8 é {c:C5}.']},
  tips:{en:['Let the underside of the 1st finger touch the 4th string to mute it.'],pt:['Deixa a parte de baixo do dedo 1 tocar na 4.ª corda para a abafar.']},
  sub:2, tempo:{start:60,goal:140,step:5}, learn:'fretboard',
  tab:rep('6.0+5.2',8)+' | '+rep('6.3+5.5',8)+' | '+rep('6.5+5.7',8)+' | '+rep('6.3+5.5',4)+' '+rep('6.8+5.10',4)+' |'
},
{
  id:'chords-power-strings', cat:'chords', level:2, tags:['rock','changes'], minutes:6,
  title:{en:'Power chords across two strings',pt:'Power chords em duas cordas'},
  goal:{en:'Jump between 6th- and 5th-string power chords without moving the hand far.',pt:'Saltar entre power chords na 6.ª e na 5.ª corda sem afastar muito a mão.'},
  how:{en:['{c:G5} is fret 3 on the 6th string; {c:C5} is the same shape one string over at fret 3.','{c:D5} is fret 5 on the 5th string, {c:A5} fret 5 on the 6th.','Move the shape as one unit.'],
       pt:['{c:G5} está no traste 3 da 6.ª corda; {c:C5} é a mesma forma uma corda abaixo, no traste 3.','{c:D5} está no traste 5 da 5.ª corda e {c:A5} no traste 5 da 6.ª.','Mexe a forma como um só bloco.']},
  sub:2, tempo:{start:60,goal:140,step:5}, learn:'fretboard',
  tab:rep('6.3+5.5',8)+' | '+rep('5.3+4.5',8)+' | '+rep('5.5+4.7',8)+' | '+rep('6.5+5.7',8)+' |',
  vars:[{name:{en:'Three-note shapes (with octave)',pt:'Formas de três notas (com oitava)'},tab:rep('6.3+5.5+4.5',8)+' | '+rep('5.3+4.5+3.5',8)+' | '+rep('5.5+4.7+3.7',8)+' | '+rep('6.5+5.7+4.7',8)+' |'}]
},
{
  id:'chords-power-slides', cat:'chords', level:3, tags:['rock','muting'], minutes:6,
  title:{en:'Sliding power chords',pt:'Power chords a deslizar'},
  goal:{en:'Slide a power chord shape into the next chord in time.',pt:'Deslizar uma forma de power chord para o acorde seguinte a tempo.'},
  how:{en:['Play palm-muted 8ths on {c:E5}.','At the end of the bar slide the {c:G5} shape up to {c:A5} without picking again.','Keep enough pressure for the notes to keep sounding through the slide.'],
       pt:['Toca colcheias abafadas em {c:E5}.','No fim do compasso desliza a forma de {c:G5} até {c:A5} sem voltar a palhetar.','Mantém pressão suficiente para as notas continuarem a soar durante o deslize.']},
  sub:2, tempo:{start:60,goal:130,step:5},
  tab:rep('6.0m+5.2m',6)+' 6.3+5.5 6.5s+5.7s | '+rep('6.0m+5.2m',6)+' 6.5+5.7 6.3s+5.5s | '+rep('6.0m+5.2m',4)+' 5.5+4.7 = 5.3s+4.5s = | 6.0+5.2 = = = - - - - |'
},
{
  id:'chords-caged-c', cat:'chords', level:4, tags:['caged','positions','barre'], minutes:10,
  title:{en:'CAGED: one chord, five shapes',pt:'CAGED: um acorde, cinco formas'},
  goal:{en:'Play the same chord in five places on the neck using the C, A, G, E and D shapes.',pt:'Tocar o mesmo acorde em cinco sítios do braço com as formas C, A, G, E e D.'},
  how:{en:['{c:C} as an open {c:C}, then the {c:A} shape at fret 3, the {c:G} shape at fret 5, the {c:E} shape at fret 8 and the {c:D} shape at fret 10.','Each shape shares notes with the next: look for the roots that overlap.','Pick the notes one by one if the full shape is hard, then strike it together.'],
       pt:['{c:C} como {c:C} aberto, depois a forma de {c:A} no traste 3, a de {c:G} no traste 5, a de {c:E} no traste 8 e a de {c:D} no traste 10.','Cada forma partilha notas com a seguinte: procura as tónicas que se sobrepõem.','Se a forma completa for difícil, toca as notas uma a uma e depois todas juntas.']},
  tips:{en:['The {c:G} shape is a big stretch: play only strings 1 to 4 of it at first.','Say the shape name as you play it.'],pt:['A forma de {c:G} é uma grande abertura: ao princípio toca só da 1.ª à 4.ª corda.','Diz o nome da forma enquanto a tocas.']},
  sub:1, tempo:{start:40,goal:80,step:4}, learn:'chords',
  tab:held([[-1,3,2,0,1,0],[-1,3,5,5,5,3],[8,7,5,5,5,8],[8,10,10,9,8,8],[-1,-1,10,12,13,12],[8,10,10,9,8,8],[8,7,5,5,5,8],[-1,3,5,5,5,3]]),
  vars:[
    {name:{en:'G through the shapes',pt:'G por todas as formas'},tab:held([[3,2,0,0,0,3],[3,5,5,4,3,3],[-1,-1,5,7,8,7],[-1,10,9,7,8,7],[-1,10,12,12,12,10],[-1,10,9,7,8,7],[-1,-1,5,7,8,7],[3,5,5,4,3,3]])},
    {name:{en:'A through the shapes',pt:'A por todas as formas'},tab:held([[-1,0,2,2,2,0],[5,4,2,2,2,5],[5,7,7,6,5,5],[-1,-1,7,9,10,9],[-1,12,11,9,10,9],[-1,-1,7,9,10,9],[5,7,7,6,5,5],[5,4,2,2,2,5]])}
  ]
},
{
  id:'chords-caged-top', cat:'chords', level:4, tags:['caged','positions','triads'], minutes:8,
  title:{en:'CAGED on the top four strings',pt:'CAGED nas quatro cordas agudas'},
  goal:{en:'Play compact four-string pieces of each CAGED shape and connect them up the neck.',pt:'Tocar pedaços compactos de quatro cordas de cada forma CAGED e ligá-los pelo braço acima.'},
  how:{en:['These are the top four strings of each {c:C} shape: easier to grab than the full chords.','Strike each one on beats 1 and 3.','Notice the root {n:C} in every shape and where it sits.'],
       pt:['São as quatro cordas agudas de cada forma de {c:C}: mais fáceis de agarrar do que os acordes completos.','Toca cada uma nos tempos 1 e 3.','Repara na tónica {n:C} em cada forma e onde está.']},
  sub:1, tempo:{start:50,goal:90,step:4}, learn:'chords',
  tab:held([[-1,-1,2,0,1,0],[-1,-1,5,5,5,3],[-1,-1,5,5,5,8],[-1,-1,10,9,8,8],[-1,-1,10,12,13,12],[-1,-1,14,12,13,15]])
},
{
  id:'chords-triads-top', cat:'chords', level:3, tags:['triads','positions'], minutes:8,
  title:{en:'Triads on strings 1-3',pt:'Tríades nas cordas 1-3'},
  goal:{en:'Play a three-note chord in all three inversions on the top three strings.',pt:'Tocar um acorde de três notas nas três inversões nas três cordas agudas.'},
  how:{en:['A triad is the three notes of a chord: for {c:C}, {n:C}, {n:E} and {n:G}.','Root position at fret 5 has {n:C} lowest, 1st inversion at fret 8 has {n:E} lowest, 2nd inversion at fret 12 has {n:G} lowest.','Pick the three notes one by one, then together.','Go up and come back down.'],
       pt:['Uma tríade são as três notas de um acorde: para {c:C}, {n:C}, {n:E} e {n:G}.','A posição fundamental no traste 5 tem {n:C} no baixo, a 1.ª inversão no traste 8 tem {n:E} e a 2.ª inversão no traste 12 tem {n:G}.','Toca as três notas uma a uma e depois juntas.','Sobe e volta a descer.']},
  sub:1, tempo:{start:50,goal:100,step:5}, learn:'chords',
  tab:tri(['3.5','2.5','1.3'])+' '+tri(['3.9','2.8','1.8'])+' '+tri(['3.12','2.13','1.12'])+' '+tri(['3.9','2.8','1.8']),
  vars:[{name:{en:'{c:Am} triads',pt:'Tríades de {c:Am}'},tab:tri(['3.2','2.1','1.0'])+' '+tri(['3.5','2.5','1.5'])+' '+tri(['3.9','2.10','1.8'])+' '+tri(['3.5','2.5','1.5'])}]
},
{
  id:'chords-triads-middle', cat:'chords', level:3, tags:['triads','positions'], minutes:8,
  title:{en:'Triads on strings 2-4',pt:'Tríades nas cordas 2-4'},
  goal:{en:'Play all three inversions of a triad on strings 2, 3 and 4.',pt:'Tocar as três inversões de uma tríade nas cordas 2, 3 e 4.'},
  how:{en:['{c:C} 1st inversion sits at frets 2-0-1, 2nd inversion at fret 5, root position at frets 10-9-8.','Pick each note, then strike the three together.','Say which note is on the bottom each time.'],
       pt:['O {c:C} na 1.ª inversão está nos trastes 2-0-1, a 2.ª inversão no traste 5 e a posição fundamental nos trastes 10-9-8.','Toca cada nota e depois as três juntas.','Diz qual é a nota mais grave de cada vez.']},
  sub:1, tempo:{start:50,goal:100,step:5}, learn:'chords',
  tab:tri(['4.2','3.0','2.1'])+' '+tri(['4.5','3.5','2.5'])+' '+tri(['4.10','3.9','2.8'])+' '+tri(['4.5','3.5','2.5']),
  vars:[{name:{en:'{c:Am} triads',pt:'Tríades de {c:Am}'},tab:tri(['4.2','3.2','2.1'])+' '+tri(['4.7','3.5','2.5'])+' '+tri(['4.10','3.9','2.10'])+' '+tri(['4.7','3.5','2.5'])}]
},
{
  id:'chords-triads-low', cat:'chords', level:3, tags:['triads','positions'], minutes:8,
  title:{en:'Triads on strings 3-5',pt:'Tríades nas cordas 3-5'},
  goal:{en:'Play all three inversions of a triad on strings 3, 4 and 5.',pt:'Tocar as três inversões de uma tríade nas cordas 3, 4 e 5.'},
  how:{en:['{c:C} root position at frets 3-2-0, 1st inversion at frets 7-5-5, 2nd inversion at frets 10-10-9.','Pick each note, then strike the three together.','These lower triads sound full and warm: good for rhythm parts.'],
       pt:['O {c:C} na posição fundamental está nos trastes 3-2-0, a 1.ª inversão nos trastes 7-5-5 e a 2.ª inversão nos trastes 10-10-9.','Toca cada nota e depois as três juntas.','Estas tríades mais graves soam cheias e quentes: boas para acompanhamento.']},
  sub:1, tempo:{start:50,goal:100,step:5}, learn:'chords',
  tab:tri(['5.3','4.2','3.0'])+' '+tri(['5.7','4.5','3.5'])+' '+tri(['5.10','4.10','3.9'])+' '+tri(['5.7','4.5','3.5']),
  vars:[{name:{en:'{c:Am} triads',pt:'Tríades de {c:Am}'},tab:tri(['5.3','4.2','3.2'])+' '+tri(['5.7','4.7','3.5'])+' '+tri(['5.12','4.10','3.9'])+' '+tri(['5.7','4.7','3.5'])}]
},
{
  id:'chords-triads-voice-leading', cat:'chords', level:4, tags:['triads','changes','positions'], minutes:8,
  title:{en:'Triad progression in one spot',pt:'Progressão de tríades num só sítio'},
  goal:{en:'Change chords with triads while moving each finger as little as possible.',pt:'Mudar de acorde com tríades mexendo cada dedo o mínimo possível.'},
  how:{en:['Play {c:C}, {c:Am}, {c:F} and {c:G} on strings 1-3, all around fret 5.','From one chord to the next only one or two notes move, by a fret or two.','Strike each triad on every beat and listen to the top note.'],
       pt:['Toca {c:C}, {c:Am}, {c:F} e {c:G} nas cordas 1-3, todos à volta do traste 5.','De um acorde para o seguinte só se mexem uma ou duas notas, um ou dois trastes.','Toca cada tríade em todos os tempos e ouve a nota mais aguda.']},
  tips:{en:['This idea of moving the least is called voice leading.'],pt:['Esta ideia de mexer o mínimo chama-se condução de vozes.']},
  sub:1, tempo:{start:60,goal:110,step:5}, learn:'chords',
  tab:rep('3.5+2.5+1.3',4)+' | '+rep('3.5+2.5+1.5',4)+' | '+rep('3.5+2.6+1.5',4)+' | '+rep('3.4+2.3+1.3',4)+' |',
  vars:[{name:{en:'Same progression on strings 2-4',pt:'A mesma progressão nas cordas 2-4'},tab:rep('4.5+3.5+2.5',4)+' | '+rep('4.7+3.5+2.5',4)+' | '+rep('4.7+3.5+2.6',4)+' | '+rep('4.5+3.4+2.3',4)+' |'}]
},
{
  id:'chords-sevenths-open', cat:'chords', level:2, tags:['sevenths','open-chords','changes'], minutes:6,
  title:{en:'Open seventh-chord colours',pt:'Cores dos acordes de sétima abertos'},
  goal:{en:'Hear and play the three main seventh sounds: major 7, minor 7 and dominant 7.',pt:'Ouvir e tocar os três sons principais de sétima: maior com sétima maior, menor com sétima e dominante.'},
  how:{en:['{c:Cmaj7} is dreamy, {c:Am7} is soft, {c:G7} is restless and wants to move.','Play one bar of each with a slow strum.','Compare each with its plain chord ({c:C}, {c:Am}, {c:G}) to hear the added note.'],
       pt:['O {c:Cmaj7} é sonhador, o {c:Am7} é suave e o {c:G7} é inquieto e quer resolver.','Toca um compasso de cada com uma batida lenta.','Compara cada um com o acorde simples ({c:C}, {c:Am}, {c:G}) para ouvir a nota acrescentada.']},
  sub:2, tempo:{start:60,goal:110,step:5}, learn:'chords', chords:pick('Cmaj7','Am7','Dm7','G7','Fmaj7','Em7','A7','D7','E7'),
  tab:prog(['Cmaj7','Am7','Dm7','G7'],'D - D U - U D U'),
  vars:[{name:{en:'Fmaj7-Em7-Dm7-Cmaj7',pt:'Fmaj7-Em7-Dm7-Cmaj7'},tab:prog(['Fmaj7','Em7','Dm7','Cmaj7'],'D - D U - U D U')},{name:{en:'Dominants: A7-D7-E7-A7',pt:'Dominantes: A7-D7-E7-A7'},tab:prog(['A7','D7','E7','A7'],'D - D U - U D U')}]
},
{
  id:'chords-sevenths-root6', cat:'chords', level:4, tags:['sevenths','barre','positions'], minutes:8,
  title:{en:'Seventh shapes, root on the 6th string',pt:'Formas de sétima com tónica na 6.ª corda'},
  goal:{en:'Play maj7, 7, m7 and m7b5 shapes from the same 6th-string root.',pt:'Tocar as formas maj7, 7, m7 e m7b5 a partir da mesma tónica na 6.ª corda.'},
  how:{en:['Root {n:A} at fret 5 of the 6th string; the 5th string is muted by the 1st finger.','{c:Amaj7}, {c:A7}, {c:Am7}, {c:Am7b5}: each changes just one note from the one before.','Strike each shape on beats 1 and 3 and listen to the change.'],
       pt:['Tónica {n:A} no traste 5 da 6.ª corda; a 5.ª corda fica abafada pelo dedo 1.','{c:Amaj7}, {c:A7}, {c:Am7}, {c:Am7b5}: cada um muda só uma nota em relação ao anterior.','Toca cada forma nos tempos 1 e 3 e ouve a diferença.']},
  tips:{en:['Pick only strings 6, 4, 3 and 2, or use your fingers so the muted strings do not matter.'],pt:['Toca só as cordas 6, 4, 3 e 2, ou usa os dedos para as cordas abafadas não importarem.']},
  sub:1, tempo:{start:50,goal:90,step:4}, learn:'chords',
  tab:held([[5,-1,6,6,5,-1],[5,-1,5,6,5,-1],[5,-1,5,5,5,-1],[5,-1,5,5,4,-1]]),
  vars:[{name:{en:'Root {n:G} at fret 3',pt:'Tónica {n:G} no traste 3'},tab:held([[3,-1,4,4,3,-1],[3,-1,3,4,3,-1],[3,-1,3,3,3,-1],[3,-1,3,3,2,-1]])}]
},
{
  id:'chords-sevenths-root5', cat:'chords', level:4, tags:['sevenths','barre','positions'], minutes:8,
  title:{en:'Seventh shapes, root on the 5th string',pt:'Formas de sétima com tónica na 5.ª corda'},
  goal:{en:'Play maj7, 7, m7 and m7b5 shapes from the same 5th-string root.',pt:'Tocar as formas maj7, 7, m7 e m7b5 a partir da mesma tónica na 5.ª corda.'},
  how:{en:['Root {n:C} at fret 3 of the 5th string.','{c:Cmaj7}, {c:C7}, {c:Cm7}, {c:Cm7b5}: notice which finger moves each time.','Strike each shape on beats 1 and 3.'],
       pt:['Tónica {n:C} no traste 3 da 5.ª corda.','{c:Cmaj7}, {c:C7}, {c:Cm7}, {c:Cm7b5}: repara que dedo se mexe de cada vez.','Toca cada forma nos tempos 1 e 3.']},
  sub:1, tempo:{start:50,goal:90,step:4}, learn:'chords',
  tab:held([[-1,3,5,4,5,3],[-1,3,5,3,5,3],[-1,3,5,3,4,3],[-1,3,4,3,4,-1]]),
  vars:[{name:{en:'Root {n:D} at fret 5',pt:'Tónica {n:D} no traste 5'},tab:held([[-1,5,7,6,7,5],[-1,5,7,5,7,5],[-1,5,7,5,6,5],[-1,5,6,5,6,-1]])}]
},
{
  id:'chords-sevenths-ii-v-i', cat:'chords', level:4, tags:['sevenths','jazz','changes','barre'], minutes:8,
  title:{en:'ii-V-I with seventh chords',pt:'ii-V-I com acordes de sétima'},
  goal:{en:'Play the ii-V-I progression with barre seventh chords and a light jazz comp.',pt:'Tocar a progressão ii-V-I com acordes de sétima com pestana e um acompanhamento leve de jazz.'},
  how:{en:['In {n:C}: {c:Dm7} (fret 5, 5th string root), {c:G7} (fret 3, 6th string root), {c:Cmaj7} (fret 3, 5th string root).','Strike short chords on beat 1 and on the "and" of 2.','Keep the chords short by easing finger pressure after each hit.'],
       pt:['Em {n:C}: {c:Dm7} (traste 5, tónica na 5.ª corda), {c:G7} (traste 3, tónica na 6.ª corda), {c:Cmaj7} (traste 3, tónica na 5.ª corda).','Toca acordes curtos no tempo 1 e no "e" do 2.','Mantém os acordes curtos aliviando a pressão dos dedos depois de cada ataque.']},
  sub:2, tempo:{start:60,goal:140,step:5}, learn:'keys',
  chords:{Dm7:[-1,5,7,5,6,5],G7:[3,5,3,4,3,3],Cmaj7:[-1,3,5,4,5,3],Bm7b5:[-1,2,3,2,3,-1],E7:[0,2,0,1,0,0],Am7:[-1,0,2,0,1,0]},
  tab:prog(['Dm7','G7','Cmaj7','Cmaj7'],'D> - - U> - - - -'),
  vars:[{name:{en:'Minor ii-V-i in {n:A}',pt:'ii-V-i menor em {n:A}'},tab:prog(['Bm7b5','E7','Am7','Am7'],'D> - - U> - - - -')}]
},
{
  id:'chords-sevenths-key-cycle', cat:'chords', level:5, tags:['sevenths','jazz','changes','barre'], minutes:10,
  title:{en:'ii-V-I down in whole steps',pt:'ii-V-I a descer por tons'},
  goal:{en:'Play the ii-V-I in three keys, each a whole step lower, without stopping.',pt:'Tocar o ii-V-I em três tonalidades, cada uma um tom abaixo, sem parar.'},
  how:{en:['{n:C}: {c:Dm7}, {c:G7}, {c:Cmaj7}. Then {n:Bb}: {c:Cm7}, {c:F7}, {c:Bbmaj7}. Then {n:Ab}: {c:Bbm7}, {c:Eb7}, {c:Abmaj7}.','Use the same two shape families: 5th-string and 6th-string roots.','Plan each move while the previous chord is still ringing.'],
       pt:['{n:C}: {c:Dm7}, {c:G7}, {c:Cmaj7}. Depois {n:Bb}: {c:Cm7}, {c:F7}, {c:Bbmaj7}. Depois {n:Ab}: {c:Bbm7}, {c:Eb7}, {c:Abmaj7}.','Usa as mesmas duas famílias de formas: tónica na 5.ª e na 6.ª corda.','Prepara cada mudança enquanto o acorde anterior ainda soa.']},
  sub:2, tempo:{start:60,goal:140,step:5}, learn:'keys',
  chords:{Dm7:[-1,5,7,5,6,5],G7:[3,5,3,4,3,3],Cmaj7:[-1,3,5,4,5,3],Cm7:[-1,3,5,3,4,3],F7:[1,3,1,2,1,1],Bbmaj7:[-1,1,3,2,3,1],Bbm7:[-1,1,3,1,2,1],Eb7:[-1,6,8,6,8,6],Abmaj7:[4,-1,5,5,4,-1]},
  tab:prog(['Dm7','G7','Cmaj7','Cmaj7','Cm7','F7','Bbmaj7','Bbmaj7','Bbm7','Eb7','Abmaj7','Abmaj7'],'D> - - U> - - - -')
},
{
  id:'chords-sevenths-shells', cat:'chords', level:5, tags:['sevenths','jazz','chord-tones'], minutes:8,
  title:{en:'Three-note shell voicings',pt:'Voicings de três notas (shells)'},
  goal:{en:'Play seventh chords with just the root, 3rd and 7th, and move between them smoothly.',pt:'Tocar acordes de sétima só com a tónica, a 3.ª e a 7.ª e mudar entre eles com suavidade.'},
  how:{en:['A shell leaves out the 5th: root, 3rd and 7th are enough to say what the chord is.','{c:Dm7} with root on the 5th string, {c:G7} with root on the 6th, {c:Cmaj7} with root on the 5th.','Notice the top two notes moving by just one fret.','Strike each shell on beats 1 and 3.'],
       pt:['Um shell deixa de fora a 5.ª: a tónica, a 3.ª e a 7.ª chegam para dizer que acorde é.','{c:Dm7} com tónica na 5.ª corda, {c:G7} com tónica na 6.ª e {c:Cmaj7} com tónica na 5.ª.','Repara que as duas notas de cima mexem só um traste.','Toca cada shell nos tempos 1 e 3.']},
  sub:1, tempo:{start:60,goal:140,step:5}, learn:'chords',
  tab:'5.5+4.3+3.5 = 5.5+4.3+3.5 = | 6.3+4.3+3.4 = 6.3+4.3+3.4 = | 5.3+4.2+3.4 = 5.3+4.2+3.4 = | 5.3+4.2+3.4 = = = |',
  vars:[{name:{en:'Shell types on a {n:G} root',pt:'Tipos de shell com tónica {n:G}'},tab:'6.3+4.4+3.4 = = = | 6.3+4.3+3.4 = = = | 6.3+4.3+3.3 = = = | 6.3+4.3+3.3 = 6.3+4.4+3.4 = |'}]
},
{
  id:'chords-arp-open', cat:'chords', level:2, tags:['arpeggios','open-chords','fingerstyle'], minutes:6,
  title:{en:'Picking open chords note by note',pt:'Acordes abertos nota a nota'},
  goal:{en:'Hold a chord and pick its strings one at a time so every note rings.',pt:'Manter um acorde e tocar as cordas uma a uma para todas as notas soarem.'},
  how:{en:['Hold {c:C}, {c:Am}, {c:Fmaj7} and {c:G} for one bar each.','Start on the bass note (the root) and pick up to the 1st string and back.','Keep the fingers down so the notes ring into each other.'],
       pt:['Faz {c:C}, {c:Am}, {c:Fmaj7} e {c:G}, um compasso cada.','Começa no baixo (a tónica) e sobe até à 1.ª corda e volta.','Mantém os dedos pousados para as notas soarem umas por cima das outras.']},
  tips:{en:['If a note dies, a finger is touching that string: arch the fingers more.'],pt:['Se uma nota se apaga, há um dedo a tocar nessa corda: arqueia mais os dedos.']},
  sub:2, tempo:{start:50,goal:110,step:5}, learn:'chords',
  tab:'5.3 4.2 3.0 2.1 1.0 2.1 3.0 4.2 | 5.0 4.2 3.2 2.1 1.0 2.1 3.2 4.2 | 4.3 3.2 2.1 1.0 2.1 3.2 4.3 3.2 | 6.3 5.2 4.0 3.0 2.0 1.3 2.0 3.0 |',
  vars:[{name:{en:'Em-C-G-D',pt:'Em-C-G-D'},tab:'6.0 5.2 4.2 3.0 2.0 1.0 2.0 3.0 | 5.3 4.2 3.0 2.1 1.0 2.1 3.0 4.2 | 6.3 5.2 4.0 3.0 2.0 1.3 2.0 3.0 | 4.0 3.2 2.3 1.2 2.3 3.2 4.0 3.2 |'}]
},
{
  id:'chords-arp-root6', cat:'chords', level:3, tags:['arpeggios','major','minor','positions'], minutes:8,
  title:{en:'Arpeggios from the 6th string',pt:'Arpejos a partir da 6.ª corda'},
  goal:{en:'Play major, minor and dominant 7 arpeggios in one position, one note at a time.',pt:'Tocar arpejos maiores, menores e de sétima dominante numa posição, uma nota de cada vez.'},
  how:{en:['{c:G} arpeggio around fret 3: the notes {n:G}, {n:B} and {n:D} over two octaves.','Do not hold a chord: fret each note on its own and lift it after.','Up, then down, alternate picking.','The variations change one note to make {c:Gm} or {c:G7}.'],
       pt:['Arpejo de {c:G} à volta do traste 3: as notas {n:G}, {n:B} e {n:D} em duas oitavas.','Não faças o acorde: pisa cada nota sozinha e levanta-a a seguir.','Sobe e depois desce, com palhetada alternada.','As variações mudam uma nota para fazer {c:Gm} ou {c:G7}.']},
  sub:2, tempo:{start:50,goal:110,step:5}, learn:'chords',
  tab:'6.3 5.2 5.5 4.5 3.4 2.3 1.3 1.7 | 1.3 2.3 3.4 4.5 5.5 5.2 6.3 = |',
  vars:[{name:{en:'{c:Gm}',pt:'{c:Gm}'},tab:'6.3 5.1 5.5 4.5 3.3 2.3 1.3 1.6 | 1.3 2.3 3.3 4.5 5.5 5.1 6.3 = |'},{name:{en:'{c:G7}',pt:'{c:G7}'},tab:'6.3 5.2 5.5 4.3 4.5 3.4 2.3 2.6 | 1.3 2.6 2.3 3.4 4.5 4.3 5.5 5.2 |'}]
},
{
  id:'chords-arp-root5', cat:'chords', level:3, tags:['arpeggios','major','minor','positions'], minutes:8,
  title:{en:'Arpeggios from the 5th string',pt:'Arpejos a partir da 5.ª corda'},
  goal:{en:'Play {c:C}, {c:Cm} and {c:C7} arpeggios with the root on the 5th string.',pt:'Tocar arpejos de {c:C}, {c:Cm} e {c:C7} com a tónica na 5.ª corda.'},
  how:{en:['Start on {n:C} at fret 3 of the 5th string.','Play up to {n:C} at fret 8 of the 1st string and back down.','Say the note names as you go: root, 3rd, 5th.'],
       pt:['Começa no {n:C} no traste 3 da 5.ª corda.','Sobe até ao {n:C} no traste 8 da 1.ª corda e volta a descer.','Diz os nomes das notas pelo caminho: tónica, 3.ª, 5.ª.']},
  sub:2, tempo:{start:50,goal:110,step:5}, learn:'chords',
  tab:'5.3 4.2 4.5 3.5 2.5 1.3 1.8 1.3 | 2.5 3.5 4.5 4.2 5.3 = = - |',
  vars:[{name:{en:'{c:Cm}',pt:'{c:Cm}'},tab:'5.3 4.1 4.5 3.5 2.4 1.3 1.8 1.3 | 2.4 3.5 4.5 4.1 5.3 = = - |'},{name:{en:'{c:C7}',pt:'{c:C7}'},tab:'5.3 4.2 4.5 3.3 3.5 2.5 1.3 1.6 | 1.3 2.5 3.5 3.3 4.5 4.2 5.3 - |'}]
},
{
  id:'chords-arp-sevenths', cat:'chords', level:4, tags:['arpeggios','sevenths','positions'], minutes:8,
  title:{en:'Seventh-chord arpeggios',pt:'Arpejos de acordes de sétima'},
  goal:{en:'Play maj7, 7, m7 and m7b5 arpeggios from one root and hear how each differs.',pt:'Tocar arpejos maj7, 7, m7 e m7b5 a partir de uma tónica e ouvir a diferença entre eles.'},
  how:{en:['Root {n:A} at fret 5 of the 6th string.','Each arpeggio has four notes: root, 3rd, 5th and 7th.','Play up in 8ths, then back down.','Switch between the variations to hear which notes change.'],
       pt:['Tónica {n:A} no traste 5 da 6.ª corda.','Cada arpejo tem quatro notas: tónica, 3.ª, 5.ª e 7.ª.','Sobe em colcheias e depois desce.','Muda entre as variações para ouvir que notas mudam.']},
  sub:2, tempo:{start:50,goal:110,step:5}, learn:'chords',
  tab:'6.5 5.4 5.7 4.6 4.7 3.6 2.5 1.4 | 1.5 1.4 2.5 3.6 4.7 4.6 5.7 5.4 |',
  vars:[
    {name:{en:'{c:A7}',pt:'{c:A7}'},tab:'6.5 5.4 5.7 4.5 4.7 3.6 2.5 1.3 | 1.5 1.3 2.5 3.6 4.7 4.5 5.7 5.4 |'},
    {name:{en:'{c:Am7}',pt:'{c:Am7}'},tab:'6.5 5.3 5.7 4.5 4.7 3.5 2.5 1.3 | 1.5 1.3 2.5 3.5 4.7 4.5 5.7 5.3 |'},
    {name:{en:'{c:Am7b5}',pt:'{c:Am7b5}'},tab:'6.5 5.3 5.6 4.5 4.7 3.5 2.4 1.3 | 1.5 1.3 2.4 3.5 4.7 4.5 5.6 5.3 |'}
  ]
},
{
  id:'chords-arp-progression', cat:'chords', level:4, tags:['arpeggios','chord-tones','minor','positions'], minutes:8,
  title:{en:'Arpeggios through a progression',pt:'Arpejos ao longo de uma progressão'},
  goal:{en:'Follow {c:Am}, {c:Dm}, {c:E7} and {c:Am} with their arpeggios in one position.',pt:'Seguir {c:Am}, {c:Dm}, {c:E7} e {c:Am} com os respetivos arpejos numa só posição.'},
  how:{en:['Stay around fret 5 the whole time.','Go up on {c:Am}, down on {c:Dm}, up on {c:E7}, down on {c:Am}.','Listen to how {n:G#} at the top of {c:E7} leads into {n:A}.'],
       pt:['Fica à volta do traste 5 o tempo todo.','Sobe em {c:Am}, desce em {c:Dm}, sobe em {c:E7} e desce em {c:Am}.','Ouve como o {n:G#} no topo do {c:E7} leva ao {n:A}.']},
  sub:2, tempo:{start:50,goal:110,step:5}, learn:'chords',
  tab:'6.5 5.3 5.7 4.7 3.5 2.5 1.5 1.8 | 1.5 2.6 3.7 4.7 4.3 5.5 6.5 = | 6.4 5.5 5.7 4.6 3.4 3.7 2.5 1.4 | 1.5 2.5 3.5 4.7 5.7 5.3 6.5 = |'
},
{
  id:'chords-sus-moves', cat:'chords', level:2, tags:['open-chords','changes'], minutes:5,
  title:{en:'Sus chord movement',pt:'Movimento com acordes sus'},
  goal:{en:'Decorate a chord by adding and lifting one finger to make sus4 and sus2 sounds.',pt:'Enfeitar um acorde pondo e tirando um dedo para fazer sons sus4 e sus2.'},
  how:{en:['Hold {c:D}. Add the 4th finger on fret 3 of the 1st string for {c:Dsus4}.','Lift the finger off the 1st string completely for {c:Dsus2}.','Two beats on each chord: {c:D}, {c:Dsus4}, {c:D}, {c:Dsus2}.','"Sus" means the 3rd of the chord is replaced, so it sounds open and unresolved.'],
       pt:['Faz {c:D}. Junta o dedo 4 no traste 3 da 1.ª corda para {c:Dsus4}.','Levanta o dedo da 1.ª corda por completo para {c:Dsus2}.','Dois tempos em cada acorde: {c:D}, {c:Dsus4}, {c:D}, {c:Dsus2}.','"Sus" quer dizer que a 3.ª do acorde é substituída, por isso soa aberto e por resolver.']},
  sub:2, tempo:{start:60,goal:110,step:5}, learn:'chords', chords:pick('D','Dsus4','Dsus2','A','Asus4','Asus2','E','Esus4'),
  tab:'@D D - D U @Dsus4 D - D U | @D D - D U @Dsus2 D - D U |',
  vars:[{name:{en:'{c:A} family',pt:'Família de {c:A}'},tab:'@A D - D U @Asus4 D - D U | @A D - D U @Asus2 D - D U |'},{name:{en:'{c:E} and {c:Esus4}',pt:'{c:E} e {c:Esus4}'},tab:'@E D - D U @Esus4 D - D U | @E D - D U @Esus4 D - @E D U |'}]
},
{
  id:'chords-add9-ringing', cat:'chords', level:2, tags:['open-chords','changes','folk'], minutes:6,
  title:{en:'Ringing add9 and sus progression',pt:'Progressão a ressoar com add9 e sus'},
  goal:{en:'Play a progression where fingers 3 and 4 stay on the top two strings for every chord.',pt:'Tocar uma progressão em que os dedos 3 e 4 ficam nas duas cordas agudas em todos os acordes.'},
  how:{en:['Keep fingers 3 and 4 on fret 3 of the 1st and 2nd strings the whole time.','Only the bass fingers move: {c:G}, {c:Cadd9}, {c:Dsus4}, {c:Em7}.','The shared notes on top make the changes sound smooth and shimmering.'],
       pt:['Mantém os dedos 3 e 4 no traste 3 da 1.ª e da 2.ª cordas o tempo todo.','Só os dedos dos baixos se mexem: {c:G}, {c:Cadd9}, {c:Dsus4}, {c:Em7}.','As notas comuns em cima fazem as mudanças soar suaves e brilhantes.']},
  sub:2, tempo:{start:60,goal:120,step:5}, learn:'chords',
  chords:{G:[3,2,0,0,3,3],Cadd9:[-1,3,2,0,3,3],Dsus4:[-1,-1,0,2,3,3],Em7:[0,2,0,0,3,3]},
  tab:prog(['G','Cadd9','Dsus4','Em7'],'D - D U - U D U'),
  vars:[{name:{en:'Em7-Cadd9-G-Dsus4',pt:'Em7-Cadd9-G-Dsus4'},tab:prog(['Em7','Cadd9','G','Dsus4'],'D - D U - U D U')}]
},
{
  id:'chords-sus-barre', cat:'chords', level:3, tags:['barre','changes'], minutes:5,
  title:{en:'Sus resolutions with barre chords',pt:'Resoluções sus com pestana'},
  goal:{en:'Add sus4 and sus2 movement to movable barre chords.',pt:'Acrescentar movimento sus4 e sus2 a acordes com pestana móveis.'},
  how:{en:['E-shape {c:A} at fret 5: add the 4th finger on the 3rd string, fret 7, for {c:Asus4}.','A-shape {c:D} at fret 5: add fret 8 on the 2nd string for {c:Dsus4}, or lift to the barre for {c:Dsus2}.','Keep the barre down the whole time; only one finger moves.'],
       pt:['{c:A} com forma de E no traste 5: junta o dedo 4 na 3.ª corda, traste 7, para {c:Asus4}.','{c:D} com forma de A no traste 5: junta o traste 8 na 2.ª corda para {c:Dsus4}, ou levanta até à pestana para {c:Dsus2}.','Mantém a pestana sempre pousada; só um dedo se mexe.']},
  sub:2, tempo:{start:60,goal:110,step:5},
  chords:{A:[5,7,7,6,5,5],Asus4:[5,7,7,7,5,5],D:[-1,5,7,7,7,5],Dsus4:[-1,5,7,7,8,5],Dsus2:[-1,5,7,7,5,5]},
  tab:'@A D - D U @Asus4 D - D U | @A D - D U - U D U | @D D - D U @Dsus4 D - D U | @D D - D U @Dsus2 D - @D D U |'
}
);
})();
