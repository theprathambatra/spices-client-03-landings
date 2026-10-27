#!/usr/bin/env bash
# img-pipeline.sh: turn one master image (ChatGPT export, photo, cutout) into
# responsive AVIF + WebP delivery files, keeping real alpha when it exists.
#
#   bash docs/playbook/tools/img-pipeline.sh <master.png> <out-dir> <base-name> [width ...]
#
#   default widths: 640 960 1440 1920 2400 (widths wider than the master are skipped;
#   the script never upscales; upscale the master first if you need a wider file)
#
# Example:
#   bash docs/playbook/tools/img-pipeline.sh \
#     scrollcraft/builds/kesari-v3/out/hero-subject-pouch.png \
#     site/public/v3/img hero-subject-pouch 960 1440 1920 2400
#
# What it checks before encoding (and why):
#   - alpha present?   An RGB-only PNG cannot be a hero layer. Exits 3 if you pass
#                      REQUIRE_ALPHA=1 and the file has no alpha channel.
#   - alpha real?      A PNG with an alpha channel that is 100% opaque is the
#                      "fake transparency" failure (checkerboard or white backdrop
#                      baked in). Exits 4 under REQUIRE_ALPHA=1.
#   - corners clear?   For a cutout, opaque corners usually mean the subject was
#                      cropped by the frame or the background was not removed.
#                      Warning only (a foreground plane may legitimately touch edges).
#
# Env knobs: WEBP_Q (default 82), AVIF_CRF (default 30, lower = better),
#            REQUIRE_ALPHA=1 (fail on missing/fake alpha), FFMPEG=/path/to/full/ffmpeg
set -euo pipefail

