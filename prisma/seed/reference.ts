export interface SeedReference {
  track: string;
  title: string;
  syntax: string;
  summary: string;
  example: string;
  mistakes: string[];
  keywords: string;
}

/** Powers the quick-reference section and global search. */
export const references: SeedReference[] = [
  // ---------------------------------------------------------------- HTML
  {
    track: "HTML",
    title: "<h1>–<h6>",
    syntax: "<h1>Page title</h1>",
    summary: "Headings from level 1 to 6. The number indicates importance, not size.",
    example: "<h1>Main heading</h1>\n<h2>Section</h2>\n<h3>Subsection</h3>",
    mistakes: [
      "Using <h1> for styling rather than structure",
      "Skipping levels, for example going from <h1> to <h3>",
    ],
    keywords: "heading h1 h2 h3 title header",
  },
  {
    track: "HTML",
    title: "<p>",
    syntax: "<p>Text content</p>",
    summary: "A paragraph of text. The browser adds spacing above and below.",
    example: "<p>Welcome to my site.</p>",
    mistakes: [
      "Adding empty <p> tags to create vertical space",
      "Putting a block element such as <div> inside a <p>",
    ],
    keywords: "paragraph text body br line break",
  },
  {
    track: "HTML",
    title: "<a>",
    syntax: '<a href="https://example.com">Link text</a>',
    summary: "A hyperlink. The href attribute holds the destination.",
    example: '<a href="/about">About us</a>\n<a href="mailto:hi@example.com">Email</a>',
    mistakes: [
      'Forgetting the protocol: href="www.example.com" breaks',
      'Using "click here" as the link text',
      "Omitting the closing </a> tag",
    ],
    keywords: "link anchor href hyperlink navigate target",
  },
  {
    track: "HTML",
    title: "<img>",
    syntax: '<img src="photo.jpg" alt="Description" />',
    summary: "An image. A void element, so it has no closing tag.",
    example: '<img src="cat.jpg" alt="A tabby cat on a windowsill" />',
    mistakes: [
      'Omitting alt entirely, or writing alt="image"',
      "Adding a closing </img> tag",
      "Using a relative path to a file that does not exist",
    ],
    keywords: "image picture photo src alt avatar logo",
  },
  {
    track: "HTML",
    title: "<ul> and <ol>",
    syntax: "<ul><li>Item</li></ul>",
    summary: "Unordered (bulleted) and ordered (numbered) lists. Each entry is an <li>.",
    example: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>",
    mistakes: [
      "Nesting a <ul> directly inside a <ul> instead of inside an <li>",
      "Using <div> grids where a list is more meaningful",
    ],
    keywords: "list ul ol li bullet ordered items",
  },
  {
    track: "HTML",
    title: "<table>",
    syntax: "<table><tr><th>Header</th><td>Cell</td></tr></table>",
    summary: "Tabular data. Use <th> for headers and add scope for accessibility.",
    example:
      '<table>\n  <caption>Scores</caption>\n  <thead><tr><th scope="col">Name</th></tr></thead>\n  <tbody><tr><td>Alex</td></tr></tbody>\n</table>',
    mistakes: [
      "Using tables for page layout",
      "Omitting scope on header cells",
      "Skipping <thead> and <tbody>",
    ],
    keywords: "table data rows columns cells th td thead tbody caption",
  },
  {
    track: "HTML",
    title: "<form> and <input>",
    syntax: '<form><input type="email" name="email" /></form>',
    summary: "Collects user input. Inputs need both name and id attributes.",
    example:
      '<form>\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required />\n  <button type="submit">Send</button>\n</form>',
    mistakes: [
      "Omitting the name attribute, so the field submits nothing",
      "Using placeholder text instead of a real label",
      "Leaving out type=\"submit\" on the button",
    ],
    keywords: "form input submit label field validation email password checkbox radio",
  },
  {
    track: "HTML",
    title: "Semantic elements",
    syntax: "<header><nav>…</nav></header><main>…</main>",
    summary:
      "Elements that describe the purpose of a region: header, nav, main, article, section, aside, footer.",
    example: "<main>\n  <article>\n    <h2>Post title</h2>\n  </article>\n</main>",
    mistakes: [
      "More than one <main> per page",
      "Building structure entirely from <div> elements",
    ],
    keywords: "semantic header nav main article section aside footer landmark",
  },

  // ----------------------------------------------------------------- CSS
  {
    track: "CSS",
    title: "display",
    syntax: "display: block | inline | inline-block | flex | grid | none",
    summary: "Controls how an element participates in layout.",
    example: ".card { display: block; }\n.row { display: flex; }",
    mistakes: [
      "Setting width on an inline element and wondering why nothing happens",
      "Reaching for position when Flexbox or Grid would be simpler",
    ],
    keywords: "display block inline flex grid none layout",
  },
  {
    track: "CSS",
    title: "position",
    syntax: "position: static | relative | absolute | fixed | sticky",
    summary: "Takes an element out of normal document flow and places it precisely.",
    example: ".header { position: sticky; top: 0; }",
    mistakes: [
      "Forgetting position: relative on the parent of an absolute element",
      "Using absolute for what should be a Flexbox layout",
    ],
    keywords: "position relative absolute fixed sticky z-index flow",
  },
  {
    track: "CSS",
    title: "margin and padding",
    syntax: "margin: 16px; padding: 8px 12px;",
    summary:
      "Padding is space inside the border. Margin is space outside it, between elements.",
    example: ".card { padding: 16px; margin-bottom: 12px; }",
    mistakes: [
      "Using margin to space the inside of a container",
      "Using padding to push elements apart",
    ],
    keywords: "margin padding spacing box model border space gap",
  },
  {
    track: "CSS",
    title: "The box model",
    syntax: "* { box-sizing: border-box; }",
    summary: "Content, padding, border, margin. border-box makes width include padding.",
    example: "* { box-sizing: border-box; }\n.card { width: 300px; padding: 20px; }",
    mistakes: [
      "Not setting box-sizing, so widths include unexpected padding",
      "Confusing the content-box and border-box models",
    ],
    keywords: "box model width height box-sizing content border",
  },
  {
    track: "CSS",
    title: "flexbox",
    syntax: "display: flex; justify-content: space-between; gap: 16px",
    summary: "One-dimensional layout for rows and columns.",
    example: ".row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}",
    mistakes: [
      "Using justify-content when you meant align-items",
      "Spacing with margins instead of gap, which breaks on wrap",
    ],
    keywords: "flex flexbox display flex-direction justify-content align-items gap wrap fr",
  },
  {
    track: "CSS",
    title: "grid",
    syntax: "grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))",
    summary: "Two-dimensional layout defining rows and columns at once.",
    example: ".grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}",
    mistakes: [
      "Using Grid where Flexbox would be simpler",
      "Using fixed px columns that overflow on mobile",
    ],
    keywords: "grid css grid two dimensional columns rows fr minmax area template",
  },
  {
    track: "CSS",
    title: "Media queries",
    syntax: "@media (min-width: 768px) { … }",
    summary: "Applies styles only at certain viewport widths. Mobile-first uses min-width.",
    example: ".grid { grid-template-columns: 1fr; }\n\n@media (min-width: 768px) {\n  .grid { grid-template-columns: repeat(3, 1fr); }\n}",
    mistakes: [
      "Writing min-width as max-width by mistake",
      "Writing a media query without a width unit",
    ],
    keywords: "media query responsive breakpoint mobile min-width max-width viewport",
  },
  {
    track: "CSS",
    title: "CSS variables",
    syntax: ":root { --brand: #4f46e5; }",
    summary: "Custom properties store reusable values, enabling consistent theming.",
    example: ":root {\n  --brand: #4f46e5;\n  --radius: 8px;\n}\n\n.btn { background: var(--brand); }",
    mistakes: [
      "Declaring variables outside :root so they are not inherited",
      "Hard-coding the same colour in many places instead",
    ],
    keywords: "variables custom properties var root theme token palette",
  },

  // ---------------------------------------------------------- JavaScript
  {
    track: "JAVASCRIPT",
    title: "let, const and var",
    syntax: "const name = 'Alex';",
    summary: "const cannot be reassigned, let can. Avoid var in new code.",
    example: "const name = \"Alex\";\nlet score = 0;\nscore = score + 10;",
    mistakes: [
      "Reassigning a const, which throws a TypeError",
      "Using var because a tutorial from 2015 used it",
    ],
    keywords: "let const var variable declaration scope",
  },
  {
    track: "JAVASCRIPT",
    title: "function",
    syntax: "function greet(name) { return 'Hello, ' + name; }",
    summary: "A reusable block of code with parameters and a return value.",
    example: "function add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(2, 3)); // 5",
    mistakes: [
      "Forgetting to return the calculated value",
      "Using a function before it is defined, when using a const arrow function",
    ],
    keywords: "function return parameter argument arrow callback",
  },
  {
    track: "JAVASCRIPT",
    title: "array methods",
    syntax: "items.map(fn).filter(fn).reduce(fn, 0)",
    summary: "Transform, filter and aggregate collections without mutating the original.",
    example:
      'const scores = [82, 91, 47];\nscores.map(s => s * 2);\nscores.filter(s => s >= 60);\nscores.reduce((sum, s) => sum + s, 0);',
    mistakes: [
      "Expecting map to modify the array in place",
      "Using forEach when you needed the returned array from map",
    ],
    keywords: "array map filter reduce find some every forEach sort push length",
  },
  {
    track: "JAVASCRIPT",
    title: "object",
    syntax: "const user = { name: 'Alex', age: 20 };",
    summary: "Groups related data under named keys. Supports destructuring and spreading.",
    example:
      'const user = { name: "Alex", address: { city: "London" } };\nconst { name } = user;\nuser.address?.city;',
    mistakes: [
      "Calling a method on a property that is undefined",
      "Mutating an object while iterating over it",
    ],
    keywords: "object key value property destructuring spread optional chaining",
  },
  {
    track: "JAVASCRIPT",
    title: "querySelector",
    syntax: "document.querySelector('.card')",
    summary: "Finds the first element matching a CSS selector, or null.",
    example:
      'const heading = document.querySelector("h1");\nheading.textContent = "New title";\n\nconst all = document.querySelectorAll(".card");',
    mistakes: [
      "Not checking for null before using the result",
      "Running before the DOM exists, without defer or DOMContentLoaded",
    ],
    keywords: "dom querySelector querySelectorAll getElementById createElement append textContent",
  },
  {
    track: "JAVASCRIPT",
    title: "addEventListener",
    syntax: "button.addEventListener('click', (event) => { … })",
    summary: "Runs a function when an event occurs on an element.",
    example:
      'form.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const value = input.value.trim();\n});',
    mistakes: [
      "Forgetting preventDefault on a form submit, which reloads the page",
      "Attaching a listener before the element exists",
    ],
    keywords: "event addEventListener click submit keydown input event target preventDefault",
  },
  {
    track: "JAVASCRIPT",
    title: "async and await",
    syntax: "const data = await fetch(url).then(r => r.json());",
    summary: "Waits for promises without blocking the page. Wrap in try/catch.",
    example:
      'async function load() {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error("Failed");\n    return await response.json();\n  } catch (error) {\n    console.error(error);\n  }\n}',
    mistakes: [
      "Not checking response.ok, so 404 pages get parsed as JSON",
      "Awaiting requests sequentially when Promise.all would be faster",
    ],
    keywords: "async await promise fetch then catch api json asynchronous",
  },
  {
    track: "JAVASCRIPT",
    title: "localStorage",
    syntax: "localStorage.setItem('key', JSON.stringify(value))",
    summary: "Stores strings persistently in the browser. Convert objects with JSON.",
    example:
      'const tasks = JSON.parse(localStorage.getItem("tasks")) || [];\ntasks.push("Write docs");\nlocalStorage.setItem("tasks", JSON.stringify(tasks));',
    mistakes: [
      "Storing an object without stringify, which yields [object Object]",
      "Parsing without checking for null first, which throws",
    ],
    keywords: "localStorage storage persist session cookie JSON string",
  },
];
