# Exercise files

Every `*.js` file in this folder adds exercises to the library. Each file is a plain script (no modules, no build) loaded by `index.html`:

```js
(window.SS_EXERCISES = window.SS_EXERCISES || []).push(
  { /* exercise */ },
  { /* exercise */ }
);
```

A file may build exercises with loops or helper functions (for example scale x position, or all 24 finger orders), as long as it only touches `window.SS_EXERCISES` and keeps its helpers inside an IIFE.

Check your work with `node tools/check-exercises.js` (or pass one file). It must report 0 problems.

## Fields

| field | required | meaning |
|---|---|---|
| `id` | yes | unique kebab-case id, prefixed by the file's category, e.g. `left-spider-1234` |
| `cat` | yes | one of `warmup`, `left`, `right`, `rhythm`, `fretboard`, `scales`, `chords`, `ear`, `improv`, `styles` |
| `level` | yes | 1 (first weeks) to 5 (advanced) |
| `tags` | yes | lowercase slugs used by the filters, e.g. `['chromatic','stamina']`. Reuse tags across files: `chromatic`, `stamina`, `legato`, `bends`, `vibrato`, `picking`, `alternate-picking`, `string-crossing`, `economy`, `sweep`, `fingerstyle`, `hybrid`, `muting`, `strumming`, `timing`, `syncopation`, `triplets`, `open-chords`, `barre`, `caged`, `triads`, `sevenths`, `arpeggios`, `changes`, `pentatonic`, `major`, `minor`, `blues`, `modes`, `sequences`, `positions`, `3nps`, `notes`, `octaves`, `intervals`, `ear`, `improv`, `phrasing`, `chord-tones`, `rock`, `funk`, `folk`, `reggae`, `country`, `jazz`, `metal` |
| `minutes` | yes | suggested practice time, 1-30 |
| `title` | yes | `{en, pt}` short name |
| `goal` | yes | `{en, pt}` one sentence: what you'll be able to do |
| `how` | yes | `{en: [...], pt: [...]}` steps, 2-5 short sentences, same count in both |
| `tips` | no | `{en: [...], pt: [...]}` common mistakes and fixes |
| `tab` | yes unless `tool` | the notes, in the token format below |
| `beats` | no | beats per bar, default 4 |
| `sub` | no | subdivisions per beat, each tab token is one: 1 quarters, 2 eighths, 3 triplets, 4 sixteenths, 6 sextuplets. Default 1 |
| `tempo` | with `tab` | `{start, goal, step}` in beats per minute (the beat, not the subdivision). `step` is how much the speed trainer adds each round |
| `chords` | for strums | `{G: [3,2,0,0,0,3]}` frets from low E to high e, `-1` = not played |
| `vars` | no | variations: `[{name:{en,pt}, tab:'...'}]` same beats/sub/tempo as the main tab |
| `learn` | no | the theory lesson behind it: `fretboard`, `intervals`, `scales`, `chords`, `keys`, `ear`, `jam` |
| `tool` | no | opens an app tool instead of (or as well as) a tab: `quiz` (name the note), `ear-iv` (interval ear quiz), `ear-chord` (major/minor ear quiz), `jam` (backing loop), `tuner`, `record` (record yourself) |

## Text

- Plain, friendly, guitar-first language for a player who learned by ear. No jargon without a short explanation.
- `pt` is **Portugal Portuguese** (pt-PT): traste, tónica, palheta, corda, acorde, "toca", "repete". Not Brazilian forms (e.g. use "estás a tocar", not "está tocando").
- Inside text write notes as `{n:C}`, `{n:F#}`, `{n:Bb}` and chords as `{c:Am}`, `{c:G7}`, never bare letters, so the app can show C D E or Dó Ré Mi. Strings are named by number ("the 6th string", "a 6.ª corda").
- No real song titles, artists or copyrighted riffs. Write original material.

## Tab tokens

Strings are numbered like real tab: **1 = high e, 6 = low E**. Each timed token lasts one subdivision.

| token | meaning |
|---|---|
| `3.5` | string 3, fret 5 |
| `3.5+2.5` | notes together (double stop, chord shape) |
| `6.x` | muted (dead) note |
| `3.7h` `3.7p` `3.7s` | hammer-on / pull-off / slide **into** this note from the previous one |
| `3.7b9` | fret 7 bent until it sounds like fret 9 (`b8` half step, `b9` whole step) |
| `3.7r` | release a bend back to fret 7 |
| `3.7v` `3.7m` `3.7>` | vibrato / palm mute / accent (combine: `6.3m>`) |
| `-` | rest |
| `=` | hold: let the previous notes ring |
| `D` `U` | down / up strum of the current chord (`D>` accented) |
| `d` `u` | ghost strum: the hand moves but misses the strings |
| `X` | muted, percussive strum |
| `@G` | switch to chord `G` from `chords` (takes no time) |
| `\|` | bar line; optional, but when used, every bar must have exactly `beats*sub` tokens |

## Example

```js
{
  id: 'left-spider-1234', cat: 'left', level: 1, tags: ['chromatic', 'stamina'], minutes: 5,
  title: { en: 'Spider walk 1-2-3-4', pt: 'Aranha 1-2-3-4' },
  goal: { en: 'Play four frets in a row on every string with one finger per fret.',
          pt: 'Tocar quatro trastes seguidos em cada corda, um dedo por traste.' },
  how: { en: ['Put finger 1 on fret 1 of the 6th string.', 'Play frets 1, 2, 3, 4 with fingers 1, 2, 3, 4.', 'Move to the next string and repeat up to the 1st string.'],
         pt: ['Põe o dedo 1 no traste 1 da 6.ª corda.', 'Toca os trastes 1, 2, 3, 4 com os dedos 1, 2, 3, 4.', 'Passa à corda seguinte e repete até à 1.ª corda.'] },
  tips: { en: ['Keep each finger down until the next one has landed.'], pt: ['Mantém cada dedo pousado até o seguinte chegar.'] },
  sub: 4, tempo: { start: 60, goal: 120, step: 4 }, learn: 'fretboard',
  tab: '6.1 6.2 6.3 6.4 5.1 5.2 5.3 5.4 4.1 4.2 4.3 4.4 3.1 3.2 3.3 3.4 | 2.1 2.2 2.3 2.4 1.1 1.2 1.3 1.4 1.4 1.3 1.2 1.1 2.4 2.3 2.2 2.1 |'
}
```

With `beats` 4 and `sub` 4 a bar is 16 tokens, so each bar above holds four strings. Strumming example: `chords:{G:[3,2,0,0,0,3],C:[-1,3,2,0,1,0]}, sub:2, tab:'@G D - D U - U D U | @C D - D U - U D U'`.
