"""Import a Figma export into the site.

Usage:  npm run ingest -- <export folder or .zip> [file ...]
   or:  python3 -I tools/ingest.py <export folder or .zip> [file ...]

Files given after the folder (paths relative to it) are the only ones imported; otherwise everything is.

How a file is matched to the site image it fills:
  1. tools/export-names.json lists files exported by hand, by their path in the export folder. A value is
       null                         the site doesn't use this file
       "14086:9781"                 the Figma layer id of the site image it fills
       {"2624x1400": ..., ...}      pick by picture size (macOS treats "image.png" and "Image.png" as one name)
       {"id": ..., "crop": [l, t, r, b], "erase": [[l, t, r, b], ...]}
                                    keep part of the picture, and/or lift light text off a smooth background
                                    inside the boxes (the page sets that text live); pixels of the exported file
       [ ... ]                      several site images cut from one file
       "video-cna" or {"video": "video-cna", "poster": "13764:3493"}
                                    a video, optionally with its first frame saved as that poster image
  2. Otherwise the "__<layer id>" ending added by the export settings in Figma is used
     (e.g. "hero__14086-9778.png").
Layer ids that are copies of one artwork go through src/lib/asset-map.json, so each image is stored once.

  PNG / JPG / WebP -> src/assets/figma/<id>.webp  (WebP q90, max 2624px wide; the build makes the smaller sizes)
  SVG              -> src/assets/figma/<id>.svg   (copied; files containing <script> are refused)
  video            -> public/videos/<name>.mp4    (if ffmpeg is installed: re-encoded when heavier than 4 Mbit/s,
                                                   otherwise copied with the index moved to the front for streaming)
  video-*.mp4|webm|mov files are taken as videos by their own name.
"""
import json, re, sys, shutil, subprocess, zipfile, tempfile
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
FFMPEG = shutil.which("ffmpeg")


def key_of(node_id):
    """Figma layer id -> file name stem, after following copies to the one exported layer."""
    node_id = ALIASES.get(node_id, node_id)
    return node_id.replace(":", "-").replace(";", "_")


def size_of(path):
    try:
        with Image.open(path) as im:
            return f"{im.width}x{im.height}"
    except Exception:
        return None


def is_video(path):
    """True for real MP4/MOV/WebM data (a Finder alias or shortcut with a video name is not)."""
    head = path.read_bytes()[:12]
    return head[4:8] == b"ftyp" or head[:4] == b"\x1a\x45\xdf\xa3"


def erase_text(im, boxes):
    """Inside each box, replace light pixels (text, plus a small halo) by interpolating each row between
    the nearest untouched pixels to the left and right. Meant for text on a smooth gradient."""
    import numpy as np
    from PIL import ImageFilter
    a = np.asarray(im.convert("RGBA")).astype(np.float32)
    lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
    mask = np.zeros(lum.shape, bool)
    for l, t, r, b in boxes:
        mask[t:b, l:r] = lum[t:b, l:r] > 150
    mask = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))) > 0
    for l, t, r, b in boxes:
        for y in range(t, b):
            xs = np.where(mask[y, l:r])[0] + l
            if len(xs):
                good = np.where(~mask[y])[0]
                for c in range(4):
                    a[y, xs, c] = np.interp(xs, good, a[y, good, c])
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")


def save_image(im, key):
    """Write a picture as src/assets/figma/<key>.webp, replacing any earlier file for that key."""
    for old in IMAGES.glob(key + ".*"):
        old.unlink()
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA")
    if im.mode == "RGBA" and im.getextrema()[3][0] == 255:
        im = im.convert("RGB")  # fully opaque: drop the alpha channel
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    im.save(IMAGES / f"{key}.webp", "WEBP", quality=90, method=6)
    return f"{key}.webp ({im.width}x{im.height})"


def bitrate(path):
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=bit_rate", "-of", "csv=p=0", str(path)], capture_output=True, text=True, timeout=60).stdout
        return int(out.strip() or 0)
    except Exception:
        return 0


def import_video(f, name, poster=None):
    dest = VIDEOS / f"{name}.mp4"
    note = "copied"
    if FFMPEG and bitrate(f) > 4_000_000:
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(f), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
                        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(dest)], check=True)
        note = "re-encoded"
    elif FFMPEG:
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(f), "-an", "-c", "copy", "-movflags", "+faststart", str(dest)], check=True)
    else:
        shutil.copyfile(f, dest)
    msg = f"public/videos/{name}.mp4 ({note}, {dest.stat().st_size // 1024} KB)"
    if poster and FFMPEG:
        with tempfile.TemporaryDirectory() as tmp:
            frame = Path(tmp) / "poster.png"
            subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(f), "-frames:v", "1", str(frame)], check=True)
            msg += " + poster " + save_image(Image.open(frame), key_of(poster))
    return msg


def import_image(f, rel, node, crop=None, erase=None):
    key = key_of(node)
    if f.suffix.lower() == ".svg":
        data = f.read_text(encoding="utf-8", errors="ignore")
        if "<script" in data.lower() or "javascript:" in data.lower():
            raise ValueError("contains script")
        for old in IMAGES.glob(key + ".*"):
            old.unlink()
        (IMAGES / f"{key}.svg").write_text(data, encoding="utf-8")
        return f"{key}.svg"
    im = Image.open(f)
    im.load()
    if erase:
        im = erase_text(im, erase)
    if crop:
        im = im.crop(tuple(crop))
    return save_image(im, key)


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
    if rel in NAMES:
        spec = NAMES[rel]
        if isinstance(spec, dict) and not ({"id", "video"} & spec.keys()):
            spec = spec.get(size_of(f) or "")
            if spec is None:
                skipped.append(f"{rel} ({size_of(f)} matches none of its listed sizes)")
                continue
    elif f.name.lower().startswith("video-") and f.suffix.lower() in (".mp4", ".webm", ".mov"):
        spec = {"video": f.stem.lower()}
    else:
        m = SUFFIX.search(f.name)
        spec = m.group(1).replace("-", ":").replace("_", ";") if m else False
        if not spec:
            skipped.append(f"{rel} (no __<layer id> ending, not in tools/export-names.json)")
            continue
    if spec is None:
        skipped.append(f"{rel} (not used by the site)")
        continue
    for item in spec if isinstance(spec, list) else [spec]:
        if isinstance(item, str) and item.startswith("video-"):
            item = {"video": item}
        if isinstance(item, str):
            item = {"id": item}
        try:
            if "video" in item:
                if not is_video(f):
                    skipped.append(f"{rel} (not a video file; a Finder alias or shortcut?)")
                    continue
                done.append(f"{rel} -> " + import_video(f, item["video"], item.get("poster")))
            else:
                key = key_of(item["id"])
                if key in written and written[key] != rel:
                    print(f"warning: {rel} and {written[key]} both fill {key}; keeping {rel}")
                written[key] = rel
                done.append(f"{rel} -> " + import_image(f, rel, item["id"], item.get("crop"), item.get("erase")))
        except Exception as e:
            skipped.append(f"{rel} ({e})")

print(f"imported {len(done)}")
for d in done:
    print("  ", d)
if skipped:
    print(f"skipped {len(skipped)}:")
    for s in skipped:
        print("  ", s)
