# See what’s possible.

The creative idea: appetite begins with attention. A familiar dish becomes an intriguing object, then a collection, then an invitation to explore HoloMenu.

## Art direction

Acid lime, warm ivory, charcoal green, plum, and dusty pink. Oversized Manrope typography paired with Cormorant Garamond italic. Original 2D food illustrations with bold contour lines, solid fills, animated eyes, playful stickers, and graphic wipes. Every visual uses flat vector shapes; no 3D models, lighting, or rendered food assets are used. A minimal custom wordmark replaces unverified official artwork.

## Edit

| Time | Picture | Voiceover |
| --- | --- | --- |
| 00–04 | Illustrated eye character, large type, flat stripe transition | What if your next craving… |
| 04–08 | Illustrated burger bounces onto an acid-lime stage | …had a whole new dimension? |
| 08–14 | Vector burger separates into independently moving ingredient layers | Every layer. Every angle. Every delicious detail. |
| 14–20 | Illustrated hand and phone with a sliding food carousel | A little closer. A little more real. |
| 20–26 | Pink pop-art posters with illustrated food and appetite typography | This is food that makes you stop. Look. And look again. |
| 26–32 | Burger, pizza, and noodle-bowl illustrations move in a three-part collection | Because great taste deserves a great first impression. |
| 32–38 | Full-frame kinetic words, illustrated magnifier, and floating vector accents | Turn a moment of curiosity into a moment of craving. |
| 38–42 | Illustrated food burst and brand positioning | Holo Menu. |
| 42–45 | Large wordmark, illustrated eye seal, and website invitation | See what’s possible. |

## Sound

Original 120 BPM electronic instrumental in a minor harmonic palette. Rounded sub-bass, sidechained pads, alternating stereo plucks, punchy kick, textured claps, crisp hats, and edit-aligned sweeps. Narration sits in the center with a subtle room treatment. Music ducks beneath speech. Final master targets approximately −17 LUFS with headroom below −1 dBTP after AAC encoding.

Voice: Kokoro `af_heart`, American English, generated narration. It is a synthetic voice, not a human recording.

## Editing notes

Open `assets/illustrations/*.svg` in Adobe Illustrator to edit paths, outlines, and flat fills. Burger layers are separate, aligned SVG files, so their motion remains independently editable.

Update scene copy, color values, SVG illustrations, and time boundaries in `src/film.js`. Edit narration lines and their start times in `src/audio.py`; regenerate audio and render again. All animation is deterministic at a given timestamp.

Website access was unavailable in the production environment. Product interface and brand styling need to be checked against the actual HoloMenu site before official publication.
