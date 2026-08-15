# The Glass System

A reusable dashboard design language — **neutral cool-grey scene, teal-green
frosted sheets** (two tones, always), highlighter yellow-green accent, airy
editorial type at generous scale. Reference implementation (shipped, live
app-wide): `app/(app)/overview/` for the hero sheet pattern, plus the
cascade-final glass overrides in `app/globals.css` that apply it to every
other page and the topbar/rail chrome (Watchtower). Written so it can be
lifted onto any product.

---

## 1. The one idea

**Everything lives on stacked sheets of frosted glass floating over a muted
scene.** Not a grid of cards — a few large translucent panes (hero pane,
stats pane, reports pane), each with its own visible rounded corners, rising
over the backdrop like layered frosted slabs. Inside a pane, zones divide
with *hairlines* and *tint changes* (a cooler, slightly darker glass) —
never borders-plus-shadows-plus-fills. The moment you add white boxes on top
of the scene, the illusion dies and it becomes another card dashboard.
Fix the scene with `background-attachment: fixed` so the glass visibly
slides over it on scroll.

## 2. Scene (the backdrop)

The glass only reads as glass if there is something behind it to blur — and
it only reads as *two tones* if the scene is a different color family than
the sheets. **Scene = neutral cool grey. Glass = teal-green.** Never let
them converge into one sage wash.

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(1100px 640px at 80% -14%, #b3bcba 0%, transparent 58%),
    radial-gradient(800px 560px at 0% 100%, #969fa0 0%, transparent 55%),
    linear-gradient(160deg, #a7aeae 0%, #9da6a5 52%, #a4acaa 100%);
}
```

- Low contrast, no pure white and no saturated color in the scene itself.
- A photo or abstract render also works (the originals use a room photo) as
  long as it's desaturated, grey-leaning and darker than the sheet.
- **Never `background: … ; background-attachment: fixed` on `body` itself.**
  Combined with `backdrop-filter` on many stacked sheets, Chromium repaints
  the entire fixed background on every scroll frame — janky enough to
  swallow the first click on nav links and buttons (symptom: "everything
  needs to be clicked twice"). A fixed pseudo-element behind the content
  (`body::before`, `z-index: -1`) looks identical and costs nothing on
  scroll. Pair it with real `<Link>`/client-router navigation, not plain
  `<a>` tags, for the top nav — full page reloads read as the same "double
  click" symptom.

## 3. The sheet (glass recipe)

```css
background:
  linear-gradient(155deg, rgba(206,228,230,.30) 0%,   /* bluish cast, top-left */
                          rgba(214,236,224,.18) 45%,
                          rgba(222,238,228,.30) 100%), /* greener, bottom */
  rgba(224, 238, 232, .46);
backdrop-filter: blur(32px) saturate(140%);
border: 1px solid rgba(255, 255, 255, .6);
border-radius: 30px;
box-shadow: 0 36px 80px rgba(28, 40, 42, .24),
            inset 0 1px 0 rgba(255, 255, 255, .65);
```

- A few large sheets per screen, stacked with breathing room between them
  so corners stay visible. Radius is generous (28–34px).
- The internal gradient matters: a faint **bluish cast top-left drifting
  greener toward the bottom** keeps the pane from reading as one flat tint.
- The **inset top highlight** is what sells the material — don't skip it.
- Secondary sheets (stats band, reports) use a slightly lighter, more
  neutral tint — `rgba(228,240,236,.42)` over a calmer gradient. Columns
  inside divide with `1px rgba(255,255,255,.5)` hairlines, right border
  only, none on the last column.
- Interior sub-surfaces (rail hover, tooltip, active pill) are `#fff` or
  near-white — white is reserved for *small* raised elements, never large
  containers.
- **Use the width.** Content canvas up to ~1500px; don't leave a dead
  gutter between the rail and the right edge of the screen.

## 4. Color

| Role | Value | Rules |
|---|---|---|
| Ink | `#142522` | Cool near-black. All headings, key numbers. |
| Muted | `#404d4a` | Body copy, labels. |
| Faint | `#5b6a66` / `#6e7d78` | Micro-labels, ticks, ranges. |
| **Highlighter** | `#eafd35` (fills), `#e2f463` (strokes/lines) | THE accent. Yellow-green like a text highlighter — not yellow, not lime-green. |
| Data-neutral | `rgba(255,255,255,.88)` | Bars, tracks, secondary series. |
| Data-muted | `#b1c6a2` | Tertiary series dots. |
| Soft green | `#c9dc7c` | Chart area fills, soft accent surfaces. |
| Text accent | `#1e6f5c` (deep teal) | Links/accent TEXT on light ground — the highlighter itself is unreadable as text. Not olive, not the scene teal — a distinct, saturated deep teal so it reads as a clickable accent rather than another neutral. |
| Coral (hot) | `#c25446` | High threat/urgency numbers and statuses. Text/chip level only. |
| Amber (warm) | `#a3701f` | Mid threat, "medium" statuses. Real amber — never a muddy brown. |
| Sky (info) | `#4f80a3` | Informational categories/statuses. Text/chip only. |
| Sand (neutral tag) | `#837d6b` | Low-priority category chips. |
| Category chips (extended) | olive `#7d941f`, green `#3f8f68`, violet `#8a5fa8` (plus coral/amber/sky above) | One hue per content category (Pricing, Ads, Hiring, News, Product…) so the rail and badges are scannable at a glance. Applied as **tinted glass, never solid fill**: `rgba(hue, .16)` background + the saturated hue as text color. A solid-filled chip reads as a sticker, not glass. |

**Highlighter discipline:** the highlighter is for *your* energy — the
primary CTA, the momentum curve, the highlighted bar, gauge fills, the
notification dot, the logo mark. It is NOT a semantic color: never use it
to say "high" or "warning" (a highlighted word reads as celebration, not
danger). Semantics get the muted supporting hues — coral for hot, sky for
info — at text/chip size only, never as large fills. Dark text on
highlighter buttons, always. On-glass "hover surface" is white, not accent.

## 5. Type (err generous — smushed kills this system)

- One geometric sans (this repo: Plus Jakarta Sans) — the *weights* do the
  design work, not multiple families.
- **Hero numerals: large and LIGHT.** ~74px at weight 400, tight
  letter-spacing (−.045em). The thin big number is the signature. Never
  bold the hero number.
- Greeting: 24px / 800 + 13.5px muted sub. Section sub-titles: 16px / 800.
  Module headers: 12px / 700 muted. Table/list rows: 13–13.5px / 700 with
  10px sub-labels. Body copy: 12.5–13px / 500–600.
- Micro-labels: 10px, 700, uppercase, letter-spacing .04–.06em, faint.
- Padding is part of the type: band columns ~34px horizontal, rows 9–11px
  vertical, legends 5.5px per row. When in doubt, add air — the fastest
  way to ruin this look is cramming ("everything looks smushed" is the
  failure mode).
- Greeting is a UI element: bold short line + muted sub ("Hey, {name}! 👋 /
  your scouts brought back N reports…"), right-aligned opposite the
  profile block.
- **Page titles (h1) get the same generous scale as everything else** —
  ~34px / 800 weight, tight letter-spacing (−.03em). A page title sized
  like body copy is the single most common "why does this look boring"
  complaint; it should compete visually with the hero numeral, not sit
  quietly above the sheet.

## 6. Chrome (the sheet's own navigation)

- **Top bar is a floating frosted PILL above everything, not a full-width
  bar and not embedded inside the first sheet.** `position: sticky` on a
  transparent wrapper, with the actual visible bar (`border-radius: 999px`,
  same glass recipe as a sheet but lighter/more opaque, its own drop
  shadow) sitting centered with margin on both sides — content scrolls
  underneath it. Getting this wrong (stretching it edge-to-edge as its own
  full-bleed row) is the single most common regression when porting; it
  should look like it's floating, the same way a single sheet does.
  Contents: logo (rounded-square accent mark with a dark dot + lowercase
  wordmark) · center pill nav (active = solid white pill with a soft
  shadow; inactive = bare muted text) · right cluster: frosted round icon
  buttons (34px circle, `rgba(255,255,255,.5)`) — gear, bell with an accent
  dot — then a dark circular avatar.
- **No white outline border on large frosted panels** (feed cards, module
  panels, forms, tables). Earlier drafts put a `1px solid rgba(255,255,255,.6)`
  ring on every surface — on anything panel-sized it reads as a bordered
  box, not glass; drop it there and let the inset top highlight (§3) plus
  the drop shadow carry the material. A thin border is still fine, even
  correct, on genuinely *small* raised elements (the topbar pill, circular
  rail buttons, small chips) where it reads as an edge-lit rim rather than
  an outline.
- **Icon rail:** individual frosted circle buttons (~46px) fixed to the
  viewport's left edge (they follow scroll), a soft vertical hairline
  separating them from content. The rail must explain itself: a small
  vertical caption above it (e.g. "SIGNALS"), a divider between the
  "all" button and the rest, and a dark label pill that slides out on
  hover (`::after { content: attr(data-label) }`). Never a boxed sidebar.
  On mobile it collapses away.
- **Profile row** under the top bar: avatar + micro-label role + bold name,
  the accent pill button, a ghost search circle; greeting on the right plus
  a ghost refresh circle at the far edge.
- One page nav (the pill nav) + one filter surface (the rail). Never add a
  second menu that duplicates either.

## 7. Chart anatomy (the signature module)

The hero chart is **needle bars + a momentum curve**, not fat bars:

1. **Needles:** one thin bar per period (4–5px wide, rx ≈ half-width),
   `rgba(255,255,255,.85)`. Zero periods keep a 3–4px stub. The single
   highlighted period is the only accent-colored needle.
2. **Momentum curve:** a smoothed line (Catmull-Rom → bézier) of the moving
   average, accent stroke ~2.4px, with a soft accent area fill under it
   (`rgba(201,220,124,.34)`) reaching the baseline. The curve tells the
   story; the needles are texture.
3. **Period labels ABOVE the chart** (W1…/months), micro-label style.
   **Y-ticks on the RIGHT edge**, faint.
4. **Tooltip flag** pinned to the peak: near-white rounded card
   (`#fdfef2`, drop shadow), a dashed leader line down to the needle,
   micro-label date row, then value rows each led by a small colored
   square (accent square first).
5. Left of the chart sits the **info column**: icon-in-circle, module title,
   two lines of copy with one bold inline link, the thin hero numeral, then
   a **value-row legend** — marker + label left, value right-aligned bold
   (`— Momentum … 6/wk`). Legends are rows with numbers, never bare dots.

## 8. Stats band (bottom zone)

- One cooler glass strip, 3–5 columns, hairline-divided. Each column:
  micro-label header row (+ optional `↗` link), bold sub-title, then ONE
  visualization:
  - **Table column:** micro uppercase column headers, rows of avatar +
    name + stacked sub-label + two right numeric columns.
  - **Gauge column:** big % numeral, half-circle gauge (white track, accent
    fill, round caps), centered; a hairline footer row with a
    label/value pair.
  - **Mini-bars column:** tiny legend row, rounded bars (white = empty,
    accent = active), date-range row underneath.
  - **Ring column:** small donut (accent arc) beside label/value rows; one
    clamped line of prose max.
- No card backgrounds inside the band. The dividers are the layout.

## 9. Interactivity (nothing is a screenshot)

A pane that doesn't respond reads as a mockup. Minimum bar:

- **The hero chart is live:** the tooltip flag + crosshair follow the
  cursor to the nearest period (client component, `mousemove` → nearest-x),
  defaulting to the peak. `cursor: crosshair` on the plot.
- Every row, chip, pill, icon button has a hover surface (white lift).
- Filter chips (per-entity focus) actually refilter the data.
- The icon rail: **individual frosted circle buttons, fixed to the viewport
  so they follow scroll**, each highlighting on hover like the bell button,
  with a soft vertical hairline separating rail from content. Never a
  boxed sidebar — and never duplicate the same filters as a second menu
  elsewhere on the page (one filter surface, one page nav, that's it).

## 10. Voice & gamification (optional layer)

The system carries a light game framing well because the material already
feels like a control panel. Rules: rename the *labels*, never distort the
*numbers*. Examples from the reference build (a competitive-intel tower):
channels live → "Scouts deployed 15/26"; feed highlights → "Scout reports";
competitor summaries → "Briefings"; industry news → "Beyond the walls";
greeting sub-line reports what the scouts brought back this week. The data
stays verifiable; only the vocabulary plays.

**The lore is a three-beat chain: "Scouts gather. The Tower sees. The
Keeper reads."** Scouts are the collectors, the Tower is the product (it
sees everything), and **the Keeper is the AI** — the character who reads
what the scouts bring back and writes the briefings. Every AI surface
names itself from the Keeper: "Ask the Keeper," "the Keeper's read," "the
Keeper connected these." The Tower never reads — it sees. And a signal is
always a signal ("Pricing", "Ads"), never "the pricing scout" — scouts are
who *brought* it, not what it is.

## 11. Motion & feel

- Hovers brighten to white surfaces (`background: #fff` on pills/rows),
  never scale (small translate lifts are fine).
- The live/notification dot may pulse; nothing else animates persistently.
- `prefers-reduced-motion`: kill all of it.

## 12. Don'ts (each learned the hard way)

- ✗ White cards floating on the scene — glass sheet or nothing.
- ✗ Warm/yellow accent (`#f0e657`-ish) — it must read *highlighter*.
- ✗ Warm sage backdrop — cool it toward slate-teal.
- ✗ Bold hero numerals, fat chart bars, left-side y-axes, labels under the
  chart.
- ✗ Reusing your app's global chrome (topbars, sidebars, gradients) inside
  this system — the sheet owns its whole screen.
- ✗ More than one accent color, or accent used on large fills.

## 13. Porting checklist

1. Scene gradient (cool, muted, darker than sheet) →
2. One sheet, glass recipe, radius 30 →
3. Internal chrome: logo mark, pill nav, icon buttons, avatar, icon rail,
   profile + greeting row →
4. Hero module: info column (thin numeral + value-row legend) + needle/curve
   chart with flag →
5. Tabs strip →
6. Cooler hairline-divided stats band (table / gauge / mini-bars / ring) →
7. Swap the highlighter accent + logo mark for the target brand if needed —
   everything else is brand-agnostic.
