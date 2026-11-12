/* Fretboard: note names, octaves, unisons and intervals on the neck. Frets are computed from standard tuning (E A D G B E). */
(function () {
  var OPEN = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
  var PC = { C: 0, 'C#': 1, D: 2, Eb: 3, E: 4, F: 5, 'F#': 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
  function mod(a, m) { return ((a % m) + m) % m; }
  function ok(s, f) { if (!(f >= 0 && f <= 17)) throw new Error('fretboard.js: fret out of range ' + s + '.' + f); return s + '.' + f; }
  function barsOf(t, per) {
    t = t.slice(); while (t.length % per) t.push('=');
    var out = []; for (var i = 0; i < t.length; i += per) out.push(t.slice(i, i + per).join(' '));
    return out.join(' | ');
  }
  function keyVars(keys, make) { return keys.map(function (k) { return { name: { en: '{n:' + k + '}', pt: '{n:' + k + '}' }, tab: make(k) }; }); }
  var NATURAL = [0, 2, 4, 5, 7, 9, 11];
  function naturals(str) {
    var t = []; for (var f = 0; f <= 12; f++) if (NATURAL.indexOf(mod(OPEN[str] + f, 12)) >= 0) t.push(ok(str, f));
    return t;
  }
  function upDown(t) { return t.concat(t.slice(0, -1).reverse()); }
  /* one note name on every string, low to high, lowest fret 0-11 */
  function everyString(key) {
    var t = [];
    [6, 5, 4, 3, 2, 1].forEach(function (s) { t.push(ok(s, mod(PC[key] - OPEN[s], 12)), '='); });
    return t;
  }
  /* every place a note name occurs up to fret 17, string by string */
  function allPlaces(key) {
    var t = [];
    [6, 5, 4, 3, 2, 1].forEach(function (s) { for (var f = mod(PC[key] - OPEN[s], 12); f <= 17; f += 12) t.push(ok(s, f)); });
    return t;
  }
  function octaveChain(key) {
    var f6 = mod(PC[key] - 4, 12), f5 = mod(PC[key] - 9, 12);
    return barsOf([ok(6, f6), ok(4, f6 + 2), ok(2, f6 + 5), '=', ok(5, f5), ok(3, f5 + 2), ok(1, f5 + 5), '=',
      ok(1, f5 + 5), ok(3, f5 + 2), ok(5, f5), '=', ok(2, f6 + 5), ok(4, f6 + 2), ok(6, f6), '='], 4);
  }
  /* the same pitch on every string where it fits (0-17) */
  function samePitch(p) {
    var t = []; [1, 2, 3, 4, 5, 6].forEach(function (s) { var f = p - OPEN[s]; if (f >= 0 && f <= 17) t.push(ok(s, f), '='); });
    return t;
  }
  /* an interval of `semi` semitones above a root on string `s`, fret `f`: same string if close, else the nearest higher string */
  function place(s, f, semi) {
    var p = OPEN[s] + f + semi;
    for (var str = s; str >= 1; str--) { var g = p - OPEN[str]; if (g >= f - 2 && g <= f + 3) return ok(str, g); }
    throw new Error('fretboard.js: cannot place interval ' + semi);
  }
  function ladder(s, f) {
    var t = [];
    for (var i = 1; i <= 12; i++) t.push(ok(s, f), '=', place(s, f, i), '=');
    return barsOf(t, 4);
  }

  (window.SS_EXERCISES = window.SS_EXERCISES || []).push(
    {
      id: 'fretboard-quiz', cat: 'fretboard', level: 1, tags: ['notes'], minutes: 5,
      title: { en: 'Name that note', pt: 'Adivinha a nota' },
      goal: { en: 'Name any note on the neck in a couple of seconds.', pt: 'Dizer o nome de qualquer nota do braço em poucos segundos.' },
      how: {
        en: ['The quiz shows a string and a fret: say the note name out loud, then pick it.', 'Start with the 6th and 5th strings: almost every chord and scale starts from them.', 'Do five minutes a day rather than one long session a week.'],
        pt: ['O quiz mostra uma corda e um traste: diz o nome da nota em voz alta e depois escolhe-a.', 'Começa pela 6.ª e pela 5.ª corda: quase todos os acordes e escalas partem daí.', 'Faz cinco minutos por dia em vez de uma sessão longa por semana.']
      },
      tips: {
        en: ['Use landmarks: fret 5 and fret 12 are easy to remember, then count from there.', 'A sharp is one fret up, a flat is one fret down: {n:F#} and {n:Gb} are the same fret.'],
        pt: ['Usa pontos de referência: o traste 5 e o traste 12 são fáceis de fixar, e conta a partir daí.', 'Um sustenido é um traste acima, um bemol é um traste abaixo: {n:F#} e {n:Gb} são o mesmo traste.']
      },
      tool: 'quiz', learn: 'fretboard'
    },
    {
      id: 'fretboard-quiz-speed', cat: 'fretboard', level: 3, tags: ['notes'], minutes: 5,
      title: { en: 'Note quiz against the clock', pt: 'Quiz de notas contra o relógio' },
      goal: { en: 'Name notes on all six strings without counting frets.', pt: 'Dizer as notas nas seis cordas sem contar trastes.' },
      how: {
        en: ['Run the note quiz for two minutes and count how many you get right.', 'Answer as fast as you can; a wrong answer is fine, a slow one means you are still counting.', 'Write down your score and try to beat it tomorrow.'],
        pt: ['Faz o quiz de notas durante dois minutos e conta quantas acertas.', 'Responde o mais depressa possível; errar não faz mal, demorar quer dizer que ainda estás a contar.', 'Aponta a pontuação e tenta batê-la amanhã.']
      },
      tips: { en: ['Find the note on the 6th or 5th string first, then use an octave shape to reach the higher strings.'], pt: ['Encontra primeiro a nota na 6.ª ou 5.ª corda e usa um desenho de oitava para chegar às cordas agudas.'] },
      tool: 'quiz', learn: 'fretboard'
    },
    {
      id: 'fretboard-naturals-6', cat: 'fretboard', level: 1, tags: ['notes'], minutes: 4,
      title: { en: 'Natural notes on the 6th string', pt: 'Notas naturais na 6.ª corda' },
      goal: { en: 'Know every natural note on the 6th string up to fret 12.', pt: 'Saber todas as notas naturais da 6.ª corda até ao traste 12.' },
      how: {
        en: ['Play the open 6th string and say {n:E}.', 'Go up: {n:F} at 1, {n:G} at 3, {n:A} at 5, {n:B} at 7, {n:C} at 8, {n:D} at 10, {n:E} at 12.', 'Say each name out loud on the beat, then come back down.'],
        pt: ['Toca a 6.ª corda solta e diz {n:E}.', 'Sobe: {n:F} no 1, {n:G} no 3, {n:A} no 5, {n:B} no 7, {n:C} no 8, {n:D} no 10, {n:E} no 12.', 'Diz cada nome em voz alta a tempo e volta a descer.']
      },
      tips: { en: ['{n:E}-{n:F} and {n:B}-{n:C} are only one fret apart; every other pair of natural notes is two frets.'], pt: ['{n:E}-{n:F} e {n:B}-{n:C} estão só a um traste; todos os outros pares de notas naturais estão a dois.'] },
      sub: 1, tempo: { start: 50, goal: 100, step: 5 }, learn: 'fretboard',
      tab: barsOf(upDown(naturals(6)), 4)
    },
    {
      id: 'fretboard-naturals-5', cat: 'fretboard', level: 1, tags: ['notes'], minutes: 4,
      title: { en: 'Natural notes on the 5th string', pt: 'Notas naturais na 5.ª corda' },
      goal: { en: 'Know every natural note on the 5th string up to fret 12.', pt: 'Saber todas as notas naturais da 5.ª corda até ao traste 12.' },
      how: {
        en: ['Play the open 5th string and say {n:A}.', 'Go up: {n:B} at 2, {n:C} at 3, {n:D} at 5, {n:E} at 7, {n:F} at 8, {n:G} at 10, {n:A} at 12.', 'Say each name out loud on the beat, then come back down.'],
        pt: ['Toca a 5.ª corda solta e diz {n:A}.', 'Sobe: {n:B} no 2, {n:C} no 3, {n:D} no 5, {n:E} no 7, {n:F} no 8, {n:G} no 10, {n:A} no 12.', 'Diz cada nome em voz alta a tempo e volta a descer.']
      },
      tips: { en: ['These are the roots of most barre chords with the root on the 5th string.'], pt: ['São as tónicas da maioria dos acordes com pestana com a tónica na 5.ª corda.'] },
      sub: 1, tempo: { start: 50, goal: 100, step: 5 }, learn: 'fretboard',
      tab: barsOf(upDown(naturals(5)), 4)
    },
    {
      id: 'fretboard-naturals-4-3', cat: 'fretboard', level: 2, tags: ['notes'], minutes: 5,
      title: { en: 'Natural notes on the 4th and 3rd strings', pt: 'Notas naturais na 4.ª e 3.ª cordas' },
      goal: { en: 'Fill in the middle of the neck: natural notes on the 4th and 3rd strings.', pt: 'Preencher o meio do braço: notas naturais na 4.ª e 3.ª cordas.' },
      how: {
        en: ['On the 4th string start from the open {n:D} and climb the natural notes to fret 12.', 'Say each name on the beat; the variation does the same on the 3rd string from {n:G}.', 'Check yourself: fret 12 is always the open note again.'],
        pt: ['Na 4.ª corda começa no {n:D} solto e sobe pelas notas naturais até ao traste 12.', 'Diz cada nome a tempo; a variação faz o mesmo na 3.ª corda a partir do {n:G}.', 'Confirma: o traste 12 é sempre outra vez a nota da corda solta.']
      },
      sub: 1, tempo: { start: 50, goal: 100, step: 5 }, learn: 'fretboard',
      tab: barsOf(upDown(naturals(4)), 4),
      vars: [{ name: { en: '3rd string', pt: '3.ª corda' }, tab: barsOf(upDown(naturals(3)), 4) }]
    },
    {
      id: 'fretboard-chromatic-names', cat: 'fretboard', level: 2, tags: ['notes', 'chromatic'], minutes: 5,
      title: { en: 'Sharps and flats on the 6th string', pt: 'Sustenidos e bemóis na 6.ª corda' },
      goal: { en: 'Name every fret of the 6th string, including the in-between notes.', pt: 'Dizer o nome de todos os trastes da 6.ª corda, incluindo as notas do meio.' },
      how: {
        en: ['Play frets 0 to 12 on the 6th string, one per beat.', 'Going up, name the in-between notes as sharps: {n:F#}, {n:G#}, {n:A#}...', 'Coming down, name them as flats: {n:Bb}, {n:Ab}, {n:Gb}...'],
        pt: ['Toca os trastes 0 a 12 na 6.ª corda, um por tempo.', 'A subir, chama sustenidos às notas do meio: {n:F#}, {n:G#}, {n:A#}...', 'A descer, chama-lhes bemóis: {n:Bb}, {n:Ab}, {n:Gb}...']
      },
      tips: { en: ['If you hesitate, find the nearest natural note and move one fret.'], pt: ['Se hesitares, procura a nota natural mais próxima e anda um traste.'] },
      sub: 1, tempo: { start: 50, goal: 100, step: 5 }, learn: 'fretboard',
      tab: barsOf(upDown([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (f) { return ok(6, f); })), 4),
      vars: [{ name: { en: '5th string', pt: '5.ª corda' }, tab: barsOf(upDown([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (f) { return ok(5, f); })), 4) }]
    },
    {
      id: 'fretboard-say-and-play', cat: 'fretboard', level: 2, tags: ['notes', 'timing'], minutes: 5,
      title: { en: 'Say it as you play it', pt: 'Diz enquanto tocas' },
      goal: { en: 'Name notes in time while jumping between the 6th and 5th strings.', pt: 'Dizer as notas a tempo enquanto saltas entre a 6.ª e a 5.ª corda.' },
      how: {
        en: ['Each beat, play one note and say its name on the click.', 'The notes go in pairs at the same fret: 6th string then 5th string ({n:G} then {n:C} at fret 3).', 'Keep the voice and the note together; slow the tempo until you never miss.'],
        pt: ['Em cada tempo, toca uma nota e diz o nome em cima do clique.', 'As notas vão aos pares no mesmo traste: 6.ª corda e depois 5.ª corda ({n:G} e depois {n:C} no traste 3).', 'Mantém a voz e a nota juntas; baixa o andamento até nunca falhares.']
      },
      tips: { en: ['The note on the 5th string is always the 6th-string note plus four letters: {n:G} becomes {n:C}, {n:A} becomes {n:D}.'], pt: ['A nota da 5.ª corda é sempre a da 6.ª mais quatro letras: {n:G} passa a {n:C}, {n:A} passa a {n:D}.'] },
      sub: 1, tempo: { start: 40, goal: 80, step: 4 }, learn: 'fretboard',
      tab: '6.1 5.1 6.3 5.3 | 6.5 5.5 6.7 5.7 | 6.8 5.8 6.10 5.10 | 6.12 5.12 6.10 5.10 | 6.8 5.8 6.7 5.7 | 6.5 5.5 6.3 5.3'
    },
    {
      id: 'fretboard-one-note-all-strings', cat: 'fretboard', level: 2, tags: ['notes'], minutes: 5,
      title: { en: 'One note on all six strings', pt: 'Uma nota nas seis cordas' },
      goal: { en: 'Find the same note name on every string, from the 6th to the 1st.', pt: 'Encontrar o mesmo nome de nota em todas as cordas, da 6.ª à 1.ª.' },
      how: {
        en: ['The main tab finds every {n:C}: fret 8, 3, 10, 5, 1 and 8 from the 6th string to the 1st.', 'Play each one and let it ring for a beat while you say its name.', 'Then pick another note from the variations and find it before you press play.'],
        pt: ['A tablatura principal encontra todos os {n:C}: trastes 8, 3, 10, 5, 1 e 8 da 6.ª à 1.ª corda.', 'Toca cada um e deixa soar um tempo enquanto dizes o nome.', 'Depois escolhe outra nota nas variações e encontra-a antes de carregares no play.']
      },
      tips: { en: ['The 6th and 1st strings always have the note at the same fret.'], pt: ['A 6.ª e a 1.ª corda têm sempre a nota no mesmo traste.'] },
      sub: 1, tempo: { start: 40, goal: 90, step: 5 }, learn: 'fretboard',
      tab: barsOf(everyString('C'), 4),
      vars: keyVars(['G', 'D', 'A', 'E', 'F', 'Bb'], function (k) { return barsOf(everyString(k), 4); })
    },
    {
      id: 'fretboard-all-places', cat: 'fretboard', level: 3, tags: ['notes'], minutes: 5,
      title: { en: 'Every place a note lives', pt: 'Todos os sítios de uma nota' },
      goal: { en: 'Find a note in every spot up to fret 17, both octaves on each string.', pt: 'Encontrar uma nota em todos os sítios até ao traste 17, as duas oitavas em cada corda.' },
      how: {
        en: ['The main tab finds every {n:G}, string by string from the 6th, low fret first.', 'Where a note fits twice on one string, play it at both frets: they are 12 frets apart.', 'Say the name each time and look for the pattern the spots make on the neck.'],
        pt: ['A tablatura principal encontra todos os {n:G}, corda a corda a partir da 6.ª, primeiro o traste mais baixo.', 'Quando uma nota cabe duas vezes na mesma corda, toca-a nos dois trastes: estão a 12 trastes de distância.', 'Diz o nome de cada vez e procura o desenho que os sítios fazem no braço.']
      },
      sub: 2, tempo: { start: 40, goal: 80, step: 4 }, learn: 'fretboard',
      tab: barsOf(allPlaces('G'), 8),
      vars: keyVars(['C', 'D', 'A', 'E', 'F#'], function (k) { return barsOf(allPlaces(k), 8); })
    },
    {
      id: 'fretboard-octaves-low', cat: 'fretboard', level: 2, tags: ['octaves', 'notes', 'rock'], minutes: 5,
      title: { en: 'Octave shape on the low strings', pt: 'Desenho de oitava nas cordas graves' },
      goal: { en: 'Use the octave shape to find any note two strings higher.', pt: 'Usar o desenho de oitava para encontrar qualquer nota duas cordas acima.' },
      how: {
        en: ['Put finger 1 on a note on the 6th string and finger 3 or 4 two frets higher on the 4th string: same note, one octave up.', 'Let finger 1 lightly touch the 5th string to mute it, and strum the three strings together.', 'Walk the shape up the natural notes {n:G}, {n:A}, {n:B}, {n:C} and back, saying each name.'],
        pt: ['Põe o dedo 1 numa nota da 6.ª corda e o dedo 3 ou 4 dois trastes acima na 4.ª corda: a mesma nota, uma oitava acima.', 'Deixa o dedo 1 tocar de leve na 5.ª corda para a abafar e toca as três cordas juntas.', 'Leva o desenho pelas notas naturais {n:G}, {n:A}, {n:B}, {n:C} e volta, a dizer cada nome.']
      },
      tips: { en: ['The same shape works from the 5th string to the 3rd: try the variation.'], pt: ['O mesmo desenho funciona da 5.ª para a 3.ª corda: experimenta a variação.'] },
      sub: 1, tempo: { start: 50, goal: 100, step: 5 }, learn: 'fretboard',
      tab: '6.3+4.5 = 6.5+4.7 = | 6.7+4.9 = 6.8+4.10 = | 6.7+4.9 = 6.5+4.7 = | 6.3+4.5 = = =',
      vars: [{ name: { en: '5th to 3rd string', pt: 'Da 5.ª para a 3.ª corda' }, tab: '5.3+3.5 = 5.5+3.7 = | 5.7+3.9 = 5.8+3.10 = | 5.7+3.9 = 5.5+3.7 = | 5.3+3.5 = = =' }]
    },
    {
      id: 'fretboard-octaves-high', cat: 'fretboard', level: 3, tags: ['octaves', 'notes'], minutes: 5,
      title: { en: 'Octave shape on the high strings', pt: 'Desenho de oitava nas cordas agudas' },
      goal: { en: 'Learn the stretched octave shape that crosses the 2nd string.', pt: 'Aprender o desenho de oitava esticado que atravessa a 2.ª corda.' },
      how: {
        en: ['From the 4th string to the 2nd, the octave is three frets higher, not two: {n:G} at 4th string fret 5 is {n:G} at 2nd string fret 8.', 'From the 3rd string to the 1st it is also three frets: {n:C} at fret 5 becomes {n:C} at fret 8.', 'Walk the shape up and down, muting the string in the middle.'],
        pt: ['Da 4.ª para a 2.ª corda, a oitava fica três trastes acima, não dois: o {n:G} no traste 5 da 4.ª corda é o {n:G} no traste 8 da 2.ª.', 'Da 3.ª para a 1.ª corda também são três trastes: o {n:C} no traste 5 passa a {n:C} no traste 8.', 'Leva o desenho a subir e a descer, a abafar a corda do meio.']
      },
      tips: { en: ['The extra fret comes from the 2nd string being tuned one fret lower than the others.'], pt: ['O traste a mais vem de a 2.ª corda estar afinada um traste abaixo das outras.'] },
      sub: 1, tempo: { start: 50, goal: 100, step: 5 }, learn: 'fretboard',
      tab: '4.5+2.8 = 4.7+2.10 = | 4.9+2.12 = 4.10+2.13 = | 4.9+2.12 = 4.7+2.10 = | 4.5+2.8 = = =',
      vars: [{ name: { en: '3rd to 1st string', pt: 'Da 3.ª para a 1.ª corda' }, tab: '3.5+1.8 = 3.7+1.10 = | 3.9+1.12 = 3.10+1.13 = | 3.9+1.12 = 3.7+1.10 = | 3.5+1.8 = = =' }]
    },
    {
      id: 'fretboard-octave-chain', cat: 'fretboard', level: 3, tags: ['octaves', 'notes'], minutes: 5,
      title: { en: 'Three octaves of one note', pt: 'Três oitavas da mesma nota' },
      goal: { en: 'Chain octave shapes to play one note from the 6th string to the 1st.', pt: 'Encadear desenhos de oitava para tocar uma nota da 6.ª à 1.ª corda.' },
      how: {
        en: ['Start on {n:G} at fret 3 of the 6th string, jump two frets up on the 4th, then three frets up on the 2nd.', 'Next, start from the 5th string {n:G} at fret 10 and do the same to reach the 1st string.', 'Come back down the same way, saying the note name each time.'],
        pt: ['Começa no {n:G} no traste 3 da 6.ª corda, salta dois trastes acima na 4.ª e depois três acima na 2.ª.', 'A seguir parte do {n:G} da 5.ª corda, no traste 10, e faz o mesmo até chegar à 1.ª corda.', 'Volta a descer pelo mesmo caminho, a dizer o nome da nota de cada vez.']
      },
      sub: 1, tempo: { start: 50, goal: 100, step: 5 }, learn: 'fretboard',
      tab: octaveChain('G'),
      vars: keyVars(['A', 'C', 'D', 'E'], octaveChain)
    },
    {
      id: 'fretboard-unisons', cat: 'fretboard', level: 3, tags: ['notes'], minutes: 5,
      title: { en: 'Unisons: the same note on the next string', pt: 'Uníssonos: a mesma nota na corda seguinte' },
      goal: { en: 'Find the exact same pitch one string higher and hear that they match.', pt: 'Encontrar exatamente a mesma altura uma corda acima e ouvir que coincidem.' },
      how: {
        en: ['Play a note on the 6th string, then the same pitch on the 5th string five frets lower.', 'Listen: the two notes should sound identical, only the tone changes.', 'In the 3rd-to-2nd-string variation, the gap is four frets instead of five.'],
        pt: ['Toca uma nota na 6.ª corda e depois a mesma altura na 5.ª corda, cinco trastes abaixo.', 'Ouve: as duas notas devem soar iguais, só muda o timbre.', 'Na variação da 3.ª para a 2.ª corda, a distância é de quatro trastes em vez de cinco.']
      },
      tips: { en: ['This is the same trick you use to tune the guitar by ear.'], pt: ['É o mesmo truque que usas para afinar a guitarra de ouvido.'] },
      sub: 1, tempo: { start: 50, goal: 90, step: 5 }, learn: 'fretboard',
      tab: '6.5 = 5.0 = | 6.7 = 5.2 = | 6.8 = 5.3 = | 6.10 = 5.5 = | 6.12 = 5.7 =',
      vars: [
        { name: { en: '5th to 4th string', pt: 'Da 5.ª para a 4.ª corda' }, tab: '5.5 = 4.0 = | 5.7 = 4.2 = | 5.8 = 4.3 = | 5.10 = 4.5 = | 5.12 = 4.7 =' },
        { name: { en: '3rd to 2nd string', pt: 'Da 3.ª para a 2.ª corda' }, tab: '3.4 = 2.0 = | 3.5 = 2.1 = | 3.7 = 2.3 = | 3.9 = 2.5 = | 3.11 = 2.7 =' }
      ]
    },
    {
      id: 'fretboard-same-pitch', cat: 'fretboard', level: 4, tags: ['notes'], minutes: 5,
      title: { en: 'One pitch, many places', pt: 'Uma altura, vários sítios' },
      goal: { en: 'Play the exact same pitch on four or five different strings.', pt: 'Tocar exatamente a mesma altura em quatro ou cinco cordas diferentes.' },
      how: {
        en: ['The main tab plays one {n:E}: open 1st string, then fret 5, 9, 14 on the next strings.', 'Each step to a lower string moves five frets up (four when you go from the 2nd to the 3rd string).', 'Compare the colour: the same pitch sounds warmer on thicker strings.'],
        pt: ['A tablatura principal toca um só {n:E}: 1.ª corda solta e depois traste 5, 9 e 14 nas cordas seguintes.', 'Cada passo para uma corda mais grave sobe cinco trastes (quatro quando passas da 2.ª para a 3.ª corda).', 'Compara a cor: a mesma altura soa mais quente nas cordas mais grossas.']
      },
      tips: { en: ['Players move the same melody to another string just to change its colour.'], pt: ['Os guitarristas mudam a mesma melodia de corda só para mudar a cor.'] },
      sub: 1, tempo: { start: 50, goal: 90, step: 5 }, learn: 'fretboard',
      tab: barsOf(samePitch(64), 4),
      vars: [
        { name: { en: '{n:A}', pt: '{n:A}' }, tab: barsOf(samePitch(57), 4) },
        { name: { en: '{n:D}', pt: '{n:D}' }, tab: barsOf(samePitch(62), 4) },
        { name: { en: '{n:G}', pt: '{n:G}' }, tab: barsOf(samePitch(67), 4) }
      ]
    },
    {
      id: 'fretboard-thirds', cat: 'fretboard', level: 3, tags: ['intervals'], minutes: 5,
      title: { en: 'Major and minor thirds on the neck', pt: 'Terceiras maiores e menores no braço' },
      goal: { en: 'Find the major and minor 3rd above any root, the notes that make chords happy or sad.', pt: 'Encontrar a 3.ª maior e a 3.ª menor acima de qualquer tónica, as notas que tornam os acordes alegres ou tristes.' },
      how: {
        en: ['Play {n:A} at fret 5 of the 6th string, then fret 4 of the 5th string: a major 3rd ({n:C#}), happy.', 'Now play the same root and fret 3 of the 5th string: a minor 3rd ({n:C}), sad.', 'Play each pair apart and then together, and hear the mood change.'],
        pt: ['Toca o {n:A} no traste 5 da 6.ª corda e depois o traste 4 da 5.ª corda: uma 3.ª maior ({n:C#}), alegre.', 'Agora toca a mesma tónica e o traste 3 da 5.ª corda: uma 3.ª menor ({n:C}), triste.', 'Toca cada par separado e depois junto, e ouve o ambiente mudar.']
      },
      tips: { en: ['From the 3rd to the 2nd string both shapes move one fret higher: try the variation.'], pt: ['Da 3.ª para a 2.ª corda os dois desenhos sobem um traste: experimenta a variação.'] },
      sub: 1, tempo: { start: 50, goal: 90, step: 5 }, learn: 'intervals',
      tab: '6.5 5.4 6.5+5.4 = | 6.5 5.3 6.5+5.3 = | 6.8 5.7 6.8+5.7 = | 6.8 5.6 6.8+5.6 =',
      vars: [{ name: { en: '3rd to 2nd string', pt: 'Da 3.ª para a 2.ª corda' }, tab: '3.2 2.2 3.2+2.2 = | 3.2 2.1 3.2+2.1 = | 3.5 2.5 3.5+2.5 = | 3.5 2.4 3.5+2.4 =' }]
    },
    {
      id: 'fretboard-fourths-fifths', cat: 'fretboard', level: 2, tags: ['intervals', 'rock'], minutes: 5,
      title: { en: 'Fourths and fifths', pt: 'Quartas e quintas' },
      goal: { en: 'See the 4th and 5th above a root, the strong, open sounds behind power chords.', pt: 'Ver a 4.ª e a 5.ª acima de uma tónica, os sons fortes e abertos dos power chords.' },
      how: {
        en: ['Play {n:A} at fret 5 of the 6th string and fret 7 of the 5th string: a perfect 5th ({n:E}).', 'Same root, fret 5 of the 5th string: a perfect 4th ({n:D}).', 'Play each pair apart, then together.'],
        pt: ['Toca o {n:A} no traste 5 da 6.ª corda e o traste 7 da 5.ª corda: uma 5.ª perfeita ({n:E}).', 'A mesma tónica com o traste 5 da 5.ª corda: uma 4.ª perfeita ({n:D}).', 'Toca cada par separado e depois junto.']
      },
      tips: { en: ['A 4th on the next string is the same fret; a 5th is two frets up. Across the 2nd string add one fret.'], pt: ['Uma 4.ª na corda seguinte fica no mesmo traste; uma 5.ª fica dois trastes acima. Ao passar para a 2.ª corda junta um traste.'] },
      sub: 1, tempo: { start: 50, goal: 90, step: 5 }, learn: 'intervals',
      tab: '6.5 5.7 6.5+5.7 = | 6.5 5.5 6.5+5.5 = | 6.3 5.5 6.3+5.5 = | 6.3 5.3 6.3+5.3 =',
      vars: [{ name: { en: '3rd to 2nd string', pt: 'Da 3.ª para a 2.ª corda' }, tab: '3.2 2.3 3.2+2.3 = | 3.2 2.5 3.2+2.5 = | 3.4 2.5 3.4+2.5 = | 3.4 2.7 3.4+2.7 =' }]
    },
    {
      id: 'fretboard-interval-ladder', cat: 'fretboard', level: 4, tags: ['intervals'], minutes: 8,
      title: { en: 'All twelve intervals from one root', pt: 'Os doze intervalos a partir de uma tónica' },
      goal: { en: 'Know the shape of every interval from a minor 2nd to the octave.', pt: 'Conhecer o desenho de todos os intervalos, da 2.ª menor à oitava.' },
      how: {
        en: ['Root {n:A} on fret 5 of the 6th string; after each root comes the next interval, one fret higher in sound each time.', 'Small intervals stay on the 6th string; from the major 3rd on they move to the 5th and then the 4th string.', 'Name each one as it sounds: minor 2nd, major 2nd, minor 3rd... up to the octave.'],
        pt: ['Tónica {n:A} no traste 5 da 6.ª corda; depois de cada tónica vem o intervalo seguinte, meio tom mais agudo de cada vez.', 'Os intervalos pequenos ficam na 6.ª corda; a partir da 3.ª maior passam para a 5.ª e depois para a 4.ª corda.', 'Diz o nome de cada um quando soa: 2.ª menor, 2.ª maior, 3.ª menor... até à oitava.']
      },
      tips: { en: ['Sing the interval before you play it, then check yourself.'], pt: ['Canta o intervalo antes de o tocares e depois confirma.'] },
      sub: 1, tempo: { start: 50, goal: 100, step: 5 }, learn: 'intervals',
      tab: ladder(6, 5),
      vars: [{ name: { en: 'Root on the 5th string ({n:D})', pt: 'Tónica na 5.ª corda ({n:D})' }, tab: ladder(5, 5) }]
    }
  );
})();
