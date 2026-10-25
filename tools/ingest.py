"""Import a Figma export into the site.

Usage:  npm run ingest -- <export folder or .zip> [file ...]
   or:  python3 -I tools/ingest.py <export folder or .zip> [file ...]

Files given after the folder (paths relative to it) are the only ones imported; otherwise everything is.

How a file is matched to the site image it fills:
  1. tools/export-names.json lists files exported by hand, by their path in the export folder
     (e.g. "Logos/SBI.png" -> 14086:9781). null there means the site doesn't use that file.
     A value can also be {"<width>x<height>": id, ...} when one file name can hold different layers
     (macOS treats "image.png" and "Image.png" as the same file), or "video-<name>" for a video.
  2. Otherwise the "__<layer id>" ending added by the export settings in Figma is used
     (e.g. "hero__14086-9778.png").
Layer ids that are copies of one artwork go through src/lib/asset-map.json, so each image is stored once.

  PNG / JPG / WebP -> src/assets/figma/<id>.webp  (WebP q90, max 2624px wide; the build makes the smaller sizes)
  SVG              -> src/assets/figma/<id>.svg   (copied; files containing <script> are refused)
  video-*.mp4|webm|mov -> public/videos/          (e.g. video-cna.mp4; shown in the case study instead of its poster)

Anything else is listed as skipped.
"""
import json, re, sys, shutil, zipfile, tempfile
from pathlib import Path, PurePosixPath
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "src" / "assets" / "figma"
VIDEOS = ROOT / "public" / "videos"
NAMES = json.loads((ROOT / "tools" / "export-names.json").read_text(encoding="utf-8"))["files"]
ALIASES = json.loads((ROOT / "src" / "lib" / "asset-map.json").read_text(encoding="utf-8"))["map"]
IMAGES.mkdir(parents=True, exist_ok=True)
VIDEOS.mkdir(parents=True, exist_ok=True)
MAX_W = 2624
SUFFIX = re.compile(r"__(I?\d+-\d+(?:_\d+-\d+)*)(?:@\dx)?\.(png|svg|jpg|jpeg|webp)$", re.I)


def key_of(node_id):
    """Figma layer id -> file name stem, after following copies to the one exported layer."""
    node_id = ALIASES.get(node_id, node_id)
    return node_id.replace(":", "-").replace(";", "_")


def is_video(path):
    """True for real MP4/MOV/WebM data (a Finder alias or shortcut with a video name is not)."""
    head = path.read_bytes()[:12]
    return head[4:8] == b"ftyp" or head[:4] == b"\x1a\x45\xdf\xa3"


def size_of(path):
    try:
        with Image.open(path) as im:
            return f"{im.width}x{im.height}"
    except Exception:
        return None


if len(sys.argv) < 2:
    sys.exit(__doc__)
src = Path(sys.argv[1]).expanduser()
only = set(sys.argv[2:])
if src.suffix.lower() == ".zip":
    work = Path(tempfile.mkdtemp())
    with zipfile.ZipFile(src) as z:
        for m in z.infolist():
            parts = [p for p in PurePosixPath(m.filename).parts if p not in ("", ".", "..", "/")]
            if m.is_dir() or not parts or parts[-1].startswith(".") or "__MACOSX" in parts:
                continue
            dest = work.joinpath(*parts)
            dest.parent.mkdir(parents=True, exist_ok=True)
            with z.open(m) as f, open(dest, "wb") as o:
                shutil.copyfileobj(f, o)
    src = work

done, skipped, written = [], [], {}
for f in sorted(p for p in src.rglob("*") if p.is_file() and not p.name.startswith(".")):
    rel = f.relative_to(src).as_posix()
    if only and rel not in only:
        continue
    low = f.name.lower()
    if low.startswith("video-") and f.suffix.lower() in (".mp4", ".webm", ".mov"):
        shutil.copyfile(f, VIDEOS / (low[:-4] + ".mp4" if low.endswith(".mov") else low))
        done.append(f"{rel} -> public/videos/")
        continue
    if rel in NAMES:
        node = NAMES[rel]
        if isinstance(node, dict):
            node = node.get(size_of(f) or "", None)
            if node is None:
                skipped.append(f"{rel} ({size_of(f)} matches none of its listed sizes)")
                continue
        if node is None:
            skipped.append(f"{rel} (not used by the site)")
            continue
        if node.startswith("video-"):
            if not is_video(f):
                skipped.append(f"{rel} (not a video file; a Finder alias or shortcut?)")
                continue
            shutil.copyfile(f, VIDEOS / f"{node}.mp4")
            done.append(f"{rel} -> public/videos/{node}.mp4")
            continue
        ext = f.suffix.lower().lstrip(".")
    else:
        m = SUFFIX.search(f.name)
        if not m:
            skipped.append(f"{rel} (no __<layer id> ending, not in tools/export-names.json)")
            continue
        node = m.group(1).replace("-", ":").replace("_", ";")
        ext = m.group(2).lower()
    key = key_of(node)
    if key in written:
        print(f"warning: {rel} and {written[key]} both fill {key}; keeping {rel}")
    written[key] = rel
    for old in IMAGES.glob(key + ".*"):
        old.unlink()
    if ext == "svg":
        data = f.read_text(encoding="utf-8", errors="ignore")
        if "<script" in data.lower() or "javascript:" in data.lower():
            skipped.append(f"{rel} (contains script)")
            continue
        (IMAGES / f"{key}.svg").write_text(data, encoding="utf-8")
        done.append(f"{rel} -> {key}.svg")
    else:
        im = Image.open(f)
        im.load()
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA")
        if im.mode == "RGBA" and im.getextrema()[3][0] == 255:
            im = im.convert("RGB")  # fully opaque: drop the alpha channel
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        im.save(IMAGES / f"{key}.webp", "WEBP", quality=90, method=6)
        done.append(f"{rel} -> {key}.webp ({im.width}x{im.height})")

print(f"imported {len(done)} files")
for d in done:
    print("  ", d)
if skipped:
    print(f"skipped {len(skipped)}:")
    for s in skipped:
        print("  ", s)
