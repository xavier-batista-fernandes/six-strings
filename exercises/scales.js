/* Scales: pentatonic boxes, blues, major (CAGED + 3 notes per string), minor, sequences, linking, modes.
   Tabs are generated from scale formulas and standard tuning (E A D G B E) so every fret is a scale note. */
(function () {
  var OPEN = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
  var PC = { C: 0, 'C#': 1, D: 2, Eb: 3, E: 4, F: 5, 'F#': 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
  var SC = {
    minPent: [0, 3, 5, 7, 10], majPent: [0, 2, 4, 7, 9],
    major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], harm: [0, 2, 3, 5, 7, 8, 11],
    dorian: [0, 2, 3, 5, 7, 9, 10], mixo: [0, 2, 4, 5, 7, 9, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11], phryg: [0, 1, 3, 5, 7, 8, 10]
  };
  function mod(a, m) { return ((a % m) + m) % m; }
  function inS(p, root, sc) { return sc.indexOf(mod(p - root, 12)) >= 0; }
  function check(L, what) {
    if (!L.length || !L.every(function (n) { return n.f >= 0 && n.f <= 17; })) throw new Error('scales.js: out of range ' + what);
    return L;
  }
  /* n notes per string, starting on scale degree `deg` on the 6th string (lowest placement that fits, at or above minF). */
  function nps(key, sc, deg, n, minF) {
    var root = PC[key], f0 = mod(root + sc[deg] - 4, 12), cands = [f0, f0 + 12];
    for (var c = 0; c < cands.length; c++) {
      var f = cands[c]; if (f < (minF || 0)) continue;
      var L = [], i = 0;
      for (var p = 40 + f; L.length < 6 * n; p++) if (inS(p, root, sc)) { var str = 6 - Math.floor(i / n); L.push({ s: str, f: p - OPEN[str] }); i++; }
      if (L.every(function (x) { return x.f >= 0 && x.f <= 17; })) return L;
    }
    throw new Error('scales.js: no placement for ' + key + ' deg ' + deg);
  }
  /* Every scale note inside a 5-fret window, string by string, always moving up in pitch. */
  function win(key, sc, lo, strings) {
    var root = PC[key], L = [], last = -1;
    (strings || [6, 5, 4, 3, 2, 1]).forEach(function (str) {
      for (var f = Math.max(0, lo); f <= lo + 4; f++) { var p = OPEN[str] + f; if (inS(p, root, sc) && p > last) { L.push({ s: str, f: f }); last = p; } }
    });
    return check(L, key + ' window ' + lo);
  }
  function r6(key) { return mod(PC[key] - 4, 12); }            // root fret on the 6th string
  function lo(key, off) { return mod(PC[key] - 4 + off, 12); } // window start relative to that root
  function pitch(n) { return OPEN[n.s] + n.f; }
  /* Blues scale: the pentatonic box plus the flat 5 one fret above each 4th. */
  function blues(key, deg) {
    var root = PC[key], out = [];
    nps(key, SC.minPent, deg, 2).forEach(function (n) { out.push(n); if (mod(pitch(n) - root, 12) === 5) out.push({ s: n.s, f: n.f + 1 }); });
    return check(out, 'blues ' + key);
  }
  function upDown(L) { return L.concat(L.slice(0, -1).reverse()); }
  function groups(L, g) {
    var out = [], i, j;
    for (i = 0; i + g <= L.length; i++) for (j = 0; j < g; j++) out.push(L[i + j]);
    for (i = L.length - 1; i - g + 1 >= 0; i--) for (j = 0; j < g; j++) out.push(L[i - j]);
    return out;
  }
  function thirds(L) {
    var out = [], i;
    for (i = 0; i + 2 < L.length; i++) out.push(L[i], L[i + 2]);
    for (i = L.length - 1; i - 2 >= 0; i--) out.push(L[i], L[i - 2]);
    return out;
  }
  /* Tokens; mode 'leg' adds h/p between notes on one string, 's' adds slides. */
  function toks(seq, mode) {
    return seq.map(function (n, i) {
      var t = n.s + '.' + n.f, pr = seq[i - 1];
      if (mode && pr && pr.s === n.s && pr.f !== n.f) t += mode === 's' ? 's' : (n.f > pr.f ? 'h' : 'p');
      return t;
    });
  }
  /* Bars of beats*sub; an up-and-down run that would land on its first note again drops it so the loop is seamless, otherwise the last note rings. */
  function bars(t, per, isLoop) {
    t = t.slice();
    if (isLoop && (t.length - 1) % per === 0) t.pop();
    while (t.length % per) t.push('=');
    var out = [];
    for (var i = 0; i < t.length; i += per) out.push(t.slice(i, i + per).join(' '));
    return out.join(' | ');
  }
  function loopTab(L, per, mode) { return bars(toks(upDown(L), mode), per, true); }
  function seqTab(seq, per, mode) { return bars(toks(seq, mode), per, false); }
  function list(arr, lang) { return arr.length < 2 ? String(arr[0]) : arr.slice(0, -1).join(', ') + (lang === 'en' ? ' and ' : ' e ') + arr[arr.length - 1]; }
  function rootStrings(L, key) {
    var s = []; L.forEach(function (n) { if (mod(pitch(n) - PC[key], 12) === 0 && s.indexOf(n.s) < 0) s.push(n.s); });
    return s.sort(function (a, b) { return b - a; });
  }
  function range(L) { var fs = L.map(function (n) { return n.f; }); return [Math.min.apply(null, fs), Math.max.apply(null, fs)]; }
  function keyName(k) { return { en: 'In {n:' + k + '}', pt: 'Em {n:' + k + '}' }; }
  function keyVars(keys, make) { return keys.map(function (k) { return { name: keyName(k), tab: make(k) }; }); }

  var EX = [];
  var T2 = { start: 60, goal: 120, step: 4 }, T3 = { start: 50, goal: 110, step: 4 }, T4 = { start: 50, goal: 100, step: 4 }, T6 = { start: 40, goal: 80, step: 4 };
  var OTHER_KEYS = { en: 'In other keys the shape stays the same: only the frets move.', pt: 'Noutros tons o desenho é o mesmo: só mudam os trastes.' };

  /* ---------- Minor pentatonic, 5 boxes ---------- */
  var BOX_TIPS = [
    ['This is the shape most rock and blues solos start from: learn it until you can see it with your eyes closed.', 'Este é o desenho de onde partem quase todos os solos de rock e blues: aprende-o até o veres de olhos fechados.'],
    ['The lower notes of box 2 are the higher notes of box 1: the boxes overlap like tiles.', 'As notas mais graves da caixa 2 são as mais agudas da caixa 1: as caixas encaixam como azulejos.'],
    ['On the 2nd string the shape moves up one fret: that comes from how that string is tuned, it is not a mistake.', 'Na 2.ª corda o desenho sobe um traste: vem da afinação dessa corda, não é engano.'],
    ['Say the note name out loud each time you hit the root, so the shape stays tied to the sound.', 'Diz o nome da nota em voz alta sempre que tocas a tónica, para o desenho ficar ligado ao som.'],
    ['Box 5 sits just below box 1 and again 12 frets higher: its top notes lead straight into box 1.', 'A caixa 5 fica logo abaixo da caixa 1 e outra vez 12 trastes acima: as notas de cima levam direto à caixa 1.']
  ];
  [1, 2, 3, 4, 5].forEach(function (k) {
    var mf = k > 1 ? 1 : 0, L = nps('A', SC.minPent, k - 1, 2, mf), rg = range(L), rs = rootStrings(L, 'A');
    EX.push({
      id: 'scales-minor-pent-box-' + k, cat: 'scales', level: [1, 2, 2, 3, 3][k - 1], tags: ['pentatonic', 'minor', 'positions'], minutes: 5,
      title: { en: 'Minor pentatonic, box ' + k, pt: 'Pentatónica menor, caixa ' + k },
      goal: { en: 'Play box ' + k + ' of the minor pentatonic up and down in any key.', pt: 'Tocar a caixa ' + k + ' da pentatónica menor a subir e a descer em qualquer tom.' },
      how: {
        en: ['In {n:A}, box ' + k + ' covers frets ' + rg[0] + ' to ' + rg[1] + ', with two notes on every string.',
          'The root {n:A} is on strings ' + list(rs, 'en') + '; make it a little louder each time.',
          'Go up from the 6th string to the 1st and straight back down, in even 8th notes.',
          'Use one finger per fret: finger 1 takes the lowest fret of the box.'],
        pt: ['Em {n:A}, a caixa ' + k + ' vai do traste ' + rg[0] + ' ao ' + rg[1] + ', com duas notas em cada corda.',
          'A tónica {n:A} está nas cordas ' + list(rs, 'pt') + '; toca-a um pouco mais forte de cada vez.',
          'Sobe da 6.ª à 1.ª corda e desce logo a seguir, em colcheias regulares.',
          'Usa um dedo por traste: o dedo 1 fica no traste mais baixo da caixa.']
      },
      tips: { en: [BOX_TIPS[k - 1][0], OTHER_KEYS.en], pt: [BOX_TIPS[k - 1][1], OTHER_KEYS.pt] },
      sub: 2, tempo: k === 1 ? { start: 50, goal: 120, step: 4 } : T2, learn: 'scales',
      tab: loopTab(L, 8),
      vars: keyVars(['E', 'G', 'C', 'D'], function (key) { return loopTab(nps(key, SC.minPent, k - 1, 2, mf), 8); })
    });
  });

  /* All five boxes in a row, up the neck */
  (function () {
    function run(key) {
      var t = [];
      for (var k = 0; k < 5; k++) { var L = nps(key, SC.minPent, k, 2, r6(key)); t = t.concat(toks(upDown(L)), ['=']); }
      return bars(t, 8, false);
    }
    EX.push({
      id: 'scales-minor-pent-all-boxes', cat: 'scales', level: 4, tags: ['pentatonic', 'minor', 'positions', 'stamina'], minutes: 8,
      title: { en: 'Five pentatonic boxes in a row', pt: 'As cinco caixas pentatónicas seguidas' },
      goal: { en: 'Move through all five minor pentatonic boxes without stopping, from the root up to fret 17.', pt: 'Passar pelas cinco caixas da pentatónica menor sem parar, da tónica até ao traste 17.' },
      how: {
        en: ['Start on box 1 with the root {n:A} at fret 5 of the 6th string.', 'Play each box up and down, hold its last note for one 8th, then move up to the next box.', 'Box 5 ends near fret 17; the loop then jumps back to box 1.'],
        pt: ['Começa na caixa 1, com a tónica {n:A} no traste 5 da 6.ª corda.', 'Toca cada caixa a subir e a descer, segura a última nota uma colcheia e passa à caixa seguinte.', 'A caixa 5 acaba perto do traste 17; depois o ciclo volta à caixa 1.']
      },
      tips: { en: ['Look ahead: during the hold, your eyes should already be on the next box.'], pt: ['Olha para a frente: durante a nota segurada, os olhos já devem estar na caixa seguinte.'] },
      sub: 2, tempo: { start: 60, goal: 110, step: 4 }, learn: 'scales',
      tab: run('A'), vars: keyVars(['G'], run)
    });
  })();

  /* ---------- Major pentatonic ---------- */
  (function () {
    var L = nps('G', SC.majPent, 0, 2), rg = range(L);
    EX.push({
      id: 'scales-major-pent-box-1', cat: 'scales', level: 2, tags: ['pentatonic', 'major', 'positions', 'country'], minutes: 5,
      title: { en: 'Major pentatonic, root box', pt: 'Pentatónica maior, caixa da tónica' },
      goal: { en: 'Play the major pentatonic from its root on the 6th string, the happy sound of country and pop solos.', pt: 'Tocar a pentatónica maior a partir da tónica na 6.ª corda, o som alegre dos solos de country e pop.' },
      how: {
        en: ['In {n:G} the box sits between frets ' + rg[0] + ' and ' + rg[1] + ' and starts on the root {n:G} at fret 3.', 'Five notes: root, 2nd, 3rd, 5th and 6th of the major scale, two per string.', 'Go up and down in 8th notes and stop on the root at the end.'],
        pt: ['Em {n:G} a caixa fica entre os trastes ' + rg[0] + ' e ' + rg[1] + ' e começa na tónica {n:G}, no traste 3.', 'Cinco notas: tónica, 2.ª, 3.ª, 5.ª e 6.ª da escala maior, duas por corda.', 'Sobe e desce em colcheias e acaba na tónica.']
      },
      tips: {
        en: ['{n:G} major pentatonic has the same notes as {n:E} minor pentatonic: this shape is box 2 of {n:E} minor.', OTHER_KEYS.en],
        pt: ['A pentatónica maior de {n:G} tem as mesmas notas que a pentatónica menor de {n:E}: este desenho é a caixa 2 de {n:E} menor.', OTHER_KEYS.pt]
      },
      sub: 2, tempo: T2, learn: 'scales',
      tab: loopTab(L, 8),
      vars: keyVars(['A', 'C', 'D', 'E'], function (k) { return loopTab(nps(k, SC.majPent, 0, 2), 8); })
    });
    EX.push({
      id: 'scales-major-pent-boxes', cat: 'scales', level: 3, tags: ['pentatonic', 'major', 'positions'], minutes: 8,
      title: { en: 'Major pentatonic, boxes 2 to 5', pt: 'Pentatónica maior, caixas 2 a 5' },
      goal: { en: 'Know the other four major pentatonic boxes so you can play it anywhere on the neck.', pt: 'Conhecer as outras quatro caixas da pentatónica maior para a tocares em qualquer zona do braço.' },
      how: {
        en: ['The main tab is box 2 in {n:G}, starting on the 2nd note of the scale ({n:A}).', 'The variations give boxes 3, 4 and 5, each starting on the next scale note on the 6th string.', 'In every box, find the {n:G} notes first and aim for them.'],
        pt: ['A tablatura principal é a caixa 2 em {n:G}, que começa na 2.ª nota da escala ({n:A}).', 'As variações dão as caixas 3, 4 e 5, cada uma a começar na nota seguinte da escala na 6.ª corda.', 'Em cada caixa, encontra primeiro as notas {n:G} e aponta para elas.']
      },
      tips: { en: ['These are the same five shapes as the minor pentatonic, just with a different note as home.'], pt: ['São os mesmos cinco desenhos da pentatónica menor, só muda a nota que é a casa.'] },
      sub: 2, tempo: T2, learn: 'scales',
      tab: loopTab(nps('G', SC.majPent, 1, 2), 8),
      vars: [3, 4, 5].map(function (k) { return { name: { en: 'Box ' + k, pt: 'Caixa ' + k }, tab: loopTab(nps('G', SC.majPent, k - 1, 2, 1), 8) }; })
    });
  })();

  /* ---------- Blues scale ---------- */
  [1, 2].forEach(function (k) {
    var L = blues('A', k - 1), rg = range(L);
    EX.push({
      id: 'scales-blues-box-' + k, cat: 'scales', level: k + 1, tags: ['blues', 'pentatonic', 'minor', 'positions'], minutes: 5,
      title: { en: 'Blues scale, box ' + k, pt: 'Escala de blues, caixa ' + k },
      goal: { en: 'Add the "blue note" to pentatonic box ' + k + ' and hear how it bites.', pt: 'Juntar a "blue note" à caixa ' + k + ' da pentatónica e ouvir como ela morde.' },
      how: {
        en: ['Start from minor pentatonic box ' + k + ' in {n:A} (frets ' + rg[0] + ' to ' + rg[1] + ').', 'Add one note: {n:Eb}, one fret above every {n:D}. That is the blue note.', 'Play it up and down; the blue note should sound like a passing tension, not a place to stop.'],
        pt: ['Parte da caixa ' + k + ' da pentatónica menor em {n:A} (trastes ' + rg[0] + ' a ' + rg[1] + ').', 'Junta uma nota: {n:Eb}, um traste acima de cada {n:D}. É a blue note.', 'Toca a subir e a descer; a blue note deve soar como uma tensão de passagem, não um sítio para parar.']
      },
      tips: { en: ['Play the blue note lightly and move on: it works best squeezed between the 4th and the 5th.', OTHER_KEYS.en], pt: ['Toca a blue note com leveza e segue: resulta melhor apertada entre a 4.ª e a 5.ª.', OTHER_KEYS.pt] },
      sub: 2, tempo: T2, learn: 'scales',
      tab: loopTab(L, 8),
      vars: keyVars(['E', 'G', 'C', 'D'], function (key) { return loopTab(blues(key, k - 1), 8); })
    });
  });

  /* ---------- Major scale: one octave, CAGED positions ---------- */
  function octave(key, strings) {
    var rp = OPEN[strings[0]] + mod(PC[key] - OPEN[strings[0]], 12);
    if (rp - OPEN[strings[0]] < 2) rp += 12;
    var L = win(key, SC.major, rp - OPEN[strings[0]] - 1, strings).filter(function (n) { var p = pitch(n); return p >= rp && p <= rp + 12; });
    return check(L, 'octave ' + key);
  }
  EX.push({
    id: 'scales-major-octave-6', cat: 'scales', level: 1, tags: ['major', 'positions'], minutes: 4,
    title: { en: 'Major scale, one octave from the 6th string', pt: 'Escala maior, uma oitava a partir da 6.ª corda' },
    goal: { en: 'Play the do-re-mi of the major scale from a root on the 6th string.', pt: 'Tocar o dó-ré-mi da escala maior a partir de uma tónica na 6.ª corda.' },
    how: {
      en: ['Put finger 2 on the root {n:G}, fret 3 of the 6th string.', 'Play eight notes over three strings, up to the {n:G} on the 4th string, then come back down.', 'Sing along: it should sound like do re mi fa sol la ti do.'],
      pt: ['Põe o dedo 2 na tónica {n:G}, traste 3 da 6.ª corda.', 'Toca oito notas em três cordas, até ao {n:G} na 4.ª corda, e volta a descer.', 'Canta junto: deve soar a dó ré mi fá sol lá si dó.']
    },
    tips: { en: ['The shape is movable: slide it so finger 2 sits on any note of the 6th string and you get that major scale.'], pt: ['O desenho é móvel: desliza-o para o dedo 2 ficar noutra nota da 6.ª corda e tens essa escala maior.'] },
    sub: 2, tempo: { start: 50, goal: 110, step: 4 }, learn: 'scales',
    tab: loopTab(octave('G', [6, 5, 4]), 8),
    vars: keyVars(['A', 'C', 'F'], function (k) { return loopTab(octave(k, [6, 5, 4]), 8); })
  });
  EX.push({
    id: 'scales-major-octave-5', cat: 'scales', level: 1, tags: ['major', 'positions'], minutes: 4,
    title: { en: 'Major scale, one octave from the 5th string', pt: 'Escala maior, uma oitava a partir da 5.ª corda' },
    goal: { en: 'Play the major scale from a root on the 5th string, the second shape every player needs.', pt: 'Tocar a escala maior a partir de uma tónica na 5.ª corda, o segundo desenho que todos precisam.' },
    how: {
      en: ['Put finger 2 on the root {n:C}, fret 3 of the 5th string.', 'Play eight notes over three strings, up to the {n:C} on the 3rd string, then come back down.', 'Compare with the 6th-string shape: same fingering, one string higher, until the 2nd string changes things.'],
      pt: ['Põe o dedo 2 na tónica {n:C}, traste 3 da 5.ª corda.', 'Toca oito notas em três cordas, até ao {n:C} na 3.ª corda, e volta a descer.', 'Compara com o desenho da 6.ª corda: a mesma dedilhação, uma corda acima.']
    },
    sub: 2, tempo: { start: 50, goal: 110, step: 4 }, learn: 'scales',
    tab: loopTab(octave('C', [5, 4, 3]), 8),
    vars: keyVars(['D', 'F', 'Bb'], function (k) { return loopTab(octave(k, [5, 4, 3]), 8); })
  });

  var CAGED = [
    { shape: 'E', off: -1, lvl: 2, en: 'The root sits under finger 2 on the 6th string, inside the {c:E} chord shape.', pt: 'A tónica fica debaixo do dedo 2 na 6.ª corda, dentro da forma do acorde {c:E}.' },
    { shape: 'D', off: 1, lvl: 3, en: 'The root is on the 4th string, inside the {c:D} chord shape.', pt: 'A tónica está na 4.ª corda, dentro da forma do acorde {c:D}.' },
    { shape: 'C', off: 4, lvl: 3, en: 'The root is on the 5th string under finger 4, inside the {c:C} chord shape.', pt: 'A tónica está na 5.ª corda debaixo do dedo 4, dentro da forma do acorde {c:C}.' },
    { shape: 'A', off: 6, lvl: 3, en: 'The root is on the 5th string under finger 1 or 2, inside the {c:A} chord shape.', pt: 'A tónica está na 5.ª corda debaixo do dedo 1 ou 2, dentro da forma do acorde {c:A}.' },
    { shape: 'G', off: 8, lvl: 3, en: 'The root is on the 6th and 1st strings under finger 4, inside the {c:G} chord shape.', pt: 'A tónica está na 6.ª e na 1.ª corda debaixo do dedo 4, dentro da forma do acorde {c:G}.' }
  ];
  CAGED.forEach(function (c, i) {
    var L = win('G', SC.major, lo('G', c.off)), rg = range(L);
    EX.push({
      id: 'scales-major-caged-' + c.shape.toLowerCase(), cat: 'scales', level: c.lvl, tags: ['major', 'caged', 'positions'], minutes: 6,
      title: { en: 'Major scale, ' + c.shape + '-shape position', pt: 'Escala maior, posição da forma ' + c.shape },
      goal: { en: 'Play two octaves of the major scale in position ' + (i + 1) + ' of 5, built around a chord shape you know.', pt: 'Tocar duas oitavas da escala maior na posição ' + (i + 1) + ' de 5, construída à volta de um acorde que já conheces.' },
      how: {
        en: ['In {n:G} this position covers frets ' + rg[0] + ' to ' + rg[1] + '.', c.en, 'Play from the lowest note on the 6th string to the highest on the 1st and back, every note even.', 'First hold the chord shape, then play the scale around it.'],
        pt: ['Em {n:G} esta posição vai do traste ' + rg[0] + ' ao ' + rg[1] + '.', c.pt, 'Toca da nota mais grave da 6.ª corda à mais aguda da 1.ª e volta, todas as notas iguais.', 'Primeiro faz a forma do acorde, depois toca a escala à volta dela.']
      },
      tips: { en: ['Some strings need a one-fret stretch: move the hand a little rather than straining one finger.', OTHER_KEYS.en], pt: ['Algumas cordas pedem uma abertura de um traste: mexe um pouco a mão em vez de forçar um dedo.', OTHER_KEYS.pt] },
      sub: 2, tempo: T2, learn: 'scales',
      tab: loopTab(L, 8),
      vars: keyVars(['C', 'A', 'D'], function (k) { return loopTab(win(k, SC.major, lo(k, c.off)), 8); })
    });
  });

  /* ---------- Major scale: 3 notes per string ---------- */
  EX.push({
    id: 'scales-major-3nps', cat: 'scales', level: 3, tags: ['major', '3nps', 'positions'], minutes: 6,
    title: { en: 'Major scale, 3 notes per string', pt: 'Escala maior, 3 notas por corda' },
    goal: { en: 'Play the major scale with exactly three notes on every string, the layout fast players love.', pt: 'Tocar a escala maior com exatamente três notas em cada corda, o desenho preferido de quem toca rápido.' },
    how: {
      en: ['Start on the root {n:G}, fret 3 of the 6th string.', 'Play three scale notes on each string, then cross to the next one.', 'The pattern drifts up the neck as you climb: let the hand shift on the 3rd and 2nd strings.'],
      pt: ['Começa na tónica {n:G}, traste 3 da 6.ª corda.', 'Toca três notas da escala em cada corda e passa à seguinte.', 'O desenho vai subindo no braço: deixa a mão deslocar-se na 3.ª e na 2.ª corda.']
    },
    tips: { en: ['Every string is a group of three, so alternate picking always lands on the same strokes: count in threes.'], pt: ['Cada corda é um grupo de três, por isso a palhetada alternada cai sempre igual: conta em três.'] },
    sub: 3, tempo: T3, learn: 'scales',
    tab: loopTab(nps('G', SC.major, 0, 3), 12),
    vars: keyVars(['A', 'C', 'E'], function (k) { return loopTab(nps(k, SC.major, 0, 3), 12); })
  });
  EX.push({
    id: 'scales-major-3nps-all', cat: 'scales', level: 4, tags: ['major', '3nps', 'positions'], minutes: 10,
    title: { en: 'All seven 3-notes-per-string patterns', pt: 'Os sete desenhos de 3 notas por corda' },
    goal: { en: 'Cover the whole neck in {n:G} major with seven patterns, one starting on each scale note.', pt: 'Cobrir o braço todo em {n:G} maior com sete desenhos, um a começar em cada nota da escala.' },
    how: {
      en: ['The main tab starts on {n:A}, the 2nd note of {n:G} major, on the 6th string.', 'Each variation starts on the next scale note: {n:B}, {n:C}, {n:D}, {n:E} and {n:F#}.', 'Whatever the starting note, keep aiming at the {n:G} notes so you hear the key.'],
      pt: ['A tablatura principal começa em {n:A}, a 2.ª nota de {n:G} maior, na 6.ª corda.', 'Cada variação começa na nota seguinte da escala: {n:B}, {n:C}, {n:D}, {n:E} e {n:F#}.', 'Comece onde começar, aponta sempre para as notas {n:G} para ouvires o tom.']
    },
    tips: { en: ['Learn one new pattern a day and link it to the one below it.'], pt: ['Aprende um desenho novo por dia e liga-o ao de baixo.'] },
    sub: 3, tempo: T3, learn: 'scales',
    tab: loopTab(nps('G', SC.major, 1, 3), 12),
    vars: [['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F#', 6]].map(function (d) {
      return { name: { en: 'From {n:' + d[0] + '}', pt: 'A partir de {n:' + d[0] + '}' }, tab: loopTab(nps('G', SC.major, d[1], 3), 12) };
    })
  });
  EX.push({
    id: 'scales-major-3nps-legato', cat: 'scales', level: 4, tags: ['major', '3nps', 'legato'], minutes: 6,
    title: { en: '3-notes-per-string legato', pt: 'Legato com 3 notas por corda' },
    goal: { en: 'Run the 3-notes-per-string major scale picking only the first note on each string.', pt: 'Correr a escala maior de 3 notas por corda palhetando só a primeira nota de cada corda.' },
    how: {
      en: ['Going up, pick the first note on each string and hammer on the other two.', 'Going down, pick the top note and pull off to the other two.', 'All three notes must sound equally loud and equally long.'],
      pt: ['A subir, palheta a primeira nota de cada corda e faz hammer-on nas outras duas.', 'A descer, palheta a nota de cima e faz pull-off para as outras duas.', 'As três notas têm de soar com o mesmo volume e a mesma duração.']
    },
    tips: { en: ['Pull-offs are a small flick downwards, not just lifting the finger.'], pt: ['O pull-off é um pequeno puxão para baixo, não é só levantar o dedo.'] },
    sub: 3, tempo: { start: 50, goal: 100, step: 4 }, learn: 'scales',
    tab: loopTab(nps('G', SC.major, 0, 3), 12, 'leg'),
    vars: keyVars(['A', 'C'], function (k) { return loopTab(nps(k, SC.major, 0, 3), 12, 'leg'); })
  });

  /* ---------- Minor scales ---------- */
  EX.push({
    id: 'scales-natural-minor-6', cat: 'scales', level: 2, tags: ['minor', 'positions'], minutes: 6,
    title: { en: 'Natural minor, root on the 6th string', pt: 'Menor natural, tónica na 6.ª corda' },
    goal: { en: 'Play two octaves of the natural minor scale, the full version of the minor pentatonic.', pt: 'Tocar duas oitavas da escala menor natural, a versão completa da pentatónica menor.' },
    how: {
      en: ['In {n:A}, start on the root at fret 5 of the 6th string and stay between frets 4 and 8.', 'You are playing pentatonic box 1 plus two extra notes: {n:B} and {n:F}.', 'Go up and down, and let the {n:F} feel a bit sad on its way to {n:E}.'],
      pt: ['Em {n:A}, começa na tónica no traste 5 da 6.ª corda e fica entre os trastes 4 e 8.', 'Estás a tocar a caixa 1 da pentatónica mais duas notas: {n:B} e {n:F}.', 'Sobe e desce, e deixa o {n:F} soar um pouco triste a caminho do {n:E}.']
    },
    tips: { en: [OTHER_KEYS.en], pt: [OTHER_KEYS.pt] },
    sub: 2, tempo: T2, learn: 'scales',
    tab: loopTab(win('A', SC.minor, lo('A', -1)), 8),
    vars: keyVars(['E', 'G', 'D'], function (k) { return loopTab(win(k, SC.minor, lo(k, -1)), 8); })
  });
  EX.push({
    id: 'scales-natural-minor-5', cat: 'scales', level: 3, tags: ['minor', 'positions'], minutes: 6,
    title: { en: 'Natural minor, root on the 5th string', pt: 'Menor natural, tónica na 5.ª corda' },
    goal: { en: 'Find the natural minor in a second position, with the root on the 5th string.', pt: 'Encontrar a menor natural numa segunda posição, com a tónica na 5.ª corda.' },
    how: {
      en: ['In {n:A} this position covers frets 9 to 13; the root is at fret 12 of the 5th string.', 'Play from the 6th string to the 1st and back.', 'Stop now and then on an {n:A} and listen to it as home.'],
      pt: ['Em {n:A} esta posição vai do traste 9 ao 13; a tónica está no traste 12 da 5.ª corda.', 'Toca da 6.ª à 1.ª corda e volta.', 'Pára de vez em quando num {n:A} e ouve-o como a casa.']
    },
    sub: 2, tempo: T2, learn: 'scales',
    tab: loopTab(win('A', SC.minor, lo('A', 4)), 8),
    vars: keyVars(['E', 'D', 'G'], function (k) { return loopTab(win(k, SC.minor, lo(k, 4)), 8); })
  });
  EX.push({
    id: 'scales-natural-minor-3nps', cat: 'scales', level: 3, tags: ['minor', '3nps'], minutes: 6,
    title: { en: 'Natural minor, 3 notes per string', pt: 'Menor natural, 3 notas por corda' },
    goal: { en: 'Play the natural minor with three notes on every string, starting from the root.', pt: 'Tocar a menor natural com três notas em cada corda, a partir da tónica.' },
    how: {
      en: ['Start on {n:A}, fret 5 of the 6th string.', 'Three notes per string, climbing slightly up the neck on the higher strings.', 'Count in threes: one group per string.'],
      pt: ['Começa no {n:A}, traste 5 da 6.ª corda.', 'Três notas por corda, a subir um pouco no braço nas cordas agudas.', 'Conta em três: um grupo por corda.']
    },
    sub: 3, tempo: T3, learn: 'scales',
    tab: loopTab(nps('A', SC.minor, 0, 3), 12),
    vars: keyVars(['E', 'G', 'D'], function (k) { return loopTab(nps(k, SC.minor, 0, 3), 12); })
  });
  EX.push({
    id: 'scales-harmonic-minor', cat: 'scales', level: 4, tags: ['minor', 'positions', 'metal'], minutes: 6,
    title: { en: 'Harmonic minor', pt: 'Menor harmónica' },
    goal: { en: 'Hear the exotic gap of the harmonic minor: natural minor with a raised 7th.', pt: 'Ouvir o salto exótico da menor harmónica: a menor natural com a 7.ª subida.' },
    how: {
      en: ['Take the natural minor in {n:A} (frets 4 to 8) and raise every {n:G} to {n:G#}.', 'Between {n:F} and {n:G#} there is a three-fret gap: that is the exotic sound.', 'Play it up and down slowly and let the {n:G#} pull you up to {n:A}.'],
      pt: ['Pega na menor natural em {n:A} (trastes 4 a 8) e sobe cada {n:G} para {n:G#}.', 'Entre {n:F} e {n:G#} há um salto de três trastes: é daí que vem o som exótico.', 'Toca a subir e a descer devagar e deixa o {n:G#} puxar-te para o {n:A}.']
    },
    tips: { en: ['This scale sounds great over an {c:E7} chord resolving to {c:Am}.'], pt: ['Esta escala soa muito bem sobre um {c:E7} que resolve para {c:Am}.'] },
    sub: 2, tempo: { start: 50, goal: 110, step: 4 }, learn: 'scales',
    tab: loopTab(win('A', SC.harm, lo('A', -1)), 8),
    vars: keyVars(['E', 'D'], function (k) { return loopTab(win(k, SC.harm, lo(k, -1)), 8); })
  });

  /* ---------- Sequences ---------- */
  var SEQ = [
    { id: 'in-3s', g: 3, sub: 3, tempo: T3, lvl: 3, en: 'in 3s', pt: 'em grupos de 3',
      howEn: 'Play three notes up the scale, then start again from the 2nd note, then from the 3rd: 1-2-3, 2-3-4, 3-4-5...',
      howPt: 'Toca três notas a subir, recomeça na 2.ª nota, depois na 3.ª: 1-2-3, 2-3-4, 3-4-5...' },
    { id: 'in-4s', g: 4, sub: 4, tempo: T4, lvl: 3, en: 'in 4s', pt: 'em grupos de 4',
      howEn: 'Play four notes up the scale, then start again one note higher: 1-2-3-4, 2-3-4-5, 3-4-5-6...',
      howPt: 'Toca quatro notas a subir e recomeça uma nota acima: 1-2-3-4, 2-3-4-5, 3-4-5-6...' },
    { id: 'thirds', g: 0, sub: 2, tempo: T2, lvl: 3, en: 'in thirds', pt: 'em terceiras',
      howEn: 'Skip one scale note each time and step back: 1-3, 2-4, 3-5, 4-6...',
      howPt: 'Salta uma nota da escala de cada vez e volta atrás: 1-3, 2-4, 3-5, 4-6...' },
    { id: 'in-6s', g: 6, sub: 6, tempo: T6, lvl: 4, en: 'in groups of 6', pt: 'em grupos de 6',
      howEn: 'Play six notes up the scale per beat, then start again one note higher: 1 to 6, 2 to 7...',
      howPt: 'Toca seis notas a subir por tempo e recomeça uma nota acima: 1 a 6, 2 a 7...' }
  ];
  function seqOf(L, s) { return s.g ? groups(L, s.g) : thirds(L); }
  SEQ.forEach(function (s) {
    var per = 4 * s.sub;
    EX.push({
      id: 'scales-seq-pent-' + s.id, cat: 'scales', level: s.lvl, tags: ['pentatonic', 'sequences', 'alternate-picking'], minutes: 6,
      title: { en: 'Pentatonic ' + s.en, pt: 'Pentatónica ' + s.pt },
      goal: { en: 'Turn pentatonic box 1 into melodic lines by playing it ' + s.en + '.', pt: 'Transformar a caixa 1 da pentatónica em frases tocando-a ' + s.pt + '.' },
      how: {
        en: ['Use minor pentatonic box 1 in {n:A}, frets 5 to 8.', s.howEn, 'At the top, turn around and run the same pattern back down.'],
        pt: ['Usa a caixa 1 da pentatónica menor em {n:A}, trastes 5 a 8.', s.howPt, 'Lá em cima, dá a volta e faz o mesmo padrão a descer.']
      },
      tips: { en: ['Accent the first note of each group so you never lose your place.'], pt: ['Acentua a primeira nota de cada grupo para nunca te perderes.'] },
      sub: s.sub, tempo: s.tempo, learn: 'scales',
      tab: seqTab(seqOf(nps('A', SC.minPent, 0, 2), s), per),
      vars: keyVars(['E', 'G', 'D'], function (k) { return seqTab(seqOf(nps(k, SC.minPent, 0, 2), s), per); })
    });
    EX.push({
      id: 'scales-seq-major-' + s.id, cat: 'scales', level: s.lvl + 1, tags: ['major', 'sequences', 'alternate-picking'], minutes: 6,
      title: { en: 'Major scale ' + s.en, pt: 'Escala maior ' + s.pt },
      goal: { en: 'Play the major scale ' + s.en + ' through two octaves, up and down.', pt: 'Tocar a escala maior ' + s.pt + ' em duas oitavas, a subir e a descer.' },
      how: {
        en: ['Use the {c:E}-shape position of {n:G} major, frets 2 to 5.', s.howEn, 'At the top, turn around and run the same pattern back down.'],
        pt: ['Usa a posição da forma {c:E} de {n:G} maior, trastes 2 a 5.', s.howPt, 'Lá em cima, dá a volta e faz o mesmo padrão a descer.']
      },
      tips: { en: ['Say the numbers in your head at first; after a while the pattern takes over.'], pt: ['Ao início diz os números na cabeça; ao fim de algum tempo o padrão fica automático.'] },
      sub: s.sub, tempo: s.tempo, learn: 'scales',
      tab: seqTab(seqOf(win('G', SC.major, lo('G', -1)), s), per),
      vars: keyVars(['A', 'C'], function (k) { return seqTab(seqOf(win(k, SC.major, lo(k, -1)), s), per); })
    });
  });
  EX.push({
    id: 'scales-seq-3nps-in-4s', cat: 'scales', level: 5, tags: ['major', '3nps', 'sequences', 'alternate-picking'], minutes: 8,
    title: { en: '3-notes-per-string in 4s', pt: '3 notas por corda em grupos de 4' },
    goal: { en: 'Play groups of four across the 3-notes-per-string major scale, where every group crosses a string in a new place.', pt: 'Tocar grupos de quatro na escala maior de 3 notas por corda, onde cada grupo muda de corda num sítio diferente.' },
    how: {
      en: ['Use the 3-notes-per-string pattern of {n:G} major from fret 3.', 'Play 1-2-3-4, 2-3-4-5, 3-4-5-6... in 16th notes.', 'At the top, run the groups back down.'],
      pt: ['Usa o desenho de 3 notas por corda de {n:G} maior a partir do traste 3.', 'Toca 1-2-3-4, 2-3-4-5, 3-4-5-6... em semicolcheias.', 'Lá em cima, faz os grupos a descer.']
    },
    tips: { en: ['Groups of 4 over strings of 3 means the string changes move around: practise slowly until they feel the same.'], pt: ['Grupos de 4 em cordas de 3 fazem as mudanças de corda andar de sítio: pratica devagar até parecerem todas iguais.'] },
    sub: 4, tempo: { start: 50, goal: 110, step: 4 }, learn: 'scales',
    tab: seqTab(groups(nps('G', SC.major, 0, 3), 4), 16),
    vars: keyVars(['A'], function (k) { return seqTab(groups(nps(k, SC.major, 0, 3), 4), 16); })
  });

  /* ---------- Linking positions / horizontal playing ---------- */
  function oneString(key, sc, str, minF, maxF) {
    var L = [];
    for (var f = minF; f <= maxF; f++) if (inS(OPEN[str] + f, PC[key], sc)) L.push({ s: str, f: f });
    return check(L, 'string ' + str);
  }
  EX.push({
    id: 'scales-pent-one-string', cat: 'scales', level: 2, tags: ['pentatonic', 'minor', 'positions'], minutes: 5,
    title: { en: 'Pentatonic along one string', pt: 'Pentatónica ao longo de uma corda' },
    goal: { en: 'Play the minor pentatonic along the 1st string and see the neck as a line, not only boxes.', pt: 'Tocar a pentatónica menor ao longo da 1.ª corda e ver o braço como uma linha, não só caixas.' },
    how: {
      en: ['In {n:A}, the notes on the 1st string are at frets 0, 3, 5, 8, 10, 12, 15 and 17.', 'Play them up and back down with one finger, shifting the hand each time.', 'Try the slide variation: glide into each new note instead of jumping.'],
      pt: ['Em {n:A}, as notas na 1.ª corda estão nos trastes 0, 3, 5, 8, 10, 12, 15 e 17.', 'Toca-as a subir e a descer com um só dedo, deslocando a mão de cada vez.', 'Experimenta a variação com slides: desliza para cada nota nova em vez de saltar.']
    },
    tips: { en: ['Look at the target fret before you move, not at your finger.'], pt: ['Olha para o traste de destino antes de te mexeres, não para o dedo.'] },
    sub: 2, tempo: { start: 50, goal: 100, step: 4 }, learn: 'scales',
    tab: loopTab(oneString('A', SC.minPent, 1, 0, 17), 8),
    vars: [
      { name: { en: 'With slides', pt: 'Com slides' }, tab: loopTab(oneString('A', SC.minPent, 1, 0, 17), 8, 's') },
      { name: { en: 'On the 2nd string', pt: 'Na 2.ª corda' }, tab: loopTab(oneString('A', SC.minPent, 2, 1, 17), 8) },
      { name: { en: 'On the 3rd string', pt: 'Na 3.ª corda' }, tab: loopTab(oneString('A', SC.minPent, 3, 0, 17), 8) }
    ]
  });
  EX.push({
    id: 'scales-major-one-string', cat: 'scales', level: 2, tags: ['major', 'positions'], minutes: 5,
    title: { en: 'Major scale on one string', pt: 'Escala maior numa só corda' },
    goal: { en: 'See the whole-whole-half pattern of the major scale laid out along a single string.', pt: 'Ver o padrão tom-tom-meio-tom da escala maior estendido numa só corda.' },
    how: {
      en: ['In {n:G} on the 3rd string, play frets 0, 2, 4, 5, 7, 9, 11, 12.', 'The gaps are 2, 2, 1, 2, 2, 2, 1 frets: that is the major scale recipe.', 'Go up and back down, sliding or shifting between notes.'],
      pt: ['Em {n:G} na 3.ª corda, toca os trastes 0, 2, 4, 5, 7, 9, 11, 12.', 'Os saltos são 2, 2, 1, 2, 2, 2, 1 trastes: é a receita da escala maior.', 'Sobe e desce, a deslizar ou a deslocar a mão entre notas.']
    },
    tips: { en: ['Sing each note as you play it: one string makes it easy to link sound and distance.'], pt: ['Canta cada nota enquanto a tocas: numa só corda é fácil ligar o som à distância.'] },
    sub: 2, tempo: { start: 50, goal: 100, step: 4 }, learn: 'scales',
    tab: loopTab(oneString('G', SC.major, 3, 0, 12), 8),
    vars: [
      { name: { en: '{n:C} on the 2nd string', pt: '{n:C} na 2.ª corda' }, tab: loopTab(oneString('C', SC.major, 2, 1, 13), 8) },
      { name: { en: '{n:A} on the 5th string', pt: '{n:A} na 5.ª corda' }, tab: loopTab(oneString('A', SC.major, 5, 0, 12), 8) }
    ]
  });
  function twoStringBoxes(key, strs) {
    var L = [];
    for (var k = 0; k < 5; k++) nps(key, SC.minPent, k, 2, r6(key)).forEach(function (n) { if (strs.indexOf(n.s) >= 0) L.push(n); });
    return check(L, 'two-string boxes');
  }
  EX.push({
    id: 'scales-pent-two-strings', cat: 'scales', level: 3, tags: ['pentatonic', 'minor', 'positions'], minutes: 6,
    title: { en: 'Pentatonic up the neck on two strings', pt: 'Pentatónica pelo braço acima em duas cordas' },
    goal: { en: 'Move through all five pentatonic boxes using only the top two strings.', pt: 'Passar pelas cinco caixas pentatónicas usando só as duas cordas de cima.' },
    how: {
      en: ['Play the 2nd and 1st string notes of box 1 in {n:A}, four notes.', 'Then the same two strings of box 2, box 3, box 4 and box 5, climbing to fret 17.', 'Come back down the same way, mirror image.'],
      pt: ['Toca as notas da 2.ª e da 1.ª corda da caixa 1 em {n:A}, quatro notas.', 'Depois as mesmas duas cordas da caixa 2, 3, 4 e 5, a subir até ao traste 17.', 'Desce pelo mesmo caminho, como num espelho.']
    },
    tips: { en: ['Each group of four repeats the last two notes of the group before: use them as your landing spot.'], pt: ['Cada grupo de quatro repete as duas últimas notas do anterior: usa-as como ponto de aterragem.'] },
    sub: 2, tempo: { start: 60, goal: 120, step: 4 }, learn: 'scales',
    tab: loopTab(twoStringBoxes('A', [2, 1]), 8),
    vars: [{ name: { en: 'On the 4th and 3rd strings', pt: 'Na 4.ª e 3.ª cordas' }, tab: loopTab(twoStringBoxes('A', [4, 3]), 8) }]
  });
  EX.push({
    id: 'scales-pent-box-shift', cat: 'scales', level: 3, tags: ['pentatonic', 'minor', 'positions'], minutes: 5,
    title: { en: 'Sliding from box 1 to box 2', pt: 'Deslizar da caixa 1 para a caixa 2' },
    goal: { en: 'Leave box 1 halfway up with a slide and finish the climb in box 2.', pt: 'Sair da caixa 1 a meio com um slide e acabar a subida na caixa 2.' },
    how: {
      en: ['Play box 1 of {n:A} minor pentatonic on the 6th and 5th strings.', 'On the 4th string play frets 5 and 7, then slide finger 3 from 7 up to 10.', 'You are now in box 2: finish on the 3rd, 2nd and 1st strings, then come back down the same road.'],
      pt: ['Toca a caixa 1 da pentatónica menor de {n:A} na 6.ª e na 5.ª corda.', 'Na 4.ª corda toca os trastes 5 e 7 e desliza o dedo 3 do 7 para o 10.', 'Estás na caixa 2: acaba na 3.ª, 2.ª e 1.ª corda e desce pelo mesmo caminho.']
    },
    tips: { en: ['Keep the slide in time: it takes one 8th note, like every other note.'], pt: ['Mantém o slide a tempo: dura uma colcheia, como qualquer outra nota.'] },
    sub: 2, tempo: { start: 60, goal: 120, step: 4 }, learn: 'scales',
    tab: '6.5 6.8 5.5 5.7 4.5 4.7 4.10s 3.7 | 3.9 2.8 2.10 1.8 1.10 1.8 2.10 2.8 | 3.9 3.7 4.10 4.7s 4.5 5.7 5.5 6.8',
    vars: [{ name: { en: 'In {n:E}', pt: 'Em {n:E}' }, tab: '6.0 6.3 5.0 5.2 4.0 4.2 4.5s 3.2 | 3.4 2.3 2.5 1.3 1.5 1.3 2.5 2.3 | 3.4 3.2 4.5 4.2s 4.0 5.2 5.0 6.3' }]
  });
  EX.push({
    id: 'scales-pent-diagonal', cat: 'scales', level: 4, tags: ['pentatonic', 'minor', '3nps', 'positions'], minutes: 6,
    title: { en: 'Diagonal pentatonic, open to fret 17', pt: 'Pentatónica na diagonal, da corda solta ao traste 17' },
    goal: { en: 'Cross the whole neck in one run, three pentatonic notes per string.', pt: 'Atravessar o braço todo numa só corrida, com três notas pentatónicas por corda.' },
    how: {
      en: ['In {n:E} minor pentatonic, start on the open 6th string.', 'Play three notes per string; each new string starts a little higher on the neck.', 'Shift with a slide where the stretch gets too wide, and finish at fret 17 of the 1st string before coming back.'],
      pt: ['Em pentatónica menor de {n:E}, começa na 6.ª corda solta.', 'Toca três notas por corda; cada corda nova começa um pouco mais acima no braço.', 'Desloca a mão com um slide onde a abertura fica grande e acaba no traste 17 da 1.ª corda antes de voltar.']
    },
    tips: { en: ['This run links all five boxes: notice each one as you pass through it.'], pt: ['Esta corrida liga as cinco caixas: repara em cada uma quando passas por ela.'] },
    sub: 3, tempo: { start: 50, goal: 100, step: 4 }, learn: 'scales',
    tab: loopTab(nps('E', SC.minPent, 0, 3), 12),
    vars: [{ name: { en: 'With slides', pt: 'Com slides' }, tab: loopTab(nps('E', SC.minPent, 0, 3), 12, 's') }]
  });
  (function () {
    function run(key) {
      var root = PC[key], start = 55 + mod(root - 55, 12);
      var ps = []; for (var p = start; ps.length < 11; p++) if (inS(p, root, SC.major)) ps.push(p);
      var seq = [];
      for (var g = 0; g < 5; g++) {
        var notes = ps.slice(g, g + 6);
        notes.forEach(function (p, i) { var str = i < 3 ? 3 : 2; seq.push({ s: str, f: p - OPEN[str] }); });
      }
      check(seq, 'two-string major ' + key);
      return seqTab(seq.concat(seq.slice().reverse()), 12);
    }
    EX.push({
      id: 'scales-major-two-strings', cat: 'scales', level: 4, tags: ['major', 'positions', '3nps'], minutes: 6,
      title: { en: 'Major scale climbing on two strings', pt: 'Escala maior a subir em duas cordas' },
      goal: { en: 'Slide the major scale up the neck on the 3rd and 2nd strings, three notes on each.', pt: 'Levar a escala maior pelo braço acima na 3.ª e na 2.ª corda, três notas em cada.' },
      how: {
        en: ['In {n:C}, play {n:C} {n:D} {n:E} on the 3rd string and {n:F} {n:G} {n:A} on the 2nd string.', 'Start the next group one scale note higher: {n:D} {n:E} {n:F}, then {n:G} {n:A} {n:B}.', 'Keep climbing for five groups, then play everything backwards.'],
        pt: ['Em {n:C}, toca {n:C} {n:D} {n:E} na 3.ª corda e {n:F} {n:G} {n:A} na 2.ª corda.', 'Começa o grupo seguinte uma nota acima: {n:D} {n:E} {n:F}, depois {n:G} {n:A} {n:B}.', 'Continua a subir durante cinco grupos e depois toca tudo ao contrário.']
      },
      tips: { en: ['Every group is one 3-notes-per-string shape: the hand moves, the fingers repeat.'], pt: ['Cada grupo é um desenho de 3 notas por corda: a mão muda, os dedos repetem.'] },
      sub: 3, tempo: { start: 50, goal: 100, step: 4 }, learn: 'scales',
      tab: run('C'), vars: keyVars(['G', 'A', 'Bb'], run)
    });
  })();

  /* ---------- Modes ---------- */
  var MODES = [
    { id: 'dorian', sc: SC.dorian, lvl: 3, tags: ['funk', 'jazz'], en: 'Dorian', pt: 'Dórico',
      soundEn: 'Dorian is a minor scale with a brighter 6th ({n:F#} in {n:A}): moody but hopeful, the sound of funk, soul and jazzy minor grooves.',
      soundPt: 'O dórico é uma escala menor com a 6.ª mais luminosa ({n:F#} em {n:A}): melancólico mas esperançoso, o som do funk, da soul e dos grooves menores com jazz.',
      useEn: 'Try it over a {c:Am} to {c:D} vamp.', usePt: 'Experimenta sobre um vaivém de {c:Am} para {c:D}.' },
    { id: 'mixolydian', sc: SC.mixo, lvl: 3, tags: ['rock', 'blues'], en: 'Mixolydian', pt: 'Mixolídio',
      soundEn: 'Mixolydian is a major scale with a flat 7th ({n:G} in {n:A}): sunny but relaxed, the sound of rock riffs and bluesy major tunes.',
      soundPt: 'O mixolídio é uma escala maior com a 7.ª abaixada ({n:G} em {n:A}): solar mas descontraído, o som dos riffs de rock e das músicas maiores com blues.',
      useEn: 'Try it over an {c:A7} chord or an {c:A} to {c:G} vamp.', usePt: 'Experimenta sobre um acorde {c:A7} ou um vaivém de {c:A} para {c:G}.' },
    { id: 'lydian', sc: SC.lydian, lvl: 4, tags: [], en: 'Lydian', pt: 'Lídio',
      soundEn: 'Lydian is a major scale with a raised 4th ({n:D#} in {n:A}): dreamy and floating, like film music about flying.',
      soundPt: 'O lídio é uma escala maior com a 4.ª subida ({n:D#} em {n:A}): sonhador e a flutuar, como música de filme sobre voar.',
      useEn: 'Try it over an {c:A} to {c:B} vamp.', usePt: 'Experimenta sobre um vaivém de {c:A} para {c:B}.' },
    { id: 'phrygian', sc: SC.phryg, lvl: 4, tags: ['metal'], en: 'Phrygian', pt: 'Frígio',
      soundEn: 'Phrygian is a minor scale with a flat 2nd ({n:Bb} in {n:A}): dark and tense, with a Spanish flavour that metal players love.',
      soundPt: 'O frígio é uma escala menor com a 2.ª abaixada ({n:Bb} em {n:A}): escuro e tenso, com um sabor espanhol que o metal adora.',
      useEn: 'Try it over an {c:Am} to {c:Bb} vamp.', usePt: 'Experimenta sobre um vaivém de {c:Am} para {c:Bb}.' }
  ];
  MODES.forEach(function (m) {
    EX.push({
      id: 'scales-mode-' + m.id, cat: 'scales', level: m.lvl, tags: ['modes', '3nps'].concat(m.tags), minutes: 6,
      title: { en: m.en + ' mode', pt: 'Modo ' + m.pt.toLowerCase() },
      goal: { en: 'Play the ' + m.en.toLowerCase() + ' mode from its root and hear its colour.', pt: 'Tocar o modo ' + m.pt.toLowerCase() + ' a partir da tónica e ouvir a sua cor.' },
      how: {
        en: [m.soundEn, 'Start on {n:A}, fret 5 of the 6th string, and play three notes per string up to the 1st string and back.', m.useEn],
        pt: [m.soundPt, 'Começa no {n:A}, traste 5 da 6.ª corda, e toca três notas por corda até à 1.ª corda e volta.', m.usePt]
      },
      tips: { en: ['Lean on the note that makes the mode special: that is where its colour lives.'], pt: ['Insiste na nota que torna o modo especial: é aí que mora a cor dele.'] },
      sub: 3, tempo: T3, learn: 'scales',
      tab: loopTab(nps('A', m.sc, 0, 3), 12),
      vars: keyVars(['E', 'G', 'D'], function (k) { return loopTab(nps(k, m.sc, 0, 3), 12); })
    });
  });
  (function () {
    function oct(sc) { return loopTab(nps('A', sc, 0, 3).slice(0, 8), 8); }
    EX.push({
      id: 'scales-mode-colours', cat: 'scales', level: 3, tags: ['modes', 'major', 'minor'], minutes: 8,
      title: { en: 'Six modes, one root', pt: 'Seis modos, uma tónica' },
      goal: { en: 'Hear how changing one or two notes turns the same root into a different mood.', pt: 'Ouvir como mudar uma ou duas notas transforma a mesma tónica num ambiente diferente.' },
      how: {
        en: ['Every version is one octave from {n:A}, fret 5 of the 6th string, up and down.', 'The main tab is the major scale; the variations are dorian, mixolydian, lydian, phrygian and natural minor.', 'Play two in a row and listen for the notes that changed.'],
        pt: ['Cada versão é uma oitava a partir do {n:A}, traste 5 da 6.ª corda, a subir e a descer.', 'A tablatura principal é a escala maior; as variações são o dórico, mixolídio, lídio, frígio e a menor natural.', 'Toca duas seguidas e ouve as notas que mudaram.']
      },
      tips: { en: ['Hum the {n:A} before each run so your ear keeps the same home.'], pt: ['Cantarola o {n:A} antes de cada corrida para o ouvido manter a mesma casa.'] },
      sub: 2, tempo: { start: 50, goal: 100, step: 4 }, learn: 'scales',
      tab: oct(SC.major),
      vars: [['Dorian', 'Dórico', SC.dorian], ['Mixolydian', 'Mixolídio', SC.mixo], ['Lydian', 'Lídio', SC.lydian], ['Phrygian', 'Frígio', SC.phryg], ['Natural minor', 'Menor natural', SC.minor]]
        .map(function (v) { return { name: { en: v[0], pt: v[1] }, tab: oct(v[2]) }; })
    });
  })();

  (window.SS_EXERCISES = window.SS_EXERCISES || []).push.apply(window.SS_EXERCISES, EX);
})();
