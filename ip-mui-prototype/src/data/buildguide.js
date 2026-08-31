/**
 * Build reference for the prototype.
 *
 * One entry per surface: what it is, which MUI components it is made of, and the
 * things that cost time when you build it for real. `custom` lists anything on the
 * surface that is not an MUI component, because that is where the estimate hides.
 */

export const ENVIRONMENT = [
  ['@mui/material', '5.18.0', 'Pinned as ^5.15.20. v5, not v6 — the `sx` and theme APIs below assume it.'],
  ['@mui/icons-material', '5.18.0', 'Every icon on every surface comes from here. No icon fonts.'],
  ['@mui/x-data-grid', '7.29.13', 'MIT tier. No Pro features are used: no tree data, no row grouping, no Excel export.'],
  ['@emotion/react', '11.11.4', 'MUI v5 styling engine. Required peer.'],
  ['react', '18.3.1', 'Nothing here needs 19.'],
  ['react-router-dom', '6.24.0', 'HashRouter, only because the prototype is served from GitHub Pages.'],
]

export const CONVENTIONS = [
  ['Theme is the source of truth',
    'Type scale, the filled-input styling and table header styling all live in the theme. Do not restyle them per page — if a heading looks wrong, the theme is wrong.'],
  ['Buttons default to contained',
    'The theme sets `variant: "contained"` as the MuiButton default, so every secondary action must state `variant="outlined"` or `variant="text"` explicitly. Forgetting this is the single most common mistake in this codebase.'],
  ['One primary per view',
    'Exactly one contained button per surface. Everything else is outlined or text. A drawer or dialog counts as its own view, so its Save may be contained.'],
  ['Filled inputs keep the underline',
    'Top two corners rounded, bottom rule only. Set once in the theme via MuiFilledInput; never re-implement.'],
  ['Page background is white',
    'Not the default grey. Panels and cards get their separation from borders, not fills.'],
  ['Icons are outlined variants',
    'Prefer `SettingsOutlined` over `Settings`, matching the live product.'],
]

