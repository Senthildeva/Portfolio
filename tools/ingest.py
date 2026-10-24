"""Import a Figma export into the site.

Usage:  npm run ingest -- <export folder or .zip>
   or:  python3 -I tools/ingest.py <export folder or .zip>

Each image layer the site uses has an export setting in Figma whose suffix is "__<layer id>", so Figma
names the file "<layer name>__<id>.png|svg" (e.g. "hero__14086-9778.png"). The id is read from the name:

  PNG / JPG  -> src/assets/figma/<id>.webp   (WebP q90, max 2624px wide; the build makes the smaller sizes)
  SVG        -> src/assets/figma/<id>.svg    (copied; files containing <script> are refused)
  video-*.mp4|webm|mov -> public/videos/     (e.g. video-cna.mp4; shown in the case study instead of its poster)

Files without the "__<id>" suffix (page PDFs, mockups) are listed as skipped.
"""
import re, sys, shutil, zipfile, tempfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "src" / "assets" / "figma"
VIDEOS = ROOT / "public" / "videos"
IMAGES.mkdir(parents=True, exist_ok=True)
VIDEOS.mkdir(parents=True, exist_ok=True)
MAX_W = 2624

if len(sys.argv) < 2:
    sys.exit(__doc__)
src = Path(sys.argv[1]).expanduser()
if src.suffix.lower() == ".zip":
    work = Path(tempfile.mkdtemp())
    with zipfile.ZipFile(src) as z:
        for m in z.infolist():
            name = Path(m.filename)
            if m.is_dir() or name.name.startswith(".") or "__MACOSX" in m.filename or ".." in name.parts:
                continue
            with z.open(m) as f, open(work / name.name, "wb") as o:
                shutil.copyfileobj(f, o)
    src = work

pat = re.compile(r"__(I?\d+-\d+(?:_\d+-\d+)*)(?:@\dx)?\.(png|svg|jpg|jpeg)$", re.I)
done, skipped = [], []
for f in sorted(p for p in src.rglob("*") if p.is_file()):
    low = f.name.lower()
    if low.startswith("video-") and f.suffix.lower() in (".mp4", ".webm", ".mov"):
        shutil.copyfile(f, VIDEOS / low.replace(".mov", ".mp4") if low.endswith(".mov") else VIDEOS / low)
        done.append(f.name)
        continue
    m = pat.search(f.name)
    if not m:
        skipped.append(f.name)
        continue
    key, ext = m.group(1), m.group(2).lower()
    if ext == "svg":
        data = f.read_text(encoding="utf-8", errors="ignore")
        if "<script" in data.lower() or "javascript:" in data.lower():
            skipped.append(f.name + " (contains script)")
            continue
        for old in IMAGES.glob(key + ".*"):
            old.unlink()
        (IMAGES / f"{key}.svg").write_text(data, encoding="utf-8")
    else:
        im = Image.open(f)
        im.load()
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA")
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        for old in IMAGES.glob(key + ".*"):
            old.unlink()
        im.save(IMAGES / f"{key}.webp", "WEBP", quality=90, method=6)
    done.append(f.name)

print(f"imported {len(done)} files")
if skipped:
    print(f"skipped {len(skipped)} (no __<layer id> in the name):")
    for s in skipped[:40]:
        print("  ", s)
