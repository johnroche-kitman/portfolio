#!/usr/bin/env bash
#
# Normalise Hudl exports into what the prototypes can play, and pull a poster
# frame out of each one.
#
#   bash transcode.sh ~/Downloads/hudl-exports
#
# Every video in the source folder is re-encoded into this folder under the same
# base name, so name the source files after the manifest in README.md first
# (session-01.mov -> session-01.mp4). Existing outputs are left alone, so the
# script is safe to re-run after adding a few more clips.
#
# Needs ffmpeg: brew install ffmpeg

set -euo pipefail

SRC=${1:-}
DEST=$(cd "$(dirname "$0")" && pwd)

if [[ -z $SRC || ! -d $SRC ]]; then
  echo "usage: bash $0 <folder of Hudl exports>" >&2
  exit 1
fi

command -v ffmpeg >/dev/null || { echo "ffmpeg not found — brew install ffmpeg" >&2; exit 1; }

mkdir -p "$DEST/posters"

shopt -s nullglob nocaseglob
for f in "$SRC"/*.{mp4,mov,m4v,avi,mkv}; do
  base=$(basename "${f%.*}")
  out="$DEST/$base.mp4"
  poster="$DEST/posters/$base.jpg"

  if [[ -f $out ]]; then
    echo "skip  $base.mp4 (already here)"
  else
    echo "encode $base.mp4"
    # -movflags +faststart puts the index at the front so the clip starts
    # playing before the whole file has downloaded.
    ffmpeg -nostdin -loglevel error -y -i "$f" \
      -vf "scale=1280:-2:flags=lanczos" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23 -preset medium \
      -c:a aac -b:a 128k -movflags +faststart \
      "$out"
  fi

  if [[ ! -f $poster ]]; then
    # One second in, so the poster is not a black fade-up.
    ffmpeg -nostdin -loglevel error -y -ss 1 -i "$out" -frames:v 1 -q:v 4 "$poster" 2>/dev/null \
      || ffmpeg -nostdin -loglevel error -y -i "$out" -frames:v 1 -q:v 4 "$poster"
    echo "poster $base.jpg"
  fi
done

echo
echo "done. $(find "$DEST" -maxdepth 1 -name '*.mp4' | wc -l | tr -d ' ') clips in $DEST"
