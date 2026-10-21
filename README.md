# Six Strings

Interactive guitar theory for players who learned by ear: where the notes are on the fretboard, intervals, scales (major, minor, pentatonic, blues), how chords are built and the CAGED shapes, keys and common progressions. Click any fret to hear it.

It's laid out as a course: the **Course** tab is a roadmap of 6 units and 18 steps, from finding notes on the neck to soloing over a backing loop. Each step opens the right lesson, set up for you, with one practice goal. Progress is saved in the browser (`localStorage`), and quiz goals tick themselves. Besides the five theory lessons there's **Ear training** (name intervals, major vs minor) and **Jam** (backing loops in any key, with the pentatonic or the current chord's notes on the neck). The units and steps are the `COURSE` list in `index.html`; their text is under `cu.*` and `cs.*` in the language files.

It's a single static page (`index.html`) with no build step. Open it in a browser, or serve it with GitHub Pages.

Live site: https://xavier-batista-fernandes.github.io/six-strings/

## Languages

The app is available in English and Portuguese (globe button in the header). Portuguese can show notes as Dó Ré Mi or C D E. All visible text lives in `i18n/<code>.js`, one file per language. To add a language, copy `i18n/en.js` to a new file, translate the values (and add the language's note names under `notes`), then add a `<script>` tag for it in `index.html` next to the others. Anything left untranslated falls back to English.
