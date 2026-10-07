# HoloMenu — Make your menu an experience.

The completed **75-second cinematic product film** follows the supplied 20-shot storyboard: warm restaurant photography, appetizing food closeups, animated product interfaces, kinetic typography, a narrated customer journey, and a connected restaurant platform.

[Download the final MP4](https://github.com/netflix-star/video/raw/refs/heads/main/output/HoloMenu-75s.mp4) · [View all 20 frames](output/storyboard.jpg) · [Download editable source](https://github.com/netflix-star/video/raw/refs/heads/main/output/HoloMenu-editable-source.zip)

1920 × 1080 · 30 fps · 75 seconds · H.264 / AAC stereo · MP4 with fast-start playback.

## Deliverables

- `output/HoloMenu-75s.mp4` — finished film with voiceover, original music and sound design.
- `output/storyboard.jpg` — contact sheet of all 20 shots.
- `production/frames/` — individual full-resolution shot previews.
- `output/captions.srt` — optional narration captions.
- `output/voiceover.wav`, `music.wav`, `mix.wav` — audio stems and mix.
- `output/HoloMenu-editable-source.zip` — editable film, photography, fonts, narration, score and captions.
- `index.html` — interactive film with synchronized audio and seeking.
- `src/cinematic.js` — deterministic Canvas 2D design and animation.
- `assets/cinematic/` — photographic assets and valid QR matrix.

The earlier `output/HoloMenu-45s.mp4` remains available as the previous flat illustrated version. The current preview and source bundle contain the new 75-second film.

## Creative and product context

This film uses **2D photographic compositing and vector interface animation**. No 3D models, WebGL, or 3D renders are used. The restaurant and food photographs were generated specifically for the film. The displayed menu, AR viewport, ordering, kitchen and dashboard screens are designed promotional interfaces, not recordings of the live product. Dashboard numbers are illustrative and marked in the shot; the film makes no numerical growth claim.

The public HoloMenu website was accessible during this production. Its title and metadata describe AR and 3D interactive menus for restaurants with no app download. The film follows the broader platform story in the user's supplied brief; it does not independently validate every illustrated platform feature.

The narration uses Kokoro's `am_michael` AI voice, with pitch-preserving timing. The 120 BPM score and sound effects are original synthesized compositions created for this edit. No human voice actor or licensed commercial music recording is represented. See [creative notes](CREATIVE.md), [production notes](production/README.md) and [attribution](assets/ATTRIBUTION.md).

## Preview and render

Requires Node.js, Python, Chromium and FFmpeg.

```sh
npm ci
npm start
```

Open the served `index.html`; press **Play film** or seek to any moment. Open `watch.html` to play the encoded MP4. With the server running in a second terminal:

```sh
npm run frames
npm run render
npm run package
```

The renderer exports exactly **2,250 deterministic frames** at fixed timestamps. It does not record real-time playback, so machine speed does not cause dropped animation frames. Playback and rendering use the included WAV mix. The source bundle does not require the large voice model unless regenerating narration.

## Regenerate audio

```sh
pip install --target .python kokoro-onnx soundfile scipy
curl -fL https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx -o assets/kokoro-v1.0.onnx
curl -fL https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin -o assets/voices-v1.0.bin
PYTHONPATH="$PWD/.python" OPENBLAS_NUM_THREADS=2 python src/audio.py
```

The model files and local Python dependencies are excluded from Git. The QR code points to `https://www.holomenu.food`.
