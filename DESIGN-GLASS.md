# The Glass System

A reusable dashboard design language — cool grey-green scene, one continuous
frosted sheet, highlighter yellow-green accent, airy editorial type.
Reference implementation: `app/(beta)/overview-beta/glass/` in this repo
(Watchtower). Written so it can be lifted onto any product.

---

## 1. The one idea

**Everything lives on a single sheet of frosted glass floating over a muted
scene.** Not a grid of cards — one translucent panel that contains the whole
interface, divided internally by hairlines. The moment you add white boxes on
top of the scene, the illusion dies and it becomes another card dashboard.
Zones that need separation get a *tint change* (a cooler, slightly darker
glass band) and *hairline dividers* — never borders-plus-shadows-plus-fills.

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

- One sheet per screen. Radius is generous (28–34px).
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

**Highlighter discipline:** one accent, used only where attention is earned —
the primary CTA, the momentum curve, the highlighted bar/week, gauge fills,
the notification dot, the logo mark. Everything else stays white/ink/grey.
Two accents kill this system. Dark text on highlighter buttons, always.
On-glass "hover surface" is white, not accent.

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
- **Icon rail inside the left edge** of the sheet: icons only, 38px round
  hover targets, divided from content by a hairline. Not a floating box
  outside the sheet. On mobile it collapses away.
- **Profile row** under the top bar: avatar + micro-label role + bold name,
  the accent pill button, a ghost search circle; greeting on the right plus
  a ghost refresh circle at the far edge.
- **Tabs strip** between zones: bare text tabs, active = white pill.

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

## 9. Motion & feel

- Hovers brighten to white surfaces (`background: #fff` on pills/rows),
  never scale.
- The live/notification dot may pulse; nothing else animates persistently.
- `prefers-reduced-motion`: kill all of it.

## 10. Don'ts (each learned the hard way)

- ✗ White cards floating on the scene — glass sheet or nothing.
- ✗ Warm/yellow accent (`#f0e657`-ish) — it must read *highlighter*.
- ✗ Warm sage backdrop — cool it toward slate-teal.
- ✗ Bold hero numerals, fat chart bars, left-side y-axes, labels under the
  chart.
- ✗ Reusing your app's global chrome (topbars, sidebars, gradients) inside
  this system — the sheet owns its whole screen.
- ✗ More than one accent color, or accent used on large fills.

## 11. Porting checklist

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