export const AREAS = [
  {
    id: 'calendar',
    name: 'Calendar',
    blurb: 'Twelve surfaces. MUI does have a calendar — the X Scheduler, covered directly below — but this prototype predates the decision to use it, so the month, week and day grids are laid out by hand over Box and Paper. Read the Scheduler note before building any of them by hand. Everything hung off the grid is stock MUI either way.',
    option: {
      title: 'Before you build any of this: MUI X Scheduler',
      status: 'Beta — v9.0.0-beta.10 at the time of writing',
      intro: 'MUI now ships a scheduler, which would replace the month, week, day and agenda views outright rather than hand-laying them out. It is a genuine candidate and worth a timeboxed spike, but it is not a decision to take on paper. Checked August 2026.',
      points: [
        ['Recurring events are Premium-only', 'The Community package (@mui/x-scheduler, MIT) gives you the four views, resources, drag and drop, resizing and theming. Recurrence, exception dates and DST-aware recurrence are all in @mui/x-scheduler-premium. iP\'s calendar is built on recurrence — the live schedule is wall-to-wall "Every day, until 31st October". So the free tier is effectively out, and Premium is a per-developer annual licence somebody has to price.'],
        ['Spike the gameweek bands first', 'This is the question that decides it. The bands span several day columns and are drawn in the all-day lane, and the GD+/- marker is per day. There is a slots API and most slots take a callback slotProps carrying the current state, so it may be reachable — but a decoration spanning multiple columns is exactly what a scheduler tends not to expose. If it cannot be done, the idea fails, because those markers are why coaches use this calendar.'],
        ['Drag to create is not documented', 'The drag-interactions page covers dragging to reschedule, resizing, and dragging between the calendar and external containers. Creating an event by dragging empty space is not mentioned. iP has it and people use it.'],
        ['The event editor is not customisable yet', 'The docs say so directly. iP creates events on a full page with squads, type, location, recurrence and athlete and staff selection, so you would need to suppress the built-in form and route to your own. Probably possible, unproven.'],
        ['Filtering is marked Planned, and that is fine', 'iP\'s filter rail can filter the events array before it is handed to the calendar. This one is not a blocker.'],
        ['Weigh the actual saving', 'The Calendar is already one of the more converted areas in the audit and the version in this prototype works. You would be trading working code for lower maintenance and things you do not have today: timezone and DST handling, virtualisation, resources. Those are real, but they are an upgrade rather than a conversion saving. The 0% areas are Medical and the session drawers, and the scheduler does nothing for those.'],
      ],
      verdict: 'Do not write it into the plan yet. One spike answers it: can you draw a multi-day band and a per-day GD marker through the slots API? A day or two settles it. If yes, it is a strong option for a later phase once it leaves beta. If no, keep the hand-built grid — it is about 470 lines and already does everything.',
      links: [
        ['Scheduler overview', 'https://mui.com/x/react-scheduler/'],
        ['Drag interactions', 'https://mui.com/x/react-scheduler/event-calendar/drag-interactions/'],
        ['Custom slots and subcomponents', 'https://mui.com/x/common-concepts/custom-components/'],
      ],
    },
    files: [
      ['pages/calendar/CalendarPage.jsx', 'Toolbar, view switching, settings drawer, and the state every view reads.'],
      ['pages/calendar/views.jsx', 'Month, Week, Day and List, plus the grid maths and the drag selection.'],
      ['pages/calendar/CalendarFilters.jsx', 'The left filter rail.'],
      ['pages/calendar/EventPopover.jsx', 'Click an event.'],
      ['pages/calendar/QuickCreatePopover.jsx', 'Drag a range, then pick a type.'],
      ['pages/calendar/DatePickerMenu.jsx', 'Click the date in the toolbar.'],
    ],
    surfaces: [
      {
        title: 'Calendar toolbar',
        route: '/calendar',
        what: 'The strip above every view: filters toggle, Today, prev/next, the date label, settings, the view switcher and Add.',
        mui: ['Box', 'Badge', 'Button', 'IconButton', 'Tooltip', 'Menu', 'MenuItem'],
        icons: ['FilterList', 'ChevronLeft', 'ChevronRight', 'ArrowDropDown', 'Add', 'SettingsOutlined'],
        notes: [
          'The filter count sits in a `Badge` wrapped around the Show filters button, with `invisible={!count}` so a zero never renders.',
          'The date label is a text Button with an `ArrowDropDown` end icon, not a heading — it opens the date popover, so it has to be focusable and announce as a button.',
          'View switcher and Add are both `Menu` anchored on their button. Add routes to `/events/new?type=Game|Session|Event` rather than opening a panel: creating an event is a full page in this product, not a drawer.',
          'Add is the toolbar’s only contained button.',
        ],
      },
      {
        title: 'Month view',
        route: '/calendar → Month',
        what: 'Six week rows of day cells, each listing that day’s events compactly.',
        mui: ['Box', 'Paper', 'Typography', 'Chip'],
        notes: [
          'CSS Grid, seven columns, over `Box`. This is hand-laid-out because the prototype does not use the X Scheduler, not because MUI lacks a calendar — see the Scheduler note at the top of this section before rebuilding it this way.',
          'Events render as the shared `EventBlock` in `dense` mode: one line, no times.',
          'Day cells carry the gameweek band and the GD+/- marker when those settings are on.',
        ],
      },
      {
        title: 'Week view',
        route: '/calendar → Week (default)',
        what: 'Seven day columns over an hour grid, with an all-day lane above.',
        mui: ['Box', 'Paper', 'Typography', 'Chip'],
        notes: [
          'The grid is fixed: `HOURS` runs 06:00–22:00, `ROW_H = 44px` per hour, `GRID_START = 6 * 60`. Positions come from `minToY(m) = ((m - GRID_START) / 60) * ROW_H`.',
          'Overlapping events are laid out by `layoutDay()`: it sorts by start, groups events into clusters that overlap, assigns each the lowest free column, and gives every event in a cluster the same column count. Without this, concurrent events stack on top of each other.',
          'Event fills use `lighten(TYPE_COLOR[type], 0.88)` from `@mui/material/styles`. Do not use hex alpha — two overlapping blocks then show through each other, which is exactly the bug this replaced.',
          'The all-day lane is a separate row above the scrolling grid and is where gameweek bands are drawn.',
        ],
      },
      {
        title: 'Day view',
        route: '/calendar → Day',
        what: 'The week view narrowed to a single column.',
        mui: ['Box', 'Paper', 'Typography'],
        notes: [
          'Same component family as Week, called with `dayIndex`. Keep them sharing `DayColumn` — the grid maths is the part you do not want two copies of.',
        ],
      },
      {
        title: 'List view',
        route: '/calendar → List',
        what: 'The week as a vertical list grouped by day.',
        mui: ['Box', 'Paper', 'Typography', 'Chip'],
        notes: [
          'No time grid, so none of the positioning maths applies. This is the cheapest of the four views to build.',
        ],
      },
      {
        title: 'Event block',
        route: 'Every view',
        what: 'The event itself: coloured fill, a darker left spine, title, time, and a completion tick.',
        mui: ['Box', 'Typography'],
        icons: ['CheckBox', 'CheckBoxOutlineBlank'],
        notes: [
          'Left spine is `borderLeft: 3px solid TYPE_COLOR[type]`, fill is the lightened version of the same colour. Hover lightens less (0.8) rather than changing hue.',
          'It stops propagation on BOTH `click` and `mousedown`. Click alone is not enough: mousedown starts the drag-to-create selection, so opening an event would also paint a new slot behind it.',
          'The completion tick reflects the session’s Complete toggle on the session page, and shows in all four views.',
        ],
      },
      {
        title: 'Gameweek bands and GD markers',
        route: 'Every view, toggled in settings',
        what: 'Yellow bands spanning the days of a gameweek, and GD+/- labels counting towards and away from a game.',
        mui: ['Box', 'Typography'],
        notes: [
          'Bands are absolutely positioned over the day columns and can span several days, so they are drawn once per row rather than per cell.',
          'The GD offset is two-sided: days before a game count down (GD-3, GD-2, GD-1) and days after count up (GD+1). A day between two games takes whichever game is nearer.',
          'Both are driven by the two checkboxes in Calendar settings. Test with July 2026 or earlier — the current window may not contain a gameweek.',
        ],
      },
      {
        title: 'Drag to create',
        route: 'Drag any empty range in Week or Day',
        what: 'Dragging paints a slot, and on release a small popover offers Session, Game or Event.',
        mui: ['Popover', 'ToggleButtonGroup', 'ToggleButton', 'Box', 'Typography'],
        notes: [
          'Drags snap to 15 minutes: `SNAP = 15`, and `yToMin()` rounds to it.',
          'The painted slot stays visible while the popover is open. That is deliberate — without it the user loses track of what they selected.',
          'The popover is anchored on a virtual element (a `getBoundingClientRect` stub for the painted range), because there is no real DOM node to anchor to. This is a supported MUI pattern, not a hack.',
          'Selection is suppressed while a slot popover is already open, and while the pointer is over an existing event.',
        ],
      },
      {
        title: 'Event popover',
        route: 'Click any event',
        what: 'Summary of the event with links through to it.',
        mui: ['Popover', 'Box', 'Button', 'Divider', 'Link', 'Typography'],
        icons: ['Repeat'],
        notes: [
          'Anchored on the clicked block. The `Repeat` icon only shows for a recurring event.',
          '“More details” routes to the session page; this popover never edits.',
        ],
      },
      {
        title: 'Calendar settings',
        route: '/calendar → cog',
        what: 'Right drawer: marker visibility and the calendar subscription link.',
        mui: ['Drawer', 'Box', 'Typography', 'Divider', 'FormControlLabel', 'Checkbox', 'TextField', 'IconButton', 'Link', 'Button'],
        icons: ['Close', 'RefreshOutlined', 'ContentCopyOutlined'],
        notes: [
          'The checkboxes edit a `draft` copy and only apply on Save, matching the live drawer. Opening the drawer re-seeds the draft from the applied state, so cancelling by closing discards cleanly.',
          'The subscription field is a read-only `TextField` with refresh and copy icon buttons beside it.',
          'Save is the drawer’s only contained button. “Advanced settings →” is a `Link component="button"`, which keeps it keyboard-reachable without looking like an action.',
        ],
      },
      {
        title: 'Filters rail',
        route: '/calendar → Show filters',
        what: 'A left rail of grouped multi-selects: squads, event types, session types, competitions, oppositions, athletes, staff, venues, locations, labels.',
        mui: ['Accordion', 'AccordionSummary', 'AccordionDetails', 'Autocomplete', 'TextField', 'Checkbox', 'FormControlLabel', 'Chip', 'IconButton', 'Link', 'Box', 'Typography'],
        icons: ['ExpandMore', 'Close', 'Search'],
        notes: [
          'Each group is an `Autocomplete` with `multiple`, and the search sits inside the input — MUI does this natively. Do not build a dropdown with a search field inside it; that pattern was removed from this codebase once already.',
          'Selected values render as `Chip`s with `limitTags` so a long selection does not push the rail open.',
          'The rail is inline in the flex row, not a `Drawer`. It pushes the grid rather than covering it, so the calendar stays readable while filtering.',
        ],
      },
      {
        title: 'Date picker',
        route: '/calendar → the date label',
        what: 'Month grid with a year/month mode and prev/next arrows.',
        mui: ['Popover', 'Box', 'IconButton', 'Typography'],
        icons: ['ChevronLeft', 'ChevronRight', 'ArrowDropDown'],
        custom: 'Hand-built day grid.',
        notes: [
          'This is the one control on the Calendar that should NOT be built as it stands. `@mui/x-date-pickers` is not a dependency of the prototype, so the day grid is hand-rolled.',
          'For the real build, add `@mui/x-date-pickers` and use `DatePicker` / `DateCalendar`. Measured on the live product, the equivalent picker on the Daily Status Report is already 99% MUI — so this is a solved problem elsewhere in the codebase.',
        ],
      },
    ],
  },
  {
    id: 'event-editor',
    name: 'Create and edit an event',
    blurb: 'One page authors all three event types. In the live product these are three separate sliding panels off the calendar Add menu; here they are a single page with conditional sections, because the game form alone runs to four sections and twenty-odd fields. The shared shell is most of the work; the three after it cover only what each type adds on top.',
    files: [
      ['pages/events/EventEditor.jsx', 'The whole thing — shell and all three type variants. 359 lines.'],
      ['data/events.js', 'Event types, repeat options, competitions, formats, venues, surfaces and the rest of the option lists.'],
      ['components/AthleteCell.jsx', 'Rendered per option inside the attendance Autocomplete.'],
    ],
    surfaces: [
      {
        title: 'Create / edit — the shared shell',
        route: '/events/new?type=Game|Session|Event, /events/:id',
        what: 'Everything common to all three types. Read this first — it is most of the work. The three entries after it cover only what each type adds.',
        mui: ['Paper', 'TextField', 'Autocomplete', 'Checkbox', 'Chip', 'Divider', 'IconButton', 'Button', 'Box', 'Typography'],
        icons: ['ArrowBack', 'Delete', 'Upload', 'Add'],
        notes: [
            'In the live product these are three sliding panels off the calendar Add menu. Here it is a full page, deliberately: the game form alone runs to four sections and twenty-odd fields, which is more than a drawer should hold. If you keep the panel, you inherit the reason it scores badly today.',
            'Build it as ONE component with conditional sections keyed off `type`, not three forms. The shared surface is large — squad, date, start time, duration, timezone, repeats, location, attendance, attachments, notifications — and the differences are small enough to read at a glance.',
            '`type` comes from `?type=` when creating and from the loaded event when editing. `isNew` drives the heading ("New session" against the event title) and whether Delete renders.',
            'Header is sticky at `top: 56` to sit under the app bar, and holds Back, Delete (edit only), Cancel and the single contained Create/Save.',
            'Delete is a `variant="text" color="error"` button, not a contained red one. Destructive does not mean primary.',
            'Fields sit on a two-column grid via a local `Section` and `Full` helper — `Full` spans both columns for things like Athletes and Description. Worth lifting into the shared parts file when a second page needs it.',
            'Repeats is a select of presets; picking Custom opens a `Dialog` with an interval field, a day-of-week `ToggleButtonGroup`, and a `RadioGroup` for how it ends — never, on a date, or after N times with an `InputAdornment` reading "Times". This is the most intricate control on the page.',
            'Attendance is an `Autocomplete multiple` rendering a `Checkbox` and the shared `AthleteCell` per option, with `disableCloseOnSelect` and `isOptionEqualToValue` comparing ids. Selected athletes render as `Chip`s through `renderTags`.',
            'Attachments is a dashed drop zone plus a Title/Link pair with an outlined Add button; added links become deletable `Chip`s.',
            'Notifications is three rows of Email/Push checkboxes plus a reminder select. Identical across all three types.',
        ],
      },
      {
        title: 'Create / edit — Session',
        route: '/events/new?type=Session',
        what: 'The shared shell plus a workload mode, a session type, and game-day context.',
        mui: ['ToggleButtonGroup', 'ToggleButton', 'TextField', 'InputAdornment'],
        notes: [
          'Opens with a Workload section the other two do not have: an exclusive `ToggleButtonGroup` choosing how load is attributed (Squad loading and the alternatives).',
          'Details adds a Session type select and keeps the free-text Title.',
          'Additional details carries Game Day +/- and the shared conditions block — surface type, surface quality, weather, and temperature with a °C `InputAdornment`. Surface Type is the only required one; the asterisk carries that, so do not repeat it in helper text.',
          'Live measurement: 26.9% MUI across 320 elements.',
        ],
      },
      {
        title: 'Create / edit — Game',
        route: '/events/new?type=Game',
        what: 'The heaviest of the three. The shared shell plus a full Game details section.',
        mui: ['TextField', 'ToggleButtonGroup', 'ToggleButton', 'InputAdornment', 'FormControlLabel', 'Checkbox'],
        notes: [
          'No Title field. A game is named by its fixture — team against opposition — so the heading comes from those rather than free text. Do not add a Title box back in.',
          'The app bar reads Schedule rather than Calendar for this type, matching where games are managed in the live product.',
          'Game details is its own section: competition, competition type, team and team score, opposition and opposition score, round, venue, duration, format and fixture rating, then the shared conditions block.',
          'Periods are a small exclusive `ToggleButtonGroup` (Split Evenly against manual) with a minutes field beside it carrying a "min" adornment. It sets how many periods the game has and how long each runs, so it is the one field here that other parts of the product read back.',
          'Additional details adds a "Create turnaround marker" checkbox, which drives the GD markers on the calendar.',
          'Live measurement: 21.6% MUI across 398 elements — the largest and least converted of the three.',
        ],
      },
      {
        title: 'Create / edit — Event',
        route: '/events/new?type=Event',
        what: 'The lightest of the three, and the only one with staff visibility.',
        mui: ['TextField', 'RadioGroup', 'Radio', 'FormControl', 'FormLabel', 'FormControlLabel'],
        notes: [
          'Details adds an Event Type select and puts Description inline rather than in its own section — this is the one type without a separate Description block.',
          'Attendance gains a Staff visibility `RadioGroup`, which neither the session nor the game has. It is passed down as `showVisibility` rather than duplicating the attendance section.',
          'No workload, no conditions, no game details. If you are building the three in order, do this one first: it exercises the shared shell with the fewest branches, so anything that breaks is the shell rather than the variant.',
          'Live measurement: 31.0% MUI across 258 elements — the most converted of the three, and the smallest.',
        ],
      },
    ],
  },
]
