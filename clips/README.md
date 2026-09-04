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

### Individual clips from the session (58 files, 6–15 s each)

Every athlete who took part in a drill has their own clip of it — that is how a
Hudl tag works, and it is what lets a coach filter the drill down to one player.
Fifty-eight is more than anyone is going to cut by hand, so treat it as tiered:

- **The twelve `session-NN.mp4` files are the priority.** They are the moments
  with something to say, and they carry the development-goal tags.
- **The forty-six `dN-NNN.mp4` files are optional.** Each shows the Hudl-
  watermarked placeholder until it lands, which reads correctly — the drill is
  complete either way, it just is not all playable yet.

If you would rather have fewer files and no placeholders, tell me how many you
can cut and I will trim the participant lists in `DRILL_PARTICIPANTS` to match.


**1. Rondo 4v2**

| File | Athlete and moment |
|---|---|
| `d1-397.mp4` | Ihenacho — keeps it under pressure |
| `d1-023.mp4` | Fitzgerald — plays out of the middle |
| `d1-191.mp4` | Castellanos — one-touch round the outside |
| `d1-234.mp4` | Adeyemi — presses in the middle |
| `session-01.mp4` | Diallo — first-time switch out of the rondo |
| `d1-584.mp4` | Okonkwo — switches the angle |
| `d1-120.mp4` | McAllister — keeps it under pressure |
| `d1-803.mp4` | Docherty — plays out of the middle |
| `d1-734.mp4` | Reeves — one-touch round the outside |
| `session-02.mp4` | Bramwell — receives on the half turn, plays through |
| `d1-559.mp4` | Ellery — presses in the middle |
| `session-03.mp4` | Ferrante — third-man run and return |

**2. Breaking lines — 6v4 middle third**

| File | Athlete and moment |
|---|---|
| `d2-316.mp4` | Bramwell — finds the pass through |
| `d2-521.mp4` | Ferrante — holds the line and steps |
| `d2-023.mp4` | Fitzgerald — receives between the lines |
| `d2-191.mp4` | Castellanos — plays round the block |
| `d2-234.mp4` | Adeyemi — presses the receiver |
| `session-04.mp4` | Ihenacho — line-breaking pass into the ten |
| `d2-416.mp4` | Kavanagh — finds the pass through |
| `d2-559.mp4` | Ellery — holds the line and steps |
| `session-05.mp4` | Diallo — splits the two pivots |
| `session-06.mp4` | Docherty — screens, intercepts, restarts |

**3. Wide overloads and crossing**

| File | Athlete and moment |
|---|---|
| `d3-584.mp4` | Okonkwo — attacks the back post |
| `d3-521.mp4` | Ferrante — overlaps and delivers |
| `d3-023.mp4` | Fitzgerald — holds the width |
| `d3-559.mp4` | Ellery — takes the defender on |
| `d3-887.mp4` | Diallo — arrives at the near post |
| `d3-316.mp4` | Bramwell — attacks the back post |
| `session-07.mp4` | Adeyemi — beats the full back, cuts back |
| `d3-734.mp4` | Reeves — overlaps and delivers |
| `d3-397.mp4` | Ihenacho — holds the width |
| `session-08.mp4` | Castellanos — first-time cross from the overlap |
| `session-09.mp4` | McAllister — left-foot finish at the near post |

**4. Counter-press transition**

| File | Athlete and moment |
|---|---|
| `d4-887.mp4` | Diallo — first to react on the turnover |
| `d4-803.mp4` | Docherty — closes the outlet |
| `d4-234.mp4` | Adeyemi — presses from behind |
| `d4-120.mp4` | McAllister — wins the second ball |
| `d4-023.mp4` | Fitzgerald — cuts the switch |
| `d4-191.mp4` | Castellanos — first to react on the turnover |
| `d4-397.mp4` | Ihenacho — closes the outlet |
| `d4-316.mp4` | Bramwell — presses from behind |
| `d4-559.mp4` | Ellery — wins the second ball |
| `d4-416.mp4` | Kavanagh — cuts the switch |
| `session-10.mp4` | Ferrante — wins it back inside five seconds |
| `session-11.mp4` | Okonkwo — presses the near shoulder, forces the turnover |

**5. 11v11 phase of play**

| File | Athlete and moment |
|---|---|
| `d5-887.mp4` | Diallo — finds the free side |
| `d5-397.mp4` | Ihenacho — rotates and receives |
| `d5-803.mp4` | Docherty — covers behind the press |
| `d5-234.mp4` | Adeyemi — breaks the line |
| `d5-584.mp4` | Okonkwo — holds shape through the phase |
| `d5-120.mp4` | McAllister — finds the free side |
| `d5-191.mp4` | Castellanos — rotates and receives |
| `session-12.mp4` | Fitzgerald — early switch to the free side |
| `d5-316.mp4` | Bramwell — covers behind the press |
| `d5-521.mp4` | Ferrante — breaks the line |
| `d5-734.mp4` | Reeves — holds shape through the phase |
| `d5-559.mp4` | Ellery — finds the free side |
| `d5-416.mp4` | Kavanagh — rotates and receives |

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
Without one the prototype falls back to the placeholders below, which is why a
missing poster is not an error. `transcode.sh` generates them.

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
