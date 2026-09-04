# Hudl video for the two prototypes

Both prototypes read their video from this one folder, so it is stored once and
shows up in the Sessions Video tab, the Development goals tab and the individual
development plan.

- Local dev: a vite middleware serves this folder at `/clips/…`, byte ranges and all
- Published: this folder sits at the site root, so files are served at
  `https://johnroche-kitman.github.io/portfolio/clips/…`

The path switch is the one line in `src/data/video.js`:

```js
export const CLIPS = import.meta.env.PROD ? '/portfolio/clips/' : '/clips/'
```

## One recording, not sixty-four clips

`drill-video.mp4` is the whole thing. Every clip on these pages is a **window**
into it — an in point and an out point — which is how Hudl actually holds them:
the analyst records the session once and a clip is a pair of marks into that
recording. Nothing is cut per clip, and the player's scrubber is scoped to the
window so a twelve-second clip reads as twelve seconds rather than as a slice of
a long file.

The five drills take equal segments of the recording in their running order, and
a drill's clips are spread across its own segment in the order they happened. So
a clip from late in the session plays from late in the recording, and the clips
of one drill are moments inside that drill's stretch of it.

### Swapping the recording

Drop a different file in as `drill-video.mp4` and update one line:

```js
export const RECORDING = { file: 'drill-video.mp4', seconds: 150 }
```

`seconds` is nominal — the player reads the media's real duration and scales
every window by the ratio, so even leaving it stale only costs you the labels.
Longer footage simply spreads the same windows further apart, which is worth
having: at 150 s each drill gets 30 s and its ten-plus clips overlap heavily.
At the full 9 m 50 s they barely overlap at all.

### The current file is avconvert's work, not ffmpeg's

`drill-video.mp4` is 150 s at 1280x720, faststart, 61 MB. It was cut with macOS
`avconvert`, which has no bitrate control — its presets are quality-locked, so
360p costs the same as 720p (~3.3 Mbps) and the full 9 m 50 s source came to
240 MB, over GitHub's 100 MB per-file limit.

With ffmpeg the whole recording fits comfortably:

```bash
brew install ffmpeg
ffmpeg -i ~/Desktop/drill-video.mp4 -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 26 -preset medium -c:a aac -b:a 96k -movflags +faststart \
  clips/drill-video.mp4
```

That lands around 55-60 MB for the full 590 s. Then set `RECORDING.seconds` to
590 and every window spreads out on its own.

## Encoding

| | |
|---|---|
| Container | MP4 |
| Video | H.264, High profile, `yuv420p` |
| Audio | AAC (or none — the prototype never unmutes) |
| Resolution | 1280 x 720 |
| Bitrate | 2–4 Mbps |
| Target size | under 5 MB per short clip, under 40 MB per full drill |

`yuv420p` matters: H.264 in 4:2:2 or 4:4:4 will not decode in Safari or Chrome,
and the page will show the "Clip not imported yet" state instead of the video.

If Hudl gives you `.mov`, ProRes, or anything heavier, drop the originals in and
transcode with `bash clips/transcode.sh <folder>` (needs ffmpeg: `brew install ffmpeg`).

## Posters (optional)

`posters/drill-video.jpg` is used as the video's poster frame if it exists.

Thumbnails do not use it: every tile shows one of the Hudl-watermarked
placeholders below, keyed off the clip's `file` name. That is deliberate — 58
video elements each pulling metadata out of a 61 MB file to render a thumbnail
would be far more expensive than six small JPEGs, and the watermark makes it
obvious the grid is a stand-in.

## Placeholders

`placeholders/hudl-01.jpg` … `hudl-06.jpg` are six training stills, each shown
under a scrim with the Hudl logo watermarked over it. They stand in for any clip
whose media has not arrived yet.

Which still a clip gets is derived from its file name, so a clip always shows
the same frame — a grid that reshuffled its images on every render would look
broken rather than pending. Nothing needs to be configured: as soon as a real
`.mp4` and its poster land, that clip stops using a placeholder.

## Nothing here is a real Hudl integration

The clips are static files. In the product these arrive over the Hudl API,
already trimmed and tagged, and the tags are what map a clip to a drill, an
athlete, a principle and a development goal. The prototype models that mapping
in `src/data/video.js` and plays local media behind it.
