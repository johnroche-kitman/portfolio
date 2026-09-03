# Hudl clips for the two prototypes

Both prototypes read their video from this one folder, so a clip is stored once
and shows up in the Sessions Video tab, the Development goals tab and the
individual development plan.

- Local dev: each app symlinks `public/clips` here, so files are served at `/clips/…`
- Published: this folder sits at the site root, so files are served at
  `https://johnroche-kitman.github.io/portfolio/clips/…`

The path switch is the one line in `src/data/video.js`:

```js
export const CLIPS = import.meta.env.PROD ? '/portfolio/clips/' : '/clips/'
```

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

## File names

The prototype looks for these exact names. A file that is missing does not break
anything: the player shows a "Clip not imported yet" panel naming the file it
wanted, so you can see at a glance what still has to land.

### Full drill playback — whole team, uncut (5 files, 30 s to a few minutes each)

| File | Drill | Angle |
|---|---|---|
| `drill-01-full.mp4` | Rondo 4v2 | Tactical wide |
| `drill-02-full.mp4` | Breaking lines — 6v4 middle third | Tactical wide |
| `drill-03-full.mp4` | Wide overloads and crossing | High behind goal |
| `drill-04-full.mp4` | Counter-press transition | Tactical wide |
| `drill-05-full.mp4` | 11v11 phase of play | Tactical wide |

These stand in for a whole drill, so they can be the longest footage you have.
They do not have to run the full length shown in the UI.

### Individual clips from the session (12 files, 6–15 s each)

| File | Drill | Athlete | What it shows |
|---|---|---|---|
| `session-01.mp4` | Rondo 4v2 | Diallo | First-time switch out of the rondo |
| `session-02.mp4` | Rondo 4v2 | Bramwell | Receives on the half turn, plays through |
| `session-03.mp4` | Rondo 4v2 | Ferrante | Third-man run and return |
| `session-04.mp4` | Breaking lines | Ihenacho | Line-breaking pass into the ten |
| `session-05.mp4` | Breaking lines | Diallo | Splits the two pivots |
| `session-06.mp4` | Breaking lines | Docherty | Screens, intercepts, restarts |
| `session-07.mp4` | Wide overloads | Adeyemi | Beats the full back, cuts back |
| `session-08.mp4` | Wide overloads | Castellanos | First-time cross from the overlap |
| `session-09.mp4` | Wide overloads | McAllister | Left-foot finish at the near post |
| `session-10.mp4` | Counter-press | Ferrante | Wins it back inside five seconds |
| `session-11.mp4` | Counter-press | Okonkwo | Presses the near shoulder, forces the turnover |
| `session-12.mp4` | 11v11 phase | Fitzgerald | Early switch to the free side |

### Individual clips from games (6 files, 6–15 s each)

These never appear on the Video tab, which is session-scoped. They are what
makes a development goal look like a season's worth of evidence rather than one
training day.

| File | Game | Athlete | What it shows |
|---|---|---|---|
| `game-01.mp4` | v Riverside Athletic (H), 30 Aug | McAllister | Left-foot strike from the edge |
| `game-02.mp4` | v Northgate United (A), 16 Aug | McAllister | Left-foot volley from a cut back |
| `game-03.mp4` | v Riverside Athletic (H), 30 Aug | Diallo | Breaks the press with one pass |
| `game-04.mp4` | v Carrick Town (A), 23 Aug | Adeyemi | Takes the full back on the outside |
| `game-05.mp4` | v Riverside Athletic (H), 30 Aug | Castellanos | Overlap and first-time delivery |
| `game-06.mp4` | v Northgate United (A), 16 Aug | Docherty | Screens in front of the back four |

The descriptions are what the prototype prints beside each clip. They do not
have to match the footage exactly — if a clip shows something different, tell me
and I will reword the fixture rather than you re-cutting the video.

## Posters (optional)

`posters/<same name>.jpg` is used as the thumbnail and the video poster frame.
Without them the prototype draws a pale pitch instead, which is why the missing
posters are not an error. `transcode.sh` generates them.

## Nothing here is a real Hudl integration

The clips are static files. In the product these arrive over the Hudl API,
already trimmed and tagged, and the tags are what map a clip to a drill, an
athlete, a principle and a development goal. The prototype models that mapping
in `src/data/video.js` and plays local media behind it.
