# Process Deck Comparison and Iteration Log

## Sources and method

- Boomstream live reference: https://boomstream.com/
- Obyom live/local page: https://obyom.org/ and `http://127.0.0.1:4173/index.html`
- Viewport: `1440 x 900`
- Screenshots captured at frequent scroll intervals:
  - Boomstream: every `100px`, `scrollY=500..3300`
  - Obyom: every `50px`, `scrollY=1800..3200`
- Screenshot sets:
  - `/tmp/boom-obyom-comparison/`
  - `/tmp/obyom-iter1/`

## What the screenshots show

### Boomstream

- The sequence is unambiguous: card `01 → 02 → 03 → 04 → 05`.
- The next card becomes the front card; the previous card remains behind it.
- At the early transition, the entering card is separated from the previous one by a large visible distance, roughly `160–270px` depending on the point in the transition.
- The deck does not immediately compress into a tight 20px stack. The 20px spacing is visible mainly in the already-processed background layers near the end of the scene.
- The cards are essentially opaque. Depth comes from solid surfaces, overlap, scale, small lateral movement, and a restrained shadow/contrast difference. There is no strong glass-like transparency between the main card surfaces.
- The active transition is slow and continuous. A card travels through a long interval before the next card becomes the dominant front card.
- Near the end of the scene, multiple older cards remain as shallow background strips while the newest card is the readable foreground card.

### Current Obyom before this pass

- Cards entered too quickly because shell geometry created an interval of about `334px` while the visual transition was short.
- The cards became a tight stack early, so their content visually collided and the user could lose the process order.
- Obyom had a stronger drop shadow and more uniform card geometry than Boomstream.
- The earlier `opacity`/scale behavior made the leaving cards look disabled instead of simply receding.

## Three-pass local iteration

### Iteration 1 — slower entry and more separation

Changed only desktop parameters:

- shell interval: `334px → 400px`;
- transition interval: `0.28vh → 0.42vh`;
- old-card opacity: very restrained, maximum reduction `4.5%`;
- shadow softened and reduced;
- old-card scale reduction kept subtle.

Result: the active card stayed readable longer and the entering card was farther away. This removed the immediate visual collision, but the lower cards still remained too close during the fully assembled state.

### Iteration 2 — wider deck spacing and restrained depth

Changed:

- shell interval: `400px → 471px`;
- stack step: `44px → 56px`;
- depth scale: `.018 → .016`;
- opacity reduction reduced to maximum `4.5%` through the depth model;
- shadow remained narrow and moderate.

Result: the entry order became visually clearer. At the fully layered state the older cards remain readable as distinct bands rather than collapsing into one tight pile. The active card remains fully opaque.

### Iteration 3 — verification pass

Checked locally with frequent states at `2200, 2400, 2600, 2800, 3000, 3200px` and then reverse-scrolled through `2800, 2400, 1900px`.

Observed final desktop behavior:

- the newest active card stays at the front and fully opaque;
- older cards recede in scale and opacity only slightly;
- background stack spacing is `56px`, making the bands visibly separated;
- the next card remains in normal flow until its turn;
- reverse scroll clears stale fixed styles and restores normal flow;
- at `375px`, cards remain a normal static list with no transform;
- desktop activates at `1200px`, while `1199px` remains a normal list.

## Current local target parameters

```js
const pinStart = 51;
const stackStep = 56;
const depthScale = 0.016;
// active transition: 42vh of the next-card interval
```

Shell interval:

```css
margin-bottom: calc(471px - 100vh);
```

The implementation remains local in `index.html`. No commit or push was made during this pass.