IN="${1:?usage: img-pipeline.sh <master.png> <out-dir> <base-name> [width ...]}"
OUTDIR="${2:?usage: img-pipeline.sh <master.png> <out-dir> <base-name> [width ...]}"
NAME="${3:?usage: img-pipeline.sh <master.png> <out-dir> <base-name> [width ...]}"
shift 3
WIDTHS=("$@")
[ ${#WIDTHS[@]} -gt 0 ] || WIDTHS=(640 960 1440 1920 2400)
WEBP_Q="${WEBP_Q:-82}"
AVIF_CRF="${AVIF_CRF:-30}"

# Same idea as scroll-craft's encode.sh: a stripped ffmpeg lacks libwebp/libaom.
pick_ffmpeg() {
  local c
  for c in "${FFMPEG:-}" "${SCROLLCRAFT_FFMPEG:-}" "$(command -v ffmpeg 2>/dev/null || true)" \
           "$HOME/.local/bin/ffmpeg" /opt/homebrew/bin/ffmpeg /usr/local/bin/ffmpeg /usr/bin/ffmpeg; do
    [ -n "$c" ] && [ -x "$c" ] || continue
    if "$c" -hide_banner -encoders 2>/dev/null | grep -q libwebp \
       && "$c" -hide_banner -encoders 2>/dev/null | grep -q libaom-av1; then
      echo "$c"; return 0
    fi
  done
  echo "ERROR: need an ffmpeg with libwebp and libaom-av1 (set FFMPEG=...)" >&2; return 1
}
FF="$(pick_ffmpeg)"
FP="$(dirname "$FF")/ffprobe"; [ -x "$FP" ] || FP="$(command -v ffprobe)"

[ -f "$IN" ] || { echo "ERROR: no such file: $IN" >&2; exit 2; }
IFS=, read -r SRC_W SRC_H PIX < <("$FP" -v error -select_streams v:0 \
  -show_entries stream=width,height,pix_fmt -of csv=p=0 "$IN")
echo "master: $IN  ${SRC_W}x${SRC_H}  $PIX"

stat_alpha() {  # $1 = extra filter prefix ("" or "crop=...,"), prints YMIN YMAX
  "$FF" -hide_banner -loglevel error -i "$IN" \
    -vf "${1}alphaextract,signalstats,metadata=mode=print:file=-" -f null - \
    | awk -F= '/YMIN/{mn=$2} /YMAX/{mx=$2} END{print mn+0, mx+0}'
}

HAS_ALPHA=0
case "$PIX" in *a*|ya*|pal8) HAS_ALPHA=1 ;; esac
if [ "$HAS_ALPHA" = 1 ]; then
  read -r AMIN _ < <(stat_alpha "")
  if [ "$AMIN" -ge 255 ]; then
    echo "WARN: alpha channel exists but every pixel is opaque (fake transparency: checkerboard/white baked in)"
    [ "${REQUIRE_ALPHA:-0}" = 1 ] && exit 4
    HAS_ALPHA=0
  else
    worst=0
    for crop in "crop=16:16:0:0," "crop=16:16:iw-16:0," "crop=16:16:0:ih-16," "crop=16:16:iw-16:ih-16,"; do
      read -r _ CMAX < <(stat_alpha "$crop")
      [ "$CMAX" -gt "$worst" ] && worst=$CMAX
    done
    if [ "$worst" -gt 16 ]; then
      echo "WARN: a corner is opaque (alpha max $worst). Fine for a foreground plane that bleeds off-frame; wrong for a free-standing cutout."
    fi
    echo "alpha: real transparency (min alpha $AMIN)"
  fi
else
  echo "alpha: none (opaque image)"
  [ "${REQUIRE_ALPHA:-0}" = 1 ] && { echo "ERROR: REQUIRE_ALPHA=1 but master has no alpha channel" >&2; exit 3; }
fi

mkdir -p "$OUTDIR"
made=()
for W in "${WIDTHS[@]}"; do
  if [ "$W" -gt "$SRC_W" ]; then echo "skip ${W}w (master is only ${SRC_W}px wide; no upscaling)"; continue; fi
  WEBP="$OUTDIR/${NAME}-${W}.webp"; AVIF="$OUTDIR/${NAME}-${W}.avif"
  if [ "$HAS_ALPHA" = 1 ]; then
    "$FF" -y -hide_banner -loglevel error -i "$IN" -vf "scale=${W}:-2:flags=lanczos" \
      -c:v libwebp -quality "$WEBP_Q" -pix_fmt yuva420p "$WEBP"
    "$FF" -y -hide_banner -loglevel error -i "$IN" -filter_complex \
      "[0:v]scale=${W}:-2:flags=lanczos,format=yuva444p,split[c][a];[a]alphaextract[al]" \
      -map "[c]" -map "[al]" -c:v libaom-av1 -still-picture 1 -crf "$AVIF_CRF" -cpu-used 4 "$AVIF"
  else
    "$FF" -y -hide_banner -loglevel error -i "$IN" -vf "scale=${W}:-2:flags=lanczos" \
      -c:v libwebp -quality "$WEBP_Q" "$WEBP"
    "$FF" -y -hide_banner -loglevel error -i "$IN" -vf "scale=${W}:-2:flags=lanczos,format=yuv420p" \
      -c:v libaom-av1 -still-picture 1 -crf "$AVIF_CRF" -cpu-used 4 "$AVIF"
  fi
  printf '  %-48s %6s   %-48s %6s\n' "$WEBP" "$(du -h "$WEBP" | cut -f1)" "$AVIF" "$(du -h "$AVIF" | cut -f1)"
  made+=("$W")
done

[ ${#made[@]} -gt 0 ] || { echo "ERROR: no width <= master width ${SRC_W}; nothing written" >&2; exit 5; }

# Print a ready <picture> with intrinsic size from the largest output.
LAST="${made[${#made[@]}-1]}"
H=$(( SRC_H * LAST / SRC_W ))
PUB="${OUTDIR#*public}"   # site/public/v3/img -> /v3/img when under public/
[ "$PUB" = "$OUTDIR" ] && PUB="$OUTDIR"
avif_set=""; webp_set=""
for W in "${made[@]}"; do
  avif_set="${avif_set:+$avif_set, }$PUB/${NAME}-${W}.avif ${W}w"
  webp_set="${webp_set:+$webp_set, }$PUB/${NAME}-${W}.webp ${W}w"
done
cat <<EOF

<picture>
  <source type="image/avif" srcset="$avif_set" sizes="100vw">
  <source type="image/webp" srcset="$webp_set" sizes="100vw">
  <img src="$PUB/${NAME}-${LAST}.webp" width="$LAST" height="$H" alt="" decoding="async">
</picture>
EOF
