/* Rhythm: strumming patterns, subdivisions, feels and timing. */
(function(){
"use strict";
const CH={
  G:[3,2,0,0,0,3], C:[-1,3,2,0,1,0], D:[-1,-1,0,2,3,2], A:[-1,0,2,2,2,0], E:[0,2,2,1,0,0],
  Em:[0,2,2,0,0,0], Am:[-1,0,2,2,1,0], Dm:[-1,-1,0,2,3,1], E7:[0,2,0,1,0,0], A7:[-1,0,2,0,2,0],
  D7:[-1,-1,0,2,1,2], G7:[3,2,0,0,0,1], B7:[-1,2,1,2,0,2], Fmaj7:[-1,-1,3,2,1,0], Cadd9:[-1,3,2,0,3,0]
};
function pick(){const o={};for(const n of arguments)o[n]=CH[n];return o;}
/* '@G pat | @C pat |' for every chord in the list */
function prog(chords,pat){return chords.map(c=>'@'+c+' '+pat+' |').join(' ');}
function rep(s,n){return Array(n).fill(s).join(' ');}
/* alternating D/U strums with an accent every `every` subdivisions, split into bars of `per` */
function groups(total,every,per){const t=[];for(let i=0;i<total;i++){t.push((i%2?'U':'D')+(i%every===0?'>':''));if((i+1)%per===0)t.push('|');}return t.join(' ');}

window.SS_EXERCISES=window.SS_EXERCISES||[];
window.SS_EXERCISES.push(
{
  id:'rhythm-quarter-downs', cat:'rhythm', level:1, tags:['strumming','timing','open-chords'], minutes:5,
  title:{en:'Quarter-note down strums',pt:'Batidas para baixo em semínimas'},
  goal:{en:'Strum one clean down stroke on every click while changing chords.',pt:'Fazer uma batida para baixo limpa em cada clique enquanto mudas de acorde.'},
  how:{en:['Hold {c:G} and strum down once on every click: 1, 2, 3, 4.','On beat 1 of the next bar change to {c:C}.','Count out loud while you strum.','Keep the strumming hand moving even if the chord is not ready yet.'],
       pt:['Faz o acorde {c:G} e toca uma batida para baixo em cada clique: 1, 2, 3, 4.','No tempo 1 do compasso seguinte muda para {c:C}.','Conta em voz alta enquanto tocas.','Mantém a mão da batida a mexer mesmo que o acorde ainda não esteja pronto.']},
  tips:{en:['Strum from the wrist, not the whole arm.','Lift the fretting fingers a little early on beat 4 so the new chord lands on 1.'],
        pt:['Toca com o pulso, não com o braço inteiro.','Levanta os dedos um pouco antes no tempo 4 para o novo acorde cair no 1.']},
  sub:1, tempo:{start:60,goal:110,step:5}, chords:pick('G','C','D','Em'),
  tab:prog(['G','G','C','C'],'D D D D'),
  vars:[{name:{en:'G-D-Em-C',pt:'G-D-Em-C'},tab:prog(['G','D','Em','C'],'D D D D')}]
},
{
  id:'rhythm-eighths-du', cat:'rhythm', level:1, tags:['strumming','timing'], minutes:5,
  title:{en:'Down-up 8th notes',pt:'Colcheias para baixo e para cima'},
  goal:{en:'Strum even 8th notes: down on the beat, up on the "and".',pt:'Tocar colcheias regulares: para baixo no tempo, para cima no "e".'},
  how:{en:['Count "1 and 2 and 3 and 4 and".','Strum down on the numbers and up on every "and".','Down and up strums should sound equally loud.','Change chord each bar without stopping the hand.'],
       pt:['Conta "1 e 2 e 3 e 4 e".','Batida para baixo nos números e para cima em cada "e".','As batidas para baixo e para cima devem soar com o mesmo volume.','Muda de acorde a cada compasso sem parar a mão.']},
  tips:{en:['Up strums only need to catch the top three or four strings.'],pt:['Nas batidas para cima basta apanhar as três ou quatro cordas mais agudas.']},
  sub:2, tempo:{start:60,goal:120,step:5}, chords:pick('Em','Am','C','D'),
  tab:prog(['Em','Am','Em','Am'],'D U D U D U D U'),
  vars:[{name:{en:'C-Am-D-Em',pt:'C-Am-D-Em'},tab:prog(['C','Am','D','Em'],'D U D U D U D U')}]
},
{
  id:'rhythm-ghost-motion', cat:'rhythm', level:1, tags:['strumming','timing'], minutes:5,
  title:{en:'The hand never stops',pt:'A mão nunca para'},
  goal:{en:'Keep a steady down-up motion and choose which strokes hit the strings.',pt:'Manter um movimento constante para baixo e para cima e escolher que batidas tocam as cordas.'},
  how:{en:['Move your hand down and up in 8th notes all the time, like a pendulum.','A lowercase d or u means move past the strings without touching them.','Start with all strokes hitting, then try the patterns with missed strokes.'],
       pt:['Mexe a mão para baixo e para cima em colcheias o tempo todo, como um pêndulo.','Um d ou u minúsculo quer dizer passar pelas cordas sem lhes tocar.','Começa com todas as batidas a tocar e depois experimenta os padrões com batidas falhadas.']},
  tips:{en:['If the missed strokes speed you up, slow down: the motion must stay even.'],pt:['Se as batidas falhadas te fazem acelerar, abranda: o movimento tem de ficar regular.']},
  sub:2, tempo:{start:60,goal:110,step:5}, chords:pick('G','C'),
  tab:'@G D u D u D u D u | @C D u D u D u D u | @G D u D U D u D U | @C D u D U D u D U |',
  vars:[{name:{en:'Down on 1 and 3 only',pt:'Só para baixo no 1 e no 3'},tab:'@G D u d u D u d u | @C D u d u D u d u | @G D u d U D u d U | @C D u d U D u d U |'}]
},
{
  id:'rhythm-folk-pattern', cat:'rhythm', level:2, tags:['strumming','folk','open-chords'], minutes:8,
  title:{en:'Down, down-up, up-down-up',pt:'Baixo, baixo-cima, cima-baixo-cima'},
  goal:{en:'Play the most common acoustic strumming pattern smoothly over chord changes.',pt:'Tocar o padrão de batida acústica mais comum de forma fluida com mudanças de acorde.'},
  how:{en:['Count "1 and 2 and 3 and 4 and" and keep the hand moving down-up.','Strum on 1, 2, "and", "and", 4, "and"; miss the strings on beat 3.','Say "down, down-up, up-down-up" while you play.','Change chord on beat 1 of each bar.'],
       pt:['Conta "1 e 2 e 3 e 4 e" e mantém a mão a mexer para baixo e para cima.','Toca no 1, no 2, no "e", no "e", no 4 e no "e"; falha as cordas no tempo 3.','Diz "baixo, baixo-cima, cima-baixo-cima" enquanto tocas.','Muda de acorde no tempo 1 de cada compasso.']},
  tips:{en:['The hand still goes down on beat 3, it just misses the strings.','The two up strums in a row are where most people rush.'],pt:['A mão continua a descer no tempo 3, só que não toca nas cordas.','As duas batidas para cima seguidas são onde quase todos aceleram.']},
  sub:2, tempo:{start:60,goal:120,step:5}, chords:pick('G','C','D','Em','Am','Cadd9'),
  tab:prog(['G','C','G','D'],'D - D U - U D U'),
  vars:[
    {name:{en:'G-Em-C-D',pt:'G-Em-C-D'},tab:prog(['G','Em','C','D'],'D - D U - U D U')},
    {name:{en:'Am-C-G-D',pt:'Am-C-G-D'},tab:prog(['Am','C','G','D'],'D - D U - U D U')},
    {name:{en:'Ghost strokes shown',pt:'Com as batidas falhadas'},tab:prog(['G','Cadd9','G','D'],'D u D U d U D U')}
  ]
},
{
  id:'rhythm-pattern-family', cat:'rhythm', level:2, tags:['strumming','timing'], minutes:8,
  title:{en:'Pattern builder',pt:'Construtor de padrões'},
  goal:{en:'Switch between related strumming patterns without losing the beat.',pt:'Mudar entre padrões de batida parecidos sem perder o tempo.'},
  how:{en:['Keep the down-up 8th-note motion going all the time.','Each variation leaves out different strokes.','Play one pattern for a few rounds, then switch to another while the click runs.'],
       pt:['Mantém sempre o movimento de colcheias para baixo e para cima.','Cada variação deixa de fora batidas diferentes.','Toca um padrão durante algumas voltas e depois muda para outro com o metrónomo a tocar.']},
  sub:2, tempo:{start:60,goal:120,step:5}, chords:pick('A','D','E','Em'),
  tab:prog(['A','D','A','E'],'D - D U D - D U'),
  vars:[
    {name:{en:'D - - U - U D U',pt:'D - - U - U D U'},tab:prog(['A','D','A','E'],'D - - U - U D U')},
    {name:{en:'D U - U D U - U',pt:'D U - U D U - U'},tab:prog(['A','D','A','E'],'D U - U D U - U')},
    {name:{en:'D - D - D U D U',pt:'D - D - D U D U'},tab:prog(['Em','D','A','E'],'D - D - D U D U')}
  ]
},
{
  id:'rhythm-backbeat-accents', cat:'rhythm', level:2, tags:['strumming','timing','rock'], minutes:5,
  title:{en:'Accents on 2 and 4',pt:'Acentos no 2 e no 4'},
  goal:{en:'Make beats 2 and 4 louder so the strumming drives like a drummer\'s snare.',pt:'Tocar mais forte os tempos 2 e 4 para a batida ter o impulso da tarola de um baterista.'},
  how:{en:['Strum steady 8ths, down-up.','Hit beats 2 and 4 harder (marked with >).','Keep the other strums light so the accent stands out.'],
       pt:['Toca colcheias regulares, para baixo e para cima.','Bate com mais força nos tempos 2 e 4 (marcados com >).','Mantém as outras batidas leves para o acento se destacar.']},
  tips:{en:['Accent with a bigger, faster stroke, not by squeezing the pick.'],pt:['Acentua com um movimento maior e mais rápido, não a apertar a palheta.']},
  sub:2, tempo:{start:70,goal:130,step:5}, chords:pick('G','C','D','Em'),
  tab:prog(['G','D','Em','C'],'D U D> U D U D> U'),
  vars:[{name:{en:'Accent on 1 and 3',pt:'Acento no 1 e no 3'},tab:prog(['G','D','Em','C'],'D> U D U D> U D U')}]
},
{
  id:'rhythm-moving-accent', cat:'rhythm', level:3, tags:['strumming','syncopation','timing'], minutes:8,
  title:{en:'Moving accent',pt:'Acento que se desloca'},
  goal:{en:'Place an accent on any 8th note of the bar, including the off-beats.',pt:'Pôr um acento em qualquer colcheia do compasso, incluindo os contratempos.'},
  how:{en:['Strum soft, even 8th notes on {c:Em}.','In each bar one strum is louder: it moves one 8th later every bar.','Count out loud so you always know where the accent is.'],
       pt:['Toca colcheias suaves e regulares em {c:Em}.','Em cada compasso há uma batida mais forte, que avança uma colcheia em cada compasso.','Conta em voz alta para saberes sempre onde está o acento.']},
  tips:{en:['Accented up strums are the hardest: let the hand travel further before the stroke.'],pt:['Os acentos nas batidas para cima são os mais difíceis: deixa a mão ir mais longe antes da batida.']},
  sub:2, tempo:{start:60,goal:110,step:5}, chords:pick('Em','Am'),
  tab:'@Em D> U D U D U D U | D U> D U D U D U | D U D> U D U D U | D U D U> D U D U | D U D U D> U D U | D U D U D U> D U | D U D U D U D> U | D U D U D U D U> |',
  vars:[{name:{en:'Two accents: 1 and the "and" of 2',pt:'Dois acentos: o 1 e o "e" do 2'},tab:'@Em D> U D U> D U D U | D> U D U> D U D U | @Am D> U D U> D U D U | D> U D U> D U D U |'}]
},
{
  id:'rhythm-chuck-2-4', cat:'rhythm', level:2, tags:['strumming','muting','timing'], minutes:8,
  title:{en:'Muted chucks on 2 and 4',pt:'Abafados percussivos no 2 e no 4'},
  goal:{en:'Replace beats 2 and 4 with a percussive muted strum, like a snare drum.',pt:'Trocar os tempos 2 e 4 por uma batida abafada e percussiva, como uma tarola.'},
  how:{en:['Strum 8ths down-up.','On beats 2 and 4 (X) lay the side of the strumming hand on the strings as you strum down, so you hear a "chk".','Lift the hand straight away so the next up strum rings.'],
       pt:['Toca colcheias para baixo e para cima.','Nos tempos 2 e 4 (X) pousa a lateral da mão da batida nas cordas enquanto desces, para ouvires um "tch".','Levanta logo a mão para a batida para cima seguinte soar.']},
  tips:{en:['You can also mute by relaxing the fretting fingers so they just touch the strings.','The chuck should be as loud as a normal strum.'],pt:['Também podes abafar aliviando os dedos da mão do braço para só tocarem nas cordas.','O abafado deve ser tão forte como uma batida normal.']},
  sub:2, tempo:{start:60,goal:120,step:5}, chords:pick('G','C','D','Em','Am'),
  tab:prog(['G','C','Em','D'],'D U X U D U X U'),
  vars:[
    {name:{en:'Pop pattern',pt:'Padrão pop'},tab:prog(['Am','C','G','D'],'D - X U - U X U')},
    {name:{en:'Busy chucks',pt:'Abafados mais cheios'},tab:prog(['G','C','Em','D'],'D U X U - U X U')}
  ]
},
{
  id:'rhythm-pushed-changes', cat:'rhythm', level:3, tags:['strumming','syncopation','changes'], minutes:8,
  title:{en:'Pushed chord changes',pt:'Mudanças antecipadas'},
  goal:{en:'Change chord on the "and" of 4, an 8th note before the bar line.',pt:'Mudar de acorde no "e" do 4, uma colcheia antes da barra de compasso.'},
  how:{en:['Play the folk pattern: down, down-up, up-down-up.','Change to the next chord on the very last up strum of the bar.','Let that chord ring over beat 1 of the next bar (no strum on 1).','This "push" makes the change feel like it leans forward.'],
       pt:['Toca o padrão folk: baixo, baixo-cima, cima-baixo-cima.','Muda para o acorde seguinte na última batida para cima do compasso.','Deixa esse acorde soar por cima do tempo 1 do compasso seguinte (sem batida no 1).','Esta antecipação dá à mudança uma sensação de ir para a frente.']},
  tips:{en:['Start the change during the down strum on beat 4.','Do not strum on beat 1 after a push: just let it ring.'],pt:['Começa a mudança durante a batida para baixo do tempo 4.','Não toques no tempo 1 depois de uma antecipação: deixa só soar.']},
  sub:2, tempo:{start:60,goal:110,step:5}, chords:pick('G','C','D','Em'),
  tab:'@G D - D U - U D @C U | = - D U - U D @D U | = - D U - U D @G U | = - D U - U D U |',
  vars:[{name:{en:'Em-C-G-D',pt:'Em-C-G-D'},tab:'@Em D - D U - U D @C U | = - D U - U D @G U | = - D U - U D @D U | = - D U - U D U |'}]
},
{
  id:'rhythm-offbeat-ups', cat:'rhythm', level:3, tags:['strumming','syncopation'], minutes:5,
  title:{en:'Off-beat up strums',pt:'Batidas para cima nos contratempos'},
  goal:{en:'Strum only on the "ands" while the hand keeps time on the beats.',pt:'Tocar só nos "e" enquanto a mão marca o tempo nos números.'},
  how:{en:['Move down-up in 8ths but miss the strings on every down stroke.','Only the up strums sound, between the clicks.','Count "1 and 2 and" and say the numbers louder than you play.'],
       pt:['Mexe a mão em colcheias mas falha as cordas em todas as batidas para baixo.','Só as batidas para cima soam, entre os cliques.','Conta "1 e 2 e" e diz os números mais alto do que tocas.']},
  tips:{en:['If you lose the beat, play the first down stroke of each bar for a while.'],pt:['Se perderes o tempo, toca durante algum tempo a primeira batida para baixo de cada compasso.']},
  sub:2, tempo:{start:60,goal:120,step:5}, chords:pick('Am','Dm','Em','E7'),
  tab:prog(['Am','Dm','Am','E7'],'d U d U d U d U'),
  vars:[{name:{en:'Down on 1, then off-beats',pt:'Baixo no 1 e depois contratempos'},tab:prog(['Am','Dm','Am','E7'],'D U d U d U d U')}]
},
{
  id:'rhythm-tresillo', cat:'rhythm', level:3, tags:['strumming','syncopation'], minutes:5,
  title:{en:'3 + 3 + 2 feel',pt:'Sensação 3 + 3 + 2'},
  goal:{en:'Split the bar into 3 + 3 + 2 eighth notes for a lilting, syncopated groove.',pt:'Dividir o compasso em 3 + 3 + 2 colcheias para um ritmo sincopado e balançado.'},
  how:{en:['Count eight 8th notes: "1 2 3 1 2 3 1 2".','Accent the first of each group: on beat 1, the "and" of 2 and beat 4.','Keep the hand moving down-up in between.'],
       pt:['Conta oito colcheias: "1 2 3 1 2 3 1 2".','Acentua a primeira de cada grupo: no tempo 1, no "e" do 2 e no tempo 4.','Mantém a mão a mexer para baixo e para cima entre os acentos.']},
  sub:2, tempo:{start:60,goal:110,step:5}, chords:pick('Am','G','C','E7','Dm'),
  tab:prog(['Am','G','C','E7'],'D> u d U> d u D> u'),
  vars:[{name:{en:'Filled in',pt:'Preenchido'},tab:prog(['Am','Dm','G','C'],'D> U D U> D U D> U')}]
},
{
  id:'rhythm-sixteenths-basic', cat:'rhythm', level:3, tags:['strumming','timing'], minutes:8,
  title:{en:'Even 16th-note strumming',pt:'Semicolcheias regulares'},
  goal:{en:'Strum four even strokes per beat with a loose, relaxed wrist.',pt:'Tocar quatro batidas regulares por tempo com o pulso solto.'},
  how:{en:['Count "1 e and a 2 e and a".','Down on "1" and "and", up on "e" and "a".','Use a small motion and only the top strings on the up strokes.','Start slow: the tempo is the beat, so there are four strums per click.'],
       pt:['Conta "1 é e á 2 é e á".','Para baixo no "1" e no "e", para cima no "é" e no "á".','Usa um movimento pequeno e só as cordas agudas nas batidas para cima.','Começa devagar: o tempo é a semínima, por isso há quatro batidas por clique.']},
  tips:{en:['If the forearm gets tight, stop and shake it out.'],pt:['Se o antebraço ficar tenso, para e sacode-o.']},
  sub:4, tempo:{start:50,goal:100,step:4}, chords:pick('Em','D','C','G'),
  tab:prog(['Em','D','C','G'],rep('D U',8)),
  vars:[{name:{en:'Accent the beats',pt:'Acentua os tempos'},tab:prog(['Em','D','C','G'],rep('D> U D U',4))}]
},
{
  id:'rhythm-funk-ghosts', cat:'rhythm', level:4, tags:['strumming','funk','muting','syncopation'], minutes:10,
  title:{en:'16th funk with ghost strums',pt:'Funk em semicolcheias com batidas fantasma'},
  goal:{en:'Play a tight funk rhythm where the hand moves in 16ths and only some strokes hit.',pt:'Tocar um ritmo funk apertado em que a mão mexe em semicolcheias e só algumas batidas tocam.'},
  how:{en:['Fret {c:E9} at the 7th fret (no 6th string).','Keep the hand moving in 16ths: down, up, down, up.','Play the uppercase strokes, miss the lowercase ones and chuck the X strokes.','Release the fretting pressure right after each hit so the chord sounds short.'],
       pt:['Faz o {c:E9} no 7.º traste (sem a 6.ª corda).','Mantém a mão a mexer em semicolcheias: baixo, cima, baixo, cima.','Toca as batidas maiúsculas, falha as minúsculas e abafa as X.','Alivia a pressão dos dedos logo a seguir a cada batida para o acorde soar curto.']},
  tips:{en:['Funk lives in the short notes: silence is part of the groove.','Keep the strumming hand very close to the strings.'],pt:['O funk vive das notas curtas: o silêncio faz parte do ritmo.','Mantém a mão da batida muito perto das cordas.']},
  sub:4, tempo:{start:60,goal:100,step:4}, chords:{E9:[-1,7,6,7,7,7],D9:[-1,5,4,5,5,5],Em7:[-1,7,9,7,8,7]},
  tab:'@E9 D u d U X u d U D u d U X u D u | D u d U X u d U D u d U X u D U |',
  vars:[
    {name:{en:'E9 to D9',pt:'E9 para D9'},tab:'@E9 D u d U X u d U D u d U X u d u | @D9 D u d U X u d U D u d U X u D U |'},
    {name:{en:'Minor, more off-beats',pt:'Menor, mais contratempos'},tab:'@Em7 D u d U d U X u d U d U X u D U | D u d U d U X u d U d U X U d U |'}
  ]
},
{
  id:'rhythm-funk-chops', cat:'rhythm', level:4, tags:['strumming','funk','syncopation','muting'], minutes:8,
  title:{en:'Funk 16th syncopation',pt:'Síncopas funk em semicolcheias'},
  goal:{en:'Land chord stabs on the "e" and "a" of the beat while the hand keeps 16ths.',pt:'Pôr ataques de acorde no "é" e no "á" do tempo enquanto a mão mantém as semicolcheias.'},
  how:{en:['Count "1 e and a" out loud at a slow tempo.','Play only the uppercase strokes; most of them fall between the beats.','The X strokes are muted chucks that keep the groove ticking.'],
       pt:['Conta "1 é e á" em voz alta num andamento lento.','Toca só as batidas maiúsculas; quase todas caem entre os tempos.','As batidas X são abafados que mantêm o ritmo a andar.']},
  sub:4, tempo:{start:50,goal:96,step:4}, chords:{E9:[-1,7,6,7,7,7],A9:[-1,0,2,4,2,3]},
  tab:'@E9 X U d u d U d U X u d U d u D u | X U d u d U d U @A9 X u d U d u D u |',
  vars:[{name:{en:'Pushes on the "a"',pt:'Antecipações no "á"'},tab:'@E9 D - - U - - D - - U - - D - - U | - - D - - U - - @A9 D - - U - - D - |'}]
},
{
  id:'rhythm-sixteenth-syncopation', cat:'rhythm', level:4, tags:['strumming','syncopation'], minutes:8,
  title:{en:'Syncopated 16th pattern',pt:'Padrão sincopado em semicolcheias'},
  goal:{en:'Play a 16th pattern with held chords that ring across the beat.',pt:'Tocar um padrão em semicolcheias com acordes que soam por cima do tempo.'},
  how:{en:['Count 16ths: "1 e and a".','Strum where the tab says D or U, let the chord ring on the rests.','The hand still moves on every 16th even when nothing is played.'],
       pt:['Conta semicolcheias: "1 é e á".','Toca onde a tablatura diz D ou U e deixa o acorde soar nas pausas.','A mão continua a mexer em cada semicolcheia mesmo quando não tocas nada.']},
  sub:4, tempo:{start:50,goal:90,step:4}, chords:pick('Em','C','G','D'),
  tab:prog(['Em','C','G','D'],'D = = U = U D = = U = U D = D U'),
  vars:[{name:{en:'Lighter version',pt:'Versão mais leve'},tab:prog(['Em','C','G','D'],'D = = U = = D = D = = U = U D U')}]
},
{
  id:'rhythm-waltz-34', cat:'rhythm', level:2, tags:['strumming','timing','folk'], minutes:5,
  title:{en:'Waltz in 3/4',pt:'Valsa em 3/4'},
  goal:{en:'Feel three beats per bar with a strong beat 1.',pt:'Sentir três tempos por compasso com o tempo 1 forte.'},
  how:{en:['Count "1 2 3, 1 2 3".','Play a bass note or strong down strum on 1 and lighter strums on 2 and 3.','Change chord every bar.'],
       pt:['Conta "1 2 3, 1 2 3".','Toca um baixo ou uma batida forte no 1 e batidas mais leves no 2 e no 3.','Muda de acorde a cada compasso.']},
  tips:{en:['Set the metronome to 3 beats per bar so the first click is different.'],pt:['Põe o metrónomo com 3 tempos por compasso para o primeiro clique ser diferente.']},
  beats:3, sub:2, tempo:{start:70,goal:140,step:5}, chords:pick('G','C','D7','Em'),
  tab:prog(['G','C','D7','G'],'D> - D - D U'),
  vars:[
    {name:{en:'Bass and strum',pt:'Baixo e batida'},tab:'@G 6.3 - D - D - | @C 5.3 - D - D - | @D7 4.0 - D - D - | @G 6.3 - D - D U |'},
    {name:{en:'Em-C-G-D7',pt:'Em-C-G-D7'},tab:prog(['Em','C','G','D7'],'D> - D U D U')}
  ]
},
{
  id:'rhythm-six-eight', cat:'rhythm', level:3, tags:['strumming','timing','triplets'], minutes:6,
  title:{en:'Rolling 6/8',pt:'6/8 a balançar'},
  goal:{en:'Strum in 6/8: two big pulses per bar, each split into three.',pt:'Tocar em 6/8: dois grandes impulsos por compasso, cada um dividido em três.'},
  how:{en:['Count "1 2 3 4 5 6" with the click on each number.','Accent 1 and 4: they are the two pulses you would tap your foot to.','Change chord every bar.'],
       pt:['Conta "1 2 3 4 5 6" com o clique em cada número.','Acentua o 1 e o 4: são os dois impulsos em que baterias o pé.','Muda de acorde a cada compasso.']},
  tips:{en:['Once it feels good, try tapping your foot only on 1 and 4.'],pt:['Quando estiver confortável, experimenta bater o pé só no 1 e no 4.']},
  beats:6, sub:1, tempo:{start:90,goal:180,step:6}, chords:pick('Em','C','G','D','Am','B7'),
  tab:prog(['Em','C','G','D'],'D> D U D> D U'),
  vars:[
    {name:{en:'Bass on 1 and 4',pt:'Baixo no 1 e no 4'},tab:'@Em 6.0 D U 4.2 D U | @C 5.3 D U 4.2 D U | @G 6.3 D U 4.0 D U | @D 4.0 D U 3.2 D U |'},
    {name:{en:'Minor: Am-Em-B7-Em',pt:'Menor: Am-Em-B7-Em'},tab:prog(['Am','Em','B7','Em'],'D> - U D> - U')}
  ]
},
{
  id:'rhythm-shuffle-strum', cat:'rhythm', level:3, tags:['strumming','triplets','blues'], minutes:8,
  title:{en:'Shuffle strum',pt:'Batida em shuffle'},
  goal:{en:'Swing your 8th notes: long on the beat, short on the "and".',pt:'Tocar colcheias swingadas: longa no tempo, curta no "e".'},
  how:{en:['Count triplets: "1 trip let 2 trip let".','Strum down on the number and up on the "let", skipping the middle.','That uneven long-short is the shuffle feel.','Play the 12-bar blues in {n:A}.'],
       pt:['Conta tercinas: "1 e a 2 e a".','Batida para baixo no número e para cima no "a", saltando o do meio.','Esse longo-curto desigual é o shuffle.','Toca o blues de 12 compassos em {n:A}.']},
  tips:{en:['Say "hump-ty hump-ty" in your head to feel the swing.'],pt:['Diz "pa-ra pa-ra" na cabeça, com o primeiro mais longo, para sentir o swing.']},
  sub:3, tempo:{start:60,goal:120,step:5}, chords:pick('A7','D7','E7'),
  tab:prog(['A7','A7','A7','A7','D7','D7','A7','A7','E7','D7','A7','E7'],'D - U D - U D - U D - U'),
  vars:[{name:{en:'Straight triplets',pt:'Tercinas seguidas'},tab:prog(['A7','D7','A7','E7'],'D U D U D U D U D U D U')}]
},
{
  id:'rhythm-shuffle-boogie', cat:'rhythm', level:3, tags:['triplets','blues','muting'], minutes:8,
  title:{en:'Boogie shuffle riff',pt:'Riff de boogie em shuffle'},
  goal:{en:'Play the classic two-note boogie pattern with a swung feel through a 12-bar blues.',pt:'Tocar o padrão de boogie de duas notas com swing num blues de 12 compassos.'},
  how:{en:['Play the open 5th string with fret 2 of the 4th string, then reach fret 4 with the 3rd finger.','Each beat is long-short (triplet swing).','Move the same shape to the 4th and 6th strings for the other chords.','Rest the strumming palm lightly on the strings for a tighter sound.'],
       pt:['Toca a 5.ª corda solta com o traste 2 da 4.ª corda e depois estica o dedo 3 até ao traste 4.','Cada tempo é longo-curto (swing de tercina).','Passa a mesma forma para a 4.ª e a 6.ª cordas nos outros acordes.','Pousa levemente a palma da mão da palheta nas cordas para um som mais apertado.']},
  sub:3, tempo:{start:60,goal:130,step:5},
  tab:(function(){
    const A='5.0+4.2 - 5.0+4.2 5.0+4.4 - 5.0+4.4 5.0+4.2 - 5.0+4.2 5.0+4.4 - 5.0+4.4 |';
    const D='4.0+3.2 - 4.0+3.2 4.0+3.4 - 4.0+3.4 4.0+3.2 - 4.0+3.2 4.0+3.4 - 4.0+3.4 |';
    const E='6.0+5.2 - 6.0+5.2 6.0+5.4 - 6.0+5.4 6.0+5.2 - 6.0+5.2 6.0+5.4 - 6.0+5.4 |';
    return [A,A,A,A,D,D,A,A,E,D,A,E].join(' ');})(),
  vars:[{name:{en:'With the 6th (fret 5)',pt:'Com a sexta (traste 5)'},tab:'5.0+4.2 - 5.0+4.2 5.0+4.4 - 5.0+4.4 5.0+4.5 - 5.0+4.5 5.0+4.4 - 5.0+4.4 | 4.0+3.2 - 4.0+3.2 4.0+3.4 - 4.0+3.4 4.0+3.5 - 4.0+3.5 4.0+3.4 - 4.0+3.4 | 5.0+4.2 - 5.0+4.2 5.0+4.4 - 5.0+4.4 5.0+4.5 - 5.0+4.5 5.0+4.4 - 5.0+4.4 | 6.0+5.2 - 6.0+5.2 6.0+5.4 - 6.0+5.4 6.0+5.5 - 6.0+5.5 6.0+5.4 - 6.0+5.4 |'}]
},
{
  id:'rhythm-palm-muted-eighths', cat:'rhythm', level:2, tags:['muting','rock','picking'], minutes:6,
  title:{en:'Palm-muted rock 8ths',pt:'Colcheias rock com abafamento'},
  goal:{en:'Chug steady down-picked 8th notes on power chords with an even palm mute.',pt:'Tocar colcheias regulares só para baixo em power chords com um abafamento uniforme.'},
  how:{en:['Rest the edge of the picking hand on the strings right next to the bridge.','Pick only down strokes, two per click.','Move the power chord shape between frets without lifting the palm.'],
       pt:['Pousa a lateral da mão da palheta nas cordas, mesmo junto à ponte.','Toca só palhetadas para baixo, duas por clique.','Mexe a forma do power chord entre trastes sem levantar a palma.']},
  tips:{en:['Too close to the neck sounds dead; too close to the bridge does not mute. Find the middle.'],pt:['Muito perto do braço soa morto; muito perto da ponte não abafa. Procura o meio-termo.']},
  sub:2, tempo:{start:80,goal:160,step:6},
  tab:rep('6.0m+5.2m',8)+' | '+rep('6.0m+5.2m',8)+' | '+rep('6.3m+5.5m',8)+' | '+rep('6.5m+5.7m',8)+' |',
  vars:[{name:{en:'Open accents on 1 and the "and" of 2',pt:'Acentos abertos no 1 e no "e" do 2'},tab:'6.0+5.2> 6.0m+5.2m 6.0m+5.2m 6.0+5.2> 6.0m+5.2m 6.0m+5.2m 6.0m+5.2m 6.0m+5.2m | 6.0+5.2> 6.0m+5.2m 6.0m+5.2m 6.0+5.2> 6.0m+5.2m 6.0m+5.2m 6.3+5.5> 6.5+5.7> | 6.0+5.2> 6.0m+5.2m 6.0m+5.2m 6.0+5.2> 6.0m+5.2m 6.0m+5.2m 6.0m+5.2m 6.0m+5.2m | 5.3+4.5> 5.3m+4.5m 5.3m+4.5m 5.5+4.7> 5.5m+4.7m 5.5m+4.7m 6.0+5.2> 6.0+5.2> |'}]
},
{
  id:'rhythm-gallop', cat:'rhythm', level:4, tags:['muting','metal','picking','stamina'], minutes:6,
  title:{en:'Gallop rhythm',pt:'Ritmo de galope'},
  goal:{en:'Play the "one, two-three" gallop (an 8th and two 16ths) tightly palm-muted.',pt:'Tocar o galope "um, dois-três" (uma colcheia e duas semicolcheias) bem abafado.'},
  how:{en:['Palm-mute the open 6th string.','Pick down on the beat, then down-up on the last two 16ths.','Every beat sounds "daa da-da".','Accent the power chords at the end of each bar.'],
       pt:['Abafa a 6.ª corda solta com a palma.','Palheta para baixo no tempo e depois baixo-cima nas duas últimas semicolcheias.','Cada tempo soa "táá ta-ta".','Acentua os power chords no fim de cada compasso.']},
  sub:4, tempo:{start:60,goal:140,step:5},
  tab:rep('6.0m - 6.0m 6.0m',4)+' | '+rep('6.0m - 6.0m 6.0m',2)+' 6.3+5.5> - 6.3m 6.3m 6.5+5.7> - 6.5m 6.5m |',
  vars:[{name:{en:'Reverse gallop',pt:'Galope invertido'},tab:rep('6.0m 6.0m 6.0m -',4)+' | '+rep('6.0m 6.0m 6.0m -',2)+' 6.3m 6.3m 6.3+5.5> - 6.2m 6.2m 6.2+5.4> - |'}]
},
{
  id:'rhythm-reggae-skank', cat:'rhythm', level:3, tags:['reggae','muting','syncopation','strumming'], minutes:6,
  title:{en:'Reggae off-beat skank',pt:'Skank de reggae no contratempo'},
  goal:{en:'Play short, crisp chords on beats 2 and 4 with silence everywhere else.',pt:'Tocar acordes curtos e secos nos tempos 2 e 4 com silêncio no resto.'},
  how:{en:['Use small chord shapes on the top four strings.','Strum a quick down stroke on beats 2 and 4.','Straight after the strum, relax the fretting hand so the chord stops.','Feel the tempo slowly: the space is the groove.'],
       pt:['Usa formas pequenas de acordes nas quatro cordas mais agudas.','Faz uma batida rápida para baixo nos tempos 2 e 4.','Logo a seguir à batida, alivia a mão do braço para o acorde parar.','Sente o andamento devagar: o espaço é o ritmo.']},
  tips:{en:['If the chord rings into the rest, it is not short enough.'],pt:['Se o acorde continua a soar na pausa, não está curto o suficiente.']},
  sub:2, tempo:{start:60,goal:90,step:3}, chords:{Am:[-1,-1,7,5,5,5],Dm:[-1,-1,7,7,6,5],G:[-1,-1,5,4,3,3],C:[-1,-1,5,5,5,3]},
  tab:prog(['Am','Am','Dm','Dm'],'- - D - - - D -'),
  vars:[
    {name:{en:'Off-beat 8ths',pt:'Colcheias no contratempo'},tab:prog(['Am','G','C','G'],'- U - U - U - U')},
    {name:{en:'Double chop on 4',pt:'Ataque duplo no 4'},tab:prog(['Am','Dm','G','C'],'- - D - - - D U')}
  ]
},
{
  id:'rhythm-bass-strum', cat:'rhythm', level:2, tags:['strumming','country','folk','open-chords'], minutes:6,
  title:{en:'Bass note and strum',pt:'Baixo e batida'},
  goal:{en:'Alternate a single bass note with a strum, switching bass notes inside each chord.',pt:'Alternar uma nota no baixo com uma batida, trocando de baixo dentro de cada acorde.'},
  how:{en:['Pick the root of the chord on beat 1, strum on 2.','On beat 3 pick another bass note from the same chord, strum on 4.','Aim for the bass string only, then the strum on the higher strings.'],
       pt:['Toca a tónica do acorde no tempo 1 e a batida no 2.','No tempo 3 toca outra nota grave do mesmo acorde e a batida no 4.','Acerta só na corda do baixo e depois faz a batida nas cordas mais agudas.']},
  sub:2, tempo:{start:60,goal:120,step:5}, chords:pick('G','C','D','Em'),
  tab:'@G 6.3 - D U 4.0 - D U | @C 5.3 - D U 4.2 - D U | @D 4.0 - D U 5.0 - D U | @G 6.3 - D U 4.0 - D U |',
  vars:[{name:{en:'With a walk-up to C',pt:'Com passagem no baixo até C'},tab:'@G 6.3 - D U 4.0 - D U | 6.3 - D U 5.0 - 5.2 - | @C 5.3 - D U 4.2 - D U | @D 4.0 - D U 5.0 - D U |'}]
},
{
  id:'rhythm-note-values', cat:'rhythm', level:1, tags:['timing'], minutes:5,
  title:{en:'Note values ladder',pt:'Escada de figuras'},
  goal:{en:'Play whole, half, quarter and 8th notes exactly in time with the click.',pt:'Tocar semibreves, mínimas, semínimas e colcheias certinhas com o clique.'},
  how:{en:['Play the open 5th string.','Bar 1: one note held for four clicks. Bar 2: two notes, two clicks each.','Bar 3: one note per click. Bar 4: two notes per click.','Count out loud the whole time.'],
       pt:['Toca a 5.ª corda solta.','Compasso 1: uma nota que dura quatro cliques. Compasso 2: duas notas de dois cliques cada.','Compasso 3: uma nota por clique. Compasso 4: duas notas por clique.','Conta sempre em voz alta.']},
  tips:{en:['Long notes are the hardest: keep counting so the next one does not come early.'],pt:['As notas longas são as mais difíceis: continua a contar para a seguinte não chegar antes do tempo.']},
  sub:2, tempo:{start:60,goal:120,step:5},
  tab:'5.0 = = = = = = = | 5.0 = = = 5.0 = = = | 5.0 = 5.0 = 5.0 = 5.0 = | 5.0 5.0 5.0 5.0 5.0 5.0 5.0 5.0 |',
  vars:[{name:{en:'Down the ladder',pt:'A descer a escada'},tab:'4.2 4.2 4.2 4.2 4.2 4.2 4.2 4.2 | 4.2 = 4.2 = 4.2 = 4.2 = | 4.2 = = = 4.2 = = = | 4.2 = = = = = = = |'}]
},
{
  id:'rhythm-quarters-click', cat:'rhythm', level:1, tags:['timing','picking'], minutes:5,
  title:{en:'Quarter notes on the click',pt:'Semínimas em cima do clique'},
  goal:{en:'Play single notes so they land exactly on the click and "hide" it.',pt:'Tocar notas soltas que caiam exatamente no clique e o "escondam".'},
  how:{en:['Play one note per click, moving through the open strings.','Listen: if the note is perfectly in time, the click almost disappears.','Record yourself and check whether you are early or late.'],
       pt:['Toca uma nota por clique, passando pelas cordas soltas.','Ouve: se a nota estiver certinha, o clique quase desaparece.','Grava-te e confirma se estás a tocar adiantado ou atrasado.']},
  tips:{en:['Most players rush. Relax and wait for the click.'],pt:['Quase todos aceleram. Relaxa e espera pelo clique.']},
  sub:1, tempo:{start:50,goal:120,step:5}, tool:'record',
  tab:'6.0 6.0 6.0 6.0 | 5.0 5.0 5.0 5.0 | 4.0 4.0 4.0 4.0 | 3.0 3.0 3.0 3.0 | 2.0 2.0 2.0 2.0 | 1.0 1.0 1.0 1.0 | 2.0 3.0 4.0 5.0 | 6.0 - - - |'
},
{
  id:'rhythm-click-2-and-4', cat:'rhythm', level:3, tags:['timing','strumming'], minutes:6,
  title:{en:'Click on 2 and 4',pt:'Clique no 2 e no 4'},
  goal:{en:'Hear the metronome as beats 2 and 4 and keep the groove yourself on 1 and 3.',pt:'Ouvir o metrónomo como os tempos 2 e 4 e manter tu o ritmo no 1 e no 3.'},
  how:{en:['Set the metronome to half the tempo you want.','Hear each click as beat 2 or 4, like a snare drum: "1 CLICK 3 CLICK".','Strum the pattern with accents on the clicks.','When this feels natural, the time is coming from you, not the metronome.'],
       pt:['Põe o metrónomo a metade do andamento que queres.','Ouve cada clique como o tempo 2 ou o 4, como uma tarola: "1 CLIQUE 3 CLIQUE".','Toca o padrão com acentos nos cliques.','Quando isto parecer natural, o tempo vem de ti e não do metrónomo.']},
  tips:{en:['Start by counting "2" and "4" out loud on the clicks for a few bars before playing.','Once it works, try a single click on beat 1 of every bar.'],
        pt:['Começa por contar "2" e "4" em voz alta nos cliques durante alguns compassos antes de tocar.','Quando funcionar, experimenta um só clique no tempo 1 de cada compasso.']},
  sub:2, tempo:{start:60,goal:120,step:5}, chords:pick('Am','Em','Dm','G','C'),
  tab:prog(['Am','G','Dm','Am'],'D U D> U D U D> U'),
  vars:[{name:{en:'Chucks on the click',pt:'Abafados no clique'},tab:prog(['Am','G','C','Em'],'D U X U D U X U')}]
},
{
  id:'rhythm-three-over-four', cat:'rhythm', level:4, tags:['syncopation','timing','strumming'], minutes:8,
  title:{en:'Groups of three in 4/4',pt:'Grupos de três em 4/4'},
  goal:{en:'Accent every third 8th note so the pattern floats across the bar line and lands back on 1 after three bars.',pt:'Acentuar cada terceira colcheia para o padrão atravessar a barra de compasso e voltar ao 1 ao fim de três compassos.'},
  how:{en:['Strum steady 8ths on {c:Em}.','Accent every third strum: "ONE two three ONE two three".','The accent falls in a different place each bar.','After three bars it lines up with beat 1 again.'],
       pt:['Toca colcheias regulares em {c:Em}.','Acentua cada terceira batida: "UM dois três UM dois três".','O acento cai num sítio diferente em cada compasso.','Ao fim de três compassos volta a coincidir com o tempo 1.']},
  tips:{en:['Keep the count of 4 in your foot and the count of 3 in your hand.'],pt:['Mantém a contagem de 4 no pé e a de 3 na mão.']},
  sub:2, tempo:{start:60,goal:110,step:5}, chords:pick('Em'),
  tab:'@Em '+groups(24,3,8),
  vars:[{name:{en:'Three-note cell',pt:'Célula de três notas'},tab:'6.0> 4.2 3.0 6.0> 4.2 3.0 6.0> 4.2 | 3.0 6.0> 4.2 3.0 6.0> 4.2 3.0 6.0> | 4.2 3.0 6.0> 4.2 3.0 6.0> 4.2 3.0 |'}]
},
{
  id:'rhythm-subdivision-ladder', cat:'rhythm', level:2, tags:['timing','muting','strumming'], minutes:5,
  title:{en:'Subdivision ladder',pt:'Escada de subdivisões'},
  goal:{en:'Switch cleanly between quarters, 8ths and 16ths against the same click.',pt:'Mudar com rigor entre semínimas, colcheias e semicolcheias com o mesmo clique.'},
  how:{en:['Mute all strings with the fretting hand and play muted strums (X).','Bar 1: one per click. Bar 2: two per click. Bar 3: four per click.','Then come back down.'],
       pt:['Abafa todas as cordas com a mão do braço e faz batidas abafadas (X).','Compasso 1: uma por clique. Compasso 2: duas por clique. Compasso 3: quatro por clique.','Depois volta a descer.']},
  sub:4, tempo:{start:50,goal:100,step:4},
  tab:'X - - - X - - - X - - - X - - - | X - X - X - X - X - X - X - X - | X X X X X X X X X X X X X X X X | X - X - X - X - X - X - X - X - |'
},
{
  id:'rhythm-stops', cat:'rhythm', level:2, tags:['timing','strumming','muting'], minutes:6,
  title:{en:'Rests and stops',pt:'Pausas e paragens'},
  goal:{en:'Stop the sound completely on the rests and come back in exactly on time.',pt:'Parar o som por completo nas pausas e voltar a entrar exatamente a tempo.'},
  how:{en:['Strum 8ths for the first part of the bar.','On a rest, mute all strings at once: relax the fretting hand and touch the strings with the strumming palm.','Count through the silence and come back in on beat 1.'],
       pt:['Toca colcheias na primeira parte do compasso.','Numa pausa, abafa todas as cordas de uma vez: alivia a mão do braço e toca nas cordas com a palma da outra mão.','Conta durante o silêncio e volta a entrar no tempo 1.']},
  tips:{en:['Silence must be as clean as the notes: no ringing strings.'],pt:['O silêncio tem de ser tão limpo como as notas: nada de cordas a soar.']},
  sub:2, tempo:{start:60,goal:120,step:5}, chords:pick('A','D','E','E7'),
  tab:'@A D U D U D - - - | @D D U D U D - - - | @A D U D U D U D U | @E D> - - - - - - - |',
  vars:[{name:{en:'Stop-time hits',pt:'Ataques com paragens'},tab:'@A D> - - - - - - - | D> - - - - - - - | D> - - - - - - - | @E7 D> - - - D> - D> - | @A D U D U D U D U | @D D U D U D U D U | @A D U D U @E D U D U | @A D> - - - - - - - |'}]
},
{
  id:'rhythm-half-time', cat:'rhythm', level:2, tags:['strumming','muting','rock','timing'], minutes:5,
  title:{en:'Half-time feel',pt:'Sensação de meio tempo'},
  goal:{en:'Make the same tempo feel twice as slow by placing the backbeat on beat 3.',pt:'Fazer o mesmo andamento parecer duas vezes mais lento pondo o acento forte no tempo 3.'},
  how:{en:['Strum a big chord on beat 1 and let it ring.','Chuck on beat 3 (X) like a slow snare.','Then compare with the normal feel in the variation, chucks on 2 and 4.'],
       pt:['Toca um acorde cheio no tempo 1 e deixa soar.','Faz um abafado no tempo 3 (X) como uma tarola lenta.','Depois compara com a sensação normal na variação, com abafados no 2 e no 4.']},
  sub:2, tempo:{start:70,goal:130,step:5}, chords:pick('Em','C','G','D'),
  tab:prog(['Em','C','G','D'],'D = = U X = = U'),
  vars:[{name:{en:'Normal feel',pt:'Sensação normal'},tab:prog(['Em','C','G','D'],'D U X U D U X U')}]
}
);
})();
