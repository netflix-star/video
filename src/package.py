"""Bundle the current editable 2D film, SVG artwork, captions, and audio stems."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1]
files = [root / name for name in (
    'README.md', 'CREATIVE.md', '.gitignore', 'package.json', 'package-lock.json',
    'index.html', 'assets/ATTRIBUTION.md', 'assets/Manrope.ttf',
    'assets/Manrope-LICENSE.txt', 'assets/CormorantGaramond-Italic.ttf',
    'assets/CormorantGaramond-LICENSE.txt', 'output/captions.srt', 'output/mix.wav',
    'output/music.wav', 'output/voiceover.wav', 'output/poster.jpg',
    'output/end-card.jpg', 'output/validation.json',
)]
files += sorted((root / 'src').glob('*.*'))
files += sorted((root / 'assets/illustrations').glob('*.svg'))
for path in files:
    if not path.is_file():
        raise FileNotFoundError(path)
target = root / 'output/HoloMenu-editable-source.zip'
with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
    for path in files:
        bundle.write(path, 'holomenu-film/' + str(path.relative_to(root)))
with zipfile.ZipFile(target) as bundle:
    if bundle.testzip() is not None:
        raise RuntimeError('Archive integrity check failed')
print(f'Verified 2D source bundle: {len(files)} files, {target.stat().st_size / 1e6:.1f} MB')
