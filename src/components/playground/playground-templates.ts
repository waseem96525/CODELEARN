"use client";

import type { CodeFiles } from "@/lib/types";

export type PracticeTrack = "HTML" | "CSS" | "JAVASCRIPT" | "MIXED";

export interface PlaygroundTemplate {
  id: string;
  title: string;
  description: string;
  track: PracticeTrack;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  files: CodeFiles;
}

export const PLAYGROUND_TEMPLATES: PlaygroundTemplate[] = [
  {
    id: "blank",
    title: "Blank canvas",
    description: "Start from zero. A clean page with a script ready to go.",
    track: "MIXED",
    difficulty: "BEGINNER",
    files: {
      html: `<main class="wrap">\n  <h1>My experiment</h1>\n  <p>Change anything — the preview updates as you type.</p>\n  <button id="btn">Click me</button>\n  <p id="out" aria-live="polite"></p>\n</main>`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  background: #f4f4f5;\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n}\n\n.wrap {\n  background: white;\n  border-radius: 12px;\n  padding: 32px;\n  box-shadow: 0 10px 30px rgb(0 0 0 / 0.08);\n  text-align: center;\n  max-width: 420px;\n}\n\nbutton {\n  border: 0;\n  border-radius: 8px;\n  padding: 10px 18px;\n  background: #4f46e5;\n  color: white;\n  font-weight: 600;\n  cursor: pointer;\n}`,
      js: `const btn = document.querySelector("#btn");\nconst out = document.querySelector("#out");\nlet count = 0;\n\nbtn.addEventListener("click", () => {\n  count += 1;\n  out.textContent = "Clicked " + count + (count === 1 ? " time" : " times");\n  console.log("clicks:", count);\n});`,
    },
  },
  {
    id: "html-semantics",
    title: "Semantic HTML card",
    description: "Practice headings, lists, forms and accessible landmarks.",
    track: "HTML",
    difficulty: "BEGINNER",
    files: {
      html: `<header>\n  <h1>Odyssey Coffee</h1>\n  <p>Small-batch roasters since 2019.</p>\n  <nav aria-label="Primary">\n    <a href="#menu">Menu</a>\n    <a href="#visit">Visit</a>\n  </nav>\n</header>\n\n<main>\n  <section id="menu" aria-labelledby="menu-heading">\n    <h2 id="menu-heading">Today's menu</h2>\n    <ul>\n      <li>Espresso — <strong>$3.00</strong></li>\n      <li>Oat latte — <strong>$4.50</strong></li>\n      <li>Pour over — <strong>$5.00</strong></li>\n    </ul>\n  </section>\n\n  <section aria-labelledby="signup-heading">\n    <h2 id="signup-heading">Get the weekly brew letter</h2>\n    <form id="brew-form">\n      <label for="email">Email</label>\n      <input id="email" name="email" type="email" required placeholder="you@example.com">\n      <button type="submit">Subscribe</button>\n    </form>\n  </section>\n</main>\n\n<footer id="visit">\n  <p>Open daily 7am – 6pm · 12 Roast Lane</p>\n</footer>`,
      css: `body { font-family: system-ui, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; }\nheader { border-bottom: 2px solid #111827; padding-bottom: 12px; }\nnav { display: flex; gap: 12px; }\nsection { margin-top: 24px; }\nform { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }\ninput { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; }\nbutton { padding: 8px 16px; border: 0; border-radius: 8px; background: #111827; color: white; cursor: pointer; }\nfooter { margin-top: 32px; color: #6b7280; font-size: 14px; }`,
      js: `document.querySelector("#brew-form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const email = document.querySelector("#email").value;\n  console.log("Subscribed:", email);\n  alert("Thanks! Brewing emails for " + email);\n});`,
    },
  },
  {
    id: "css-flex",
    title: "Flexbox pricing cards",
    description: "Nail justify-content, align-items and responsive wrapping.",
    track: "CSS",
    difficulty: "BEGINNER",
    files: {
      html: `<h1>Pick your plan</h1>\n<div class="plans">\n  <article class="plan">\n    <h2>Starter</h2>\n    <p class="price">$0</p>\n    <ul>\n      <li>3 projects</li>\n      <li>Community support</li>\n    </ul>\n    <button>Choose</button>\n  </article>\n  <article class="plan featured">\n    <p class="badge">Most popular</p>\n    <h2>Pro</h2>\n    <p class="price">$12<span>/mo</span></p>\n    <ul>\n      <li>Unlimited projects</li>\n      <li>Custom domains</li>\n    </ul>\n    <button>Choose</button>\n  </article>\n  <article class="plan">\n    <h2>Team</h2>\n    <p class="price">$29<span>/mo</span></p>\n    <ul>\n      <li>Everything in Pro</li>\n      <li>Shared workspaces</li>\n    </ul>\n    <button>Choose</button>\n  </article>\n</div>`,
      css: `body { font-family: system-ui, sans-serif; background: #eef2ff; padding: 32px 16px; }\nh1 { text-align: center; }\n.plans {\n  display: flex;\n  gap: 16px;\n  justify-content: center;\n  align-items: stretch;\n  flex-wrap: wrap;\n  max-width: 900px;\n  margin: 24px auto 0;\n}\n.plan {\n  background: white;\n  border-radius: 16px;\n  padding: 24px;\n  flex: 1 1 220px;\n  max-width: 280px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.featured { outline: 2px solid #4f46e5; position: relative; }\n.badge {\n  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);\n  background: #4f46e5; color: white; font-size: 12px;\n  padding: 2px 12px; border-radius: 999px; margin: 0;\n}\n.price { font-size: 32px; font-weight: 800; margin: 0; }\n.price span { font-size: 14px; font-weight: 400; color: #6b7280; }\nul { padding-left: 18px; color: #374151; }\nbutton { margin-top: auto; border: 0; border-radius: 8px; padding: 10px; background: #111827; color: white; cursor: pointer; }\n.featured button { background: #4f46e5; }`,
      js: `document.querySelectorAll(".plan button").forEach((btn) => {\n  btn.addEventListener("click", () => {\n    const plan = btn.closest(".plan").querySelector("h2").textContent;\n    console.log("Selected plan:", plan);\n  });\n});`,
    },
  },
  {
    id: "css-grid",
    title: "Grid photo gallery",
    description: "Build a responsive gallery with grid-template-columns and gaps.",
    track: "CSS",
    difficulty: "INTERMEDIATE",
    files: {
      html: `<h1>Gallery</h1>\n<p class="hint">Resize the preview — the grid reflows automatically.</p>\n<div class="gallery">\n  <figure class="tall"><div class="ph" style="background:#c7d2fe">1</div><figcaption>Mountains</figcaption></figure>\n  <figure><div class="ph" style="background:#fecaca">2</div><figcaption>Desert</figcaption></figure>\n  <figure><div class="ph" style="background:#bbf7d0">3</div><figcaption>Forest</figcaption></figure>\n  <figure class="wide"><div class="ph" style="background:#fde68a">4</div><figcaption>Coastline panorama</figcaption></figure>\n  <figure><div class="ph" style="background:#ddd6fe">5</div><figcaption>City</figcaption></figure>\n  <figure><div class="ph" style="background:#bae6fd">6</div><figcaption>Lake</figcaption></figure>\n</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 24px; }\n.hint { color: #6b7280; }\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));\n  gap: 12px;\n  margin-top: 16px;\n}\nfigure { margin: 0; }\n.ph {\n  height: 120px; display: grid; place-items: center;\n  font-size: 28px; font-weight: 800; color: #374151;\n  border-radius: 12px;\n}\n.tall .ph { height: 200px; }\n.wide { grid-column: span 2; }\nfigcaption { font-size: 13px; color: #6b7280; margin-top: 4px; }`,
      js: `console.log("Gallery items:", document.querySelectorAll("figure").length);`,
    },
  },
  {
    id: "css-animations",
    title: "CSS animations lab",
    description: "Transitions, keyframes, transforms and hover states.",
    track: "CSS",
    difficulty: "INTERMEDIATE",
    files: {
      html: `<h1>Motion lab</h1>\n<div class="row">\n  <div class="demo">\n    <p>Hover me</p>\n    <div class="box hover-me"></div>\n  </div>\n  <div class="demo">\n    <p>Always spinning</p>\n    <div class="box spinner"></div>\n  </div>\n  <div class="demo">\n    <p>Bouncing ball</p>\n    <div class="stage"><div class="ball"></div></div>\n  </div>\n</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 24px; }\n.row { display: flex; gap: 24px; flex-wrap: wrap; }\n.demo { flex: 1 1 180px; }\n.box { width: 72px; height: 72px; border-radius: 16px; background: #4f46e5; }\n.hover-me { transition: transform 0.25s ease, background 0.25s ease; }\n.hover-me:hover { transform: scale(1.15) rotate(8deg); background: #7c3aed; }\n.spinner { border-radius: 50%; border: 8px solid #e0e7ff; border-top-color: #4f46e5; animation: spin 1s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }\n.stage { height: 140px; border: 1px dashed #cbd5e1; border-radius: 12px; display: flex; justify-content: center; }\n.ball { width: 32px; height: 32px; border-radius: 50%; background: #f59e0b; animation: bounce 0.9s ease-in-out infinite alternate; }\n@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(100px); } }`,
      js: `console.log("Tip: try changing the animation-duration values.");`,
    },
  },
  {
    id: "js-todo",
    title: "JavaScript todo app",
    description: "DOM rendering, events, array methods and local state.",
    track: "JAVASCRIPT",
    difficulty: "BEGINNER",
    files: {
      html: `<h1>Todos</h1>\n<form id="todo-form">\n  <input id="todo-input" placeholder="What needs doing?" autocomplete="off">\n  <button>Add</button>\n</form>\n<ul id="list"></ul>\n<p id="empty">Nothing here yet — add your first todo above.</p>`,
      css: `body { font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px; }\nform { display: flex; gap: 8px; }\ninput { flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; }\nbutton { padding: 10px 16px; border: 0; border-radius: 8px; background: #4f46e5; color: white; cursor: pointer; }\nul { list-style: none; padding: 0; margin-top: 16px; display: grid; gap: 8px; }\nli { display: flex; align-items: center; gap: 8px; background: white; border: 1px solid #e5e7eb; padding: 10px 12px; border-radius: 8px; }\nli.done span { text-decoration: line-through; color: #9ca3af; }\nli button { margin-left: auto; background: #fee2e2; color: #b91c1c; padding: 4px 10px; }\n#empty { color: #6b7280; }`,
      js: `const form = document.querySelector("#todo-form");\nconst input = document.querySelector("#todo-input");\nconst list = document.querySelector("#list");\nconst empty = document.querySelector("#empty");\nconst todos = [];\n\nfunction render() {\n  list.innerHTML = "";\n  empty.style.display = todos.length ? "none" : "block";\n  todos.forEach((todo, i) => {\n    const li = document.createElement("li");\n    if (todo.done) li.classList.add("done");\n    li.innerHTML = '<input type="checkbox"' + (todo.done ? " checked" : "") + '> <span></span> <button>Delete</button>';\n    li.querySelector("span").textContent = todo.text;\n    li.querySelector("input").addEventListener("change", () => {\n      todos[i].done = !todos[i].done;\n      render();\n    });\n    li.querySelector("button").addEventListener("click", () => {\n      todos.splice(i, 1);\n      render();\n    });\n    list.appendChild(li);\n  });\n  console.log("Todos:", todos.length);\n}\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const text = input.value.trim();\n  if (!text) return;\n  todos.push({ text, done: false });\n  input.value = "";\n  render();\n});\n\nrender();`,
    },
  },
  {
    id: "js-form",
    title: "Form validation",
    description: "Constraint validation, regex and friendly error messages.",
    track: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    files: {
      html: `<form id="signup" novalidate>\n  <h1>Create account</h1>\n  <label>Username\n    <input id="username" name="username" minlength="3" required>\n    <small class="error" id="username-error"></small>\n  </label>\n  <label>Password\n    <input id="password" name="password" type="password" minlength="8" required>\n    <small class="error" id="password-error"></small>\n  </label>\n  <p id="strength" aria-live="polite"></p>\n  <button>Create account</button>\n  <p id="success" hidden>Account created — check the console for the payload.</p>\n</form>`,
      css: `body { font-family: system-ui, sans-serif; background: #f8fafc; display: grid; place-items: center; min-height: 100vh; }\nform { background: white; padding: 28px; border-radius: 16px; width: min(360px, 90vw); display: grid; gap: 12px; box-shadow: 0 10px 30px rgb(0 0 0 / 0.08); }\nh1 { margin: 0; font-size: 22px; }\nlabel { display: grid; gap: 4px; font-size: 14px; font-weight: 600; }\ninput { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; }\ninput.invalid { border-color: #dc2626; }\n.error { color: #dc2626; font-weight: 400; min-height: 16px; }\n#strength { margin: 0; font-size: 13px; color: #6b7280; }\nbutton { border: 0; border-radius: 8px; background: #4f46e5; color: white; padding: 12px; font-weight: 700; cursor: pointer; }\n#success { color: #15803d; font-weight: 600; }`,
      js: `const form = document.querySelector("#signup");\nconst username = document.querySelector("#username");\nconst password = document.querySelector("#password");\nconst strength = document.querySelector("#strength");\n\npassword.addEventListener("input", () => {\n  const v = password.value;\n  let score = 0;\n  if (v.length >= 8) score++;\n  if (/[A-Z]/.test(v)) score++;\n  if (/[0-9]/.test(v)) score++;\n  if (/[^A-Za-z0-9]/.test(v)) score++;\n  const labels = ["Too weak", "Weak", "Okay", "Good", "Strong"];\n  strength.textContent = v ? "Strength: " + labels[score] : "";\n});\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  let ok = true;\n  const uErr = document.querySelector("#username-error");\n  const pErr = document.querySelector("#password-error");\n  uErr.textContent = ""; pErr.textContent = "";\n  username.classList.remove("invalid"); password.classList.remove("invalid");\n  if (username.value.trim().length < 3) {\n    uErr.textContent = "Username needs at least 3 characters.";\n    username.classList.add("invalid"); ok = false;\n  }\n  if (password.value.length < 8) {\n    pErr.textContent = "Password needs at least 8 characters.";\n    password.classList.add("invalid"); ok = false;\n  }\n  document.querySelector("#success").hidden = !ok;\n  if (ok) console.log("Payload:", { username: username.value });\n});`,
    },
  },
  {
    id: "js-fetch",
    title: "Fetch + async rendering",
    description: "Fetch JSON, loading states and error handling with async/await.",
    track: "JAVASCRIPT",
    difficulty: "ADVANCED",
    files: {
      html: `<h1>Users</h1>\n<button id="load">Load users</button>\n<p id="status" aria-live="polite"></p>\n<ul id="users"></ul>`,
      css: `body { font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px; }\nbutton { border: 0; border-radius: 8px; background: #4f46e5; color: white; padding: 10px 18px; font-weight: 700; cursor: pointer; }\nbutton:disabled { opacity: 0.6; cursor: wait; }\n#status { color: #6b7280; }\nul { list-style: none; padding: 0; display: grid; gap: 8px; margin-top: 12px; }\nli { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; }\nli strong { display: block; }\nli span { color: #6b7280; font-size: 13px; }`,
      js: `const btn = document.querySelector("#load");\nconst status = document.querySelector("#status");\nconst list = document.querySelector("#users");\n\n// Note: the playground sandbox blocks network access, so this demo\n// uses an inline fake API. Copy it into a real page and swap\n// fakeFetch() for fetch("https://jsonplaceholder.typicode.com/users").\nfunction fakeFetch() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve([\n      { name: "Ada Lovelace", email: "ada@analytical.engine" },\n      { name: "Grace Hopper", email: "grace@navy.mil" },\n      { name: "Margaret Hamilton", email: "margaret@apollo.nasa" },\n    ]), 800);\n  });\n}\n\nbtn.addEventListener("click", async () => {\n  btn.disabled = true;\n  status.textContent = "Loading…";\n  list.innerHTML = "";\n  try {\n    const users = await fakeFetch();\n    status.textContent = "Loaded " + users.length + " users.";\n    for (const u of users) {\n      const li = document.createElement("li");\n      const name = document.createElement("strong");\n      name.textContent = u.name;\n      const email = document.createElement("span");\n      email.textContent = u.email;\n      li.append(name, email);\n      list.appendChild(li);\n    }\n    console.log("users:", users);\n  } catch (err) {\n    status.textContent = "Something went wrong: " + err.message;\n    console.error(err);\n  } finally {\n    btn.disabled = false;\n  }\n});`,
    },
  },
];

export function getTemplate(id: string | null | undefined): PlaygroundTemplate {
  return PLAYGROUND_TEMPLATES.find((t) => t.id === id) ?? PLAYGROUND_TEMPLATES[0];
}
