/* Ear training: interval and chord quizzes, recording yourself, and short phrases to hear and play back. */
(window.SS_EXERCISES = window.SS_EXERCISES || []).push(
  {
    id: 'ear-iv-quiz-first', cat: 'ear', level: 1, tags: ['ear', 'intervals'], minutes: 5,
    title: { en: 'Interval quiz: first steps', pt: 'Quiz de intervalos: primeiros passos' },
    goal: { en: 'Tell close notes from far-apart notes just by hearing them.',
            pt: 'Distinguir notas próximas de notas afastadas só de ouvido.' },
    how: { en: ['Open the interval quiz and press play.', 'Listen to the two notes without looking at anything.', 'First just decide: are they close together or far apart?', 'Then pick the answer and check it.'],
           pt: ['Abre o quiz de intervalos e carrega em play.', 'Ouve as duas notas sem olhar para nada.', 'Primeiro decide só isto: estão perto ou longe uma da outra?', 'Depois escolhe a resposta e confirma.'] },
    tips: { en: ['Hum both notes after you hear them. Your voice often knows before your head does.', 'Five minutes a day beats one long session a week.'],
            pt: ['Cantarola as duas notas depois de as ouvires. A voz muitas vezes sabe antes da cabeça.', 'Cinco minutos por dia valem mais do que uma sessão longa por semana.'] },
    tool: 'ear-iv', learn: 'intervals'
  },
  {
    id: 'ear-chord-quiz-first', cat: 'ear', level: 1, tags: ['ear', 'major', 'minor'], minutes: 5,
    title: { en: 'Major or minor?', pt: 'Maior ou menor?' },
    goal: { en: 'Hear whether a chord sounds major (bright) or minor (darker).',
            pt: 'Ouvir se um acorde soa maior (alegre) ou menor (mais escuro).' },
    how: { en: ['Open the chord quiz and press play.', 'Listen without looking and ask yourself: bright or dark?', 'Answer, then play the chord again to hear it once more.'],
           pt: ['Abre o quiz de acordes e carrega em play.', 'Ouve sem olhar e pergunta a ti próprio: alegre ou escuro?', 'Responde e depois toca o acorde outra vez para o ouvir de novo.'] },
    tips: { en: ['Do not overthink it. Your first feeling is usually right.', 'After the quiz, strum {c:E} and {c:Em} on your guitar and listen to the same difference.'],
            pt: ['Não penses demasiado. A primeira sensação costuma estar certa.', 'Depois do quiz, toca {c:E} e {c:Em} na guitarra e ouve a mesma diferença.'] },
    tool: 'ear-chord', learn: 'ear'
  },
  {
    id: 'ear-echo-three-notes', cat: 'ear', level: 1, tags: ['ear', 'notes'], minutes: 5,
    title: { en: 'Echo three notes', pt: 'Eco de três notas' },
    goal: { en: 'Hear a three-note melody and find it on the guitar without reading it.',
            pt: 'Ouvir uma melodia de três notas e encontrá-la na guitarra sem a ler.' },
    how: { en: ['Hide the tab, press play and listen without looking.', 'Sing the melody back once.', 'Start on the open 3rd string ({n:G}) and find the other notes by trying frets nearby.', 'Show the tab and check what you found.'],
           pt: ['Esconde a tablatura, carrega em play e ouve sem olhar.', 'Canta a melodia uma vez.', 'Começa na 3.ª corda solta ({n:G}) e procura as outras notas experimentando trastes ali perto.', 'Mostra a tablatura e confirma o que encontraste.'] },
    tips: { en: ['First decide if each note goes up or down. Then decide by how much.'],
            pt: ['Decide primeiro se cada nota sobe ou desce. Depois decide quanto.'] },
    tempo: { start: 60, goal: 90, step: 5 }, learn: 'ear',
    tab: '3.0 3.2 2.0 - | 2.0 3.2 3.0 - |',
    vars: [
      { name: { en: 'Up and back', pt: 'Sobe e volta' }, tab: '3.0 2.0 3.2 - | 3.0 2.0 2.1 - |' },
      { name: { en: 'Skip', pt: 'Salto' }, tab: '3.0 2.0 2.3 - | 2.3 2.0 3.0 - |' }
    ]
  },
  {
    id: 'ear-record-echo', cat: 'ear', level: 1, tags: ['ear', 'timing'], minutes: 5,
    title: { en: 'Record and listen back', pt: 'Grava e ouve' },
    goal: { en: 'Hear your own playing the way other people hear it.',
            pt: 'Ouvir o teu som como os outros o ouvem.' },
    how: { en: ['Pick a short melody you already know by ear.', 'Open the recorder and play it twice.', 'Listen back with your hands off the guitar.', 'Name one thing you liked and one thing to fix, then record again.'],
           pt: ['Escolhe uma melodia curta que já sabes de ouvido.', 'Abre o gravador e toca-a duas vezes.', 'Ouve a gravação com as mãos longe da guitarra.', 'Diz uma coisa de que gostaste e uma a corrigir e grava outra vez.'] },
    tips: { en: ['Listen for notes that buzz or stop too early. They are easy to miss while you play.'],
            pt: ['Repara nas notas que trastejam ou se calam cedo demais. Enquanto tocas, escapam facilmente.'] },
    tool: 'record', learn: 'ear'
  },
  {
    id: 'ear-fifth-vs-fourth', cat: 'ear', level: 2, tags: ['ear', 'intervals'], minutes: 5,
    title: { en: 'Fifth or fourth?', pt: 'Quinta ou quarta?' },
    goal: { en: 'Hear the difference between a 5th and a 4th on the guitar.',
            pt: 'Ouvir a diferença entre uma quinta e uma quarta na guitarra.' },
    how: { en: ['Press play and listen without looking: first {n:A} to {n:E} (a 5th), then {n:A} to {n:D} (a 4th).', 'The 5th sounds open and settled. The 4th sounds like it wants to move on.', 'Play both on your guitar: open 5th string, then fret 2 or the open 4th string.', 'Ask a friend (or the variation) to play one at random and name it.'],
           pt: ['Carrega em play e ouve sem olhar: primeiro {n:A} para {n:E} (uma quinta), depois {n:A} para {n:D} (uma quarta).', 'A quinta soa aberta e assente. A quarta soa como se quisesse seguir em frente.', 'Toca as duas na guitarra: 5.ª corda solta, depois o traste 2 ou a 4.ª corda solta.', 'Pede a um amigo (ou usa a variação) para tocar uma ao acaso e diz qual é.'] },
    tips: { en: ['A power chord is a 5th. If it sounds like a power chord, it is the 5th.'],
            pt: ['Um power chord é uma quinta. Se soa a power chord, é a quinta.'] },
    tempo: { start: 50, goal: 80, step: 5 }, learn: 'intervals',
    tab: '5.0 4.2 = - | 5.0 4.0 = - |',
    vars: [
      { name: { en: 'Together', pt: 'Juntas' }, tab: '5.0+4.2 = = - | 5.0+4.0 = = - |' },
      { name: { en: 'Mystery order', pt: 'Ordem mistério' }, tab: '5.0 4.0 = - | 5.0 4.2 = - | 5.0 4.2 = - | 5.0 4.0 = - |' }
    ]
  },
  {
    id: 'ear-sing-the-root', cat: 'ear', level: 2, tags: ['ear', 'major'], minutes: 5,
    title: { en: 'Sing the home note', pt: 'Canta a nota de casa' },
    goal: { en: 'Hear which note feels like home (the root) and find it on the guitar.',
            pt: 'Ouvir qual nota soa a casa (a tónica) e encontrá-la na guitarra.' },
    how: { en: ['Press play and listen without looking.', 'When it stops, sing the note that would make the melody feel finished.', 'Hold that note with your voice and find it on the 2nd or 5th string.', 'Check: it is {n:C}, on the 2nd string fret 1 or the 5th string fret 3.'],
           pt: ['Carrega em play e ouve sem olhar.', 'Quando parar, canta a nota que faria a melodia soar acabada.', 'Segura essa nota com a voz e procura-a na 2.ª ou na 5.ª corda.', 'Confirma: é {n:C}, na 2.ª corda traste 1 ou na 5.ª corda traste 3.'] },
    tips: { en: ['The home note is the one that lets you stop. Any other note leaves you hanging.'],
            pt: ['A nota de casa é a que te deixa parar. Qualquer outra deixa-te em suspenso.'] },
    tempo: { start: 60, goal: 90, step: 5 }, learn: 'ear',
    tab: '2.1 2.3 1.0 2.3 | 2.1 3.2 3.0 - |',
    vars: [
      { name: { en: 'Higher ending', pt: 'Final mais agudo' }, tab: '3.0 3.2 2.0 2.1 | 1.0 1.1 2.3 2.0 |' }
    ]
  },
  {
    id: 'ear-bass-line-6th', cat: 'ear', level: 2, tags: ['ear', 'notes'], minutes: 6,
    title: { en: 'Find a bass line', pt: 'Descobre uma linha de baixo' },
    goal: { en: 'Copy a low melody by ear, using only the 6th string.',
            pt: 'Copiar uma melodia grave de ouvido, só na 6.ª corda.' },
    how: { en: ['Hide the tab, press play and listen without looking.', 'Every note is on the 6th string, starting open ({n:E}).', 'Slide your finger along the string until each note matches what you heard.', 'Play along with the app once you have it.'],
           pt: ['Esconde a tablatura, carrega em play e ouve sem olhar.', 'Todas as notas estão na 6.ª corda, a começar solta ({n:E}).', 'Desliza o dedo pela corda até cada nota bater com o que ouviste.', 'Toca junto com a app quando a tiveres.'] },
    tips: { en: ['On one string, a bigger jump in sound means a bigger jump in frets.'],
            pt: ['Numa só corda, um salto maior no som é um salto maior nos trastes.'] },
    tempo: { start: 60, goal: 100, step: 5 }, learn: 'ear',
    tab: '6.0 6.3 6.5 6.3 | 6.0 - 6.7 6.5 | 6.3 6.5 6.3 6.0 | 6.2 - 6.0 - |'
  },
  {
    id: 'ear-major-minor-guitar', cat: 'ear', level: 2, tags: ['ear', 'major', 'minor', 'open-chords'], minutes: 5,
    title: { en: 'Major or minor on the guitar', pt: 'Maior ou menor na guitarra' },
    goal: { en: 'Hear one changed note turn a major chord into a minor one.',
            pt: 'Ouvir uma só nota mudada transformar um acorde maior em menor.' },
    how: { en: ['Press play and listen without looking: {c:E}, then {c:Em}.', 'Only one note changes: the 3rd string goes from fret 1 to open.', 'Play both yourself, then try the variation and say which comes first.'],
           pt: ['Carrega em play e ouve sem olhar: {c:E}, depois {c:Em}.', 'Só muda uma nota: a 3.ª corda passa do traste 1 para solta.', 'Toca os dois e depois experimenta a variação e diz qual vem primeiro.'] },
    tempo: { start: 50, goal: 80, step: 5 }, learn: 'ear',
    chords: { E: [0, 2, 2, 1, 0, 0], Em: [0, 2, 2, 0, 0, 0], A: [-1, 0, 2, 2, 2, 0], Am: [-1, 0, 2, 2, 1, 0] },
    tab: '@E D = = - | @Em D = = - |',
    vars: [
      { name: { en: 'Which first?', pt: 'Qual primeiro?' }, tab: '@Am D = = - | @A D = = - |' },
      { name: { en: 'Pick the note', pt: 'Só a nota' }, tab: '6.0+4.2+3.1 = = - | 6.0+4.2+3.0 = = - |' }
    ]
  },
  {
    id: 'ear-pentatonic-echo', cat: 'ear', level: 3, tags: ['ear', 'pentatonic', 'minor'], minutes: 8,
    title: { en: 'Five-note echo', pt: 'Eco de cinco notas' },
    goal: { en: 'Copy a short {n:A} minor pentatonic phrase by ear.',
            pt: 'Copiar de ouvido uma frase curta da pentatónica menor de {n:A}.' },
    how: { en: ['Hide the tab, press play and listen without looking.', 'All the notes are in the {n:A} minor pentatonic box at fret 5.', 'Find the first note, then the next, one at a time.', 'Play the whole phrase along with the app.'],
           pt: ['Esconde a tablatura, carrega em play e ouve sem olhar.', 'Todas as notas estão na caixa da pentatónica menor de {n:A} no traste 5.', 'Encontra a primeira nota, depois a seguinte, uma de cada vez.', 'Toca a frase toda junto com a app.'] },
    tips: { en: ['Sing each note before you look for it. If you cannot sing it, listen again.'],
            pt: ['Canta cada nota antes de a procurares. Se não a consegues cantar, ouve outra vez.'] },
    tempo: { start: 60, goal: 100, step: 5 }, learn: 'ear',
    tab: '2.5 2.8 1.5 2.8 | 2.5 3.7 3.5 - |',
    vars: [
      { name: { en: 'Going down', pt: 'A descer' }, tab: '1.8 1.5 2.8 2.5 | 3.7 3.5 4.7 - |' },
      { name: { en: 'Low end', pt: 'Zona grave' }, tab: '5.5 5.7 4.5 4.7 | 4.5 5.7 6.5 - |' }
    ]
  },
  {
    id: 'ear-thirds-major-minor', cat: 'ear', level: 3, tags: ['ear', 'intervals', 'major', 'minor'], minutes: 5,
    title: { en: 'Major 3rd or minor 3rd?', pt: 'Terceira maior ou menor?' },
    goal: { en: 'Hear the one-fret difference that makes melodies happy or sad.',
            pt: 'Ouvir a diferença de um traste que torna as melodias alegres ou tristes.' },
    how: { en: ['Press play and listen without looking: {n:C} to {n:E}, then {n:C} to {n:Eb}.', 'The major 3rd sounds bright, the minor 3rd sounds darker.', 'Play both: 5th string fret 3, then 4th string fret 2 or fret 1.', 'Then open the interval quiz and listen for just these two.'],
           pt: ['Carrega em play e ouve sem olhar: {n:C} para {n:E}, depois {n:C} para {n:Eb}.', 'A terceira maior soa alegre, a terceira menor soa mais escura.', 'Toca as duas: 5.ª corda traste 3, depois 4.ª corda traste 2 ou traste 1.', 'Depois abre o quiz de intervalos e escuta só estas duas.'] },
    tempo: { start: 50, goal: 80, step: 5 }, learn: 'intervals', tool: 'ear-iv',
    tab: '5.3 4.2 = - | 5.3 4.1 = - |',
    vars: [
      { name: { en: 'Together', pt: 'Juntas' }, tab: '5.3+4.2 = = - | 5.3+4.1 = = - |' }
    ]
  },
  {
    id: 'ear-iv-quiz-all', cat: 'ear', level: 3, tags: ['ear', 'intervals'], minutes: 10,
    title: { en: 'Interval quiz: every interval', pt: 'Quiz de intervalos: todos' },
    goal: { en: 'Name any interval within an octave by ear.',
            pt: 'Dizer qualquer intervalo até à oitava só de ouvido.' },
    how: { en: ['Open the interval quiz with all intervals switched on.', 'Listen once without looking, then sing the two notes.', 'Answer, and when you miss, play both notes on one string to hear the gap.'],
           pt: ['Abre o quiz de intervalos com todos os intervalos ligados.', 'Ouve uma vez sem olhar e depois canta as duas notas.', 'Responde e, quando falhares, toca as duas notas numa só corda para ouvires a distância.'] },
    tips: { en: ['Count the frets between the notes on one string: that number is the interval in half steps.'],
            pt: ['Conta os trastes entre as notas numa só corda: esse número é o intervalo em meios-tons.'] },
    tool: 'ear-iv', learn: 'intervals'
  },
  {
    id: 'ear-chord-quiz-fast', cat: 'ear', level: 3, tags: ['ear', 'major', 'minor'], minutes: 8,
    title: { en: 'Major or minor, first time', pt: 'Maior ou menor à primeira' },
    goal: { en: 'Name major and minor chords after hearing them only once.',
            pt: 'Dizer se um acorde é maior ou menor ouvindo-o uma só vez.' },
    how: { en: ['Open the chord quiz.', 'Allow yourself one listen only, without looking.', 'Keep a streak count and try to beat it each day.'],
           pt: ['Abre o quiz de acordes.', 'Permite-te ouvir só uma vez, sem olhar.', 'Conta as respostas certas seguidas e tenta bater o recorde todos os dias.'] },
    tool: 'ear-chord', learn: 'ear'
  },
  {
    id: 'ear-lick-transcribe', cat: 'ear', level: 4, tags: ['ear', 'pentatonic', 'bends', 'phrasing'], minutes: 10,
    title: { en: 'Steal a lick by ear', pt: 'Rouba uma frase de ouvido' },
    goal: { en: 'Copy a lick with a bend, notes and timing, just by listening.',
            pt: 'Copiar uma frase com bend, notas e ritmo, só a ouvir.' },
    how: { en: ['Hide the tab, press play and listen without looking, three times.', 'Sing it, including the bend.', 'Find the notes in the {n:A} minor pentatonic box at fret 5. The bend goes up a whole step.', 'Play it with the app, then record yourself and compare.'],
           pt: ['Esconde a tablatura, carrega em play e ouve sem olhar, três vezes.', 'Canta-a, incluindo o bend.', 'Procura as notas na caixa da pentatónica menor de {n:A} no traste 5. O bend sobe um tom.', 'Toca-a com a app, depois grava-te e compara.'] },
    tips: { en: ['Slow the tempo right down. Speed hides the details.', 'Check the bend: play the target note first, then bend until you match it.'],
            pt: ['Baixa bem o andamento. A velocidade esconde os pormenores.', 'Confirma o bend: toca primeiro a nota de destino e depois puxa a corda até lá chegar.'] },
    sub: 2, tempo: { start: 50, goal: 90, step: 5 }, learn: 'ear',
    tab: '1.5 1.8 2.5 2.8 3.7 = 3.5 3.7 | 3.7b9 = 3.7r 3.5 4.7 = = - |'
  },
  {
    id: 'ear-record-melody-memory', cat: 'ear', level: 4, tags: ['ear', 'phrasing'], minutes: 10,
    title: { en: 'Melody from memory', pt: 'Melodia de memória' },
    goal: { en: 'Work out a melody you know from memory and check it by recording.',
            pt: 'Tirar de memória uma melodia que conheces e confirmá-la gravando.' },
    how: { en: ['Pick a simple tune you can sing, such as a children\'s song.', 'Sing the first note, find it, and build the tune note by note.', 'Record it and listen back: does it sound like the tune in your head?', 'Fix any note that sounds wrong and record again.'],
           pt: ['Escolhe uma melodia simples que saibas cantar, como uma canção infantil.', 'Canta a primeira nota, encontra-a e constrói a melodia nota a nota.', 'Grava e ouve: soa como a melodia que tens na cabeça?', 'Corrige as notas que soam mal e grava outra vez.'] },
    tool: 'record', learn: 'ear'
  }
);
