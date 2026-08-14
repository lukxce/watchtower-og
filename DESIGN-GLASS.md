# The Glass System

A reusable dashboard design language — cool grey-green scene, one continuous
frosted sheet, highlighter yellow-green accent, airy editorial type.
Reference implementation: `app/(beta)/overview-beta/glass/` in this repo
(Watchtower). Written so it can be lifted onto any product.

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

The glass only reads as glass if there is something behind it to blur.

```css
background:
  radial-gradient(1000px 620px at 78% -12%, #c8d2d0 0%, transparent 60%),
  radial-gradient(760px 540px at 2% 100%, #a9b6b4 0%, transparent 55%),
  linear-gradient(162deg, #b7c1bf 0%, #aeb9b7 52%, #b4bfbc 100%);
```

- Temperature: **cool** grey-green (toward slate/teal, never warm sage or
  beige). If it looks like a spa, cool it down.
- Low contrast, no pure white and no saturated color in the scene itself.
- A photo or abstract render also works (the originals use a room photo) as
  long as it's desaturated and darker than the sheet.

## 3. The sheet (glass recipe)

```css
background: rgba(240, 246, 244, .42);
backdrop-filter: blur(30px) saturate(135%);
border: 1px solid rgba(255, 255, 255, .55);
border-radius: 30px;
box-shadow: 0 34px 80px rgba(35, 48, 50, .22),
            inset 0 1px 0 rgba(255, 255, 255, .6);
```

- A few large sheets per screen, stacked with breathing room between them
  so corners stay visible. Radius is generous (28–34px).
- The **inset top highlight** is what sells the material — don't skip it.
- Secondary zone (stats band, footer strip): same sheet, cooler tint —
  `rgba(214, 226, 226, .38)` — separated by a `1px rgba(255,255,255,.5)`
  hairline. Columns inside it divide with the same hairline, right border
  only, none on the last column.
- Interior sub-surfaces (icon-rail hover, tooltip, active pill) are
  `#fff` or near-white — white is reserved for *small* raised elements,
  never large containers.

## 4. Color

| Role | Value | Rules |
|---|---|---|
| Ink | `#20272a` | Cool near-black. All headings, key numbers. |
| Muted | `#576462` | Body copy, labels. |
| Faint | `#6d7a78` / `#7d8a88` | Micro-labels, ticks, ranges. |
| **Highlighter** | `#e0f23c` (fills), `#cfe32c` (strokes/lines) | THE accent. Yellow-green like a text highlighter — not yellow, not lime-green. |
| Data-neutral | `rgba(255,255,255,.85)` | Bars, tracks, secondary series. |
| Data-muted | `#8d9a98` | Tertiary series dots. |
| Coral (hot) | `#c96b5e` | High threat/urgency numbers and statuses. Text-level only. |
| Sky (info) | `#5f8aa8` | Informational categories/statuses. Text/chip only. |
| Sand (neutral tag) | `#8a8474` | Low-priority category chips. |

**Highlighter discipline:** the highlighter is for *your* energy — the
primary CTA, the momentum curve, the highlighted bar, gauge fills, the
notification dot, the logo mark. It is NOT a semantic color: never use it
to say "high" or "warning" (a highlighted word reads as celebration, not
danger). Semantics get the muted supporting hues — coral for hot, sky for
info — at text/chip size only, never as large fills. Dark text on
highlighter buttons, always. On-glass "hover surface" is white, not accent.

## 5. Type

- One geometric sans (this repo: Plus Jakarta Sans) — the *weights* do the
  design work, not multiple families.
- **Hero numerals: large and LIGHT.** 56–64px at weight 400, tight
  letter-spacing (−.04em). The thin big number is the signature. Never bold
  the hero number.
- Headings: 15–17px / 800. Body: 11–12px / 500–600, muted color.
- Micro-labels: 9–10px, 700, uppercase, letter-spacing .04–.06em, faint.
- Greeting is a UI element: bold short line + muted sub ("Hey, {name}! 👋 /
  Explore your …"), right-aligned opposite the profile block.

## 6. Chrome (the sheet's own navigation)

- **Top bar lives inside the sheet:** logo (rounded-square accent mark with
  a dark dot + lowercase wordmark) · center pill nav (active = solid white
  pill with a soft shadow; inactive = bare muted text) · right cluster:
  frosted round icon buttons (34px circle, `rgba(255,255,255,.5)`) — gear,
  bell with an accent dot — then a dark circular avatar.
- **Icon rail:** individual frosted circle buttons fixed to the viewport's
  left edge (they follow scroll), a soft vertical hairline separating them
  from content. Never a boxed sidebar. On mobile it collapses away.
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
   (`rgba(215,235,52,.26)`) reaching the baseline. The curve tells the
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
