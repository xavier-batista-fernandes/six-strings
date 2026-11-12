/* Fretting-hand (left hand) technique: spiders, independence, stretches, legato, slides, bends, vibrato, shifts. */
(function(){
"use strict";
function bars(tokens, per){
  const out = [];
  tokens.forEach((t, i) => { if (i && i % per === 0) out.push('|'); out.push(t); });
  return out.join(' ');
}
function perms(a){
  if (a.length <= 1) return [a];
  const r = [];
  a.forEach((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach(p => r.push([x].concat(p))));
  return r;
}
/* Spider: finger order on each string from 6th to 1st, then backwards from 1st to 6th. Finger f sits on fret pos+f-1. */
function spider(order, pos){
  const t = [], rev = order.slice().reverse();
  for (let s = 6; s >= 1; s--) order.forEach(f => t.push(s + '.' + (pos + f - 1)));
  for (let s = 1; s <= 6; s++) rev.forEach(f => t.push(s + '.' + (pos + f - 1)));
  return bars(t, 16);
}
/* Same fret pattern on every string, up and then down (down pattern given separately). */
function acrossStrings(up, down, per){
  const t = [];
  for (let s = 6; s >= 1; s--) up.forEach(f => t.push(s + '.' + f));
  for (let s = 1; s <= 6; s++) down.forEach(f => t.push(s + '.' + f));
  return bars(t, per);
}
function trill(str, a, b){
  const t = [str + '.' + a];
  for (let i = 1; i < 16; i++) t.push(i % 2 ? str + '.' + b + 'h' : str + '.' + a + 'p');
  return t.join(' ');
}
/* A minor, three notes per string, starting on fret 5 of the 6th string. */
const AMIN3 = { 6: [5, 7, 8], 5: [5, 7, 8], 4: [5, 7, 9], 3: [5, 7, 9], 2: [6, 8, 10], 1: [7, 8, 10] };
function ladder(str){
  const t = [];
  [1, 5, 9].forEach(p => { for (let f = 0; f < 4; f++) t.push(str + '.' + (p + f)); });
  [9, 5, 1].forEach(p => { for (let f = 3; f >= 0; f--) t.push(str + '.' + (p + f)); });
  return bars(t, 12);
}

const list = [];

/* ---- The 24 spider orders ---- */
perms([1, 2, 3, 4]).forEach(order => {
  const key = order.join(''), dash = order.join('-'), back = order.slice().reverse().join('-');
  let jumps = 0;
  for (let i = 1; i < 4; i++) if (Math.abs(order[i] - order[i - 1]) > 1) jumps++;
  const level = (key === '1234' || key === '4321') ? 1 : jumps <= 1 ? 2 : 3;
  const hasFar = order.some((f, i) => i && Math.abs(f - order[i - 1]) === 3);
  const tipsEn = ['Keep the fingers you are not using hovering just above their frets.'];
  const tipsPt = ['Mantém os dedos que não estás a usar logo acima dos seus trastes.'];
  if (hasFar){ tipsEn.push('The jump between fingers 1 and 4 is the hard part: keep the hand still and let only the fingers move.');
               tipsPt.push('O salto entre os dedos 1 e 4 é a parte difícil: mantém a mão parada e mexe só os dedos.'); }
  if (level > 1){ tipsEn.push('Say the order out loud at a slow tempo until the fingers know it without thinking.');
                  tipsPt.push('Diz a ordem em voz alta num andamento lento até os dedos a saberem sem pensar.'); }
  list.push({
    id: 'left-spider-' + key, cat: 'left', level, tags: ['chromatic', 'stamina'], minutes: 5,
    title: { en: 'Spider walk ' + dash, pt: 'Aranha ' + dash },
    goal: { en: 'Play the finger order ' + dash + ' on every string with one finger per fret.',
            pt: 'Tocar a ordem de dedos ' + dash + ' em todas as cordas, um dedo por traste.' },
    how: { en: ['Place the hand with finger 1 on fret 5, 2 on fret 6, 3 on fret 7 and 4 on fret 8.',
                'On each string play the fingers in the order ' + dash + ', from the 6th string up to the 1st.',
                'Come back from the 1st string to the 6th playing the order backwards: ' + back + '.',
                'Use alternate picking all the way: down, up, down, up.'],
           pt: ['Põe a mão com o dedo 1 no traste 5, o 2 no 6, o 3 no 7 e o 4 no 8.',
                'Em cada corda toca os dedos pela ordem ' + dash + ', da 6.ª corda até à 1.ª.',
                'Volta da 1.ª corda à 6.ª com a ordem ao contrário: ' + back + '.',
                'Usa palhetada alternada sempre: baixo, cima, baixo, cima.'] },
    tips: { en: tipsEn, pt: tipsPt },
    sub: 4, tempo: level === 1 ? { start: 60, goal: 120, step: 4 } : level === 2 ? { start: 50, goal: 110, step: 4 } : { start: 45, goal: 100, step: 3 },
    learn: 'fretboard',
    tab: spider(order, 5),
    vars: [ { name: { en: 'Position 1 (frets 1-4, wider)', pt: 'Posição 1 (trastes 1-4, mais largos)' }, tab: spider(order, 1) },
            { name: { en: 'Position 9 (frets 9-12, narrower)', pt: 'Posição 9 (trastes 9-12, mais estreitos)' }, tab: spider(order, 9) } ]
  });
});

list.push(
/* ---- Finger independence ---- */
{
  id: 'left-anchor-index', cat: 'left', level: 2, tags: ['chromatic', 'stamina'], minutes: 3,
  title: { en: 'Anchored index finger', pt: 'Indicador ancorado' },
  goal: { en: 'Move fingers 2, 3 and 4 freely while finger 1 stays pressed down.',
          pt: 'Mexer os dedos 2, 3 e 4 à vontade enquanto o dedo 1 fica sempre pousado.' },
  how: { en: ['Press fret 5 of the 2nd string with finger 1 and never lift it.',
              'Fingers 2, 3 and 4 take turns on frets 6, 7 and 8; between them you hear fret 5 again.',
              'Pick every note.'],
         pt: ['Carrega no traste 5 da 2.ª corda com o dedo 1 e nunca o levantes.',
              'Os dedos 2, 3 e 4 revezam-se nos trastes 6, 7 e 8; entre eles volta a soar o traste 5.',
              'Ataca todas as notas com a palheta.'] },
  tips: { en: ['If finger 1 lifts when finger 4 plays, slow down: that is exactly the habit this fixes.'],
          pt: ['Se o dedo 1 se levantar quando o 4 toca, abranda: é exatamente esse hábito que isto corrige.'] },
  sub: 4, tempo: { start: 50, goal: 110, step: 4 },
  tab: '2.5 2.6 2.5 2.7 2.5 2.8 2.5 2.7 2.5 2.6 2.5 2.7 2.5 2.8 2.7 2.6',
  vars: [ { name: { en: 'On the 3rd string', pt: 'Na 3.ª corda' }, tab: '3.5 3.6 3.5 3.7 3.5 3.8 3.5 3.7 3.5 3.6 3.5 3.7 3.5 3.8 3.7 3.6' },
          { name: { en: 'On the 5th string', pt: 'Na 5.ª corda' }, tab: '5.5 5.6 5.5 5.7 5.5 5.8 5.5 5.7 5.5 5.6 5.5 5.7 5.5 5.8 5.7 5.6' } ]
},
{
  id: 'left-fixed-pinky', cat: 'left', level: 3, tags: ['stamina', 'string-crossing'], minutes: 3,
  title: { en: 'Fixed pinky', pt: 'Mindinho fixo' },
  goal: { en: 'Keep finger 4 planted on one string while the other fingers work on the next string.',
          pt: 'Manter o dedo 4 pousado numa corda enquanto os outros dedos trabalham na corda ao lado.' },
  how: { en: ['Put finger 4 on fret 8 of the 1st string and leave it there the whole time.',
              'Fingers 1, 2 and 3 play frets 5, 6 and 7 on the 2nd string.',
              'Every second note is the held pinky note on the 1st string.'],
         pt: ['Põe o dedo 4 no traste 8 da 1.ª corda e deixa-o lá o tempo todo.',
              'Os dedos 1, 2 e 3 tocam os trastes 5, 6 e 7 na 2.ª corda.',
              'Uma nota sim, outra não, é a nota do mindinho na 1.ª corda.'] },
  tips: { en: ['Arch the fingers so they do not touch the 1st string and mute the pinky note.'],
          pt: ['Arqueia os dedos para não tocarem na 1.ª corda e não abafarem a nota do mindinho.'] },
  sub: 4, tempo: { start: 50, goal: 100, step: 4 },
  tab: '2.5 1.8 2.6 1.8 2.7 1.8 2.6 1.8 2.5 1.8 2.6 1.8 2.7 1.8 2.6 1.8',
  vars: [ { name: { en: 'Strings 3 and 2', pt: 'Cordas 3 e 2' }, tab: '3.5 2.8 3.6 2.8 3.7 2.8 3.6 2.8 3.5 2.8 3.6 2.8 3.7 2.8 3.6 2.8' },
          { name: { en: 'Strings 5 and 4', pt: 'Cordas 5 e 4' }, tab: '5.5 4.8 5.6 4.8 5.7 4.8 5.6 4.8 5.5 4.8 5.6 4.8 5.7 4.8 5.6 4.8' } ]
},
{
  id: 'left-1324', cat: 'left', level: 2, tags: ['chromatic', 'stamina'], minutes: 4,
  title: { en: 'Skipping fingers 1-3, 2-4', pt: 'Dedos alternados 1-3, 2-4' },
  goal: { en: 'Separate neighbouring fingers by playing them in skipping pairs.',
          pt: 'Separar dedos vizinhos tocando-os aos pares alternados.' },
  how: { en: ['One finger per fret from fret 5: finger 1 on 5, 2 on 6, 3 on 7, 4 on 8.',
              'On each string play frets 5, 7, 6, 8 (fingers 1-3, then 2-4).',
              'On the way back play 8, 6, 7, 5 (fingers 4-2, then 3-1).'],
         pt: ['Um dedo por traste a partir do traste 5: dedo 1 no 5, 2 no 6, 3 no 7, 4 no 8.',
              'Em cada corda toca os trastes 5, 7, 6, 8 (dedos 1-3, depois 2-4).',
              'No regresso toca 8, 6, 7, 5 (dedos 4-2, depois 3-1).'] },
  sub: 4, tempo: { start: 50, goal: 110, step: 4 },
  tab: acrossStrings([5, 7, 6, 8], [8, 6, 7, 5], 16),
  vars: [ { name: { en: 'Position 2 (wider)', pt: 'Posição 2 (mais larga)' }, tab: acrossStrings([2, 4, 3, 5], [5, 3, 4, 2], 16) } ]
},
{
  id: 'left-diagonal-hold', cat: 'left', level: 3, tags: ['stamina', 'string-crossing'], minutes: 3,
  title: { en: 'Diagonal hold', pt: 'Diagonal pousada' },
  goal: { en: 'Hold four fingers on four strings at once and let every note ring.',
          pt: 'Manter quatro dedos em quatro cordas ao mesmo tempo e deixar todas as notas soar.' },
  how: { en: ['Place finger 1 on the 4th string fret 5, finger 2 on the 3rd string fret 6, finger 3 on the 2nd string fret 7, finger 4 on the 1st string fret 8.',
              'Keep all four down and pick the notes in the order shown.',
              'Every note should keep ringing; if one dies, a finger is touching the wrong string.'],
         pt: ['Põe o dedo 1 na 4.ª corda traste 5, o 2 na 3.ª corda traste 6, o 3 na 2.ª corda traste 7 e o 4 na 1.ª corda traste 8.',
              'Mantém os quatro pousados e toca as notas pela ordem indicada.',
              'Todas as notas devem continuar a soar; se uma se apagar, há um dedo a tocar na corda errada.'] },
  tips: { en: ['Play on the fingertips with the knuckles bent, like holding a small ball.'],
          pt: ['Toca com as pontas dos dedos e os nós dobrados, como se segurasses uma bola pequena.'] },
  sub: 2, tempo: { start: 60, goal: 120, step: 5 },
  tab: '4.5 3.6 2.7 1.8 2.7 3.6 4.5 3.6 | 4.5 2.7 3.6 1.8 4.5 1.8 3.6 2.7',
  vars: [ { name: { en: 'Reverse diagonal (finger 4 on the 4th string)', pt: 'Diagonal inversa (dedo 4 na 4.ª corda)' },
            tab: '4.8 3.7 2.6 1.5 2.6 3.7 4.8 3.7 | 4.8 2.6 3.7 1.5 4.8 1.5 3.7 2.6' } ]
},

/* ---- Stretches ---- */
{
  id: 'left-stretch-gap', cat: 'left', level: 3, tags: ['chromatic', 'stamina'], minutes: 4,
  title: { en: 'Five-fret stretch', pt: 'Afastamento de cinco trastes' },
  goal: { en: 'Cover five frets with four fingers high up the neck, where the frets are narrow.',
          pt: 'Cobrir cinco trastes com quatro dedos lá em cima no braço, onde os trastes são estreitos.' },
  how: { en: ['Fingers 1, 2, 3 on frets 12, 13, 14, and finger 4 reaches to fret 16.',
              'Play 12, 13, 14, 16 on each string from the 6th to the 1st.',
              'Come back down playing 16, 14, 13, 12.'],
         pt: ['Os dedos 1, 2 e 3 nos trastes 12, 13 e 14, e o dedo 4 estica-se até ao traste 16.',
              'Toca 12, 13, 14, 16 em cada corda, da 6.ª à 1.ª.',
              'Volta a descer a tocar 16, 14, 13, 12.'] },
  tips: { en: ['Let the thumb drop lower behind the neck; it opens the hand.', 'Stop if anything hurts. Stretch grows over weeks, not minutes.'],
          pt: ['Deixa o polegar descer atrás do braço; isso abre a mão.', 'Para se doer. O afastamento cresce em semanas, não em minutos.'] },
  sub: 4, tempo: { start: 50, goal: 100, step: 4 },
  tab: acrossStrings([12, 13, 14, 16], [16, 14, 13, 12], 16),
  vars: [ { name: { en: 'Lower: frets 7-11', pt: 'Mais abaixo: trastes 7-11' }, tab: acrossStrings([7, 8, 9, 11], [11, 9, 8, 7], 16) },
          { name: { en: 'Low and wide: frets 3-7', pt: 'Em baixo e largo: trastes 3-7' }, tab: acrossStrings([3, 4, 5, 7], [7, 5, 4, 3], 16) } ]
},
{
  id: 'left-stretch-whole-tones', cat: 'left', level: 3, tags: ['stamina', 'triplets'], minutes: 4,
  title: { en: 'Whole-step stretch', pt: 'Afastamento em tons inteiros' },
  goal: { en: 'Open the hand to two frets between each finger, three notes per string.',
          pt: 'Abrir a mão com dois trastes entre cada dedo, três notas por corda.' },
  how: { en: ['On each string play frets 12, 14 and 16 with fingers 1, 2 and 4.',
              'Count in threes: one string per beat.',
              'Go up from the 6th string to the 1st and back down.'],
         pt: ['Em cada corda toca os trastes 12, 14 e 16 com os dedos 1, 2 e 4.',
              'Conta em grupos de três: uma corda por tempo.',
              'Sobe da 6.ª corda à 1.ª e volta a descer.'] },
  tips: { en: ['Keep finger 1 down while the others reach; it is your anchor.'],
          pt: ['Mantém o dedo 1 pousado enquanto os outros esticam; é a tua âncora.'] },
  sub: 3, tempo: { start: 50, goal: 100, step: 4 },
  tab: acrossStrings([12, 14, 16], [16, 14, 12], 12),
  vars: [ { name: { en: 'Frets 9-13', pt: 'Trastes 9-13' }, tab: acrossStrings([9, 11, 13], [13, 11, 9], 12) },
          { name: { en: 'Frets 5-9 (hardest)', pt: 'Trastes 5-9 (o mais difícil)' }, tab: acrossStrings([5, 7, 9], [9, 7, 5], 12) } ]
},

/* ---- Legato ---- */
{
  id: 'left-hammer-on-basics', cat: 'left', level: 1, tags: ['legato'], minutes: 3,
  title: { en: 'First hammer-ons', pt: 'Primeiros ligados ascendentes' },
  goal: { en: 'Sound a second note just by hitting the string with a fretting finger.',
          pt: 'Fazer soar uma segunda nota só com a força do dedo a bater na corda.' },
  how: { en: ['Pick the open string, then drop a finger hard onto the fret shown without picking again.',
              'Land right behind the fret on the fingertip.',
              'Each pair is pick, hammer.'],
         pt: ['Toca a corda solta e depois deixa cair um dedo com força no traste indicado, sem voltar a tocar com a palheta.',
              'Aterra com a ponta do dedo logo atrás do traste.',
              'Cada par é palheta, martelo.'] },
  tips: { en: ['If the hammered note is quiet, hit faster, not harder.'],
          pt: ['Se a nota ligada soar fraca, bate mais rápido, não com mais força.'] },
  sub: 2, tempo: { start: 50, goal: 100, step: 5 },
  tab: '3.0 3.2h 3.0 3.2h 2.0 2.1h 2.0 2.3h | 1.0 1.1h 1.0 1.3h 2.0 2.3h 3.0 3.2h',
  vars: [ { name: { en: 'Fretted: from fret 5', pt: 'Com traste: a partir do traste 5' },
            tab: '3.5 3.7h 3.5 3.7h 2.5 2.6h 2.5 2.8h | 1.5 1.7h 1.5 1.8h 2.5 2.8h 3.5 3.7h' } ]
},
{
  id: 'left-pull-off-basics', cat: 'left', level: 1, tags: ['legato'], minutes: 3,
  title: { en: 'First pull-offs', pt: 'Primeiros ligados descendentes' },
  goal: { en: 'Sound a lower note by plucking the string with the finger as it leaves.',
          pt: 'Fazer soar uma nota mais grave puxando a corda com o dedo ao sair.' },
  how: { en: ['Fret the first note and pick it.',
              'Pull the finger slightly down and off the string, as if flicking it, so the open string sounds.',
              'Each pair is pick, pull.'],
         pt: ['Pisa a primeira nota e toca-a.',
              'Puxa o dedo um pouco para baixo e para fora da corda, como um piparote, para soar a corda solta.',
              'Cada par é palheta, puxar.'] },
  tips: { en: ['Lifting the finger straight up gives no sound; the small sideways flick is the trick.'],
          pt: ['Levantar o dedo a direito não dá som; o segredo é o pequeno piparote para o lado.'] },
  sub: 2, tempo: { start: 50, goal: 100, step: 5 },
  tab: '1.3 1.0p 1.1 1.0p 2.3 2.0p 2.1 2.0p | 3.2 3.0p 3.2 3.0p 2.1 2.0p 1.3 1.0p',
  vars: [ { name: { en: 'Fretted: down to fret 5', pt: 'Com traste: até ao traste 5' },
            tab: '1.8 1.5p 1.7 1.5p 2.8 2.5p 2.6 2.5p | 3.7 3.5p 3.7 3.5p 2.6 2.5p 1.8 1.5p' } ]
},
{
  id: 'left-trills', cat: 'left', level: 2, tags: ['legato', 'stamina'], minutes: 4,
  title: { en: 'Trills', pt: 'Trilos' },
  goal: { en: 'Keep a fast, even stream of hammer-ons and pull-offs between two fingers.',
          pt: 'Manter um fluxo rápido e regular de ligados entre dois dedos.' },
  how: { en: ['Pick the first note only; everything after it is hammer-on, pull-off, hammer-on...',
              'Keep the lower finger pressed the whole time.',
              'Try every finger pair in the variations; 3-4 is usually the weakest.'],
         pt: ['Ataca só a primeira nota; tudo o resto é ligado ascendente, descendente, ascendente...',
              'Mantém o dedo de baixo sempre pousado.',
              'Experimenta todos os pares de dedos nas variações; o 3-4 costuma ser o mais fraco.'] },
  tips: { en: ['Small movements: the hammering finger should stay close to the string.'],
          pt: ['Movimentos pequenos: o dedo que martela deve ficar perto da corda.'] },
  sub: 4, tempo: { start: 50, goal: 110, step: 4 },
  tab: trill(3, 5, 6),
  vars: [ { name: { en: 'Fingers 1-3', pt: 'Dedos 1-3' }, tab: trill(3, 5, 7) },
          { name: { en: 'Fingers 1-4', pt: 'Dedos 1-4' }, tab: trill(3, 5, 8) },
          { name: { en: 'Fingers 2-3', pt: 'Dedos 2-3' }, tab: trill(3, 6, 7) },
          { name: { en: 'Fingers 2-4', pt: 'Dedos 2-4' }, tab: trill(3, 6, 8) },
          { name: { en: 'Fingers 3-4', pt: 'Dedos 3-4' }, tab: trill(3, 7, 8) } ]
},
{
  id: 'left-legato-scale', cat: 'left', level: 3, tags: ['legato', 'minor', '3nps', 'triplets'], minutes: 5,
  title: { en: 'Legato scale, three notes per string', pt: 'Escala ligada, três notas por corda' },
  goal: { en: 'Play a whole minor scale with one pick per string and the rest legato.',
          pt: 'Tocar uma escala menor inteira com uma palhetada por corda e o resto ligado.' },
  how: { en: ['This is {n:A} minor, three notes on each string, starting on fret 5 of the 6th string.',
              'Going up, pick the first note on each string and hammer the other two.',
              'Coming down, pick the top note on each string and pull off to the other two.',
              'One string per beat, counted in threes.'],
         pt: ['Isto é {n:A} menor, três notas em cada corda, a começar no traste 5 da 6.ª corda.',
              'A subir, ataca a primeira nota de cada corda e liga as outras duas com martelo.',
              'A descer, ataca a nota mais aguda de cada corda e puxa para as outras duas.',
              'Uma corda por tempo, contado em grupos de três.'] },
  tips: { en: ['On the 2nd and 1st strings the hand moves up a fret: let finger 1 lead the shift.'],
          pt: ['Na 2.ª e na 1.ª corda a mão sobe um traste: deixa o dedo 1 guiar a mudança.'] },
  sub: 3, tempo: { start: 50, goal: 110, step: 4 }, learn: 'scales',
  tab: (function(){ const t = [];
    for (let s = 6; s >= 1; s--){ const f = AMIN3[s]; t.push(s + '.' + f[0], s + '.' + f[1] + 'h', s + '.' + f[2] + 'h'); }
    for (let s = 1; s <= 6; s++){ const f = AMIN3[s]; t.push(s + '.' + f[2], s + '.' + f[1] + 'p', s + '.' + f[0] + 'p'); }
    return bars(t, 12); })()
},
{
  id: 'left-legato-rolls', cat: 'left', level: 5, tags: ['legato', 'stamina', 'minor', '3nps'], minutes: 6,
  title: { en: 'Legato rolls in sixes', pt: 'Rolos ligados em seis' },
  goal: { en: 'Keep six legato notes per beat going on each string of the scale.',
          pt: 'Manter seis notas ligadas por tempo em cada corda da escala.' },
  how: { en: ['Use the three notes per string of {n:A} minor (frets 5-7-8 on the 6th string, and so on).',
              'Each beat stays on one string: up, up, down, down, up, with only the first note picked.',
              'Climb from the 6th string to the 1st, then roll back down from the top.'],
         pt: ['Usa as três notas por corda de {n:A} menor (trastes 5-7-8 na 6.ª corda, e assim por diante).',
              'Cada tempo fica numa só corda: sobe, sobe, desce, desce, sobe, com só a primeira nota atacada.',
              'Sobe da 6.ª corda à 1.ª e depois rola de volta lá de cima.'] },
  tips: { en: ['Mute the strings you are not playing with the side of the picking hand.',
               'If the notes get uneven, drop the tempo by 10 and rebuild.'],
          pt: ['Abafa as cordas que não estás a tocar com a parte de lado da mão da palheta.',
               'Se as notas ficarem desiguais, baixa o andamento 10 e volta a subir.'] },
  sub: 6, tempo: { start: 40, goal: 90, step: 3 }, learn: 'scales',
  tab: (function(){ const t = [];
    for (let s = 6; s >= 1; s--){ const [a, b, c] = AMIN3[s];
      t.push(s + '.' + a, s + '.' + b + 'h', s + '.' + c + 'h', s + '.' + b + 'p', s + '.' + a + 'p', s + '.' + b + 'h'); }
    for (let s = 1; s <= 6; s++){ const [a, b, c] = AMIN3[s];
      t.push(s + '.' + c, s + '.' + b + 'p', s + '.' + a + 'p', s + '.' + b + 'h', s + '.' + c + 'h', s + '.' + b + 'p'); }
    return bars(t, 24); })()
},

/* ---- Slides and shifts ---- */
{
  id: 'left-slide-one-finger', cat: 'left', level: 2, tags: ['positions'], minutes: 3,
  title: { en: 'One-finger slides', pt: 'Deslizar com um dedo' },
  goal: { en: 'Slide one finger between notes and land exactly on pitch.',
          pt: 'Deslizar um dedo entre notas e aterrar exatamente na nota certa.' },
  how: { en: ['Use finger 3 only, on the 3rd string.',
              'Pick the first note, then keep pressing while you slide to the next fret; do not pick again.',
              'Each note is held for a beat before the next slide.'],
         pt: ['Usa só o dedo 3, na 3.ª corda.',
              'Toca a primeira nota e continua a carregar enquanto deslizas para o traste seguinte; não voltes a tocar.',
              'Cada nota dura um tempo antes do deslize seguinte.'] },
  tips: { en: ['Ease the pressure a little while moving, then press again on arrival. Too light and the note dies.'],
          pt: ['Alivia um pouco a pressão enquanto te moves e volta a carregar ao chegar. Leve demais e a nota morre.'] },
  sub: 2, tempo: { start: 50, goal: 100, step: 5 },
  tab: '3.5 = 3.7s = 3.9s = 3.7s = | 3.5s = 3.4s = 3.2s = 3.4s =',
  vars: [ { name: { en: 'On the 2nd string', pt: 'Na 2.ª corda' }, tab: '2.5 = 2.7s = 2.9s = 2.7s = | 2.5s = 2.3s = 2.1s = 2.3s =' },
          { name: { en: 'With finger 1', pt: 'Com o dedo 1' }, tab: '4.5 = 4.7s = 4.9s = 4.7s = | 4.5s = 4.4s = 4.2s = 4.4s =' } ]
},
{
  id: 'left-slide-positions', cat: 'left', level: 3, tags: ['positions', 'minor'], minutes: 4,
  title: { en: 'Sliding between positions', pt: 'Deslizar entre posições' },
  goal: { en: 'Use slides to move up and down the neck in the middle of a scale.',
          pt: 'Usar deslizes para subir e descer o braço a meio de uma escala.' },
  how: { en: ['This is {n:A} minor on the 3rd and 2nd strings, from {n:A} up to the next {n:A}.',
              'Slide from fret 5 to 7 on the 3rd string with finger 4, then continue in the new position.',
              'At the top slide from fret 8 to 10 on the 2nd string, then come back down with two slides the other way.'],
         pt: ['Isto é {n:A} menor na 3.ª e na 2.ª corda, desde {n:A} até ao {n:A} seguinte.',
              'Desliza do traste 5 para o 7 na 3.ª corda com o dedo 4 e continua na posição nova.',
              'Lá em cima desliza do traste 8 para o 10 na 2.ª corda e depois desce com dois deslizes ao contrário.'] },
  tips: { en: ['Look at the target fret before you slide; the eyes lead the hand.'],
          pt: ['Olha para o traste de chegada antes de deslizar; os olhos guiam a mão.'] },
  sub: 2, tempo: { start: 50, goal: 110, step: 5 }, learn: 'scales',
  tab: '3.2 3.4 3.5 3.7s 2.5 2.6 2.8 2.10s | = 2.8s 2.6 2.5 3.7 3.5s 3.4 3.2'
},
{
  id: 'left-position-ladder', cat: 'left', level: 2, tags: ['chromatic', 'positions'], minutes: 3,
  title: { en: 'Position jumps', pt: 'Saltos de posição' },
  goal: { en: 'Jump the whole hand four frets at a time without losing the beat.',
          pt: 'Saltar com a mão inteira quatro trastes de cada vez sem perder o tempo.' },
  how: { en: ['On the 2nd string play frets 1-2-3-4 with fingers 1-2-3-4.',
              'Jump so that finger 1 lands on fret 5 and play 5-6-7-8, then jump again to 9-10-11-12.',
              'Come back down the same way, 4-3-2-1 in each position.'],
         pt: ['Na 2.ª corda toca os trastes 1-2-3-4 com os dedos 1-2-3-4.',
              'Salta para o dedo 1 aterrar no traste 5 e toca 5-6-7-8, depois salta outra vez para 9-10-11-12.',
              'Volta a descer da mesma forma, 4-3-2-1 em cada posição.'] },
  tips: { en: ['Move the thumb with the hand, so the hand shape arrives in one piece.'],
          pt: ['Leva o polegar com a mão, para a forma da mão chegar inteira.'] },
  beats: 3, sub: 4, tempo: { start: 50, goal: 110, step: 4 }, learn: 'fretboard',
  tab: ladder(2),
  vars: [ { name: { en: 'On the 1st string', pt: 'Na 1.ª corda' }, tab: ladder(1) },
          { name: { en: 'On the 4th string', pt: 'Na 4.ª corda' }, tab: ladder(4) },
          { name: { en: 'On the 6th string', pt: 'Na 6.ª corda' }, tab: ladder(6) } ]
},

/* ---- Bends ---- */
{
  id: 'left-bend-whole-step', cat: 'left', level: 2, tags: ['bends'], minutes: 4,
  title: { en: 'Whole-step bend to pitch', pt: 'Bend de um tom, afinado' },
  goal: { en: 'Bend a string up exactly one whole step, checking it against the real note.',
          pt: 'Puxar a corda exatamente um tom acima, a comparar com a nota verdadeira.' },
  how: { en: ['First play fret 10 on the 2nd string and listen: that is the target.',
              'Then play fret 8 with finger 3, fingers 1 and 2 behind it on the same string, and push the string up until it sounds like fret 10.',
              'Hold the bend steady for the whole note.'],
         pt: ['Primeiro toca o traste 10 da 2.ª corda e ouve: é esse o alvo.',
              'Depois toca o traste 8 com o dedo 3, com os dedos 1 e 2 atrás na mesma corda, e empurra a corda para cima até soar como o traste 10.',
              'Mantém o bend estável durante toda a nota.'] },
  tips: { en: ['Bend from the wrist, turning it like a doorknob, not by pushing with the finger alone.',
               'Most players bend too little. Record yourself and compare.'],
          pt: ['Puxa com o pulso, a rodar como numa maçaneta, e não só a empurrar com o dedo.',
               'A maioria das pessoas puxa de menos. Grava-te e compara.'] },
  sub: 1, tempo: { start: 50, goal: 80, step: 5 },
  tab: '2.10 = 2.8b10 = | 2.10 = 2.8b10 =',
  vars: [ { name: { en: 'On the 3rd string', pt: 'Na 3.ª corda' }, tab: '3.9 = 3.7b9 = | 3.9 = 3.7b9 =' },
          { name: { en: 'Higher: 2nd string, fret 13', pt: 'Mais acima: 2.ª corda, traste 13' }, tab: '2.15 = 2.13b15 = | 2.15 = 2.13b15 =' } ]
},
{
  id: 'left-bend-half-step', cat: 'left', level: 2, tags: ['bends'], minutes: 3,
  title: { en: 'Half-step bend to pitch', pt: 'Bend de meio tom, afinado' },
  goal: { en: 'Control a small bend of exactly one fret.',
          pt: 'Controlar um bend pequeno de exatamente um traste.' },
  how: { en: ['Play the target note first: fret 9 on the 2nd string.',
              'Then play fret 8 and bend it just enough to match fret 9.',
              'A half step is a small push; stop as soon as it matches.'],
         pt: ['Toca primeiro a nota alvo: traste 9 da 2.ª corda.',
              'Depois toca o traste 8 e puxa só o suficiente para igualar o traste 9.',
              'Meio tom é um empurrão pequeno; para assim que a nota coincidir.'] },
  sub: 1, tempo: { start: 50, goal: 80, step: 5 },
  tab: '2.9 = 2.8b9 = | 2.9 = 2.8b9 =',
  vars: [ { name: { en: 'On the 3rd string', pt: 'Na 3.ª corda' }, tab: '3.8 = 3.7b8 = | 3.8 = 3.7b8 =' },
          { name: { en: 'Half then whole', pt: 'Meio tom e depois um tom' }, tab: '2.9 = 2.8b9 = | 2.10 = 2.8b10 =' } ]
},
{
  id: 'left-bend-release', cat: 'left', level: 3, tags: ['bends', 'pentatonic', 'phrasing'], minutes: 4,
  title: { en: 'Bend and release', pt: 'Bend e regresso' },
  goal: { en: 'Bend up, hold, and lower the string back to the original note in time.',
          pt: 'Puxar, segurar e voltar a baixar a corda até à nota original, a tempo.' },
  how: { en: ['Bend fret 7 on the 3rd string up a whole step and hold it.',
              'On the next beat let it down slowly to fret 7 without picking again.',
              'Continue the little phrase from {n:A} minor pentatonic.'],
         pt: ['Puxa o traste 7 da 3.ª corda um tom acima e segura.',
              'No tempo seguinte deixa-a descer devagar até ao traste 7 sem voltar a tocar.',
              'Continua a pequena frase da pentatónica de {n:A} menor.'] },
  tips: { en: ['The release must land exactly on the fretted pitch, not a little above it.'],
          pt: ['O regresso tem de cair exatamente na nota do traste, não um pouco acima.'] },
  sub: 2, tempo: { start: 50, goal: 90, step: 5 }, learn: 'scales',
  tab: '3.7b9 = 3.7r 3.5 4.7 = = - | 2.8b10 = 2.8r 2.5 3.7 = = -'
},
{
  id: 'left-unison-bend', cat: 'left', level: 4, tags: ['bends'], minutes: 4,
  title: { en: 'Unison bends', pt: 'Bends em uníssono' },
  goal: { en: 'Bend one string up until it matches a fretted note on the next string.',
          pt: 'Puxar uma corda até igualar uma nota pisada na corda ao lado.' },
  how: { en: ['First play the fretted target alone: fret 5 on the 2nd string.',
              'Then hold it with finger 1 and, at the same time, bend fret 7 on the 3rd string with finger 3.',
              'When the bend is right the two notes merge into one; when it is off they wobble against each other.'],
         pt: ['Primeiro toca só a nota alvo: traste 5 da 2.ª corda.',
              'Depois segura-a com o dedo 1 e, ao mesmo tempo, puxa o traste 7 da 3.ª corda com o dedo 3.',
              'Quando o bend está certo as duas notas fundem-se numa só; quando não está, ondulam uma contra a outra.'] },
  tips: { en: ['Keep finger 1 firm: the bending string tends to push it off.'],
          pt: ['Mantém o dedo 1 firme: a corda puxada tende a empurrá-lo.'] },
  sub: 1, tempo: { start: 50, goal: 80, step: 5 },
  tab: '2.5 = 3.7b9+2.5 = | 1.7 = 2.10b12+1.7 =',
  vars: [ { name: { en: 'Lower position', pt: 'Posição mais baixa' }, tab: '2.3 = 3.5b7+2.3 = | 1.5 = 2.8b10+1.5 =' } ]
},

/* ---- Vibrato ---- */
{
  id: 'left-vibrato-slow', cat: 'left', level: 2, tags: ['vibrato'], minutes: 3,
  title: { en: 'Slow, even vibrato', pt: 'Vibrato lento e regular' },
  goal: { en: 'Make a long note sing with a steady, controlled vibrato.',
          pt: 'Fazer uma nota longa cantar com um vibrato estável e controlado.' },
  how: { en: ['Play the note and let it ring for the whole bar.',
              'Rock the string slightly up and back with a wrist turn, in time: two wobbles per beat.',
              'Try it with finger 3 (first two bars) and finger 1 (last two bars).'],
         pt: ['Toca a nota e deixa-a soar o compasso inteiro.',
              'Balança a corda um pouco para cima e de volta, com o pulso, a tempo: duas ondas por tempo.',
              'Experimenta com o dedo 3 (os dois primeiros compassos) e com o dedo 1 (os dois últimos).'] },
  tips: { en: ['The pitch should come back to the fretted note each time, not drift sharp.'],
          pt: ['A afinação deve voltar sempre à nota do traste, não ficar a subir.'] },
  sub: 1, tempo: { start: 50, goal: 80, step: 5 },
  tab: '2.8v = = = | 3.7v = = = | 2.5v = = = | 3.5v = = ='
},
{
  id: 'left-vibrato-phrases', cat: 'left', level: 3, tags: ['vibrato', 'pentatonic', 'phrasing'], minutes: 4,
  title: { en: 'Phrases that end in vibrato', pt: 'Frases que acabam em vibrato' },
  goal: { en: 'Finish short phrases with a long, singing vibrato note.',
          pt: 'Terminar frases curtas com uma nota longa e cantada em vibrato.' },
  how: { en: ['Each bar is two quick notes and a long one, all from {n:A} minor pentatonic.',
              'Start the vibrato as soon as the long note sounds and keep it going to the end of the bar.',
              'Use the finger the note falls on: 1 or 3.'],
         pt: ['Cada compasso tem duas notas rápidas e uma longa, todas da pentatónica de {n:A} menor.',
              'Começa o vibrato logo que a nota longa soa e mantém-no até ao fim do compasso.',
              'Usa o dedo que calha na nota: 1 ou 3.'] },
  sub: 2, tempo: { start: 60, goal: 100, step: 5 }, learn: 'scales',
  tab: '2.5 2.8 1.5v = = = = = | 3.5 3.7 2.5v = = = = = | 4.5 4.7 3.7v = = = = = | 4.5 3.5 4.7v = = = = ='
},
{
  id: 'left-bend-vibrato', cat: 'left', level: 4, tags: ['bends', 'vibrato', 'phrasing'], minutes: 4,
  title: { en: 'Vibrato on a bend', pt: 'Vibrato num bend' },
  goal: { en: 'Hold a bent note at pitch and add vibrato on top of it.',
          pt: 'Segurar uma nota puxada afinada e juntar-lhe vibrato.' },
  how: { en: ['Bend fret 7 on the 3rd string up a whole step.',
              'Once it is in tune, let it dip slightly and push back up, over and over: that is vibrato on a bend.',
              'Release to fret 7 and finish the phrase. The second half does the same on the 2nd string.'],
         pt: ['Puxa o traste 7 da 3.ª corda um tom acima.',
              'Quando estiver afinada, deixa-a descer um pouco e volta a empurrar, várias vezes: isso é vibrato num bend.',
              'Volta ao traste 7 e acaba a frase. A segunda metade faz o mesmo na 2.ª corda.'] },
  tips: { en: ['The vibrato goes below the target and back up, never above it.'],
          pt: ['O vibrato desce abaixo do alvo e volta, nunca passa por cima dele.'] },
  sub: 1, tempo: { start: 50, goal: 80, step: 5 }, learn: 'scales',
  tab: '3.7b9v = = = | 3.7r 3.5 4.7v = | 2.8b10v = = = | 2.8r 2.5 3.7v ='
}
);

(window.SS_EXERCISES = window.SS_EXERCISES || []).push.apply(window.SS_EXERCISES, list);
})();
