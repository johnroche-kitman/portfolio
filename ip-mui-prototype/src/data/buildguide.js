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
    blurb: 'Ten surfaces. The calendar grid itself is the one part of the product MUI does not give you — there is no MUI calendar component, so the month, week and day views are laid out by hand over Box and Paper. Everything hung off the grid is stock MUI.',
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
          'CSS Grid, seven columns, over `Box`. There is no MUI calendar — do not go looking for one.',
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
]
