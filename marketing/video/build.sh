#!/usr/bin/env bash
# Arma los videos cortos de Convite en salida/ a partir de index.html / index-corto.html y assets/.
#   ./build.sh          -> las dos versiones (larga y corta)
#   ./build.sh largo    -> solo convite-short*.mp4
#   ./build.sh corto    -> solo convite-short-corto*.mp4
#   ./build.sh chat     -> video 1 de las publicaciones, "El chat imposible" (chat-imposible*.mp4)
#   ./build.sh scroll   -> video 3, "Scroll satisfactorio" con xv-disco (scroll-xv*.mp4); antes: node capture-scroll.mjs xv-disco
# Requiere ffmpeg y Chrome. Las capturas de shots/ se generan antes con capture.mjs (sitio local en el puerto 8123).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida
QUIERO="${1:-todos}"

# Mezcla la voz con music2.mp3 bajando la música mientras se habla.
#   $1 video sin música, $2 voz, $3 filtro de la voz, $4 duración de la música, $5 curva de volumen de la música,
#   $6 inicio del fade final, $7 duración del fade, $8 salida
mezclar() {
  ffmpeg -v error -y -i "$1" -i "$2" -ss 0.52 -i assets/music2.mp3 -filter_complex "
[1:a]$3,asplit=2[voz][key];
[2:a]atrim=0:$4,asetpts=PTS-STARTPTS,volume=-5.5dB,
 volume='$5':eval=frame,
 afade=t=in:d=0.3,afade=t=out:st=$6:d=$7[mus];
[mus][key]sidechaincompress=threshold=0.05:ratio=3:attack=20:release=350[duck];
[voz][duck]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$8"
}

if [[ "$QUIERO" == todos || "$QUIERO" == largo ]]; then
  node render.mjs
  ffmpeg -v error -y -framerate 30 -i frames/f%05d.jpg -i assets/voz.mp3 -c:v libx264 -preset slow -crf 17 \
    -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest salida/convite-short.mp4
  rm -rf frames stills
  mezclar salida/convite-short.mp4 assets/voz.mp3 'volume=2dB' 76.05 \
    'if(lt(t,16.8),0.8, if(between(t,66.2,71.15),0.25, if(gte(t,71.15),1.35,1)))' 74.9 1.14 salida/convite-short-musica.mp4
fi

if [[ "$QUIERO" == todos || "$QUIERO" == corto ]]; then
  PAGE=index-corto.html FRAMES=frames-corto node render.mjs
  ffmpeg -v error -y -framerate 30 -i frames-corto/f%05d.jpg -i assets/voz2.mp3 -filter_complex "[1:a]apad[v]" \
    -map 0:v -map "[v]" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart \
    -t 43 salida/convite-short-corto.mp4
  rm -rf frames-corto stills
  mezclar salida/convite-short-corto.mp4 assets/voz2.mp3 'volume=2dB,apad,atrim=0:43' 43 \
    'if(lt(t,12.0),0.8, if(gte(t,37.85),1.35,1))' 41.3 1.7 salida/convite-short-corto-musica.mp4
fi

if [[ "$QUIERO" == chat ]]; then
  PAGE=chat-imposible.html FRAMES=frames-chat node render.mjs
  PAGE=chat-imposible.html node sfx.mjs salida/sfx-chat.wav
  ffmpeg -v error -y -framerate 30 -i frames-chat/f%05d.jpg -i salida/sfx-chat.wav -c:v libx264 -preset slow -crf 17 \
    -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest salida/chat-imposible.mp4
  # Con música de fondo: music2.mp3 debajo de los efectos, con fade al final
  ffmpeg -v error -y -i salida/chat-imposible.mp4 -ss 0.52 -i assets/music2.mp3 -filter_complex "
[1:a]atrim=0:12,asetpts=PTS-STARTPTS,volume=-9dB,afade=t=in:d=0.2,afade=t=out:st=11:d=1[mus];
[0:a][mus]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart salida/chat-imposible-musica.mp4
  rm -rf frames-chat stills salida/sfx-chat.wav
fi

if [[ "$QUIERO" == scroll ]]; then
  PAGE=scroll-xv.html FRAMES=frames-scroll node render.mjs
  PAGE=scroll-xv.html node sfx.mjs salida/sfx-scroll.wav
  ffmpeg -v error -y -framerate 30 -i frames-scroll/f%05d.jpg -i salida/sfx-scroll.wav -c:v libx264 -preset slow -crf 17 \
    -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest salida/scroll-xv.mp4
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 salida/scroll-xv.mp4)
  ffmpeg -v error -y -i salida/scroll-xv.mp4 -ss 0.52 -i assets/music2.mp3 -filter_complex "
[1:a]atrim=0:$DUR,asetpts=PTS-STARTPTS,volume=-7dB,afade=t=in:d=0.2,afade=t=out:st=$(echo "$DUR - 1.2" | bc):d=1.2[mus];
[0:a][mus]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart salida/scroll-xv-musica.mp4
  rm -rf frames-scroll stills salida/sfx-scroll.wav
fi

ls -la salida
