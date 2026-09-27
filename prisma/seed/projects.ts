import type { CodeFiles } from "@/lib/types";

export interface SeedProject {
  title: string;
  slug: string;
  description: string;
  track: string;
  difficulty?: string;
  requirements: string[];
  checklist: string[];
  starterFiles: Record<string, string>;
  designReference: CodeFiles;
  xpReward?: number;
}

const files = (
  html: string,
  css: string,
  js: string,
): Record<string, string> => ({
  "index.html": html,
  "style.css": css,
  "script.js": js,
});

/** Projects from the spec, ordered beginner -> advanced. */
export const projects: SeedProject[] = [
  {
    title: "Personal Profile Page",
    slug: "personal-profile-page",
    description: "A single-page profile with a header, about section, skills and contact details.",
    track: "HTML",
    difficulty: "BEGINNER",
    xpReward: 200,
    requirements: [
      "A sticky header with your name and a short tagline.",
      "A hero section with a profile photo and a paragraph about you.",
      "A skills section listing at least six skills.",
      "A projects section with at least two entries.",
      "A contact section with an email link and a phone link.",
      "Fully responsive down to 320px wide.",
    ],
    checklist: [
      "Header created",
      "Hero section created",
      "Responsive layout created",
      "JavaScript interaction added",
      "Mobile layout completed",
    ],
    starterFiles: files(
      `<header>
  
</header>

<main>
  
</main>

<footer>
  
</footer>`,
      `* { box-sizing: border-box; }

body {
  font-family: system-ui, sans-serif;
  margin: 0;
}`,
      ``,
    ),
    designReference: {
      html: `<header class="site-header">
  <div class="brand">Alex Kim</div>
  <nav><a href="#about">About</a><a href="#work">Work</a><a href="#contact">Contact</a></nav>
</header>

<main>
  <section class="hero">
    <img src="https://picsum.photos/id/1005/160" alt="Portrait of Alex Kim" />
    <div>
      <h1>Alex Kim</h1>
      <p>Frontend developer who enjoys turning designs into working interfaces.</p>
      <a class="cta" href="#work">See my work</a>
    </div>
  </section>

  <section id="work">
    <h2>Selected work</h2>
    <div class="cards">
      <article><h3>Habit tracker</h3><p>Local-first app with streak maths.</p></article>
      <article><h3>Recipe search</h3><p>Debounced search against a public API.</p></article>
    </div>
  </section>
</main>

<footer id="contact">
  <p>alex@example.com &middot; +44 20 7946 0000</p>
</footer>`,
      css: `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; margin: 0; color: #0f1729; }

.site-header {
  position: sticky; top: 0;
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 24px; background: #4f46e5; color: #fff;
}
.site-header a { color: #fff; margin-left: 16px; text-decoration: none; }

.hero { display: flex; gap: 24px; align-items: center; padding: 40px 24px; }
.hero img { border-radius: 50%; }
.hero h1 { margin: 0 0 8px; }
.cta { display: inline-block; background: #0f1729; color: #fff; padding: 10px 18px; border-radius: 8px; text-decoration: none; }

#work { padding: 24px; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
article { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
article h3 { margin-top: 0; }

footer { background: #f1f5f9; padding: 20px 24px; margin-top: 32px; }

@media (max-width: 600px) {
  .hero { flex-direction: column; text-align: center; }
}`,
      js: `// Optional: smooth-scroll the nav links
document.querySelectorAll('.site-header a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});`,
    },
  },
  {
    title: "Restaurant Website",
    slug: "restaurant-website",
    description: "A restaurant site with a hero, a menu grid, a reservation form and a footer.",
    track: "CSS",
    difficulty: "INTERMEDIATE",
    xpReward: 250,
    requirements: [
      "A sticky header with a horizontally distributed navigation bar.",
      "A full-width hero with a heading, a tagline and a call to action.",
      "A menu section using CSS Grid with three columns on desktop, one on mobile.",
      "A reservation form with a name, date, time and guests field.",
      "An opening hours table using a real `<table>` element.",
      "A footer with address, hours and social links.",
    ],
    checklist: [
      "Header created",
      "Hero section created",
      "Responsive layout created",
      "JavaScript interaction added",
      "Mobile layout completed",
    ],
    starterFiles: files(
      `<header></header>
<main></main>
<footer></footer>`,
      `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; margin: 0; }`,
      ``,
    ),
    designReference: {
      html: `<header class="bar">
  <div class="logo">Olive &amp; Oak</div>
  <nav><a href="#menu">Menu</a><a href="#book">Book</a><a href="#hours">Hours</a></nav>
</header>

<main>
  <section class="hero">
    <h1>Seasonal food, open fire</h1>
    <p>A neighbourhood kitchen in the heart of the city.</p>
    <a class="cta" href="#book">Book a table</a>
  </section>

  <section id="menu">
    <h2>This week's menu</h2>
    <div class="dishes">
      <article><h3>Charred leeks</h3><p>Whipped ricotta, hazelnut</p><span class="price">9</span></article>
      <article><h3>Wood-fired trout</h3><p>Fennel, brown butter</p><span class="price">18</span></article>
      <article><h3>Burnt honey tart</h3><p>Sea salt, creme fraiche</p><span class="price">7</span></article>
    </div>
  </section>

  <section id="book">
    <h2>Book a table</h2>
    <form id="booking">
      <label for="name">Name</label><input id="name" />
      <label for="date">Date</label><input id="date" type="date" />
      <label for="guests">Guests</label><input id="guests" type="number" min="1" max="12" />
      <button type="submit">Request booking</button>
      <p id="confirmation"></p>
    </form>
  </section>
</main>

<footer id="hours">
  <p>12 Bridge Street &middot; open@oliveandoak.dev</p>
</footer>`,
      css: `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; margin: 0; color: #1c1917; }

.bar { position: sticky; top: 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #292524; color: #fff; }
.bar a { color: #fff; margin-left: 20px; text-decoration: none; }
.logo { font-weight: 700; letter-spacing: 0.05em; }

.hero { padding: 80px 24px; background: #292524; color: #fff; }
.hero h1 { font-size: 2.5rem; margin: 0 0 12px; }
.cta { display: inline-block; background: #fff; color: #292524; padding: 12px 22px; border-radius: 999px; text-decoration: none; font-weight: 600; }

#menu, #book { padding: 40px 24px; }
.dishes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.dishes article { border: 1px solid #e7e5e4; border-radius: 10px; padding: 18px; }
.dishes h3 { margin: 0 0 6px; }
.price { display: block; margin-top: 10px; font-weight: 700; }

form { display: grid; gap: 8px; max-width: 320px; }
label { font-weight: 600; font-size: 14px; }
input { padding: 9px; border: 1px solid #d6d3d1; border-radius: 6px; }
button { padding: 11px 18px; background: #292524; color: #fff; border: 0; border-radius: 6px; cursor: pointer; }
#confirmation { color: #166534; font-weight: 600; }

footer { background: #f5f5f4; padding: 24px; }

@media (max-width: 700px) {
  .dishes { grid-template-columns: 1fr; }
  .hero h1 { font-size: 1.9rem; }
}`,
      js: `document.getElementById('booking').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const guests = document.getElementById('guests').value;
  const output = document.getElementById('confirmation');

  if (!name) {
    output.textContent = 'Please enter a name.';
    return;
  }
  output.textContent = \`Thanks \${name} — booking requested for \${guests || 2} guest(s).\`;
});`,
    },
  },
  {
    title: "Product Landing Page",
    slug: "product-landing-page",
    description: "A conversion-focused landing page with pricing cards and a feature grid.",
    track: "CSS",
    difficulty: "INTERMEDIATE",
    xpReward: 250,
    requirements: [
      "A hero with a product name, tagline and two buttons.",
      "A feature section with three cards in a grid.",
      "A pricing section with three tiers, one marked as recommended.",
      "A call-to-action band near the bottom.",
      "Buttons and cards have hover states with transitions.",
      "Layout collapses to one column below 700px.",
    ],
    checklist: [
      "Header created",
      "Hero section created",
      "Responsive layout created",
      "JavaScript interaction added",
      "Mobile layout completed",
    ],
    starterFiles: files(`<header></header><main></main><footer></footer>`, `body { font-family: system-ui, sans-serif; margin: 0; }`, ``),
    designReference: {
      html: `<header class="top">
  <strong>Northwind</strong>
  <nav><a href="#features">Features</a><a href="#pricing">Pricing</a></nav>
</header>

<main>
  <section class="hero">
    <h1>Ship faster with Northwind</h1>
    <p>One workspace for issues, deploys and on-call.</p>
    <div class="actions">
      <a class="btn primary" href="#pricing">Start free</a>
      <a class="btn" href="#features">See features</a>
    </div>
  </section>

  <section id="features" class="features">
    <article><h3>Fast</h3><p>Sub-second search across every project.</p></article>
    <article><h3>Reliable</h3><p>99.99% uptime with regional failover.</p></article>
    <article><h3>Simple</h3><p>Keyboard shortcuts for everything.</p></article>
  </section>

  <section id="pricing" class="pricing">
    <div class="tier"><h3>Starter</h3><p class="price">$0</p><a class="btn" href="#">Get started</a></div>
    <div class="tier featured"><h3>Team</h3><p class="price">$12</p><a class="btn primary" href="#">Try Team</a></div>
    <div class="tier"><h3>Scale</h3><p class="price">$39</p><a class="btn" href="#">Contact sales</a></div>
  </section>
</main>

<footer><p>Northwind &middot; hello@northwind.dev</p></footer>`,
      css: `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; margin: 0; color: #0f172a; }

.top { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e2e8f0; }
.top a { margin-left: 18px; color: #334155; text-decoration: none; }

.hero { text-align: center; padding: 72px 24px; }
.hero h1 { font-size: 2.6rem; margin: 0 0 12px; }
.actions { display: flex; gap: 12px; justify-content: center; margin-top: 24px; }

.btn { display: inline-block; padding: 11px 20px; border: 1px solid #cbd5e1; border-radius: 8px; text-decoration: none; color: #0f172a; transition: background-color 0.2s ease, transform 0.2s ease; }
.btn:hover { transform: translateY(-2px); }
.btn.primary { background: #4f46e5; border-color: #4f46e5; color: #fff; }
.btn.primary:hover { background: #4338ca; }

.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 40px 24px; }
.features article { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; transition: box-shadow 0.2s ease; }
.features article:hover { box-shadow: 0 8px 24px rgba(15,23,42,0.08); }
.features h3 { margin: 0 0 8px; }

.pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 40px 24px; align-items: start; }
.tier { border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; }
.tier.featured { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.12); }
.price { font-size: 2rem; font-weight: 700; margin: 12px 0; }

footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; }

@media (max-width: 700px) {
  .features, .pricing { grid-template-columns: 1fr; }
  .hero h1 { font-size: 2rem; }
  .actions { flex-direction: column; align-items: center; }
}`,
      js: `// Add a subtle entrance animation as cards scroll into view
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.style.opacity = '1';
  }
}, { threshold: 0.1 });

document.querySelectorAll('.features article, .tier').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transition = \`opacity 0.4s ease \${i * 80}ms\`;
  observer.observe(el);
});`,
    },
  },
  {
    title: "Calculator",
    slug: "calculator",
    description: "A working calculator with keyboard support and a running calculation display.",
    track: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    xpReward: 300,
    requirements: [
      "Buttons for digits 0-9, `.`, `+`, `-`, `*`, `/` and clear.",
      "An `=` button that shows the result.",
      "Division by zero shows a friendly message instead of `Infinity` or `NaN`.",
      "The display updates as digits are pressed.",
      "Keyboard input works: digits, operators, Enter for `=` and Escape to clear.",
      "No `eval` is used — the calculation is done with your own function.",
    ],
    checklist: [
      "Header created",
      "Hero section created",
      "Responsive layout created",
      "JavaScript interaction added",
      "Mobile layout completed",
    ],
    starterFiles: files(
      `<div class="calc">
  <div class="display" id="display">0</div>
  <div class="keys">
    <!-- add buttons -->
  </div>
</div>`,
      `body { font-family: system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; }`,
      `const display = document.getElementById("display");`,
    ),
    designReference: {
      html: `<div class="calc">
  <div class="display" id="display">0</div>
  <div class="keys">
    <button class="key fn" data-key="C">C</button>
    <button class="key fn" data-key="back">&#8592;</button>
    <button class="key op" data-key="/">&divide;</button>
    <button class="key op" data-key="*">&times;</button>

    <button class="key" data-key="7">7</button>
    <button class="key" data-key="8">8</button>
    <button class="key" data-key="9">9</button>
    <button class="key op" data-key="-">&minus;</button>

    <button class="key" data-key="4">4</button>
    <button class="key" data-key="5">5</button>
    <button class="key" data-key="6">6</button>
    <button class="key op" data-key="+">+</button>

    <button class="key" data-key="1">1</button>
    <button class="key" data-key="2">2</button>
    <button class="key" data-key="3">3</button>
    <button class="key op wide" data-key="=">=</button>

    <button class="key" data-key="0">0</button>
    <button class="key" data-key=".">.</button>
  </div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  display: grid; place-items: center;
  min-height: 100vh; margin: 0; background: #f1f5f9;
}

.calc { width: 280px; background: #0f172a; border-radius: 16px; padding: 16px; box-shadow: 0 18px 40px rgba(15,23,42,0.25); }

.display {
  background: #1e293b; color: #f8fafc;
  font-size: 2rem; text-align: right;
  padding: 16px; border-radius: 10px;
  margin-bottom: 12px; min-height: 64px;
  overflow: hidden; font-variant-numeric: tabular-nums;
}

.keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }

.key {
  border: 0; border-radius: 10px; padding: 16px 0;
  font-size: 1.1rem; font-weight: 600; cursor: pointer;
  background: #e2e8f0; color: #0f172a;
  transition: background-color 0.15s ease, transform 0.15s ease;
}
.key:hover { background: #cbd5e1; }
.key:active { transform: scale(0.96); }
.key.op { background: #38bdf8; color: #0c4a6e; }
.key.fn { background: #334155; color: #f8fafc; }
.key.wide { grid-row: span 2; }`,
      js: `const display = document.getElementById("display");

let current = "0";
let previous = null;
let operator = null;
let fresh = true;

function render() {
  display.textContent = current;
}

function inputDigit(digit) {
  if (fresh) {
    current = digit === "." ? "0." : digit;
    fresh = false;
  } else {
    if (digit === "." && current.includes(".")) return;
    current = current === "0" && digit !== "." ? digit : current + digit;
  }
  render();
}

function chooseOp(next) {
  if (operator && !fresh) calculate();
  previous = parseFloat(current);
  operator = next;
  fresh = true;
}

function calculate() {
  if (operator === null || previous === null) return;
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case "+": result = previous + b; break;
    case "-": result = previous - b; break;
    case "*": result = previous * b; break;
    case "/":
      if (b === 0) {
        display.textContent = "Cannot divide by zero";
        current = "0"; previous = null; operator = null; fresh = true;
        return;
      }
      result = previous / b;
      break;
    default: return;
  }
  current = String(Math.round(result * 1e10) / 1e10);
  previous = null;
  operator = null;
  fresh = true;
  render();
}

function clear() {
  current = "0"; previous = null; operator = null; fresh = true;
  render();
}

document.querySelectorAll(".key").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.key;
    if (key === "C") return clear();
    if (key === "back") {
      current = current.length > 1 ? current.slice(0, -1) : "0";
      return render();
    }
    if (key === "=") return calculate();
    if ("+-*/".includes(key)) return chooseOp(key);
    inputDigit(key);
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (/^[0-9.]$/.test(key)) inputDigit(key);
  else if ("+-*/".includes(key)) chooseOp(key);
  else if (key === "Enter" || key === "=") calculate();
  else if (key === "Escape") clear();
});

render();`,
    },
  },
  {
    title: "To-Do App",
    slug: "todo-app",
    description: "A persistent task manager with add, complete, filter and delete.",
    track: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    xpReward: 300,
    requirements: [
      "Add tasks with an input and a button; Enter also submits.",
      "Each task can be marked complete with a checkbox.",
      "Filter buttons for All, Active and Completed.",
      "Deleting a task removes it permanently.",
      "The task list is saved to `localStorage` and restored on load.",
      "A count of remaining tasks is always visible.",
    ],
    checklist: [
      "Header created",
      "Hero section created",
      "Responsive layout created",
      "JavaScript interaction added",
      "Mobile layout completed",
    ],
    starterFiles: files(
      `<h1>Tasks</h1>
<form id="add"><input id="input" placeholder="Add a task" /><button>Add</button></form>
<div id="filters"></div>
<ul id="list"></ul>
<p id="count"></p>`,
      `body { font-family: system-ui, sans-serif; max-width: 460px; margin: 40px auto; padding: 0 20px; }`,
      `const KEY = "tasks";`,
    ),
    designReference: {
      html: `<h1>Tasks</h1>

<form id="add">
  <input id="input" placeholder="Add a task" autocomplete="off" />
  <button type="submit">Add</button>
</form>

<div class="filters" id="filters">
  <button class="filter active" data-filter="all">All</button>
  <button class="filter" data-filter="active">Active</button>
  <button class="filter" data-filter="done">Completed</button>
</div>

<ul id="list"></ul>
<p id="count"></p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  max-width: 460px; margin: 40px auto; padding: 0 20px; color: #0f172a;
}
h1 { margin: 0 0 16px; }

#add { display: flex; gap: 8px; }
#input { flex: 1; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; }
#add button { padding: 10px 18px; border: 0; border-radius: 8px; background: #4f46e5; color: #fff; cursor: pointer; }

.filters { display: flex; gap: 6px; margin: 16px 0; }
.filter { padding: 6px 14px; border: 1px solid #cbd5e1; border-radius: 999px; background: #fff; cursor: pointer; }
.filter.active { background: #4f46e5; border-color: #4f46e5; color: #fff; }

#list { list-style: none; padding: 0; }
#list li { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
#list li.done label { text-decoration: line-through; color: #94a3b8; }
#list label { flex: 1; cursor: pointer; }
#list button { border: 0; background: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem; }
#list button:hover { color: #dc2626; }

#count { color: #64748b; font-size: 0.9rem; }`,
      js: `const KEY = "tasks";
let tasks = JSON.parse(localStorage.getItem(KEY)) || [];
let filter = "all";

const list = document.getElementById("list");
const countEl = document.getElementById("count");
const input = document.getElementById("input");

function save() {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

function visible() {
  if (filter === "active") return tasks.filter((t) => !t.done);
  if (filter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  list.innerHTML = "";

  for (const task of visible()) {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      save();
      render();
    });

    const label = document.createElement("label");
    label.textContent = task.text;

    const remove = document.createElement("button");
    remove.textContent = "\\u00d7";
    remove.setAttribute("aria-label", "Delete " + task.text);
    remove.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      save();
      render();
    });

    li.append(checkbox, label, remove);
    list.appendChild(li);
  }

  const remaining = tasks.filter((t) => !t.done).length;
  countEl.textContent = remaining + " task" + (remaining === 1 ? "" : "s") + " remaining";
}

document.getElementById("add").addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  input.value = "";
  save();
  render();
});

document.getElementById("filters").addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;
  filter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === button));
  render();
});

render();`,
    },
  },
];
