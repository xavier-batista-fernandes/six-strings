# Six Strings

A guitar practice app for players who learned by ear.

- **Practice:** a library of 269 exercises in ten categories (warm-ups, left hand, picking hand, rhythm, fretboard, scales, chords, ear, improvising, style studies). Each exercise has a tab you can hear, a goal tempo, a metronome with count-in, a speed trainer and a tempo log.
- **Today, Routines, Progress:** a daily session built from what is due for review, timed routines (ready-made or your own), a practice calendar, streaks, tempo charts and backup/restore.
- **Tools:** metronome, microphone tuner and recorder.
- **Learn:** the original theory course: fretboard notes, intervals, scales, chords and CAGED, keys, ear training and jam loops.

It's a static site with no build step. Open `index.html` in a browser (or serve the folder), or use GitHub Pages. Progress is stored in the browser.

## Adding exercises

Exercises live in `exercises/*.js`. The format and tab notation are in [exercises/README.md](exercises/README.md). Check them with `node tools/check-exercises.js`.

Interface text is in `i18n/en.js` and `i18n/pt.js` (Portugal Portuguese); add every new string to both.
