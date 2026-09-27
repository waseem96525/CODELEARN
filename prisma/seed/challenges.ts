import type { CodeFiles, ValidationTest } from "@/lib/types";

export interface SeedChallenge {
  title: string;
  slug: string;
  description: string;
  instructions: string;
  track: string;
  difficulty?: string;
  starterCode: CodeFiles;
  solution: CodeFiles;
  tests: ValidationTest[];
  hints: string[];
  xpReward?: number;
}

const empty = (html = "", css = "", js = ""): CodeFiles => ({ html, css, js });

/**
 * HTML/CSS challenges.
 *
 * Tests are declarative DOM/CSS assertions evaluated inside the sandboxed
 * preview iframe after the user's code runs. This validates the *rendered
 * result*, not the text they typed, so formatting cannot be gamed.
 */
export const challenges: SeedChallenge[] = [
  {
    title: "Semantic Profile Card",
    slug: "semantic-profile-card",
    description:
      "Create a profile card using semantic HTML, with an avatar, a name, a short bio and a list of skills.",
    instructions: [
      "Wrap everything in an `<article>` element.",
      "Include one `<h2>` containing the person's name.",
      "Include exactly one `<img>` element with a non-empty `alt` attribute.",
      "Include one `<p>` element with the bio.",
      "Include a `<ul>` with at least three `<li>` items for the skills.",
    ].join("\n"),
    track: "HTML",
    difficulty: "BEGINNER",
    xpReward: 50,
    starterCode: empty(
      `<article class="card">
  <!-- Add your profile card here -->
</article>`,
      ``,
    ),
    solution: empty(
      `<article class="card">
  <img src="https://picsum.photos/id/1005/120" alt="Portrait of Alex Kim" />
  <h2>Alex Kim</h2>
  <p>Frontend developer learning to build real products.</p>
  <ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
  </ul>
</article>`,
    ),
    hints: [
      "A profile card is self-contained content, which is exactly what <article> describes.",
      "Try <h2> for the name and <ul> with <li> items for the skills.",
      "Remember alt text should describe the image, not just say 'photo'.",
    ],
    tests: [
      { kind: "exists", selector: "article", label: "Content is wrapped in an <article>" },
      { kind: "exists", selector: "article h2", label: "An <h2> exists for the name" },
      { kind: "exists", selector: "article img", label: "An <img> is present" },
      {
        kind: "attrPresent",
        selector: "article img",
        attr: "alt",
        label: "The image has an alt attribute",
      },
      { kind: "exists", selector: "article p", label: "A <p> holds the bio" },
      { kind: "exists", selector: "article ul", label: "Skills are in a <ul>" },
      { kind: "atLeast", selector: "article ul li", expected: 3, label: "At least 3 skills listed" },
    ],
  },
  {
    title: "Navigation with Links",
    slug: "navigation-with-links",
    description:
      "Build a navigation bar with a brand, three links and a call-to-action button, using correct link syntax.",
    instructions: [
      "Wrap the links in a `<nav>` element.",
      "Include an `<a>` element with an href starting with `https://`.",
      "Include at least three `<a>` elements in total.",
      "Include one `<button>` element.",
      "Every link must have text content — no empty anchors.",
    ].join("\n"),
    track: "HTML",
    difficulty: "BEGINNER",
    xpReward: 50,
    starterCode: empty(
      `<header>
  
</header>`,
    ),
    solution: empty(
      `<header>
  <a class="brand" href="https://example.com">CodeLearn</a>
  <nav>
    <a href="#courses">Courses</a>
    <a href="#pricing">Pricing</a>
    <a href="https://developer.mozilla.org">Docs</a>
  </nav>
  <button>Start learning</button>
</header>`,
    ),
    hints: [
      "A navigation bar is a block of major links, so <nav> is the right element.",
      "Wrap the <a> elements in <nav>, and keep the call to action as a <button> since it acts on the page rather than navigating.",
      "One link should point at a full external URL with https:// — not a bare domain like www.example.com.",
    ],
    tests: [
      { kind: "exists", selector: "nav", label: "Links are wrapped in a <nav>" },
      { kind: "atLeast", selector: "a", expected: 3, label: "At least 3 links" },
      { kind: "exists", selector: "button", label: "A <button> is present" },
      {
        kind: "attr",
        selector: "a",
        attr: "href",
        expected: "https://",
        label: "A link uses a full https:// URL",
      },
      { kind: "textContains", selector: "nav", text: "a", label: "Nav contains link text" },
    ],
  },
  {
    title: "Accessible Form",
    slug: "accessible-form",
    description:
      "Build a contact form where every control has a real label, and validation is defined in HTML.",
    instructions: [
      "Wrap the controls in a `<form>` element.",
      "Create two inputs: one with `type=\"email\"` and one with `type=\"password\"`.",
      "Each input must have a matching `<label for>` pointing at its `id`.",
      "Each input must have a `name` attribute.",
      "Include one `<button type=\"submit\">`.",
    ].join("\n"),
    track: "HTML",
    difficulty: "INTERMEDIATE",
    xpReward: 60,
    starterCode: empty(
      `<form>
  <p>
    <input type="text" />
  </p>
  <p>
    <input type="text" />
  </p>
  <button>Send</button>
</form>`,
    ),
    solution: empty(
      `<form>
  <p>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required />
  </p>
  <p>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" minlength="8" required />
  </p>
  <button type="submit">Send</button>
</form>`,
    ),
    hints: [
      "A form control with no label is invisible to screen readers, so pairing them is the whole point of this challenge.",
      "Each <label> needs a for attribute matching the input's id — for=\"email\" pairs with id=\"email\".",
      "An input without a name attribute submits nothing, even though it looks perfect in the browser.",
    ],
    tests: [
      { kind: "exists", selector: "form", label: "A <form> element is used" },
      { kind: "attr", selector: "input", attr: "type", expected: "email", label: "An email input exists" },
      {
        kind: "attr",
        selector: "input",
        attr: "type",
        expected: "password",
        label: "A password input exists",
      },
      { kind: "atLeast", selector: "label", expected: 2, label: "Both inputs have labels" },
      { kind: "atLeast", selector: "input[name]", expected: 2, label: "Both inputs have a name attribute" },
      { kind: "attr", selector: "button", attr: "type", expected: "submit", label: "Button type is submit" },
    ],
  },
  {
    title: "Data Table",
    slug: "data-table",
    description:
      "Present tabular data correctly with a caption, a header row and scoped headers.",
    instructions: [
      "Create a `<table>` with a `<caption>`.",
      "Add a `<thead>` containing a `<tr>` with at least two `<th scope=\"col\">` cells.",
      "Add a `<tbody>` with at least three rows.",
      "Each body row should begin with a `<th scope=\"row\">`.",
    ].join("\n"),
    track: "HTML",
    difficulty: "INTERMEDIATE",
    xpReward: 60,
    starterCode: empty(
      `<table>
  
</table>`,
    ),
    solution: empty(
      `<table>
  <caption>Top languages</caption>
  <thead>
    <tr>
      <th scope="col">Language</th>
      <th scope="col">Share</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">JavaScript</th>
      <td>62%</td>
    </tr>
    <tr>
      <th scope="row">HTML</th>
      <td>28%</td>
    </tr>
    <tr>
      <th scope="row">CSS</th>
      <td>10%</td>
    </tr>
  </tbody>
</table>`,
    ),
    hints: [
      "A caption goes as the first child of <table>, before thead.",
      "The thead row should use <th scope=\"col\"> for each column heading.",
      "Each tbody row should start with a <th scope=\"row\"> so screen readers announce which row a value belongs to.",
    ],
    tests: [
      { kind: "exists", selector: "table caption", label: "The table has a caption" },
      { kind: "atLeast", selector: "thead th[scope='col']", expected: 2, label: "Two column headers" },
      { kind: "atLeast", selector: "tbody tr", expected: 3, label: "At least 3 body rows" },
      { kind: "atLeast", selector: "tbody th[scope='row']", expected: 3, label: "Rows use row-scoped headers" },
    ],
  },
  {
    title: "Styled Button Set",
    slug: "styled-button-set",
    description:
      "Style three variants of a button using CSS custom properties for colour and spacing.",
    instructions: [
      "Render at least three `<button>` elements.",
      "Define a custom property on `:root` (for example `--brand`).",
      "Use `var(--...)` in at least two CSS rules.",
      "Add a `:hover` state that changes a button's background colour.",
      "Buttons must be visually distinguishable from the page background.",
    ].join("\n"),
    track: "CSS",
    difficulty: "BEGINNER",
    xpReward: 60,
    starterCode: empty(
      `<button>Primary</button>
<button>Secondary</button>
<button>Danger</button>`,
    ),
    solution: empty(
      `<button class="primary">Primary</button>
<button class="secondary">Secondary</button>
<button class="danger">Danger</button>`,
      `:root {
  --brand: #4f46e5;
  --danger: #dc2626;
  --radius: 8px;
}

body { font-family: system-ui, sans-serif; padding: 20px; }

button {
  padding: 10px 18px;
  margin-right: 8px;
  border: 2px solid var(--brand);
  border-radius: var(--radius);
  background: var(--brand);
  color: white;
  cursor: pointer;
}

button:hover { background: #312e81; }

.secondary { background: white; color: var(--brand); }

.danger { background: var(--danger); border-color: var(--danger); }
.danger:hover { background: #991b1b; }`,
    ),
    hints: [
      "Custom properties are declared on :root, which is the html element.",
      "A value starting with two dashes, like --brand, defines one. To use it, write var(--brand).",
      "A :hover block goes after the base rule and changes one property, such as background-color.",
    ],
    tests: [
      { kind: "atLeast", selector: "button", expected: 3, label: "At least 3 buttons" },
      { kind: "cssHasProperty", property: "--brand", valuePattern: "^#[0-9a-fA-F]{3,8}", label: "A --brand custom property is defined" },
      { kind: "cssHasProperty", property: "var(--", valuePattern: "", label: "CSS uses var(--...) somewhere" },
      { kind: "cssHasSelector", pattern: ":hover", label: "A :hover state is defined" },
    ],
  },
  {
    title: "Responsive Card Grid",
    slug: "responsive-card-grid",
    description:
      "Build a card grid that reflows from one column on mobile to three on desktop.",
    instructions: [
      "Create a container with `display: grid`.",
      "Inside it, add at least six card elements.",
      "Base styles use a single column.",
      "Add a `min-width` media query for two columns at 600px and three at 960px.",
      "Use `gap` rather than margins for the spacing.",
    ].join("\n"),
    track: "CSS",
    difficulty: "INTERMEDIATE",
    xpReward: 70,
    starterCode: empty(
      `<div class="grid">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
  <div class="card">Four</div>
  <div class="card">Five</div>
  <div class="card">Six</div>
</div>`,
    ),
    solution: empty(
      `<div class="grid">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
  <div class="card">Four</div>
  <div class="card">Five</div>
  <div class="card">Six</div>
</div>`,
      `.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 600px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 960px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

.card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}`,
    ),
    hints: [
      "The container is the element with display: grid — the .card elements are just its children.",
      "grid-template-columns: 1fr gives one column. Use repeat(2, 1fr) and repeat(3, 1fr) for more.",
      "Wrap each breakpoint in @media (min-width: 600px) and @media (min-width: 960px), and use gap for spacing.",
    ],
    tests: [
      { kind: "exists", selector: ".grid", label: "A .grid container exists" },
      { kind: "atLeast", selector: ".card", expected: 6, label: "At least 6 cards" },
      { kind: "cssHasProperty", property: "display", valuePattern: "grid", label: "display: grid is used" },
      { kind: "cssHasProperty", property: "grid-template-columns", valuePattern: "1fr", label: "Base layout is a single column" },
      { kind: "cssHasProperty", property: "gap", valuePattern: "[0-9]", label: "gap is used for spacing" },
    ],
  },
  {
    title: "Sticky Header Layout",
    slug: "sticky-header-layout",
    description:
      "Build a page with a sticky header, a Flexbox navigation bar and a content area.",
    instructions: [
      "The header has `position: sticky` with `top` set to 0.",
      "The navigation uses `display: flex`.",
      "The navigation has `justify-content` set to distribute its items.",
      "There is at least one navigation link.",
      "The header has a background colour set.",
    ].join("\n"),
    track: "CSS",
    difficulty: "INTERMEDIATE",
    xpReward: 60,
    starterCode: empty(
      `<header>
  <div class="brand">Site</div>
  <nav>
    <a href="#">Home</a>
    <a href="#">About</a>
  </nav>
</header>
<main>
  <p>Content</p>
</main>`,
    ),
    solution: empty(
      `<header>
  <div class="brand">Site</div>
  <nav>
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </nav>
</header>
<main>
  <p>Scroll down — the header stays in place.</p>
  <p>Line two.</p>
  <p>Line three.</p>
  <p>Line four.</p>
  <p>Line five.</p>
  <p>Line six.</p>
</main>`,
      `body { font-family: system-ui, sans-serif; margin: 0; }

header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #4f46e5;
  color: white;
  padding: 14px 20px;
}

nav { display: flex; gap: 16px; }
nav a { color: white; }`,
    ),
    hints: [
      "position: sticky needs a top value to know when to stick, so top: 0 pins it to the top of the viewport.",
      "Apply display: flex to the nav (or the header) and use justify-content: space-between to push items apart.",
      "The header needs a background colour, otherwise the text will be unreadable over the content scrolling beneath it.",
    ],
    tests: [
      { kind: "exists", selector: "header", label: "A header exists" },
      { kind: "atLeast", selector: "nav a", expected: 2, label: "At least 2 nav links" },
      { kind: "cssHasProperty", property: "position", valuePattern: "sticky", label: "position: sticky is used" },
      { kind: "cssHasProperty", property: "display", valuePattern: "flex", label: "Flexbox is used" },
      { kind: "cssHasProperty", property: "justify-content", valuePattern: "[a-z]", label: "justify-content is set" },
    ],
  },
  {
    title: "Box Model Breakdown",
    slug: "box-model-breakdown",
    description:
      "Demonstrate the four layers of the CSS box model with visibly distinct content, padding, border and margin.",
    instructions: [
      "Create an element with a fixed `width`.",
      "It has `padding` that differs from its `margin`.",
      "It has a visible `border`.",
      "It has a background colour so the padding area is visible.",
      "Set `box-sizing: border-box` on the page.",
    ].join("\n"),
    track: "CSS",
    difficulty: "BEGINNER",
    xpReward: 50,
    starterCode: empty(
      `<div class="box">content</div>`,
    ),
    solution: empty(
      `<div class="box">content</div>`,
      `* { box-sizing: border-box; }

body { font-family: system-ui, sans-serif; padding: 20px; }

.box {
  width: 200px;
  margin: 40px;
  padding: 30px;
  border: 10px solid #4f46e5;
  background: #e0e7ff;
}`,
    ),
    hints: [
      "There are four layers: content, padding, border, margin. Content is what width sets.",
      "Give the element a background colour so the padding area is visibly distinct from the margin area.",
      "Set * { box-sizing: border-box; } at the top so the declared width matches what is actually rendered.",
    ],
    tests: [
      { kind: "exists", selector: ".box", label: "The .box element exists" },
      { kind: "cssHasProperty", property: "width", valuePattern: "[0-9]", label: "A width is set" },
      { kind: "cssHasProperty", property: "padding", valuePattern: "[0-9]", label: "Padding is set" },
      { kind: "cssHasProperty", property: "margin", valuePattern: "[0-9]", label: "Margin is set" },
      { kind: "cssHasProperty", property: "box-sizing", valuePattern: "border-box", label: "box-sizing: border-box is set" },
    ],
  },
];
