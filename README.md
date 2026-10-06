# HoloMenu — Food. With dimension.

A 45-second, 16:9 motion design concept with procedural 3D food, animated typography, an original electronic score, sound design, and AI voiceover. Final delivery: 1920 × 1080, 30 fps, H.264/AAC.

[Download the MP4](https://github.com/netflix-star/video/raw/refs/heads/main/output/HoloMenu-45s.mp4) · [Download the editable source bundle](https://github.com/netflix-star/video/raw/refs/heads/main/output/HoloMenu-editable-source.zip)

## Deliverables

- `output/HoloMenu-45s.mp4` — final film.
- `output/captions.srt` — optional captions.
- `output/voiceover.wav` — stereo narration stem.
- `output/music.wav` — original score and sound effects stem, with narration ducking.
- `output/mix.wav` — complete unmastered stereo mix.
- `index.html` — interactive, seekable source film.
- `src/film.js` — time-driven Three.js scenes, design, and animation.
- `src/audio.py` — narration generation, original music composition, sound design, and mixing.
- `src/render.mjs` — deterministic browser frame export.

## Brand assumptions

The production environment could not access `https://www.holomenu.food`: its egress proxy returned HTTP 403. The lime/cream/charcoal palette, wordmark treatment, stylized food assets, and phone interface are an original creative concept, not a reproduction of verified HoloMenu brand assets or its live interface. Copy avoids numerical product claims and unverified feature promises. Confirm this creative direction against the real brand before using it as an official advertisement.

The narration is generated with Kokoro's `af_heart` voice; no human voice actor was recorded or impersonated. The score and sound effects were synthesized specifically for this film. No commercial music recording is included.

## Play and edit

From `/workspace/video`:

```sh
npm ci
python -m http.server 8000 --bind 0.0.0.0
```

Open the served `index.html` in a browser. Press **Play film** for synchronized picture and sound; use the timeline to inspect any moment. Sources use a 1920 × 1080 design coordinate system. WebGL renders at 1280 × 720, composited with native 1080p typography and design into the final 1080p video.

Scene timing: 0–4 opening; 4–8 hero reveal; 8–14 exploded stack; 14–20 phone concept; 20–26 orbital food hero; 26–32 food collection; 32–38 kinetic typography; 38–42 brand promise; 42–45 end card.

## Render

Requires Chromium at `/usr/bin/chromium`, Node.js, FFmpeg, and the HTTP server above.

```sh
node src/render.mjs --samples
node src/render.mjs
bash src/finish.sh
```

`render.mjs` exports exactly 1,350 frames. It renders fixed timestamps instead of recording real-time playback, so a slow machine does not produce dropped animation frames.

## Recreate narration and music

The included WAV files are sufficient for playback and rendering. To regenerate them:

```sh
pip install --target .python kokoro-onnx soundfile scipy
curl -fL https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx -o assets/kokoro-v1.0.onnx
curl -fL https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin -o assets/voices-v1.0.bin
PYTHONPATH="$PWD/.python" OPENBLAS_NUM_THREADS=2 python src/audio.py
```

The large model and local Python environment are ignored by Git. Font and model attribution are in `assets/ATTRIBUTION.md`.
