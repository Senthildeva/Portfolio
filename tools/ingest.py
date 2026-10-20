"""Import the Figma export into public/assets.

Usage: python3 -I tools/ingest.py <export folder or .zip>

Figma names each file "<layer name>__<node id>.png|svg" (the suffix was set on every exported layer),
so the node id is read from the filename. PNGs become WebP (max 2624px wide, quality 82); SVGs are copied;
videos (mp4/webm/mov) whose name starts with "video-" are copied as-is.
"""
import re, sys, shutil, zipfile, tempfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

src = Path(sys.argv[1])
work = Path(tempfile.mkdtemp())
if src.suffix.lower() == ".zip":
    with zipfile.ZipFile(src) as z:
        for m in z.infolist():
            name = Path(m.filename)
            if m.is_dir() or name.name.startswith(".") or "__MACOSX" in m.filename or ".." in name.parts:
                continue
            target = work / name.name
            with z.open(m) as f, open(target, "wb") as o:
                shutil.copyfileobj(f, o)
    src = work

pat = re.compile(r"__(I?\d+-\d+(?:_\d+-\d+)*)(?:@\dx)?\.(png|svg|jpg|jpeg)$", re.I)
done, skipped = 0, []
for f in sorted(p for p in src.rglob("*") if p.is_file()):
    if f.name.lower().startswith("video-") and f.suffix.lower() in (".mp4", ".webm", ".mov"):
        shutil.copyfile(f, OUT / f.name.lower()); done += 1; continue
    low = f.name.lower()
    if low.startswith("splash-hello") or low.startswith("splash-senthil"):
        stem = "splash-hello" if low.startswith("splash-hello") else "splash-senthil"
        if f.suffix.lower() == ".svg":
            shutil.copyfile(f, OUT / f"{stem}.svg")
        else:
            Image.open(f).save(OUT / f"{stem}.webp", "WEBP", quality=90)
        done += 1; continue
    m = pat.search(f.name)
    if not m:
        skipped.append(f.name); continue
    key, ext = m.group(1), m.group(2).lower()
    if ext == "svg":
        data = f.read_text(encoding="utf-8", errors="ignore")
        if "<script" in data.lower():
            skipped.append(f.name + " (contains script)"); continue
        (OUT / f"{key}.svg").write_text(data, encoding="utf-8")
    else:
        im = Image.open(f)
        im.load()
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA")
        if im.width > 2624:
            im = im.resize((2624, round(im.height * 2624 / im.width)), Image.LANCZOS)
        im.save(OUT / f"{key}.webp", "WEBP", quality=82, method=6)
    done += 1
print(f"imported {done} files into {OUT}")
if skipped:
    print("skipped:", *skipped[:30], sep="\n  ")
