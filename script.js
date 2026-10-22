// Kleine stukjes interactie. De site werkt ook zonder dit script,
// je mist dan alleen de decoratieve grafieken en de klikbare tijdlijn.
document.documentElement.classList.add("js");

const SVG_NS = "http://www.w3.org/2000/svg";
let gradientId = 0;

// Catmull-Rom → cubic bezier: een vloeiende lijn door alle punten.
function smoothPath(pts) {
  let d = `M${pts[0]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1} ${c2} ${p2}`;
  }
  return d;
}

// <div class="curve" data-curve="0.2,0.5,0.9" data-dots="all|last" data-spread="edge|center">
function drawCurve(el) {
  const values = el.dataset.curve.split(",").map(Number);
  const n = values.length;
  const center = el.dataset.spread === "center";
  const pts = values.map((v, i) => [
    center ? ((i + 0.5) / n) * 100 : (i / (n - 1)) * 100,
    8 + (1 - v) * 84,
  ]);
  const id = `curve-grad-${gradientId++}`;
  const line = smoothPath(pts);
  const area = `${line} L${pts[n - 1][0]},100 L${pts[0][0]},100 Z`;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity="0.28"/>
        <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path class="curve-area" d="${area}" fill="url(#${id})"/>
    <path class="curve-line" d="${line}" pathLength="1"/>`;
  el.prepend(svg);

  const which = el.dataset.dots === "all" ? pts : [pts[n - 1]];
  return which.map(([x, y]) => {
    const dot = document.createElement("span");
    dot.className = "curve-dot";
    dot.setAttribute("aria-hidden", "true");
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    el.append(dot);
    return dot;
  });
}

// <div class="bars" data-bars="28" data-seed="1" data-highlight="4">
function drawBars(el) {
  const n = Number(el.dataset.bars);
  const seed = Number(el.dataset.seed || 0);
  const hi = Number(el.dataset.highlight || 3);
  for (let i = 0; i < n; i++) {
    const h = 0.45 + 0.28 * Math.sin(i * 0.55 + seed) + 0.17 * Math.sin(i * 1.7 + seed * 2) + i / n * 0.2;
    const bar = document.createElement("span");
    bar.style.setProperty("--h", `${Math.round(Math.min(1, Math.max(0.12, h)) * 100)}%`);
    bar.style.setProperty("--i", i);
    if (i >= n - hi) bar.className = "is-hi";
    el.append(bar);
  }
}

document.querySelectorAll(".bars[data-bars]").forEach(drawBars);
document.querySelectorAll(".skill-chart span").forEach((s, i) => s.style.setProperty("--i", i));
document.querySelectorAll(".curve[data-curve]:not(.tracker-chart)").forEach(drawCurve);

// Werkervaring: tabs die de curve en het detailpaneel aansturen.
const tracker = document.querySelector("[data-tracker]");
if (tracker) {
  const dots = drawCurve(tracker.querySelector(".tracker-chart"));
  const tabs = [...tracker.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

  const select = (index, focus) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", active);
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
      dots[i]?.classList.toggle("is-active", active);
    });
    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (e.key in keys) {
        e.preventDefault();
        select((i + keys[e.key] + tabs.length) % tabs.length, true);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        select(e.key === "Home" ? 0 : tabs.length - 1, true);
      }
    });
  });
  select(0);
}
