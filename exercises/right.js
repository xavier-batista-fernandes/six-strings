/* Picking-hand (right hand) technique: alternate, crossing, skipping, economy, sweeps, muting, tremolo, fingerstyle, Travis, hybrid. */
(function(){
"use strict";
function bars(tokens, per){
  const out = [];
  tokens.forEach((t, i) => { if (i && i % per === 0) out.push('|'); out.push(t); });
  return out.join(' ');
}
function rep(tok, n){ return Array(n).fill(tok); }
/* A minor, three notes per string, from fret 5 of the 6th string. */
const AMIN3 = { 6: [5, 7, 8], 5: [5, 7, 8], 4: [5, 7, 9], 3: [5, 7, 9], 2: [6, 8, 10], 1: [7, 8, 10] };
function amin3(){
  const t = [];
  for (let s = 6; s >= 1; s--) AMIN3[s].forEach(f => t.push(s + '.' + f));
  for (let s = 1; s <= 6; s++) AMIN3[s].slice().reverse().forEach(f => t.push(s + '.' + f));
  return bars(t, 12);
}
/* Moving accent: 16ths on one note, the accent moves one 16th later every bar. */
function movingAccent(note){
  const t = [];
  for (let b = 0; b < 4; b++) for (let i = 0; i < 16; i++) t.push(i % 4 === b ? note + '>' : note);
  return bars(t, 16);
}
/* Sweep loop over three strings: up three strings, hammer, pull, back. Two loops fill a 4/4 bar of triplets. */
function sweep(a, b, c, top){
  const loop = ['3.' + a, '2.' + b, '1.' + c, '1.' + top + 'h', '1.' + c + 'p', '2.' + b];
  return loop.concat(loop);
}
/* A minor pentatonic box 1, high to low, in descending groups of six. */
const PENT_DOWN = ['1.8', '1.5', '2.8', '2.5', '3.7', '3.5', '4.7', '4.5', '5.7', '5.5', '6.8', '6.5'];
function sixes(){
  const down = [];
  [0, 2, 4, 6].forEach(i => down.push.apply(down, PENT_DOWN.slice(i, i + 6)));
  return bars(down.concat(down.slice().reverse()), 24);
}

(window.SS_EXERCISES = window.SS_EXERCISES || []).push(
/* ---- Alternate picking on one string ---- */
{
  id: 'right-alt-8ths', cat: 'right', level: 1, tags: ['picking', 'alternate-picking', 'timing'], minutes: 3,
  title: { en: 'Alternate picking in 8ths', pt: 'Palhetada alternada em colcheias' },
  goal: { en: 'Pick down on the beat and up between beats, steadily, on one string.',
          pt: 'Palhetar para baixo no tempo e para cima entre tempos, com regularidade, numa só corda.' },
  how: { en: ['Every note is played twice: down on the beat, up on the "and".',
              'Stay on the 3rd string; the fretting hand just moves between frets 0, 2, 4 and 5.',
              'Keep the pick moving down-up even when the note changes.'],
         pt: ['Cada nota toca-se duas vezes: para baixo no tempo, para cima no "e".',
              'Fica na 3.ª corda; a mão esquerda só muda entre os trastes 0, 2, 4 e 5.',
              'Mantém a palheta a mexer baixo-cima mesmo quando a nota muda.'] },
  tips: { en: ['Hold the pick lightly with only its tip showing; a small movement is enough.'],
          pt: ['Segura a palheta com leveza e só a ponta de fora; basta um movimento pequeno.'] },
  sub: 2, tempo: { start: 60, goal: 140, step: 5 },
  tab: '3.2 3.2 3.4 3.4 3.5 3.5 3.4 3.4 | 3.2 3.2 3.0 3.0 3.2 3.2 3.2 3.2',
  vars: [ { name: { en: 'On the 2nd string', pt: 'Na 2.ª corda' }, tab: '2.1 2.1 2.3 2.3 2.5 2.5 2.3 2.3 | 2.1 2.1 2.0 2.0 2.1 2.1 2.1 2.1' },
          { name: { en: 'On the 5th string', pt: 'Na 5.ª corda' }, tab: '5.2 5.2 5.3 5.3 5.5 5.5 5.3 5.3 | 5.2 5.2 5.0 5.0 5.2 5.2 5.2 5.2' } ]
},
{
  id: 'right-alt-triplets', cat: 'right', level: 2, tags: ['picking', 'alternate-picking', 'triplets'], minutes: 3,
  title: { en: 'Alternate picking in triplets', pt: 'Palhetada alternada em tercinas' },
  goal: { en: 'Keep strict down-up picking when groups of three make each beat start on a different stroke.',
          pt: 'Manter a palhetada baixo-cima mesmo quando os grupos de três fazem cada tempo começar com um golpe diferente.' },
  how: { en: ['Three notes per beat: count "1-trip-let, 2-trip-let".',
              'Accent the first note of each beat.',
              'Because three is odd, beat 1 starts with a downstroke and beat 2 with an upstroke. Do not fix it, practise it.'],
         pt: ['Três notas por tempo: conta "1-e-a, 2-e-a".',
              'Acentua a primeira nota de cada tempo.',
              'Como três é ímpar, o 1.º tempo começa para baixo e o 2.º para cima. Não corrijas isso, treina-o.'] },
  tips: { en: ['The up-stroke accents are the weak spot; make them as loud as the down ones.'],
          pt: ['Os acentos para cima são o ponto fraco; faz com que soem tão fortes como os para baixo.'] },
  sub: 3, tempo: { start: 50, goal: 120, step: 4 },
  tab: '3.5> 3.5 3.5 3.7> 3.7 3.7 3.9> 3.9 3.9 3.7> 3.7 3.7',
  vars: [ { name: { en: 'On the 1st string', pt: 'Na 1.ª corda' }, tab: '1.5> 1.5 1.5 1.7> 1.7 1.7 1.8> 1.8 1.8 1.7> 1.7 1.7' } ]
},
{
  id: 'right-alt-16ths', cat: 'right', level: 2, tags: ['picking', 'alternate-picking', 'stamina'], minutes: 4,
  title: { en: 'Alternate picking in 16ths', pt: 'Palhetada alternada em semicolcheias' },
  goal: { en: 'Play four even notes per beat with alternate picking.',
          pt: 'Tocar quatro notas iguais por tempo com palhetada alternada.' },
  how: { en: ['Four picks per note, one note per beat: count "1-e-and-a".',
              'Down, up, down, up on every beat.',
              'Change the fretted note exactly on the beat.'],
         pt: ['Quatro palhetadas por nota, uma nota por tempo: conta "1-e-e-a".',
              'Baixo, cima, baixo, cima em cada tempo.',
              'Muda a nota pisada exatamente no tempo.'] },
  tips: { en: ['Move from the wrist, not the elbow, and keep the forearm relaxed.'],
          pt: ['Mexe o pulso, não o cotovelo, e mantém o antebraço descontraído.'] },
  sub: 4, tempo: { start: 50, goal: 130, step: 4 },
  tab: bars([].concat(rep('2.5', 4), rep('2.6', 4), rep('2.8', 4), rep('2.6', 4), rep('2.5', 4), rep('2.3', 4), rep('2.1', 4), rep('2.3', 4)), 16),
  vars: [ { name: { en: 'On the 4th string', pt: 'Na 4.ª corda' },
            tab: bars([].concat(rep('4.5', 4), rep('4.7', 4), rep('4.9', 4), rep('4.7', 4), rep('4.5', 4), rep('4.3', 4), rep('4.2', 4), rep('4.3', 4)), 16) } ]
},
{
  id: 'right-speed-bursts', cat: 'right', level: 2, tags: ['picking', 'alternate-picking'], minutes: 3,
  title: { en: 'Speed bursts', pt: 'Rajadas de velocidade' },
  goal: { en: 'Pick short fast bursts and relax completely in the rests.',
          pt: 'Palhetar rajadas curtas e rápidas e descontrair totalmente nas pausas.' },
  how: { en: ['Play five quick notes, then rest until the next burst.',
              'The last bar has a longer burst of nine notes.',
              'In the rests, loosen the hand on purpose before the next burst.'],
         pt: ['Toca cinco notas rápidas e depois descansa até à rajada seguinte.',
              'O último compasso tem uma rajada mais longa de nove notas.',
              'Nas pausas, solta a mão de propósito antes da rajada seguinte.'] },
  tips: { en: ['Short bursts let you play faster than your steady speed. Push the tempo here.'],
          pt: ['Rajadas curtas deixam-te tocar mais rápido do que consegues de forma contínua. Aqui puxa pelo andamento.'] },
  sub: 4, tempo: { start: 60, goal: 150, step: 5 },
  tab: '1.5 1.5 1.5 1.5 1.5 - - - 1.5 1.5 1.5 1.5 1.5 - - - | 1.5 1.5 1.5 1.5 1.5 1.5 1.5 1.5 1.5 - - - - - - -'
},
{
  id: 'right-moving-accents', cat: 'right', level: 3, tags: ['picking', 'alternate-picking', 'timing'], minutes: 4,
  title: { en: 'Moving accents', pt: 'Acentos que mudam de lugar' },
  goal: { en: 'Control every pick stroke by accenting a different 16th note in each bar.',
          pt: 'Controlar cada palhetada, acentuando uma semicolcheia diferente em cada compasso.' },
  how: { en: ['Steady 16ths on one note.',
              'Bar 1 accents "1", bar 2 accents "e", bar 3 accents "and", bar 4 accents "a" of every beat.',
              'Only the accented notes get louder; keep the rest soft and even.'],
         pt: ['Semicolcheias regulares numa só nota.',
              'O 1.º compasso acentua o "1", o 2.º o "e", o 3.º o segundo "e" e o 4.º o "a" de cada tempo.',
              'Só as notas acentuadas sobem de volume; as outras ficam suaves e iguais.'] },
  tips: { en: ['Bars 2 and 4 put the accent on an upstroke, which is the real test.'],
          pt: ['Os compassos 2 e 4 põem o acento numa palhetada para cima, e esse é o verdadeiro teste.'] },
  sub: 4, tempo: { start: 50, goal: 120, step: 4 },
  tab: movingAccent('3.7'),
  vars: [ { name: { en: 'Palm-muted on the 6th string', pt: 'Abafado na 6.ª corda' }, tab: movingAccent('6.0m') } ]
},

/* ---- String crossing ---- */
{
  id: 'right-outside-picking', cat: 'right', level: 2, tags: ['picking', 'alternate-picking', 'string-crossing'], minutes: 3,
  title: { en: 'Outside picking', pt: 'Palhetada por fora' },
  goal: { en: 'Cross between two strings with the pick travelling around the outside of the pair.',
          pt: 'Passar entre duas cordas com a palheta a contornar o par por fora.' },
  how: { en: ['Alternate between the 3rd and 2nd strings, one note each.',
              'The thicker string always gets a downstroke and the thinner one an upstroke.',
              'So the pick has to hop over each string to reach it from outside.'],
         pt: ['Alterna entre a 3.ª e a 2.ª corda, uma nota em cada.',
              'A corda mais grossa leva sempre palhetada para baixo e a mais fina para cima.',
              'Por isso a palheta tem de saltar por cima de cada corda para chegar por fora.'] },
  tips: { en: ['Make the hop small: just enough to clear the string.'],
          pt: ['Faz o salto pequeno: só o suficiente para passar a corda.'] },
  sub: 4, tempo: { start: 50, goal: 120, step: 4 },
  tab: '3.5 2.5 3.5 2.5 3.7 2.6 3.7 2.6 3.7 2.8 3.7 2.8 3.5 2.6 3.5 2.6',
  vars: [ { name: { en: 'Strings 5 and 4', pt: 'Cordas 5 e 4' }, tab: '5.3 4.2 5.3 4.2 5.5 4.3 5.5 4.3 5.5 4.5 5.5 4.5 5.3 4.3 5.3 4.3' } ]
},
{
  id: 'right-inside-picking', cat: 'right', level: 2, tags: ['picking', 'alternate-picking', 'string-crossing'], minutes: 3,
  title: { en: 'Inside picking', pt: 'Palhetada por dentro' },
  goal: { en: 'Cross between two strings with the pick staying trapped between them.',
          pt: 'Passar entre duas cordas com a palheta sempre presa entre elas.' },
  how: { en: ['The same notes as outside picking, but each pair starts on the thinner string.',
              'Now the thinner string gets the downstroke and the thicker one the upstroke.',
              'The pick stays in the gap between the two strings.'],
         pt: ['As mesmas notas da palhetada por fora, mas cada par começa na corda mais fina.',
              'Agora a corda mais fina leva a palhetada para baixo e a mais grossa para cima.',
              'A palheta fica no espaço entre as duas cordas.'] },
  tips: { en: ['Most players find one of the two harder. Spend more time on that one.'],
          pt: ['A maioria acha uma das duas mais difícil. Passa mais tempo nessa.'] },
  sub: 4, tempo: { start: 50, goal: 120, step: 4 },
  tab: '2.5 3.5 2.5 3.5 2.6 3.7 2.6 3.7 2.8 3.7 2.8 3.7 2.6 3.5 2.6 3.5',
  vars: [ { name: { en: 'Strings 5 and 4', pt: 'Cordas 5 e 4' }, tab: '4.2 5.3 4.2 5.3 4.3 5.5 4.3 5.5 4.5 5.5 4.5 5.5 4.3 5.3 4.3 5.3' } ]
},
{
  id: 'right-three-string-rolls', cat: 'right', level: 2, tags: ['picking', 'string-crossing', 'open-chords'], minutes: 3,
  title: { en: 'Three-string rolls', pt: 'Rolos em três cordas' },
  goal: { en: 'Alternate-pick across three strings through a chord progression.',
          pt: 'Palhetar alternado em três cordas ao longo de uma sequência de acordes.' },
  how: { en: ['Each beat is one chord on the top three strings: {c:C}, {c:Am}, {c:F}, {c:G}.',
              'Play low, middle, high, middle on each beat with down-up-down-up.',
              'Change the chord shape exactly on the beat.'],
         pt: ['Cada tempo é um acorde nas três cordas agudas: {c:C}, {c:Am}, {c:F}, {c:G}.',
              'Toca grave, meio, aguda, meio em cada tempo, com baixo-cima-baixo-cima.',
              'Muda a forma do acorde exatamente no tempo.'] },
  sub: 4, tempo: { start: 50, goal: 110, step: 4 }, learn: 'chords',
  tab: '3.0 2.1 1.0 2.1 3.2 2.1 1.0 2.1 3.2 2.1 1.1 2.1 3.0 2.0 1.3 2.0'
},
{
  id: 'right-skip-pentatonic', cat: 'right', level: 3, tags: ['picking', 'string-crossing', 'pentatonic'], minutes: 4,
  title: { en: 'Pentatonic string skipping', pt: 'Pentatónica a saltar cordas' },
  goal: { en: 'Jump over a string cleanly while alternate picking.',
          pt: 'Saltar por cima de uma corda com limpeza, em palhetada alternada.' },
  how: { en: ['These are notes of {n:A} minor pentatonic around fret 5, two on one string and two on the string after next.',
              'Pairs go 6th and 4th, 5th and 3rd, 4th and 2nd, 3rd and 1st, then back down.',
              'Keep strict alternate picking over the skipped strings.'],
         pt: ['São notas da pentatónica de {n:A} menor à volta do traste 5, duas numa corda e duas na corda a seguir à próxima.',
              'Os pares são 6.ª e 4.ª, 5.ª e 3.ª, 4.ª e 2.ª, 3.ª e 1.ª, e depois de volta.',
              'Mantém a palhetada alternada por cima das cordas saltadas.'] },
  tips: { en: ['Mute the skipped string with the fretting finger lying lightly on it.'],
          pt: ['Abafa a corda saltada com o dedo da mão esquerda pousado levemente nela.'] },
  sub: 4, tempo: { start: 50, goal: 120, step: 4 }, learn: 'scales',
  tab: '6.5 6.8 4.5 4.7 5.5 5.7 3.5 3.7 4.5 4.7 2.5 2.8 3.5 3.7 1.5 1.8 | 1.8 1.5 3.7 3.5 2.8 2.5 4.7 4.5 3.7 3.5 5.7 5.5 4.7 4.5 6.8 6.5'
},
{
  id: 'right-skip-wide', cat: 'right', level: 4, tags: ['picking', 'string-crossing', 'pentatonic'], minutes: 4,
  title: { en: 'Wide string skips', pt: 'Saltos largos de corda' },
  goal: { en: 'Jump over two strings at a time without losing the pick direction.',
          pt: 'Saltar duas cordas de cada vez sem perder a direção da palheta.' },
  how: { en: ['Pairs of strings three apart: 6th and 3rd, 5th and 2nd, 4th and 1st.',
              'Each beat alternates between the two strings of a pair, all notes from {n:A} minor pentatonic.',
              'The second bar comes back the same way in reverse.'],
         pt: ['Pares de cordas a três de distância: 6.ª e 3.ª, 5.ª e 2.ª, 4.ª e 1.ª.',
              'Cada tempo alterna entre as duas cordas de um par, todas as notas da pentatónica de {n:A} menor.',
              'O segundo compasso volta pelo mesmo caminho ao contrário.'] },
  tips: { en: ['Watch the pick for a few rounds; the eyes learn the distance faster than the hand.'],
          pt: ['Olha para a palheta durante algumas voltas; os olhos aprendem a distância mais depressa do que a mão.'] },
  beats: 3, sub: 4, tempo: { start: 50, goal: 110, step: 4 }, learn: 'scales',
  tab: '6.5 3.5 6.8 3.7 5.5 2.5 5.7 2.8 4.5 1.5 4.7 1.8 | 1.8 4.7 1.5 4.5 2.8 5.7 2.5 5.5 3.7 6.8 3.5 6.5'
},

/* ---- Economy, 3nps, sweeps ---- */
{
  id: 'right-economy-3nps', cat: 'right', level: 3, tags: ['picking', 'economy', '3nps', 'minor', 'triplets'], minutes: 5,
  title: { en: 'Economy picking, three notes per string', pt: 'Palhetada económica, três notas por corda' },
  goal: { en: 'Cross strings by continuing the pick in the same direction instead of reversing it.',
          pt: 'Mudar de corda continuando a palheta na mesma direção, em vez de a inverter.' },
  how: { en: ['This is {n:A} minor with three notes on each string, one string per beat.',
              'Going up, every string is down-up-down, and the last downstroke carries straight on to the next string.',
              'Coming down, every string is up-down-up, and the last upstroke carries on to the next string.'],
         pt: ['Isto é {n:A} menor com três notas em cada corda, uma corda por tempo.',
              'A subir, cada corda é baixo-cima-baixo, e a última palhetada para baixo segue direta para a corda seguinte.',
              'A descer, cada corda é cima-baixo-cima, e a última para cima segue para a corda seguinte.'] },
  tips: { en: ['The string change should feel like one push through two strings, not two separate strokes.'],
          pt: ['A mudança de corda deve parecer um só empurrão por duas cordas, não duas palhetadas separadas.'] },
  sub: 3, tempo: { start: 50, goal: 120, step: 4 }, learn: 'scales',
  tab: amin3()
},
{
  id: 'right-alternate-3nps', cat: 'right', level: 4, tags: ['picking', 'alternate-picking', '3nps', 'minor', 'triplets'], minutes: 5,
  title: { en: 'Strict alternate, three notes per string', pt: 'Alternada estrita, três notas por corda' },
  goal: { en: 'Keep strict alternate picking through a scale where every string change flips the pick direction.',
          pt: 'Manter a palhetada alternada estrita numa escala em que cada mudança de corda inverte a direção.' },
  how: { en: ['The same {n:A} minor scale as the economy exercise, but now never break the down-up pattern.',
              'The first string goes down-up-down, the next up-down-up, and so on.',
              'Half of the string changes are outside picking and half inside.'],
         pt: ['A mesma escala de {n:A} menor do exercício de palhetada económica, mas agora nunca quebres o baixo-cima.',
              'A primeira corda é baixo-cima-baixo, a seguinte cima-baixo-cima, e assim por diante.',
              'Metade das mudanças de corda são por fora e metade por dentro.'] },
  tips: { en: ['Compare with the economy version at the same tempo and notice which feels smoother to you.'],
          pt: ['Compara com a versão económica ao mesmo andamento e repara qual te parece mais fluida.'] },
  sub: 3, tempo: { start: 50, goal: 130, step: 4 }, learn: 'scales',
  tab: amin3()
},
{
  id: 'right-sweep-three-strings', cat: 'right', level: 4, tags: ['sweep', 'arpeggios', 'triplets'], minutes: 5,
  title: { en: 'Three-string sweep', pt: 'Varrimento em três cordas' },
  goal: { en: 'Play a small arpeggio across three strings with one smooth pick motion each way.',
          pt: 'Tocar um pequeno arpejo em três cordas com um só movimento de palheta em cada sentido.' },
  how: { en: ['This is {c:Am}: fret 9 on the 3rd string, 10 on the 2nd, 8 and 12 on the 1st.',
              'Push the pick down through the three strings in one movement, one note per string.',
              'Hammer to fret 12 and pull back to 8 on the 1st string, then pull the pick up through the 2nd and 3rd strings.',
              'Lift each finger as soon as its note is done, so the notes do not ring together.'],
         pt: ['Isto é {c:Am}: traste 9 na 3.ª corda, 10 na 2.ª, 8 e 12 na 1.ª.',
              'Empurra a palheta para baixo pelas três cordas num só movimento, uma nota por corda.',
              'Liga para o traste 12 e volta ao 8 na 1.ª corda, depois puxa a palheta para cima pela 2.ª e pela 3.ª corda.',
              'Levanta cada dedo logo que a sua nota acaba, para as notas não soarem juntas.'] },
  tips: { en: ['A sweep is a slow push, not a strum. At a slow tempo every note must be separate.'],
          pt: ['O varrimento é um empurrão lento, não um rasgueado. Em andamento lento cada nota tem de soar separada.'] },
  sub: 3, tempo: { start: 40, goal: 100, step: 4 }, learn: 'chords',
  tab: sweep(9, 10, 8, 12).join(' '),
  vars: [ { name: { en: '{c:G} shape', pt: 'Forma de {c:G}' }, tab: sweep(7, 8, 7, 10).join(' ') },
          { name: { en: '{c:Em} shape', pt: 'Forma de {c:Em}' }, tab: sweep(4, 5, 3, 7).join(' ') } ]
},
{
  id: 'right-sweep-progression', cat: 'right', level: 5, tags: ['sweep', 'arpeggios', 'triplets', 'changes'], minutes: 6,
  title: { en: 'Sweeping through chords', pt: 'Varrimento pelos acordes' },
  goal: { en: 'Sweep a three-string arpeggio for each chord of a progression without a gap.',
          pt: 'Fazer varrimento de um arpejo de três cordas em cada acorde de uma sequência, sem falhas.' },
  how: { en: ['One bar each of {c:Am}, {c:G}, {c:F} and {c:E}, each swept twice.',
              '{c:Am} starts at fret 9 of the 3rd string, {c:G} at fret 7, {c:F} at fret 5 and {c:E} at fret 4.',
              'Look ahead to the next shape during the last two notes of each bar.'],
         pt: ['Um compasso de cada um: {c:Am}, {c:G}, {c:F} e {c:E}, cada um varrido duas vezes.',
              '{c:Am} começa no traste 9 da 3.ª corda, {c:G} no 7, {c:F} no 5 e {c:E} no 4.',
              'Prepara a forma seguinte durante as duas últimas notas de cada compasso.'] },
  tips: { en: ['Mute with both hands: the picking palm on the low strings and the fretting fingers flattening slightly.'],
          pt: ['Abafa com as duas mãos: a palma da mão direita nas cordas graves e os dedos da esquerda um pouco deitados.'] },
  sub: 3, tempo: { start: 40, goal: 100, step: 3 }, learn: 'chords',
  tab: bars([].concat(sweep(9, 10, 8, 12), sweep(7, 8, 7, 10), sweep(5, 6, 5, 8), sweep(4, 5, 4, 7)), 12)
},

/* ---- Palm muting and tremolo ---- */
{
  id: 'right-palm-mute-chugs', cat: 'right', level: 1, tags: ['muting', 'picking', 'rock'], minutes: 3,
  title: { en: 'Palm-muted chugs', pt: 'Notas abafadas com a palma' },
  goal: { en: 'Get a tight, thick palm-muted sound and open it up on the accents.',
          pt: 'Conseguir um som abafado, curto e encorpado, e abri-lo nos acentos.' },
  how: { en: ['Rest the side of the picking hand on the strings right where they meet the bridge.',
              'Play the open 6th string in 8ths with downstrokes only.',
              'At the end of bar 2, lift the palm and hit two open power chords: {c:G5} and {c:A5}.'],
         pt: ['Pousa a parte de lado da mão direita nas cordas, mesmo onde elas chegam à ponte.',
              'Toca a 6.ª corda solta em colcheias, só com palhetadas para baixo.',
              'No fim do 2.º compasso, levanta a palma e toca dois power chords soltos: {c:G5} e {c:A5}.'] },
  tips: { en: ['Too far from the bridge and the note dies; too close and it is not muted. Find the middle.'],
          pt: ['Longe demais da ponte e a nota morre; perto demais e não fica abafada. Procura o meio-termo.'] },
  sub: 2, tempo: { start: 70, goal: 140, step: 5 },
  tab: '6.0m 6.0m 6.0m 6.0m 6.0m 6.0m 6.0m 6.0m | 6.0m 6.0m 6.0m 6.0m 6.3+5.5> = 6.5+5.7> ='
},
{
  id: 'right-gallop', cat: 'right', level: 3, tags: ['muting', 'picking', 'metal'], minutes: 4,
  title: { en: 'Gallop rhythm', pt: 'Ritmo de galope' },
  goal: { en: 'Play the "long-short-short" gallop figure tight and in time.',
          pt: 'Tocar a figura de galope "longa-curta-curta" certinha e a tempo.' },
  how: { en: ['Each beat is one 8th note and two 16ths: "da-daga, da-daga".',
              'Palm-mute the open 6th string and pick down, then down-up for the two short notes.',
              'Bar 2 ends with two accented power chords.'],
         pt: ['Cada tempo é uma colcheia e duas semicolcheias: "pa-taca, pa-taca".',
              'Abafa a 6.ª corda solta com a palma e toca para baixo, depois baixo-cima nas duas notas curtas.',
              'O 2.º compasso acaba com dois power chords acentuados.'] },
  tips: { en: ['If it starts to sound like three even notes, slow down and exaggerate the long one.'],
          pt: ['Se começar a soar como três notas iguais, abranda e exagera a nota longa.'] },
  sub: 4, tempo: { start: 60, goal: 140, step: 4 },
  tab: '6.0m - 6.0m 6.0m 6.0m - 6.0m 6.0m 6.0m - 6.0m 6.0m 6.0m - 6.0m 6.0m | 6.0m - 6.0m 6.0m 6.0m - 6.0m 6.0m 6.3+5.5> = = = 6.5+5.7> = = ='
},
{
  id: 'right-palm-mute-16ths', cat: 'right', level: 3, tags: ['muting', 'alternate-picking', 'metal'], minutes: 4,
  title: { en: 'Palm-muted 16ths', pt: 'Semicolcheias abafadas' },
  goal: { en: 'Keep fast, even palm-muted 16ths with accents on the beat.',
          pt: 'Manter semicolcheias abafadas, rápidas e iguais, com acento no tempo.' },
  how: { en: ['Alternate-pick the muted open 6th string, four notes per beat.',
              'Accent the first note of each beat by digging in a little harder.',
              'In bar 2, move briefly to fret 1 and hit a {c:G5} on beat 3.'],
         pt: ['Toca a 6.ª corda solta abafada em palhetada alternada, quatro notas por tempo.',
              'Acentua a primeira nota de cada tempo, a carregar um pouco mais.',
              'No 2.º compasso passa um pouco pelo traste 1 e toca um {c:G5} no 3.º tempo.'] },
  sub: 4, tempo: { start: 60, goal: 130, step: 4 },
  tab: '6.0m> 6.0m 6.0m 6.0m 6.0m> 6.0m 6.0m 6.0m 6.0m> 6.0m 6.0m 6.0m 6.0m> 6.0m 6.0m 6.0m | 6.0m> 6.0m 6.0m 6.0m 6.1m 6.1m 6.0m 6.0m 6.3+5.5> = = = 6.0m 6.0m 6.0m 6.0m'
},
{
  id: 'right-tremolo', cat: 'right', level: 3, tags: ['picking', 'alternate-picking', 'stamina'], minutes: 3,
  title: { en: 'Tremolo picking', pt: 'Palhetada em tremolo' },
  goal: { en: 'Pick one note very fast and evenly so it sounds like a sustained tone.',
          pt: 'Palhetar uma nota muito rápido e por igual, para soar como um som contínuo.' },
  how: { en: ['Four fast picks on each note, one note per beat, on the 1st string.',
              'Use tiny movements from the wrist, with the pick barely touching the string.',
              'Once it is even, push the tempo: tremolo is meant to blur into one sound.'],
         pt: ['Quatro palhetadas rápidas em cada nota, uma nota por tempo, na 1.ª corda.',
              'Usa movimentos mínimos do pulso, com a palheta mal a tocar na corda.',
              'Quando estiver regular, sobe o andamento: o tremolo deve fundir-se num só som.'] },
  tips: { en: ['Tension kills tremolo. If the forearm burns, stop and shake it out.'],
          pt: ['A tensão mata o tremolo. Se o antebraço arder, para e sacode-o.'] },
  sub: 4, tempo: { start: 60, goal: 160, step: 5 },
  tab: bars([].concat(rep('1.3', 4), rep('1.5', 4), rep('1.7', 4), rep('1.8', 4), rep('1.8', 4), rep('1.7', 4), rep('1.5', 4), rep('1.3', 4)), 16)
},
{
  id: 'right-tremolo-melody', cat: 'right', level: 4, tags: ['picking', 'alternate-picking', 'minor', 'stamina'], minutes: 4,
  title: { en: 'Tremolo melody', pt: 'Melodia em tremolo' },
  goal: { en: 'Keep a fast tremolo going while the fretting hand plays a melody up the neck.',
          pt: 'Manter um tremolo rápido enquanto a mão esquerda toca uma melodia a subir o braço.' },
  how: { en: ['Six picks per note, one note per beat, on the 1st string.',
              'The notes go up {n:A} minor from {n:A} to {n:E} and back down.',
              'The picking hand never stops; only the fretting hand moves.'],
         pt: ['Seis palhetadas por nota, uma nota por tempo, na 1.ª corda.',
              'As notas sobem {n:A} menor desde {n:A} até {n:E} e voltam a descer.',
              'A mão da palheta nunca para; só a mão esquerda se mexe.'] },
  sub: 6, tempo: { start: 40, goal: 100, step: 3 }, learn: 'scales',
  tab: bars([].concat(rep('1.5', 6), rep('1.7', 6), rep('1.8', 6), rep('1.10', 6), rep('1.12', 6), rep('1.10', 6), rep('1.8', 6), rep('1.7', 6)), 24)
},
{
  id: 'right-sixes', cat: 'right', level: 5, tags: ['picking', 'alternate-picking', 'pentatonic', 'sequences'], minutes: 6,
  title: { en: 'Pentatonic sixes', pt: 'Pentatónica em grupos de seis' },
  goal: { en: 'Alternate-pick six notes per beat through a pentatonic sequence across all strings.',
          pt: 'Palhetar alternado seis notas por tempo numa sequência pentatónica por todas as cordas.' },
  how: { en: ['The notes are {n:A} minor pentatonic around fret 5.',
              'Bar 1 runs down in groups of six, each group starting two notes lower than the last.',
              'Bar 2 climbs back up the same way.',
              'Two notes per string with alternate picking: watch the outside and inside crossings.'],
         pt: ['As notas são a pentatónica de {n:A} menor à volta do traste 5.',
              'O 1.º compasso desce em grupos de seis, cada grupo a começar duas notas abaixo do anterior.',
              'O 2.º compasso volta a subir da mesma forma.',
              'Duas notas por corda com palhetada alternada: atenção às passagens por fora e por dentro.'] },
  tips: { en: ['Accent the first note of each six to stay locked to the beat.'],
          pt: ['Acentua a primeira nota de cada grupo de seis para não perderes o tempo.'] },
  sub: 6, tempo: { start: 40, goal: 100, step: 3 }, learn: 'scales',
  tab: sixes()
},

/* ---- Fingerstyle ---- */
{
  id: 'right-finger-pima', cat: 'right', level: 1, tags: ['fingerstyle'], minutes: 3,
  title: { en: 'Fingers p-i-m-a', pt: 'Dedos p-i-m-a' },
  goal: { en: 'Give each picking-hand finger its own string.',
          pt: 'Dar a cada dedo da mão direita a sua própria corda.' },
  how: { en: ['p is the thumb, i the index, m the middle and a the ring finger.',
              'The thumb plays the bass strings (6th, 5th, 4th); i plays the 3rd, m the 2nd and a the 1st.',
              'All open strings, so you can watch the picking hand.'],
         pt: ['p é o polegar, i o indicador, m o médio e a o anelar.',
              'O polegar toca os bordões (6.ª, 5.ª e 4.ª cordas); o i toca a 3.ª, o m a 2.ª e o a a 1.ª.',
              'Tudo cordas soltas, para poderes olhar para a mão direita.'] },
  tips: { en: ['The fingers pull up into the palm; the thumb pushes down and forward. They never collide.'],
          pt: ['Os dedos puxam para cima, para a palma; o polegar empurra para baixo e para a frente. Nunca se cruzam.'] },
  sub: 2, tempo: { start: 50, goal: 110, step: 5 },
  tab: '6.0 3.0 2.0 1.0 5.0 3.0 2.0 1.0 | 4.0 3.0 2.0 1.0 5.0 3.0 2.0 1.0'
},
{
  id: 'right-thumb-independence', cat: 'right', level: 2, tags: ['fingerstyle', 'open-chords'], minutes: 4,
  title: { en: 'Steady thumb', pt: 'Polegar constante' },
  goal: { en: 'Keep the thumb on every beat while the fingers add notes on and between beats.',
          pt: 'Manter o polegar em todos os tempos enquanto os dedos juntam notas nos tempos e entre eles.' },
  how: { en: ['Hold {c:Am} for bar 1 and {c:E} for bar 2.',
              'The thumb plays the bass string on every beat, no matter what.',
              'On beats 1 and 3 a finger plays together with the thumb; on beats 2 and 4 it plays just after.'],
         pt: ['Faz {c:Am} no 1.º compasso e {c:E} no 2.º.',
              'O polegar toca o bordão em todos os tempos, aconteça o que acontecer.',
              'Nos tempos 1 e 3 um dedo toca junto com o polegar; nos tempos 2 e 4 toca logo a seguir.'] },
  tips: { en: ['Practise the thumb alone first, then add the fingers. If the thumb hesitates, the fingers are leading.'],
          pt: ['Treina primeiro só o polegar e depois junta os dedos. Se o polegar hesitar, são os dedos que estão a mandar.'] },
  sub: 2, tempo: { start: 50, goal: 100, step: 5 }, learn: 'chords',
  tab: '5.0+2.1 = 5.0 3.2 5.0+1.0 = 5.0 2.1 | 6.0+2.0 = 6.0 3.1 6.0+1.0 = 6.0 2.0'
},
{
  id: 'right-arpeggio-pimami', cat: 'right', level: 2, tags: ['fingerstyle', 'arpeggios', 'open-chords'], minutes: 4,
  title: { en: 'Arpeggio p-i-m-a-m-i', pt: 'Arpejo p-i-m-a-m-i' },
  goal: { en: 'Roll through open chords with a flowing six-note finger pattern.',
          pt: 'Percorrer acordes abertos com um padrão fluido de seis notas.' },
  how: { en: ['One bar each of {c:C}, {c:Am}, {c:Em} and {c:G}, counted in three.',
              'The thumb plays the root, then i, m, a go up and m, i come back down.',
              'Hold the whole chord shape so every note rings.'],
         pt: ['Um compasso de cada: {c:C}, {c:Am}, {c:Em} e {c:G}, contado a três.',
              'O polegar toca a tónica, depois i, m, a sobem e m, i voltam a descer.',
              'Mantém a forma do acorde toda pousada para todas as notas soarem.'] },
  beats: 3, sub: 2, tempo: { start: 50, goal: 110, step: 5 }, learn: 'chords',
  tab: '5.3 3.0 2.1 1.0 2.1 3.0 | 5.0 3.2 2.1 1.0 2.1 3.2 | 6.0 3.0 2.0 1.0 2.0 3.0 | 6.3 3.0 2.0 1.3 2.0 3.0'
},
{
  id: 'right-pinch-pattern', cat: 'right', level: 2, tags: ['fingerstyle', 'open-chords'], minutes: 4,
  title: { en: 'Pinch and fill', pt: 'Pinça e preenchimento' },
  goal: { en: 'Pluck bass and melody together, then fill the gaps with the inner strings.',
          pt: 'Tocar baixo e melodia ao mesmo tempo e depois preencher com as cordas do meio.' },
  how: { en: ['A "pinch" is thumb and ring finger plucking at the same moment.',
              'Pinch on beats 1 and 3; in between, i and m play the 3rd and 2nd strings.',
              'The thumb moves to a second bass string on beat 3.',
              'Chords: {c:C}, {c:G}, {c:Am}, {c:G}.'],
         pt: ['Uma "pinça" é o polegar e o anelar a tocar no mesmo instante.',
              'Pinça nos tempos 1 e 3; entre elas, o i e o m tocam a 3.ª e a 2.ª corda.',
              'No 3.º tempo o polegar passa para outro bordão.',
              'Acordes: {c:C}, {c:G}, {c:Am}, {c:G}.'] },
  sub: 2, tempo: { start: 50, goal: 110, step: 5 }, learn: 'chords',
  tab: '5.3+1.0 3.0 2.1 3.0 4.2+1.0 3.0 2.1 3.0 | 6.3+1.3 3.0 2.0 3.0 4.0+1.3 3.0 2.0 3.0 | 5.0+1.0 3.2 2.1 3.2 4.2+1.0 3.2 2.1 3.2 | 6.3+1.3 3.0 2.0 3.0 4.0+1.3 3.0 2.0 3.0'
},
{
  id: 'right-arpeggio-16ths', cat: 'right', level: 3, tags: ['fingerstyle', 'arpeggios', 'minor'], minutes: 4,
  title: { en: 'Flowing 16th arpeggios', pt: 'Arpejos corridos em semicolcheias' },
  goal: { en: 'Keep a fast p-i-m-i-a-i-m-i pattern smooth through chord changes.',
          pt: 'Manter um padrão rápido p-i-m-i-a-i-m-i fluido nas mudanças de acorde.' },
  how: { en: ['The pattern is thumb, i, m, i, a, i, m, i: the index returns between every other finger.',
              'Two beats per pattern; chords {c:Am}, {c:Dm}, {c:Am}, {c:E}, one bar each.',
              'The thumb moves to the right bass string for each chord: 5th, 4th, 5th, 6th.'],
         pt: ['O padrão é polegar, i, m, i, a, i, m, i: o indicador volta entre cada um dos outros dedos.',
              'Dois tempos por padrão; acordes {c:Am}, {c:Dm}, {c:Am}, {c:E}, um compasso cada.',
              'O polegar muda para o bordão certo em cada acorde: 5.ª, 4.ª, 5.ª, 6.ª.'] },
  tips: { en: ['Keep the hand still above the strings; only the fingers move.'],
          pt: ['Mantém a mão parada por cima das cordas; só os dedos se mexem.'] },
  sub: 4, tempo: { start: 40, goal: 90, step: 3 }, learn: 'chords',
  tab: (function(){
    const am = ['5.0', '3.2', '2.1', '3.2', '1.0', '3.2', '2.1', '3.2'], dm = ['4.0', '3.2', '2.3', '3.2', '1.1', '3.2', '2.3', '3.2'],
          e = ['6.0', '3.1', '2.0', '3.1', '1.0', '3.1', '2.0', '3.1'];
    return bars([].concat(am, am, dm, dm, am, am, e, e), 16); })()
},
{
  id: 'right-travis-thumb', cat: 'right', level: 2, tags: ['fingerstyle', 'folk', 'country'], minutes: 3,
  title: { en: 'Alternating bass thumb', pt: 'Polegar com baixo alternado' },
  goal: { en: 'Build the steady alternating thumb that Travis picking stands on.',
          pt: 'Construir o polegar constante e alternado em que assenta o padrão Travis.' },
  how: { en: ['Hold {c:C}: the thumb plays the 5th string, then the 4th, then the 6th, then the 4th.',
              'For the 6th string, move finger 3 from the 5th string to fret 3 of the 6th.',
              'Bar 2 is {c:G}: thumb on the 6th, 4th, 5th and 4th strings.'],
         pt: ['Faz {c:C}: o polegar toca a 5.ª corda, depois a 4.ª, depois a 6.ª e depois a 4.ª.',
              'Para a 6.ª corda, passa o dedo 3 da 5.ª corda para o traste 3 da 6.ª.',
              'O 2.º compasso é {c:G}: polegar na 6.ª, 4.ª, 5.ª e 4.ª cordas.'] },
  tips: { en: ['Rest the picking palm lightly on the bass strings near the bridge for a punchy, muted bass.'],
          pt: ['Pousa levemente a palma da mão direita nos bordões junto à ponte para um baixo abafado e com pulso.'] },
  sub: 2, tempo: { start: 60, goal: 120, step: 5 }, learn: 'chords',
  tab: '5.3 = 4.2 = 6.3 = 4.2 = | 6.3 = 4.0 = 5.2 = 4.0 ='
},
{
  id: 'right-travis-basic', cat: 'right', level: 3, tags: ['fingerstyle', 'folk', 'country', 'syncopation'], minutes: 5,
  title: { en: 'Basic Travis pattern', pt: 'Padrão Travis básico' },
  goal: { en: 'Add fingers between the beats over an alternating thumb.',
          pt: 'Juntar os dedos entre os tempos por cima de um polegar alternado.' },
  how: { en: ['The thumb keeps the alternating bass from the previous exercise on every beat.',
              'On beat 1 the middle finger pinches the 2nd string with the thumb.',
              'Then the fingers play only on the "and" between beats: i, m, i.',
              'Chords: {c:C}, {c:Am}, {c:G}, {c:C}.'],
         pt: ['O polegar mantém o baixo alternado do exercício anterior em todos os tempos.',
              'No 1.º tempo o médio toca a 2.ª corda junto com o polegar.',
              'Depois os dedos tocam só no "e" entre os tempos: i, m, i.',
              'Acordes: {c:C}, {c:Am}, {c:G}, {c:C}.'] },
  tips: { en: ['If it falls apart, play only the thumb for a bar and then bring the fingers back in.'],
          pt: ['Se se desfizer, toca só o polegar durante um compasso e depois volta a juntar os dedos.'] },
  sub: 2, tempo: { start: 50, goal: 110, step: 5 }, learn: 'chords',
  tab: '5.3+2.1 = 4.2 3.0 6.3 2.1 4.2 3.0 | 5.0+2.1 = 4.2 3.2 6.0 2.1 4.2 3.2 | 6.3+2.0 = 4.0 3.0 5.2 2.0 4.0 3.0 | 5.3+2.1 = 4.2 3.0 6.3 2.1 4.2 3.0'
},
{
  id: 'right-travis-melody', cat: 'right', level: 4, tags: ['fingerstyle', 'folk', 'country', 'syncopation'], minutes: 6,
  title: { en: 'Travis with a melody on top', pt: 'Travis com melodia por cima' },
  goal: { en: 'Pick a simple melody on the 1st string, partly off the beat, over the alternating bass.',
          pt: 'Tocar uma melodia simples na 1.ª corda, em parte fora do tempo, por cima do baixo alternado.' },
  how: { en: ['The thumb plays every beat, as in the basic pattern.',
              'The ring finger plays the melody on the 1st string, sometimes with the thumb and sometimes between beats.',
              'Chords: {c:C}, {c:Am}, {c:G}, {c:G}.'],
         pt: ['O polegar toca todos os tempos, como no padrão básico.',
              'O anelar toca a melodia na 1.ª corda, às vezes com o polegar e às vezes entre os tempos.',
              'Acordes: {c:C}, {c:Am}, {c:G}, {c:G}.'] },
  tips: { en: ['Make the melody notes a little louder than the rest so they stand out.'],
          pt: ['Faz as notas da melodia um pouco mais fortes do que o resto para se destacarem.'] },
  sub: 2, tempo: { start: 50, goal: 100, step: 5 }, learn: 'chords',
  tab: '5.3+1.0 = 4.2 2.1 6.3 1.0 4.2 2.1 | 5.0 1.0 4.2 2.1 6.0 1.0 4.2 3.2 | 6.3+1.3 = 4.0 2.0 5.2 1.3 4.0 2.0 | 6.3 2.0 4.0 1.3 5.2 2.0 4.0 3.0'
},

/* ---- Hybrid picking ---- */
{
  id: 'right-hybrid-basics', cat: 'right', level: 3, tags: ['hybrid', 'open-chords'], minutes: 4,
  title: { en: 'Hybrid picking basics', pt: 'Palhetada híbrida: o básico' },
  goal: { en: 'Use the pick for bass notes and the middle and ring fingers for the top strings.',
          pt: 'Usar a palheta nos baixos e o médio e o anelar nas cordas agudas.' },
  how: { en: ['Hold the pick normally; the middle (m) and ring (a) fingers stay free.',
              'The pick plays the bass strings with downstrokes; m plucks the 2nd string and a the 1st.',
              'Chords: {c:G} for bar 1, {c:C} for bar 2.'],
         pt: ['Segura a palheta como de costume; o médio (m) e o anelar (a) ficam livres.',
              'A palheta toca os bordões para baixo; o m puxa a 2.ª corda e o a a 1.ª.',
              'Acordes: {c:G} no 1.º compasso, {c:C} no 2.º.'] },
  tips: { en: ['Rest the free fingers lightly on the top strings so they are ready to pluck.'],
          pt: ['Pousa os dedos livres levemente nas cordas agudas para estarem prontos a puxar.'] },
  sub: 2, tempo: { start: 50, goal: 110, step: 5 }, learn: 'chords',
  tab: '6.3 2.0 4.0 1.3 5.2 2.0 4.0 1.3 | 5.3 2.1 4.2 1.0 5.3 2.1 4.2 1.0'
},
{
  id: 'right-hybrid-double-stops', cat: 'right', level: 4, tags: ['hybrid', 'country'], minutes: 4,
  title: { en: 'Hybrid double stops', pt: 'Notas duplas em híbrida' },
  goal: { en: 'Snap two top strings with the fingers between picked bass notes.',
          pt: 'Puxar duas cordas agudas com os dedos entre baixos tocados com a palheta.' },
  how: { en: ['Bar 1 is {c:D}, bar 2 is {c:A}.',
              'The pick plays the bass on each beat; m and a pluck the 2nd and 1st strings together on the "and".',
              'Pluck the double stops with a little snap so they pop out.'],
         pt: ['O 1.º compasso é {c:D}, o 2.º é {c:A}.',
              'A palheta toca o baixo em cada tempo; o m e o a puxam a 2.ª e a 1.ª corda juntas no "e".',
              'Puxa as notas duplas com um pequeno estalo para se destacarem.'] },
  sub: 2, tempo: { start: 60, goal: 130, step: 5 }, learn: 'chords',
  tab: '4.0 2.3+1.2 5.0 2.3+1.2 4.0 2.3+1.2 5.0 2.3+1.2 | 5.0 2.2+1.0 4.2 2.2+1.0 6.0 2.2+1.0 4.2 2.2+1.0'
},
{
  id: 'right-hybrid-rolls', cat: 'right', level: 4, tags: ['hybrid', 'country', 'syncopation'], minutes: 5,
  title: { en: 'Hybrid rolls', pt: 'Rolos em híbrida' },
  goal: { en: 'Play a rolling three-note pattern with pick, middle and ring finger in 16ths.',
          pt: 'Tocar um padrão rolado de três notas com palheta, médio e anelar em semicolcheias.' },
  how: { en: ['The pick plays the bass string, m the 2nd string and a the 1st, always in that order.',
              'Groups of three over a beat of four make the pattern roll across the beat; restart it every two beats.',
              'Bar 1 is {c:G}, bar 2 is {c:C}.'],
         pt: ['A palheta toca o bordão, o m a 2.ª corda e o a a 1.ª, sempre por esta ordem.',
              'Grupos de três num tempo de quatro fazem o padrão rolar por cima do tempo; recomeça a cada dois tempos.',
              'O 1.º compasso é {c:G}, o 2.º é {c:C}.'] },
  tips: { en: ['Accent the picked note to hear the 3-3-2 shape.'],
          pt: ['Acentua a nota da palheta para ouvires a forma 3-3-2.'] },
  sub: 4, tempo: { start: 40, goal: 100, step: 4 }, learn: 'chords',
  tab: '4.0 2.0 1.3 4.0 2.0 1.3 4.0 2.0 4.0 2.0 1.3 4.0 2.0 1.3 4.0 2.0 | 5.3 2.1 1.0 5.3 2.1 1.0 5.3 2.1 5.3 2.1 1.0 5.3 2.1 1.0 5.3 2.1'
}
);
})();
