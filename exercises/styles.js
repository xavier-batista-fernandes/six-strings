/* Style studies: short original pieces in blues, rock, funk, folk, country, reggae, bossa, metal, ballad and jazz styles. */
(function () {
  var FORM = ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'];
  var QUICK = ['I', 'IV', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'];
  var E_MAP = { I: ['6.0m', '5.2m'], IV: ['5.0m', '4.2m'], V: ['5.2m', '4.4m'] };
  var A_MAP = { I: ['5.0m', '4.2m'], IV: ['4.0m', '3.2m'], V: ['6.0m', '5.2m'] };
  // One bar of boogie shuffle (sub 3): root + 5th, then root + 6th (5th two frets up), long-short, twice.
  function boogieM(root, fifth) {
    var f = fifth.replace('m', '').split('.');
    var a = root + '+' + fifth, b = root + '+' + f[0] + '.' + (+f[1] + 2) + 'm';
    return [a, '=', a, b, '=', b, a, '=', a, b, '=', b].join(' ');
  }
  function twelveBarM(map, form) {
    return form.map(function (c) { return boogieM(map[c][0], map[c][1]); }).join(' | ') + ' |';
  }
  // Strummed shuffle bar (sub 3): down on the beat, up on the last triplet.
  function shuffleStrum(form, names) {
    return form.map(function (c) { return '@' + names[c] + ' D = U D = U D = U D = U'; }).join(' | ') + ' |';
  }

  (window.SS_EXERCISES = window.SS_EXERCISES || []).push(
    {
      id: 'styles-shuffle-e', cat: 'styles', level: 2, tags: ['blues', 'triplets', 'muting'], minutes: 10,
      title: { en: '12-bar boogie shuffle in {n:E}', pt: 'Boogie shuffle de 12 compassos em {n:E}' },
      goal: { en: 'Play a full 12-bar blues with the classic boogie pattern on the low strings.',
              pt: 'Tocar um blues completo de 12 compassos com o padrão boogie nas cordas graves.' },
      how: { en: ['Hold the open low string and rock your finger between fret 2 and fret 4 on the string above.', 'Play long-short: the first note of each pair is twice as long as the second (shuffle feel).', 'Move the shape: {c:E} on strings 6-5, {c:A} on strings 5-4, {c:B} on strings 5-4 at fret 2.', 'Rest the side of your picking hand on the strings near the bridge for a chunky palm mute.'],
             pt: ['Deixa a corda grave solta e alterna o dedo entre o traste 2 e o traste 4 na corda de cima.', 'Toca longo-curto: a primeira nota de cada par dura o dobro da segunda (sensação de shuffle).', 'Muda a forma: {c:E} nas cordas 6-5, {c:A} nas cordas 5-4, {c:B} nas cordas 5-4 no traste 2.', 'Apoia a parte lateral da mão da palheta nas cordas junto à ponte para um palm mute encorpado.'] },
      tips: { en: ['Use down-strokes only. It keeps the shuffle heavy and even.', 'Count the bars: 4 of {c:E}, 2 of {c:A}, 2 of {c:E}, then {c:B} {c:A} {c:E} {c:B}.'],
              pt: ['Usa só palhetadas para baixo. Mantém o shuffle pesado e regular.', 'Conta os compassos: 4 de {c:E}, 2 de {c:A}, 2 de {c:E}, depois {c:B} {c:A} {c:E} {c:B}.'] },
      sub: 3, tempo: { start: 60, goal: 120, step: 5 }, learn: 'chords',
      tab: twelveBarM(E_MAP, FORM),
      vars: [{ name: { en: 'Quick change', pt: 'Mudança rápida' }, tab: twelveBarM(E_MAP, QUICK) }]
    },
    {
      id: 'styles-shuffle-a', cat: 'styles', level: 2, tags: ['blues', 'triplets', 'muting'], minutes: 10,
      title: { en: '12-bar boogie shuffle in {n:A}', pt: 'Boogie shuffle de 12 compassos em {n:A}' },
      goal: { en: 'Move the boogie pattern to {n:A}, switching between three string pairs.',
              pt: 'Passar o padrão boogie para {n:A}, mudando entre três pares de cordas.' },
      how: { en: ['{c:A} sits on strings 5-4, {c:D} on strings 4-3 and {c:E} on strings 6-5, all with open roots.', 'Rock between fret 2 and fret 4 with a long-short shuffle feel.', 'Mute the strings you are not using with the side of your picking hand.'],
             pt: ['{c:A} fica nas cordas 5-4, {c:D} nas cordas 4-3 e {c:E} nas cordas 6-5, todos com a tónica solta.', 'Alterna entre o traste 2 e o traste 4 com a sensação longo-curto do shuffle.', 'Abafa as cordas que não estás a usar com a parte lateral da mão da palheta.'] },
      tips: { en: ['On {c:D} the 3rd string is fretted: press firmly, it is the thinnest string you use here.'],
              pt: ['No {c:D} a 3.ª corda é pisada: carrega bem, é a corda mais fina que usas aqui.'] },
      sub: 3, tempo: { start: 60, goal: 120, step: 5 }, learn: 'chords',
      tab: twelveBarM(A_MAP, FORM)
    },
    {
      id: 'styles-shuffle-strum', cat: 'styles', level: 2, tags: ['blues', 'triplets', 'strumming', 'sevenths'], minutes: 8,
      title: { en: 'Strummed blues shuffle', pt: 'Shuffle de blues em rasgueado' },
      goal: { en: 'Strum a 12-bar blues in {n:A} with seventh chords and a swung feel.',
              pt: 'Rasgar um blues de 12 compassos em {n:A} com acordes de sétima e balanço.' },
      how: { en: ['Learn the open shapes {c:A7}, {c:D7} and {c:E7}.', 'Strum down on each beat and up on the last part of the beat: long-short, long-short.', 'Follow the 12-bar order and keep the hand moving through the changes.'],
             pt: ['Aprende as formas abertas de {c:A7}, {c:D7} e {c:E7}.', 'Rasga para baixo em cada tempo e para cima no fim do tempo: longo-curto, longo-curto.', 'Segue a ordem dos 12 compassos e mantém a mão a mexer nas mudanças.'] },
      sub: 3, tempo: { start: 60, goal: 120, step: 5 }, learn: 'chords',
      chords: { A7: [-1, 0, 2, 0, 2, 0], D7: [-1, -1, 0, 2, 1, 2], E7: [0, 2, 0, 1, 0, 0] },
      tab: shuffleStrum(FORM, { I: 'A7', IV: 'D7', V: 'E7' })
    },
    {
      id: 'styles-blues-turnaround-e', cat: 'styles', level: 3, tags: ['blues', 'triplets', 'chromatic'], minutes: 6,
      title: { en: 'Blues turnaround in {n:E}', pt: 'Turnaround de blues em {n:E}' },
      goal: { en: 'Play a two-bar ending that walks down and sends the blues back to the top.',
              pt: 'Tocar um final de dois compassos que desce e manda o blues de volta ao início.' },
      how: { en: ['Keep the open 1st string ringing while the 3rd string walks down from fret 4 to fret 1.', 'Play each pair long-short, like the shuffle.', 'Bar 2: hit {c:E}, then {c:B7} to set up the next 12 bars.', 'Play it at the end of the {n:E} shuffle exercise.'],
             pt: ['Deixa a 1.ª corda solta a soar enquanto a 3.ª corda desce do traste 4 ao traste 1.', 'Toca cada par longo-curto, como no shuffle.', 'Compasso 2: toca {c:E} e depois {c:B7} para preparar os 12 compassos seguintes.', 'Toca-o no fim do exercício de shuffle em {n:E}.'] },
      tips: { en: ['Use one finger per fret as you walk down so your hand does not jump.'],
              pt: ['Usa um dedo por traste ao descer para a mão não saltar.'] },
      sub: 3, tempo: { start: 50, goal: 100, step: 5 }, learn: 'chords',
      tab: '3.4+1.0 - 3.4+1.0 3.3+1.0 - 3.3+1.0 3.2+1.0 - 3.2+1.0 3.1+1.0 - 3.1+1.0 | 6.0+5.2+4.2+3.1 = = = = = 5.2+4.1+3.2+2.0+1.2 = = = = - |'
    },
    {
      id: 'styles-slow-blues-lick', cat: 'styles', level: 3, tags: ['blues', 'bends', 'vibrato', 'phrasing'], minutes: 10,
      title: { en: 'Slow blues lick', pt: 'Frase de blues lento' },
      goal: { en: 'Play a slow, singing blues phrase in {n:A} with bends and vibrato.',
              pt: 'Tocar uma frase de blues lento em {n:A}, cantada, com bends e vibrato.' },
      how: { en: ['Feel the beat in three: each beat is a slow triplet.', 'Bar 1: bend {n:C} (1st string fret 8) up a half step to {n:C#}, the sweet major 3rd.', 'Bar 2: bend the 3rd string fret 7 up a whole step, release it, and finish on {n:A} with wide vibrato.', 'Let every note ring as long as the tab says.'],
             pt: ['Sente o tempo a três: cada tempo é uma tercina lenta.', 'Compasso 1: puxa o {n:C} (1.ª corda traste 8) meio-tom acima até {n:C#}, a terceira maior doce.', 'Compasso 2: puxa a 3.ª corda traste 7 um tom acima, solta-a e acaba no {n:A} com vibrato largo.', 'Deixa cada nota soar o tempo que a tablatura indica.'] },
      tips: { en: ['Slow blues is about the space between notes. Do not rush to fill it.'],
              pt: ['O blues lento vive do espaço entre as notas. Não te apresses a enchê-lo.'] },
      sub: 3, tempo: { start: 45, goal: 70, step: 3 }, learn: 'scales',
      tab: '1.8b9 = = 1.5 - - 2.8 - 2.5 3.7 = = | 3.7b9 = = 3.7r - 3.5 4.7v = = = = - |'
    },
    {
      id: 'styles-rock-power-riff', cat: 'styles', level: 2, tags: ['rock', 'muting', 'picking'], minutes: 8,
      title: { en: 'Palm-muted power-chord riff', pt: 'Riff de power chords com palm mute' },
      goal: { en: 'Switch between chugging palm mutes and open power chords in time.',
              pt: 'Alternar a tempo entre notas abafadas e power chords abertos.' },
      how: { en: ['Palm-mute the open 6th string for the chugs.', 'Lift your palm for the power chords {c:G5}, {c:A5} and {c:D5}.', 'Use down-strokes throughout and keep the 8ths steady.'],
             pt: ['Faz palm mute na 6.ª corda solta para os "chugs".', 'Levanta a mão para os power chords {c:G5}, {c:A5} e {c:D5}.', 'Usa sempre palhetadas para baixo e mantém as colcheias certas.'] },
      tips: { en: ['The contrast between muted and open is the riff. Make it obvious.'],
              pt: ['O contraste entre abafado e aberto é o próprio riff. Torna-o evidente.'] },
      sub: 2, tempo: { start: 80, goal: 140, step: 5 }, learn: 'chords',
      tab: '6.0m 6.0m 6.0m 6.0m 6.3+5.5 = 6.0m 6.0m | 6.5+5.7 = 6.0m 6.0m 6.3+5.5 = 6.0m 6.0m | 6.0m 6.0m 6.0m 6.0m 6.3+5.5 = 6.0m 6.0m | 5.5+4.7 = = 6.5+5.7 = = 6.3+5.5 = |'
    },
    {
      id: 'styles-rock-pent-riff', cat: 'styles', level: 2, tags: ['rock', 'pentatonic', 'minor'], minutes: 6,
      title: { en: 'Low pentatonic rock riff', pt: 'Riff rock pentatónico grave' },
      goal: { en: 'Play a single-note riff on the low strings with the {n:E} minor pentatonic.',
              pt: 'Tocar um riff de notas soltas nas cordas graves com a pentatónica menor de {n:E}.' },
      how: { en: ['All notes are open or on frets 2 and 3 of the 6th, 5th and 4th strings.', 'Use alternate picking, down on the beat.', 'Loop it and let the last note ring.'],
             pt: ['Todas as notas são soltas ou nos trastes 2 e 3 das 6.ª, 5.ª e 4.ª cordas.', 'Usa palhetada alternada, para baixo no tempo.', 'Repete em ciclo e deixa a última nota soar.'] },
      sub: 2, tempo: { start: 80, goal: 140, step: 5 }, learn: 'scales',
      tab: '6.0 6.3 6.0 5.2 - 6.0 6.3 5.0 | - 5.2 5.0 6.3 6.0 = - - | 6.0 6.3 6.0 5.2 - 6.0 6.3 5.0 | 5.2 4.2 5.2 5.0 6.3 6.0 = - |'
    },
    {
      id: 'styles-classic-rock-doublestops', cat: 'styles', level: 3, tags: ['rock', 'phrasing', 'major'], minutes: 8,
      title: { en: 'Classic-rock double stops', pt: 'Notas duplas de rock clássico' },
      goal: { en: 'Play a riff in {n:A} that mixes the open bass with two-note shapes.',
              pt: 'Tocar um riff em {n:A} que mistura o baixo solto com formas de duas notas.' },
      how: { en: ['Hit the open 5th string, then play pairs of notes on strings 3 and 2.', 'The pairs walk up the {n:A} major sound and back down.', 'Bar 3 moves the idea to {c:D} on strings 2 and 1.', 'Pick both strings of each pair together, cleanly.'],
             pt: ['Toca a 5.ª corda solta e depois pares de notas nas cordas 3 e 2.', 'Os pares sobem pelo som de {n:A} maior e voltam a descer.', 'O compasso 3 leva a ideia para {c:D} nas cordas 2 e 1.', 'Ataca as duas cordas de cada par juntas e de forma limpa.'] },
      tips: { en: ['Barre the pairs on the same fret with one finger; use two fingers for the others.'],
              pt: ['Faz pestana com um dedo nos pares do mesmo traste; usa dois dedos nos outros.'] },
      sub: 2, tempo: { start: 70, goal: 130, step: 5 }, learn: 'chords',
      tab: '5.0 = 3.2+2.2 = 3.4+2.3 3.2+2.2 - 5.0 | 5.0 - 3.6+2.5 = 3.7+2.7 3.6+2.5 3.4+2.3 3.2+2.2 | 4.0 = 2.3+1.2 = 2.5+1.5 2.3+1.2 - 4.0 | 6.0 - 3.2+2.2 = 3.4+2.3 3.2+2.2 5.0 - |'
    },
    {
      id: 'styles-funk-single-note', cat: 'styles', level: 3, tags: ['funk', 'muting', 'syncopation', 'alternate-picking'], minutes: 8,
      title: { en: 'Funk single-note riff', pt: 'Riff funk de notas soltas' },
      goal: { en: 'Play a tight 16th-note riff in {n:E} with muted ghost notes.',
              pt: 'Tocar um riff apertado em semicolcheias em {n:E}, com notas mortas.' },
      how: { en: ['Keep your picking hand moving down-up on every 16th, even in the rests.', 'For the x notes, relax the fretting finger so the string clicks without a pitch.', 'Stay around fret 7: {n:E} on the 5th string, {n:G} {n:A} {n:B} on the 4th.'],
             pt: ['Mantém a mão da palheta a mexer para baixo e para cima em cada semicolcheia, mesmo nas pausas.', 'Nas notas com x, alivia o dedo que pisa para a corda estalar sem nota.', 'Fica à volta do traste 7: {n:E} na 5.ª corda, {n:G} {n:A} {n:B} na 4.ª.'] },
      tips: { en: ['Short notes sound funkier. Release each note right after you pick it.'],
              pt: ['Notas curtas soam mais funk. Solta cada nota logo depois de a tocares.'] },
      sub: 4, tempo: { start: 60, goal: 100, step: 4 }, learn: 'scales',
      tab: '5.7 - 5.x 5.7 - 5.7 4.5 4.7 5.x 5.7 - 5.5 5.7 - 4.x 4.9 | 5.7 - 5.x 5.7 - 5.7 4.5 4.7 - 4.9 4.7 4.5 5.7 - 5.x - |'
    },
    {
      id: 'styles-funk-stabs', cat: 'styles', level: 3, tags: ['funk', 'strumming', 'muting', 'syncopation'], minutes: 8,
      title: { en: 'Funk chord stabs', pt: 'Golpes de acorde funk' },
      goal: { en: 'Play short {c:E9} stabs on a steady 16th-note strumming motion.',
              pt: 'Tocar golpes curtos de {c:E9} sobre um movimento constante de semicolcheias.' },
      how: { en: ['Fret {c:E9} with the root on the 5th string, fret 7. Mute the 6th and 1st strings.', 'Move the hand down-up on every 16th. Most strums miss the strings.', 'On the hits, squeeze then release the chord at once so it is short.', 'X strums are muted scratches: relax the fretting hand.'],
             pt: ['Pisa o {c:E9} com a tónica na 5.ª corda, traste 7. Abafa a 6.ª e a 1.ª cordas.', 'Mexe a mão para baixo e para cima em cada semicolcheia. A maioria dos movimentos falha as cordas.', 'Nos golpes, aperta e solta logo o acorde para ficar curto.', 'Os X são raspadas abafadas: alivia a mão que pisa.'] },
      tips: { en: ['The motion never stops. Only the contact with the strings changes.'],
              pt: ['O movimento nunca para. Só muda o contacto com as cordas.'] },
      sub: 4, tempo: { start: 60, goal: 100, step: 4 }, learn: 'chords',
      chords: { E9: [-1, 7, 6, 7, 7, -1] },
      tab: '@E9 D> u d u X u d U> d u D> u X u d u | D> u d U X u d u d U> d u X u D u |'
    },
    {
      id: 'styles-funk-combo', cat: 'styles', level: 5, tags: ['funk', 'muting', 'syncopation', 'strumming'], minutes: 12,
      title: { en: 'Funk riff and stabs together', pt: 'Riff funk e golpes juntos' },
      goal: { en: 'Switch between single notes and {c:E9} stabs without breaking the 16th groove.',
              pt: 'Alternar entre notas soltas e golpes de {c:E9} sem quebrar o groove de semicolcheias.' },
      how: { en: ['Learn the single-note riff and the {c:E9} stabs separately first.', 'Here the first half of each bar is a single-note line and the second half is chords.', 'Keep the picking hand moving down-up the whole time.'],
             pt: ['Aprende primeiro o riff de notas soltas e os golpes de {c:E9} em separado.', 'Aqui a primeira metade de cada compasso é uma linha de notas e a segunda são acordes.', 'Mantém a mão da palheta sempre a mexer para baixo e para cima.'] },
      sub: 4, tempo: { start: 60, goal: 105, step: 3 }, learn: 'chords',
      chords: { E9: [-1, 7, 6, 7, 7, -1] },
      tab: '5.7 - 5.x 5.7 - 5.7 4.5 4.7 @E9 d u D> u X u d U> | 5.7 - 5.x 5.5 5.7 - 4.x 4.9 @E9 D> u d U> d u X u |'
    },
    {
      id: 'styles-folk-fingerpicking', cat: 'styles', level: 2, tags: ['folk', 'fingerstyle', 'open-chords', 'arpeggios'], minutes: 10,
      title: { en: 'Folk fingerpicking study', pt: 'Estudo de dedilhado folk' },
      goal: { en: 'Fingerpick {c:C} {c:G} {c:Am} {c:F} with the thumb alternating between two bass strings.',
              pt: 'Dedilhar {c:C} {c:G} {c:Am} {c:F} com o polegar a alternar entre duas cordas graves.' },
      how: { en: ['The thumb plays the bass notes on beats 1 and 3; the fingers play the 3rd and 2nd strings in between.', 'Hold the whole chord shape down so every note rings.', 'For {c:F}, use the small shape on the top four strings.'],
             pt: ['O polegar toca os baixos nos tempos 1 e 3; os dedos tocam a 3.ª e a 2.ª cordas entre eles.', 'Segura a forma completa do acorde para todas as notas soarem.', 'No {c:F}, usa a forma pequena nas quatro cordas agudas.'] },
      tips: { en: ['Index finger on the 3rd string, middle on the 2nd. Do not change fingers mid-bar.'],
              pt: ['Indicador na 3.ª corda, médio na 2.ª. Não troques de dedo a meio do compasso.'] },
      sub: 2, tempo: { start: 60, goal: 110, step: 5 }, learn: 'chords',
      tab: '5.3 3.0 2.1 3.0 4.2 3.0 2.1 3.0 | 6.3 3.0 2.0 3.0 4.0 3.0 2.0 3.0 | 5.0 3.2 2.1 3.2 4.2 3.2 2.1 3.2 | 4.3 3.2 2.1 3.2 5.3 3.2 2.1 3.2 |'
    },
    {
      id: 'styles-travis-picking', cat: 'styles', level: 4, tags: ['folk', 'country', 'fingerstyle', 'open-chords'], minutes: 12,
      title: { en: 'Travis-picking study', pt: 'Estudo de Travis picking' },
      goal: { en: 'Keep a steady alternating thumb on every beat while the fingers fill the off-beats.',
              pt: 'Manter o polegar a alternar em todos os tempos enquanto os dedos preenchem os contratempos.' },
      how: { en: ['Practise the thumb alone first: it plays every beat, jumping between two bass strings.', 'Add the fingers on the "and" of each beat, plus a pinch (thumb and finger together) on beat 1.', 'On {c:C}, move your ring finger to the 6th string fret 3 for the third beat.', 'Chords: {c:C} {c:Am} {c:G} {c:C}.'],
             pt: ['Pratica primeiro só o polegar: toca todos os tempos, a saltar entre duas cordas graves.', 'Junta os dedos no "e" de cada tempo, mais uma pinça (polegar e dedo juntos) no tempo 1.', 'No {c:C}, passa o anelar para a 6.ª corda traste 3 no terceiro tempo.', 'Acordes: {c:C} {c:Am} {c:G} {c:C}.'] },
      tips: { en: ['Palm-mute the bass lightly so the thumb sounds like a separate instrument.', 'If it falls apart, slow down until the thumb is automatic.'],
              pt: ['Abafa ligeiramente os baixos com a palma para o polegar soar como outro instrumento.', 'Se se desmanchar, abranda até o polegar ficar automático.'] },
      sub: 2, tempo: { start: 60, goal: 110, step: 4 }, learn: 'chords',
      tab: '5.3+2.1 3.0 4.2 2.1 6.3 3.0 4.2 2.1 | 5.0+2.1 3.2 4.2 2.1 6.0 3.2 4.2 2.1 | 6.3+1.3 2.0 4.0 3.0 6.3 2.0 4.0 3.0 | 5.3+1.0 2.1 4.2 3.0 6.3 2.1 5.3+1.0 = |'
    },
    {
      id: 'styles-country-hybrid', cat: 'styles', level: 4, tags: ['country', 'hybrid', 'major'], minutes: 10,
      title: { en: 'Country hybrid-picking lick', pt: 'Frase country com hybrid picking' },
      goal: { en: 'Play a bright {n:G} lick using the pick and your middle finger together.',
              pt: 'Tocar uma frase alegre em {n:G} usando a palheta e o dedo médio em conjunto.' },
      how: { en: ['Hold the pick as usual. Play the lower note with the pick and the higher string with your middle finger.', 'The double stop at the start is a pinch: pick and finger at the same time.', 'In bar 2, pick the {n:Bb} and hammer on to {n:B}: a small bluesy touch.', 'Snap the finger notes a little so they pop.'],
             pt: ['Segura a palheta como sempre. Toca a nota mais grave com a palheta e a corda mais aguda com o dedo médio.', 'A nota dupla do início é uma pinça: palheta e dedo ao mesmo tempo.', 'No compasso 2, toca o {n:Bb} e faz hammer-on para {n:B}: um toque de blues.', 'Puxa um pouco as notas do dedo para estalarem.'] },
      tips: { en: ['Keep the fingers curled and close to the strings, ready for the next note.'],
              pt: ['Mantém os dedos dobrados e perto das cordas, prontos para a nota seguinte.'] },
      sub: 2, tempo: { start: 60, goal: 120, step: 5 }, learn: 'scales',
      tab: '6.3 4.5+2.3 4.2 4.4h 4.5 2.3 3.4 2.3 | 3.2 - 3.3 3.4h 2.3 1.3 = - | 6.3 4.5+2.3 4.2 4.4h 4.5 2.3 3.4 2.3 | 3.2 3.4 4.5 4.2 5.5 6.3v = - |'
    },
    {
      id: 'styles-country-boom-chick', cat: 'styles', level: 2, tags: ['country', 'strumming', 'open-chords'], minutes: 8,
      title: { en: 'Boom-chick country rhythm', pt: 'Ritmo country "boom-chick"' },
      goal: { en: 'Alternate a single bass note with a strum on {c:G} {c:C} {c:D}.',
              pt: 'Alternar uma nota de baixo com um rasgueado em {c:G} {c:C} {c:D}.' },
      how: { en: ['Pick the root on beat 1, strum the chord on beat 2.', 'Pick a different bass note on beat 3, strum again on beat 4.', 'On the strums, aim at the higher strings only.'],
             pt: ['Toca a tónica no tempo 1 e rasga o acorde no tempo 2.', 'Toca outra nota de baixo no tempo 3 e rasga outra vez no tempo 4.', 'Nos rasgueados, aponta só às cordas mais agudas.'] },
      sub: 2, tempo: { start: 70, goal: 130, step: 5 }, learn: 'chords',
      chords: { G: [3, 2, 0, 0, 0, 3], C: [-1, 3, 2, 0, 1, 0], D: [-1, -1, 0, 2, 3, 2] },
      tab: '@G 6.3 - D - 4.0 - D U | 6.3 - D - 4.0 - D U | @C 5.3 - D - 4.2 - D U | @G 6.3 - D - 4.0 - D U | @D 4.0 - D - 5.0 - D U | @D 4.0 - D - 5.0 - D U | @G 6.3 - D - 4.0 - D U | 6.3 - D - - - - - |'
    },
    {
      id: 'styles-reggae-skank', cat: 'styles', level: 2, tags: ['reggae', 'strumming', 'muting', 'syncopation'], minutes: 8,
      title: { en: 'Reggae skank', pt: 'Skank de reggae' },
      goal: { en: 'Play short, choppy chords on beats 2 and 4 with {c:Am} and {c:Dm}.',
              pt: 'Tocar acordes curtos e secos nos tempos 2 e 4 com {c:Am} e {c:Dm}.' },
      how: { en: ['Use small shapes on the top three strings: {c:Am} at fret 5, {c:Dm} with frets 7-6-5.', 'Strum only on beats 2 and 4.', 'Right after each strum, relax your fretting hand so the chord stops at once.'],
             pt: ['Usa formas pequenas nas três cordas agudas: {c:Am} no traste 5, {c:Dm} com os trastes 7-6-5.', 'Rasga só nos tempos 2 e 4.', 'Logo depois de cada golpe, alivia a mão que pisa para o acorde parar de imediato.'] },
      tips: { en: ['The silence after the chord is as important as the chord. Keep it laid back.'],
              pt: ['O silêncio depois do acorde é tão importante como o acorde. Toca descontraído.'] },
      sub: 2, tempo: { start: 60, goal: 90, step: 4 }, learn: 'chords',
      chords: { Am: [-1, -1, -1, 5, 5, 5], Dm: [-1, -1, -1, 7, 6, 5] },
      tab: '@Am - - D> - - - D> - | - - D> - - - D> - | @Dm - - D> - - - D> - | - - D> - - - D> - |',
      vars: [{ name: { en: 'Double chop', pt: 'Golpe duplo' }, tab: '@Am - - D> U - - D> U | - - D> U - - D> U | @Dm - - D> U - - D> U | - - D> U - - D> U |' }]
    },
    {
      id: 'styles-bossa-comping', cat: 'styles', level: 4, tags: ['jazz', 'fingerstyle', 'sevenths', 'syncopation'], minutes: 12,
      title: { en: 'Bossa-style comping', pt: 'Acompanhamento estilo bossa' },
      goal: { en: 'Play a gentle bossa rhythm on {c:Dm7} {c:G7} {c:Cmaj7}: thumb on the beat, fingers off it.',
              pt: 'Tocar um ritmo de bossa suave em {c:Dm7} {c:G7} {c:Cmaj7}: polegar no tempo, dedos fora dele.' },
      how: { en: ['Use your thumb for the bass note on beats 1 and 3.', 'Pluck the top three notes together with three fingers, in the gaps shown in the tab.', 'Shapes: {c:Dm7} with the root on the 5th string fret 5, {c:G7} on the 6th string fret 3, {c:Cmaj7} on the 5th string fret 3.', 'Play softly. Bossa is quiet and relaxed.'],
             pt: ['Usa o polegar para o baixo nos tempos 1 e 3.', 'Belisca as três notas de cima juntas com três dedos, nos espaços indicados na tablatura.', 'Formas: {c:Dm7} com a tónica na 5.ª corda traste 5, {c:G7} na 6.ª corda traste 3, {c:Cmaj7} na 5.ª corda traste 3.', 'Toca suave. A bossa é calma e descontraída.'] },
      tips: { en: ['Count the thumb out loud and let the fingers fall around it.'],
              pt: ['Conta o polegar em voz alta e deixa os dedos encaixarem à volta dele.'] },
      sub: 2, tempo: { start: 60, goal: 110, step: 4 }, learn: 'chords',
      tab: '5.5+3.5+2.6+1.5 - 3.5+2.6+1.5 - 5.5 3.5+2.6+1.5 - 3.5+2.6+1.5 | 6.3+4.3+3.4+2.3 - 4.3+3.4+2.3 - 6.3 4.3+3.4+2.3 - 4.3+3.4+2.3 | 5.3+3.4+2.5+1.3 - 3.4+2.5+1.3 - 5.3 3.4+2.5+1.3 - 3.4+2.5+1.3 | 5.3+3.4+2.5+1.3 = = = = = = - |'
    },
    {
      id: 'styles-metal-gallop', cat: 'styles', level: 3, tags: ['metal', 'muting', 'picking', 'stamina'], minutes: 8,
      title: { en: 'Metal gallop', pt: 'Galope de metal' },
      goal: { en: 'Play the gallop rhythm (long, short-short) tight and palm-muted on the low {n:E}.',
              pt: 'Tocar o ritmo de galope (longo, curto-curto) apertado e com palm mute no {n:E} grave.' },
      how: { en: ['Each gallop is one 8th and two 16ths: "da, da-da".', 'Pick it down, down-up to start; later try all down-strokes.', 'Keep the palm on the 6th string near the bridge and lift it for the accented power chords.'],
             pt: ['Cada galope é uma colcheia e duas semicolcheias: "pá, pá-pá".', 'Começa com baixo, baixo-cima; mais tarde experimenta tudo para baixo.', 'Mantém a palma na 6.ª corda junto à ponte e levanta-a nos power chords acentuados.'] },
      tips: { en: ['Tightness beats speed. Record it and check the gallops are all the same length.'],
              pt: ['Precisão vale mais do que velocidade. Grava e confirma que os galopes têm todos a mesma duração.'] },
      sub: 4, tempo: { start: 70, goal: 160, step: 5 }, learn: 'chords',
      tab: '6.0m - 6.0m 6.0m 6.0m - 6.0m 6.0m 6.0m - 6.0m 6.0m 6.1>+5.3> = = - | 6.0m - 6.0m 6.0m 6.0m - 6.0m 6.0m 6.3>+5.5> = 6.1>+5.3> = 6.0m - 6.0m 6.0m |',
      vars: [{ name: { en: 'Reverse gallop', pt: 'Galope invertido' }, tab: '6.0m 6.0m 6.0m - 6.0m 6.0m 6.0m - 6.0m 6.0m 6.0m - 6.1>+5.3> = = - | 6.0m 6.0m 6.0m - 6.0m 6.0m 6.0m - 6.3>+5.5> = 6.1>+5.3> = 6.0m 6.0m 6.0m - |' }]
    },
    {
      id: 'styles-ballad-arpeggios', cat: 'styles', level: 2, tags: ['arpeggios', 'open-chords', 'picking', 'string-crossing'], minutes: 10,
      title: { en: 'Arpeggiated ballad', pt: 'Balada em arpejos' },
      goal: { en: 'Pick {c:G} {c:D/F#} {c:Em} {c:C} one string at a time and let the notes ring together.',
              pt: 'Tocar {c:G} {c:D/F#} {c:Em} {c:C} corda a corda e deixar as notas soar juntas.' },
      how: { en: ['Hold each chord shape for the whole bar.', 'Pick from the bass up to the 1st string, then back down.', 'For {c:D/F#}, wrap your thumb over the neck for the 6th string fret 2, or use your 2nd finger.'],
             pt: ['Segura cada forma de acorde durante o compasso inteiro.', 'Toca do baixo até à 1.ª corda e depois volta a descer.', 'No {c:D/F#}, passa o polegar por cima do braço para a 6.ª corda traste 2, ou usa o dedo 2.'] },
      tips: { en: ['Play softly and evenly. No note should jump out.'],
              pt: ['Toca suave e por igual. Nenhuma nota deve saltar à frente.'] },
      sub: 2, tempo: { start: 60, goal: 100, step: 4 }, learn: 'chords',
      tab: '6.3 4.0 3.0 2.0 1.3 2.0 3.0 4.0 | 6.2 4.0 3.2 2.3 1.2 2.3 3.2 4.0 | 6.0 4.2 3.0 2.0 1.0 2.0 3.0 4.2 | 5.3 4.2 3.0 2.1 1.0 2.1 3.0 4.2 |'
    },
    {
      id: 'styles-jazz-two-five-one', cat: 'styles', level: 4, tags: ['jazz', 'sevenths', 'changes', 'syncopation'], minutes: 10,
      title: { en: 'Jazz ii-V-I comping', pt: 'Acompanhamento jazz ii-V-I' },
      goal: { en: 'Comp {c:Dm7} {c:G7} {c:Cmaj7} with three-note shells and a swinging rhythm.',
              pt: 'Acompanhar {c:Dm7} {c:G7} {c:Cmaj7} com formas de três notas e um ritmo com swing.' },
      how: { en: ['Each shell is just root, 3rd and 7th: three strings, nothing else.', '{c:Dm7} and {c:Cmaj7} have the root on the 5th string, {c:G7} on the 6th.', 'Hit on beat 1 and just before beat 3, short and crisp.', 'Notice how little your fingers move between the shapes.'],
             pt: ['Cada forma é só tónica, terceira e sétima: três cordas, mais nada.', '{c:Dm7} e {c:Cmaj7} têm a tónica na 5.ª corda, {c:G7} na 6.ª.', 'Toca no tempo 1 e mesmo antes do tempo 3, curto e nítido.', 'Repara como os dedos quase não se mexem entre as formas.'] },
      tips: { en: ['Let the fretting-hand fingers touch the unused strings so a full strum still sounds clean.'],
              pt: ['Deixa os dedos da mão que pisa tocar nas cordas não usadas para que um rasgueado completo soe limpo.'] },
      sub: 2, tempo: { start: 70, goal: 140, step: 5 }, learn: 'chords',
      chords: { Dm7: [-1, 5, 3, 5, -1, -1], G7: [3, -1, 3, 4, -1, -1], Cmaj7: [-1, 3, 2, 4, -1, -1] },
      tab: '@Dm7 D> - - D - - - - | @G7 D> - - D - - - - | @Cmaj7 D> - - D - - - - | D = = = = = - - |',
      vars: [{ name: { en: 'Four to the bar', pt: 'Quatro por compasso' }, tab: '@Dm7 D - D - D> - D - | @G7 D - D - D> - D - | @Cmaj7 D - D - D> - D - | D - D - D> - D - |' }]
    }
  );
})();
