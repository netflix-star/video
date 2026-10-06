#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -hide_banner -y -i output/picture.mp4 -i output/mix.wav \
  -map 0:v:0 -map 1:a:0 -c:v copy \
  -af 'loudnorm=I=-16:TP=-1:LRA=9,volume=-1dB' -ar 48000 -c:a aac -b:a 320k \
  -t 45 -movflags +faststart \
  -metadata title='HoloMenu — Food. With dimension.' \
  -metadata comment='Original motion design concept. AI narration and original synthesized score.' \
  output/HoloMenu-45s.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate,channels,nb_frames \
  -of json output/HoloMenu-45s.mp4 > output/validation.json
