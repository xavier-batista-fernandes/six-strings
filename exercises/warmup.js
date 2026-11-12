/* Warm-up routines: short, gentle openers to start every practice session. */
(function(){
"use strict";
function bars(tokens, per){
  const out = [];
  tokens.forEach((t, i) => { if (i && i % per === 0) out.push('|'); out.push(t); });
  return out.join(' ');
}
/* Diagonal crawl: one finger per fret, the hand moves up one fret on each new string. */
function diagonal(start){
  const up = [], down = [];
  for (let k = 0; k < 6; k++){ const str = 6 - k, base = start + k;
    for (let f = 0; f < 4; f++) up.push(str + '.' + (base + f)); }
  for (let k = 5; k >= 0; k--){ const str = 6 - k, base = start + k;
    for (let f = 3; f >= 0; f--) down.push(str + '.' + (base + f)); }
  return bars(up.concat(down), 16);
}
/* Walk a 1-2-3-4 group down the neck one fret at a time on one string. */
function walkDown(str, from){
  const t = [];
  for (let p = from; p > from - 8; p--) for (let f = 0; f < 4; f++) t.push(str + '.' + (p + f));
  return bars(t, 16);
}
/* Chromatic ladder: up the strings, shift up a fret, down the strings, shift again. */
function ladder(start){
  const t = [];
  for (let pass = 0; pass < 4; pass++){ const base = start + pass;
    if (pass % 2 === 0){ for (let s = 6; s >= 1; s--) for (let f = 0; f < 4; f++) t.push(s + '.' + (base + f)); }
    else { for (let s = 1; s <= 6; s++) for (let f = 3; f >= 0; f--) t.push(s + '.' + (base + f)); } }
  return bars(t, 16);
}

(window.SS_EXERCISES = window.SS_EXERCISES || []).push(
{
  id: 'warmup-finger-roll-call', cat: 'warmup', level: 1, tags: ['chromatic'], minutes: 1,
  title: { en: 'Finger roll call', pt: 'Chamada dos dedos' },
  goal: { en: 'Wake up each finger of the fretting hand with slow, clean notes.',
          pt: 'Acordar cada dedo da mão esquerda com notas lentas e limpas.' },
  how: { en: ['Put finger 1 on fret 5 of the 3rd string; fingers 2, 3 and 4 go on frets 6, 7 and 8.',
              'Play one note per click and let each one ring for the whole beat.',
              'Move to the 2nd string, then come back down the same way.'],
         pt: ['Põe o dedo 1 no traste 5 da 3.ª corda; os dedos 2, 3 e 4 ficam nos trastes 6, 7 e 8.',
              'Toca uma nota por clique e deixa cada uma soar durante o tempo todo.',
              'Passa à 2.ª corda e depois volta pelo mesmo caminho.'] },
  tips: { en: ['Press just hard enough for a clear note. Squeezing harder only tires the hand.'],
          pt: ['Carrega só o suficiente para a nota soar limpa. Apertar mais só cansa a mão.'] },
  sub: 1, tempo: { start: 50, goal: 80, step: 5 }, learn: 'fretboard',
  tab: '3.5 3.6 3.7 3.8 | 2.5 2.6 2.7 2.8 | 2.8 2.7 2.6 2.5 | 3.8 3.7 3.6 3.5'
},
{
  id: 'warmup-open-string-crossing', cat: 'warmup', level: 1, tags: ['string-crossing', 'alternate-picking', 'picking'], minutes: 2,
  title: { en: 'Open-string crossing', pt: 'Cordas soltas, de corda em corda' },
  goal: { en: 'Loosen the picking hand by moving across all six open strings in time.',
          pt: 'Soltar a mão da palheta, passando pelas seis cordas soltas a tempo.' },
  how: { en: ['No fretting at all: every note is an open string.',
              'Pick down, up, down, up without a break, one note per string.',
              'Keep the movement small and let the forearm rest on the guitar.'],
         pt: ['Não pisas nenhum traste: todas as notas são cordas soltas.',
              'Toca para baixo, para cima, para baixo, para cima sem parar, uma nota por corda.',
              'Mantém o movimento pequeno e deixa o antebraço apoiado na guitarra.'] },
  tips: { en: ['If you hit the wrong string, slow down and look at the pick for a few rounds.'],
          pt: ['Se acertares na corda errada, abranda e olha para a palheta durante algumas voltas.'] },
  sub: 2, tempo: { start: 60, goal: 110, step: 5 },
  tab: '6.0 5.0 4.0 3.0 2.0 1.0 2.0 3.0 | 4.0 5.0 6.0 5.0 4.0 3.0 4.0 5.0'
},
{
  id: 'warmup-slow-hammers', cat: 'warmup', level: 2, tags: ['legato'], minutes: 2,
  title: { en: 'Slow hammer-ons and pull-offs', pt: 'Ligados lentos' },
  goal: { en: 'Warm up finger strength with gentle hammer-ons and pull-offs on one string.',
          pt: 'Aquecer a força dos dedos com ligados suaves numa só corda.' },
  how: { en: ['Pick the first note of each pair; the second note is a hammer-on (first bar) or a pull-off (second bar).',
              'For a hammer-on, drop the finger onto the string like a small hammer, right behind the fret.',
              'For a pull-off, have both fingers down and flick the top finger slightly sideways off the string.'],
         pt: ['Ataca a primeira nota de cada par; a segunda é um ligado ascendente (1.º compasso) ou descendente (2.º compasso).',
              'No ligado ascendente, deixa cair o dedo na corda como um pequeno martelo, logo atrás do traste.',
              'No ligado descendente, pousa os dois dedos e puxa o de cima ligeiramente para o lado, a soltar a corda.'] },
  tips: { en: ['Both notes of a pair should sound equally loud.'],
          pt: ['As duas notas de cada par devem soar com o mesmo volume.'] },
  sub: 2, tempo: { start: 50, goal: 90, step: 5 },
  tab: '3.5 3.7h 3.5 3.8h 3.7 3.8h 3.5 3.6h | 3.7 3.5p 3.8 3.5p 3.8 3.7p 3.6 3.5p',
  vars: [ { name: { en: 'On the 2nd string', pt: 'Na 2.ª corda' },
            tab: '2.5 2.7h 2.5 2.8h 2.7 2.8h 2.5 2.6h | 2.7 2.5p 2.8 2.5p 2.8 2.7p 2.6 2.5p' },
          { name: { en: 'On the 4th string', pt: 'Na 4.ª corda' },
            tab: '4.5 4.7h 4.5 4.8h 4.7 4.8h 4.5 4.6h | 4.7 4.5p 4.8 4.5p 4.8 4.7p 4.6 4.5p' } ]
},
{
  id: 'warmup-string-pairs', cat: 'warmup', level: 2, tags: ['string-crossing', 'alternate-picking'], minutes: 2,
  title: { en: 'Two notes per string', pt: 'Duas notas por corda' },
  goal: { en: 'Coordinate both hands while crossing all strings with two fretted notes each.',
          pt: 'Coordenar as duas mãos a passar por todas as cordas com duas notas em cada.' },
  how: { en: ['Use finger 1 on fret 5 and finger 3 on fret 7.',
              'Go up from the 6th string to the 1st, then back down.',
              'Strict alternate picking: down, up, down, up.'],
         pt: ['Usa o dedo 1 no traste 5 e o dedo 3 no traste 7.',
              'Sobe da 6.ª corda até à 1.ª e depois desce.',
              'Palhetada alternada sempre: baixo, cima, baixo, cima.'] },
  sub: 2, tempo: { start: 60, goal: 110, step: 5 },
  tab: '6.5 6.7 5.5 5.7 4.5 4.7 3.5 3.7 | 2.5 2.7 1.5 1.7 1.7 1.5 2.7 2.5 | 3.7 3.5 4.7 4.5 5.7 5.5 6.7 6.5'
},
{
  id: 'warmup-trill-wake', cat: 'warmup', level: 2, tags: ['legato', 'stamina'], minutes: 1,
  title: { en: 'Trill wake-up', pt: 'Trilos para acordar' },
  goal: { en: 'Get every pair of fingers moving with short, relaxed trills.',
          pt: 'Pôr cada par de dedos a mexer com trilos curtos e descontraídos.' },
  how: { en: ['Each beat is one finger pair: 1-2, then 2-3, then 3-4, then 1-4.',
              'Pick only the first note of each beat; the rest are hammer-ons and pull-offs.',
              'Stop after a minute. This is a wake-up, not a workout.'],
         pt: ['Cada tempo é um par de dedos: 1-2, depois 2-3, depois 3-4, depois 1-4.',
              'Ataca só a primeira nota de cada tempo; as outras são ligados.',
              'Para ao fim de um minuto. Isto é para acordar, não para treinar a força.'] },
  tips: { en: ['If the hand feels tight, shake it out and play softer.'],
          pt: ['Se sentires a mão tensa, sacode-a e toca mais suave.'] },
  sub: 4, tempo: { start: 50, goal: 80, step: 5 },
  tab: '3.5 3.6h 3.5p 3.6h 3.6 3.7h 3.6p 3.7h 3.7 3.8h 3.7p 3.8h 3.5 3.8h 3.5p 3.8h'
},
{
  id: 'warmup-diagonal-crawl', cat: 'warmup', level: 2, tags: ['chromatic', 'positions'], minutes: 3,
  title: { en: 'Diagonal crawl', pt: 'Rastejar em diagonal' },
  goal: { en: 'Stretch and relax the hand by climbing one fret higher on every new string.',
          pt: 'Esticar e soltar a mão, subindo um traste em cada corda nova.' },
  how: { en: ['Start with fingers 1-2-3-4 on frets 5-8 of the 6th string.',
              'On the 5th string play frets 6-9, on the 4th 7-10, and so on: the hand slides up one fret per string.',
              'At the 1st string turn around and come back down the same diagonal.'],
         pt: ['Começa com os dedos 1-2-3-4 nos trastes 5-8 da 6.ª corda.',
              'Na 5.ª corda tocas os trastes 6-9, na 4.ª os 7-10, e assim por diante: a mão sobe um traste por corda.',
              'Na 1.ª corda dá a volta e desce pela mesma diagonal.'] },
  tips: { en: ['Move the thumb behind the neck along with the hand, so the stretch stays the same.'],
          pt: ['Leva o polegar atrás do braço junto com a mão, para o afastamento ser sempre igual.'] },
  sub: 4, tempo: { start: 50, goal: 100, step: 5 }, learn: 'fretboard',
  tab: diagonal(5),
  vars: [ { name: { en: 'Lower: start on fret 2', pt: 'Mais abaixo: começa no traste 2' }, tab: diagonal(2) } ]
},
{
  id: 'warmup-stretch-walk-down', cat: 'warmup', level: 2, tags: ['chromatic', 'stamina'], minutes: 2,
  title: { en: 'Stretch walk-down', pt: 'Descida a esticar' },
  goal: { en: 'Open up the hand gradually, from the narrow high frets to the wide low ones.',
          pt: 'Abrir a mão aos poucos, dos trastes estreitos lá em cima aos largos cá em baixo.' },
  how: { en: ['Play frets 8-9-10-11 on the 3rd string with fingers 1-2-3-4.',
              'Move the whole hand down one fret and play the next group of four.',
              'Keep going down to frets 1-4; the frets get wider, so the stretch grows slowly.'],
         pt: ['Toca os trastes 8-9-10-11 na 3.ª corda com os dedos 1-2-3-4.',
              'Desce a mão inteira um traste e toca o grupo de quatro seguinte.',
              'Continua até aos trastes 1-4; os trastes ficam mais largos e o afastamento cresce devagar.'] },
  tips: { en: ['Never force a stretch. If fret 1-4 hurts, stop at frets 2-5.'],
          pt: ['Nunca forces o afastamento. Se os trastes 1-4 doerem, para nos 2-5.'] },
  sub: 4, tempo: { start: 50, goal: 90, step: 5 },
  tab: walkDown(3, 8),
  vars: [ { name: { en: 'On the 5th string', pt: 'Na 5.ª corda' }, tab: walkDown(5, 8) },
          { name: { en: 'On the 1st string', pt: 'Na 1.ª corda' }, tab: walkDown(1, 8) } ]
},
{
  id: 'warmup-chromatic-ladder', cat: 'warmup', level: 3, tags: ['chromatic', 'stamina', 'positions'], minutes: 5,
  title: { en: 'Chromatic ladder', pt: 'Escada cromática' },
  goal: { en: 'Run a full five-minute warm-up across all strings and four positions.',
          pt: 'Fazer um aquecimento completo de cinco minutos por todas as cordas e quatro posições.' },
  how: { en: ['Play 1-2-3-4 on every string from the 6th to the 1st, starting at fret 5.',
              'Shift the hand up one fret and come back down, 4-3-2-1 on each string.',
              'Shift up again and climb, then shift and come down once more.'],
         pt: ['Toca 1-2-3-4 em cada corda, da 6.ª à 1.ª, a começar no traste 5.',
              'Sobe a mão um traste e desce as cordas, 4-3-2-1 em cada uma.',
              'Sobe outra vez e volta a subir as cordas, depois sobe e desce mais uma vez.'] },
  tips: { en: ['The shift happens on the 1st and 6th strings without a gap in the rhythm.',
               'Keep alternate picking going through the string changes.'],
          pt: ['A mudança de posição faz-se na 1.ª e na 6.ª corda sem falhar o ritmo.',
               'Mantém a palhetada alternada nas mudanças de corda.'] },
  sub: 4, tempo: { start: 60, goal: 120, step: 4 }, learn: 'fretboard',
  tab: ladder(5),
  vars: [ { name: { en: 'Lower: start on fret 1', pt: 'Mais abaixo: começa no traste 1' }, tab: ladder(1) } ]
}
);
})();
