import type { SeedCourse } from "./types";

/**
 * HTML Fundamentals — the full beginner path.
 *
 * Every lesson follows the same shape: objective -> explanation -> syntax ->
 * example -> interactive example -> mistakes -> practice -> quiz, so students
 * always know what comes next.
 */
export const htmlCourse: SeedCourse = {
  title: "HTML Fundamentals",
  slug: "html",
  description:
    "Learn how websites are structured. HTML is the skeleton of every page: it gives your content meaning, and it is the first thing you should master.",
  tagline: "Learn how websites are structured",
  track: "HTML",
  icon: "FileCode2",
  accent: "html",
  lessons: [
    // ---------------------------------------------------------------- 01
    {
      slug: "html-introduction",
      title: "Introduction to HTML",
      summary: "What HTML is, why every page starts with it, and how a browser reads it.",
      estimatedMinutes: 8,
      objective:
        "Understand what HTML is, what it does, and be able to write and open your first HTML page.",
      blocks: [
        {
          type: "paragraph",
          text: "Every website you have ever visited was built out of three main ingredients: **HTML** for structure, **CSS** for style, and **JavaScript** for behaviour. HTML is the one you must learn first, and it is the easiest of the three to start with.",
        },
        {
          type: "paragraph",
          text: "HTML stands for **HyperText Markup Language**. Despite the name, it is not a programming language — it is a *markup* language. That means you do not give it instructions. You wrap your content in tags that describe what that content **is**.",
        },
        {
          type: "paragraph",
          text: "When someone asks a browser to show a page, the browser reads your HTML from top to bottom and builds a live document out of it. A heading becomes a heading because you told it to be one.",
        },
        {
          type: "heading",
          text: "Anatomy of a tag",
        },
        {
          type: "paragraph",
          text: "A tag usually comes in a pair. The first is the **opening tag** and the second is the **closing tag**. The closing tag is identical except for a forward slash.",
        },
        {
          type: "code",
          lang: "html",
          code: `<h1>Hello World</h1>`,
          caption: "An opening tag, some content, and a closing tag.",
        },
        {
          type: "list",
          items: [
            "`<h1>` is the opening tag — it starts the element.",
            "`Hello World` is the content that lives inside it.",
            "`</h1>` is the closing tag — it ends the element.",
            "Everything between the two tags is the element's **content**.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Try it yourself",
          text: "Create a file called `index.html`, paste in `<h1>Hello World</h1>`, save it, then double-click the file. It opens in your browser. That is all HTML is — a text file the browser knows how to read.",
        },
        {
          type: "heading",
          text: "The three languages",
        },
        {
          type: "table",
          head: ["Language", "Job", "Example"],
          rows: [
            ["HTML", "Describes what content *is*", "`<h1>My Name</h1>`"],
            ["CSS", "Decides how it *looks*", "`h1 { color: blue; }`"],
            ["JavaScript", "Decides how it *behaves*", "`button.addEventListener(...)`"],
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "A useful rule for the whole course",
          text: "HTML is for **meaning**, CSS is for **looks**. If you are about to add a tag purely to change the colour or spacing of something, you probably want CSS instead.",
        },
        {
          type: "exercise",
          prompt:
            "Write an HTML page with a heading that says your name and a paragraph underneath introducing yourself.",
          checklist: [
            "The page has an `<h1>` containing your name",
            "The page has a `<p>` with at least one sentence",
            "Every tag you opened is also closed",
          ],
          starter: {
            html: `<h1>Your name here</h1>
<p>Write a sentence or two about yourself.</p>`,
            css: `h1 {
  color: #4f46e5;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What does HTML stand for?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "HyperText Markup Language", correct: true },
            { text: "High Transfer Machine Language", correct: false },
            { text: "Hyperlink Text Making Language", correct: false },
            { text: "Home Tool Markup Language", correct: false },
          ],
          explanation:
            "HTML is HyperText Markup Language. It is a markup language for describing the structure of a page, not a programming language.",
          xpReward: 10,
        },
        {
          question: "Which of these is a correct closing tag?",
          type: "MULTIPLE_CHOICE",
          code: `<h1>Hello World</h1>`,
          options: [
            { text: "<h1>", correct: false },
            { text: "</h1>", correct: true },
            { text: "<h1/>", correct: false },
            { text: "<h1:>", correct: false },
          ],
          explanation:
            "A closing tag is written with a forward slash before the element name: `</h1>`. The `<h1/>` form is XML syntax and is not how HTML is normally written.",
          xpReward: 10,
        },
        {
          question:
            "True or false: HTML is a programming language used to give the browser instructions.",
          type: "TRUE_FALSE",
          options: [
            { text: "True", correct: false },
            { text: "False", correct: true },
          ],
          explanation:
            "HTML is a markup language. You describe what content is; you do not give the browser instructions. Instructions come from JavaScript.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 02
    {
      slug: "html-structure",
      title: "HTML Structure",
      summary: "The document skeleton: doctype, html, head and body.",
      estimatedMinutes: 12,
      objective:
        "Understand the four parts every HTML document has, and what belongs in each one.",
      blocks: [
        {
          type: "paragraph",
          text: "Every HTML page has the same overall shape. There are four parts, and each one has a specific job.",
        },
        {
          type: "code",
          lang: "html",
          code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This content is visible in the browser.</p>
  </body>
</html>`,
          caption: "The standard structure of a modern HTML5 page.",
        },
        {
          type: "list",
          items: [
            "`<!DOCTYPE html>` — tells the browser 'this is a modern HTML5 page'. It always goes first and never has a closing tag.",
            "`<html>` — the root element. Everything else lives inside it.",
            "`<head>` — information *about* the page. The user never sees this.",
            "`<body>` — the visible content. Everything the visitor actually sees goes here.",
          ],
        },
        {
          type: "heading",
          text: "What goes in the head?",
        },
        {
          type: "paragraph",
          text: "The `<head>` holds metadata — settings and descriptions rather than content. The three you will use most:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "`<meta charset=\"UTF-8\">` makes sure symbols like emoji and accents display correctly. Put it first.",
            "`<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">` is what makes your page work on phones. Without it, mobile browsers zoom out and show a tiny desktop layout.",
            "`<title>` is the text shown on the browser tab, and in search results.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "The most common beginner mistake",
          text: "Putting visible text inside `<head>`. If your content disappears from the page, check whether you wrote it in `<head>` instead of `<body>`.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Why the lang attribute matters",
          text: "`lang=\"en\"` tells the browser and screen readers which language the page is in. Search engines and translation tools use it too. It costs one attribute and makes your site more accessible.",
        },
        {
          type: "playground",
          instructions: "The preview shows only what is inside <body>. Edit both and watch what appears.",
          height: 200,
          files: {
            html: `<h1>Visible content</h1>
<p>This is in the body, so you can see it.</p>

<!-- Try moving the <h1> into the head and re-run. -->`,
            css: `body {
  font-family: system-ui, sans-serif;
  padding: 20px;
}`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Build the standard structure from scratch: a doctype, an html tag with lang set, a head with charset, viewport and a title, and a body with a heading.",
          checklist: [
            "The file starts with `<!DOCTYPE html>`",
            "There is a `<head>` with charset, viewport and a `<title>`",
            "All visible content is inside `<body>`",
            "The html tag has `lang=\"en\"`",
          ],
          starter: {
            html: `<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="" />
    <title></title>
  </head>
  <body>
    
  </body>
</html>`,
            css: ``,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "Which section contains the content the visitor actually sees?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "<head>", correct: false },
            { text: "<body>", correct: true },
            { text: "<title>", correct: false },
            { text: "<meta>", correct: false },
          ],
          explanation:
            "The `<body>` holds everything visible on the page. The `<head>` holds metadata that the visitor does not see directly.",
          xpReward: 10,
        },
        {
          question: "What does the `<!DOCTYPE html>` declaration do?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It imports an HTML template file", correct: false },
            { text: "It tells the browser to render the page in standards mode as HTML5", correct: true },
            { text: "It declares the page language", correct: false },
            { text: "It links the CSS file", correct: false },
          ],
          explanation:
            "The doctype tells the browser to use modern standards mode rather than legacy compatibility mode, which changes how the page is rendered.",
          xpReward: 10,
        },
        {
          question:
            "Which meta tag is required for a page to display properly on mobile devices?",
          type: "MULTIPLE_CHOICE",
          code: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
          options: [
            { text: "The charset meta tag", correct: false },
            { text: "The viewport meta tag", correct: true },
            { text: "The description meta tag", correct: false },
            { text: "The author meta tag", correct: false },
          ],
          explanation:
            "The viewport meta tag tells mobile browsers to use the device's real width instead of zooming out to fit a desktop layout.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 03
    {
      slug: "html-headings",
      title: "HTML Headings",
      summary: "The six heading levels and how to choose between them.",
      estimatedMinutes: 10,
      objective: "Use the six HTML heading levels correctly and understand how they build a page outline.",
      blocks: [
        {
          type: "paragraph",
          text: "HTML provides six heading levels, from `<h1>` to `<h6>`. The number is not about size — it is about **importance**. The browser picks the font size; you pick the meaning.",
        },
        {
          type: "code",
          lang: "html",
          code: `<h1>Main Heading</h1>
<h2>Sub Heading</h2>
<h3>Section Heading</h3>
<h4>Minor Heading</h4>
<h5>Smaller Heading</h5>
<h6>Smallest Heading</h6>`,
        },
        {
          type: "paragraph",
          text: "Think of headings as the outline of a document. A reader (or a screen reader) can scan your headings alone and understand the structure of the page before reading a single paragraph.",
        },
        {
          type: "heading",
          text: "The h1 rule",
        },
        {
          type: "list",
          items: [
            "Each page should normally have exactly **one** `<h1>` — the main title of that page.",
            "Never skip a level. Going from `<h1>` straight to `<h3>` breaks the outline for screen reader users.",
            "Do not choose a heading level for its font size. If the size is wrong, change it with CSS instead.",
          ],
        },
        {
          type: "callout",
          variant: "mistake",
          title: "Common mistake",
          text: "Using `<h1>` for every section heading 'because it looks bigger'. A page with six `<h1>` tags tells assistive technology that the page has six separate main topics. Structure breaks, and it is hard to undo later.",
        },
        {
          type: "playground",
          instructions: "Change the numbers and watch both the size and the document outline change.",
          height: 260,
          files: {
            html: `<h1>Recipe: Banana Bread</h1>

<h2>Ingredients</h2>
<p>Three bananas, flour, sugar, butter.</p>

<h3>Optional extras</h2>
<p>Chocolate chips, walnuts.</p>

<h2>Method</h2>
<p>Mix everything, then bake for an hour.</p>`,
            css: `body {
  font-family: Georgia, serif;
  padding: 20px;
  line-height: 1.6;
}
h1 { color: #b45309; }
h2 { color: #92400e; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Best practice",
          text: "Test your outline by viewing the page with the CSS disabled, or just read the headings in order. If it does not read like a sensible summary, the structure is wrong.",
        },
        {
          type: "exercise",
          prompt:
            "Create a page outline for a blog post. Use one h1 for the post title, h2s for each section, and an h3 inside at least one section.",
          checklist: [
            "Exactly one `<h1>`",
            "At least two `<h2>` sections",
            "At least one `<h3>` nested under an h2",
            "No level is skipped",
          ],
          starter: {
            html: `<h1>How I Learned to Code</h1>

<h2>Where I started</h2>
<p>Write about your first experience.</p>

<h2>What I learned</h2>
<p>Write about a lesson.</p>

<h3>One specific thing</h3>
<p>Go deeper on a single idea.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "How many `<h1>` elements should a typical page contain?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "One", correct: true },
            { text: "One per section", correct: false },
            { text: "As many as you like", correct: false },
            { text: "Always six", correct: false },
          ],
          explanation:
            "A page should normally have exactly one `<h1>` that describes its main subject. Sections use `<h2>` and below.",
          xpReward: 10,
        },
        {
          question: "Which heading tag is missing from this list: h1, h2, h4, h6?",
          type: "CODE_COMPLETION",
          options: [
            { text: "h3", correct: true },
            { text: "h5", correct: false },
            { text: "h7", correct: false },
            { text: "h0", correct: false },
          ],
          explanation:
            "HTML only has `<h1>` through `<h6>`. The list is skipping `<h3>`, which means the structure jumps a level — something to avoid.",
          xpReward: 10,
        },
        {
          question: "Why should you avoid skipping heading levels?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It makes the page load more slowly", correct: false },
            { text: "It breaks the document outline that screen reader users rely on", correct: true },
            { text: "It stops headings from being bold", correct: false },
            { text: "It is a syntax error", correct: false },
          ],
          explanation:
            "Screen reader users navigate pages by heading level. Skipping from h1 to h3 removes a level in the outline, making the structure harder to follow.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 04
    {
      slug: "html-paragraphs",
      title: "HTML Paragraphs",
      summary: "Creating paragraphs of text with the p element.",
      estimatedMinutes: 8,
      objective: "Understand how to create paragraphs using HTML.",
      blocks: [
        {
          type: "paragraph",
          text: "The `<p>` element is the workhorse for text. It creates a paragraph — a block of text with a small space above and below it.",
        },
        {
          type: "code",
          lang: "html",
          code: `<p>Hello World</p>`,
          caption: "The simplest possible paragraph.",
        },
        {
          type: "paragraph",
          text: "`<p>` creates a paragraph, and that is all it does. The browser adds the spacing for you — you should never insert empty `<p>` tags to create gaps.",
        },
        {
          type: "heading",
          text: "Why line breaks in the source do not matter",
        },
        {
          type: "paragraph",
          text: "HTML collapses any run of whitespace into a single space. This surprises almost every beginner.",
        },
        {
          type: "playground",
          instructions: "Press Enter inside the paragraph in the HTML tab. The output will not change — that is whitespace collapsing.",
          height: 180,
          files: {
            html: `<p>This sentence is
split across three
lines in the HTML source.</p>

<p>But the browser
still shows it as one continuous line, because HTML collapses
whitespace into single spaces.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "info",
          title: "So how do I force a line break?",
          text: "Use the `<br>` element. It is an empty element — it has no closing tag — and it forces a line break. Use it for things like addresses or poetry, not for paragraph spacing.",
        },
        {
          type: "code",
          lang: "html",
          code: `<p>CodeLearn HQ<br>221B Baker Street<br>London</p>`,
          caption: "<br> forces each address onto its own line.",
        },
        {
          type: "callout",
          variant: "mistake",
          title: "Common mistakes",
          text: "1. Wrapping every line in its own `<p>` to control spacing. 2. Using `<br><br>` to add vertical space. 3. Putting a heading inside a `<p>` — block elements like `<h1>` and `<div>` cannot live inside a paragraph.",
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Best practice",
          text: "Write your text naturally, let the browser handle spacing, and use CSS when you need custom vertical rhythm. Your HTML should read like a document, not like a layout.",
        },
        {
          type: "exercise",
          prompt: "Create a webpage containing a heading and three paragraphs.",
          checklist: [
            "The page has one heading",
            "The page has exactly three `<p>` paragraphs",
            "Each paragraph is closed with `</p>`",
            "No `<br>` tags are used for spacing",
          ],
          starter: {
            html: `<h1>My Website</h1>

<p>Write the first paragraph here.</p>

<p>Write the second paragraph here.</p>

<p>Write the third paragraph here.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What HTML element is used for a paragraph?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "<p>", correct: true },
            { text: "<para>", correct: false },
            { text: "<paragraph>", correct: false },
            { text: "<text>", correct: false },
          ],
          explanation: "The paragraph element is `<p>`, written as `<p>content</p>`.",
          xpReward: 10,
        },
        {
          question:
            "You split a sentence across three lines in your HTML source. What will the browser display?",
          type: "MULTIPLE_CHOICE",
          code: `<p>This is a long
sentence split
over three lines.</p>`,
          options: [
            { text: "Three separate lines", correct: false },
            { text: "One continuous line, because HTML collapses whitespace", correct: true },
            { text: "A syntax error", correct: false },
            { text: "The text disappears", correct: false },
          ],
          explanation:
            "HTML treats any run of whitespace — spaces, tabs, newlines — as a single space. Source formatting does not affect layout. Use `<br>` when you genuinely need a line break.",
          xpReward: 10,
        },
        {
          question: "Which of these is NOT a valid use of the `<br>` element?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Splitting a postal address across lines", correct: false },
            { text: "Adding vertical space between paragraphs", correct: true },
            { text: "Keeping a poem's line breaks", correct: false },
          ],
          explanation:
            "`<br>` controls line breaks, not spacing between blocks. Two consecutive `<br>` tags used as a spacer is a classic beginner mistake — use CSS margin instead.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 05
    {
      slug: "html-links",
      title: "HTML Links",
      summary: "Sending people to other pages with the a element.",
      estimatedMinutes: 10,
      objective: "Create working links, understand the href attribute, and tell internal links apart from external ones.",
      blocks: [
        {
          type: "paragraph",
          text: "The `<a>` element creates a hyperlink. Its most important attribute is `href`, which stands for **hypertext reference** — the destination.",
        },
        {
          type: "code",
          lang: "html",
          code: `<a href="https://developer.mozilla.org">MDN Web Docs</a>`,
          caption: "The minimum needed for a working link.",
        },
        {
          type: "paragraph",
          text: "Link text should describe where the link goes. A visitor should be able to understand the destination from the text alone, without hovering.",
        },
        {
          type: "heading",
          text: "Types of links",
        },
        {
          type: "table",
          head: ["Type", "href value", "Example"],
          rows: [
            ["External", "Full URL with https", `<a href="https://example.com">`],
            ["Internal", "Relative path", `<a href="about.html">`],
            ["Anchor", "Hash on this page", `<a href="#section">`],
            ["Email", "mailto: protocol", `<a href="mailto:hi@example.com">`],
            ["Phone", "tel: protocol", `<a href="tel:+441234567">`],
          ],
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Always use https",
          text: "Link with `https://`, never `http://`. Modern browsers mark insecure links as 'Not secure', and some refuse to open them entirely.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Opening a link in a new tab",
          text: "You can add `target=\"_blank\"` to open a link in a new tab. Modern browsers automatically add `rel=\"noopener\"` for you, which stops the new page from reaching back through `window.opener`. Use it sparingly — most users find unexpected new tabs annoying.",
        },
        {
          type: "playground",
          instructions: "Hover the links below. Notice the status bar at the bottom-left of the preview showing the destination.",
          height: 220,
          files: {
            html: `<p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML">MDN HTML reference</a></p>

<p><a href="#tips">Jump to the tips section</a></p>

<p><a href="mailto:hello@codelearn.dev">Email us</a></p>

<h3 id="tips">Tips</h3>
<p>You just scrolled using an anchor link.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
a { color: #4f46e5; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "mistake",
          title: "Common mistakes",
          text: "1. Writing `href=\"www.example.com\"` — without a protocol the browser treats it as a relative file path and the link breaks. 2. Link text that says 'click here'. 3. Forgetting the closing `</a>` tag.",
        },
        {
          type: "exercise",
          prompt:
            "Create a page with three links: one to another website, one that jumps to a section lower down the page, and one that opens your email client.",
          checklist: [
            "One link starts with `https://`",
            "One link's href starts with `#` and the target element has a matching `id`",
            "One link uses `mailto:`",
            "Every link has meaningful text, not 'click here'",
          ],
          starter: {
            html: `<a href="">External link</a>

<p><a href="">Jump to bottom</a></p>

<p><a href="">Email a friend</a></p>

<h3 id="bottom">Bottom section</h3>
<p>You made it.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "Which attribute of the `<a>` element specifies the destination?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "src", correct: false },
            { text: "href", correct: true },
            { text: "link", correct: false },
            { text: "target", correct: false },
          ],
          explanation:
            "`href` is the hypertext reference — the destination of the link. `src` is used by elements like `<img>` and `<script>`.",
          xpReward: 10,
        },
        {
          question: "What happens if you write `href=\"www.example.com\"` with no protocol?",
          type: "DEBUGGING",
          options: [
            { text: "The link works exactly the same as with https", correct: false },
            { text: "The browser treats it as a relative file path, so the link breaks", correct: true },
            { text: "The browser automatically adds https", correct: false },
            { text: "It is a syntax error and nothing renders", correct: false },
          ],
          explanation:
            "Without a protocol, the browser assumes a relative path on your own site and looks for a folder literally called 'www.example.com'. Always write the full `https://` address.",
          xpReward: 10,
        },
        {
          question: "What does `href=\"#about\"` do?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Opens a new page called about", correct: false },
            { text: "Scrolls to the element with id=\"about\" on the current page", correct: true },
            { text: "Sends an email", correct: false },
            { text: "Downloads a file", correct: false },
          ],
          explanation:
            "A hash fragment such as `#about` jumps to the element on the current page whose `id` is `about`.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 06
    {
      slug: "html-images",
      title: "HTML Images",
      summary: "Displaying images, and why alt text is not optional.",
      estimatedMinutes: 9,
      objective: "Add images to a page and write alt text that is genuinely useful.",
      blocks: [
        {
          type: "paragraph",
          text: "Images are added with the `<img>` element. It is an **empty element** — it has no closing tag, because there is nothing inside it to close.",
        },
        {
          type: "code",
          lang: "html",
          code: `<img src="cat.jpg" alt="A tabby cat sitting on a windowsill" />`,
          caption: "The two attributes every image needs.",
        },
        {
          type: "list",
          items: [
            "`src` is the file path or URL of the image.",
            "`alt` is the text description. It is the single most important attribute on this element.",
          ],
        },
        {
          type: "heading",
          text: "Why alt text is not optional",
        },
        {
          type: "paragraph",
          text: "Roughly one in five people on the web uses a screen reader. When a screen reader reaches an image, it reads the `alt` text aloud. If the `alt` attribute is missing, it may announce the file name instead — something like 'IMG_4821 dot JPG'.",
        },
        {
          type: "paragraph",
          text: "Alt text is also what displays when an image fails to load, and many screen readers read it when a user hovers over the image.",
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Writing good alt text",
          text: "Describe what the image conveys in context, in under about 125 characters. Skip filler like 'image of'. If the image is purely decorative, use `alt=\"\"` — an empty alt tells screen readers to skip it, which is correct and better than a redundant description.",
        },
        {
          type: "callout",
          variant: "mistake",
          title: "Common mistakes",
          text: "1. Writing `alt=\"image\"` or `alt=\"photo\"` — tells the user nothing. 2. Omitting `alt` entirely. 3. Using an image when text would work. 4. Forgetting that a relative path like `cat.jpg` must actually exist in the same folder as your HTML file.",
        },
        {
          type: "playground",
          instructions: "Remove the alt attribute from the second image, then use a screen reader to hear the difference.",
          height: 200,
          files: {
            html: `<h2>Working with alt text</h2>

<img
  src="https://picsum.photos/id/237/400/200"
  alt="A black dog sitting on a wooden floor"
/>

<img
  src="https://picsum.photos/id/1025/400/200"
/>

<p>Two images. Only the first one is described.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
img { border-radius: 8px; margin-bottom: 12px; }`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Add three images to a page, each with a descriptive alt attribute. At least one should be a real web URL rather than a local file.",
          checklist: [
            "All three images use `<img>` with no closing tag",
            "Every image has an `alt` attribute",
            "The alt text describes the image content, not just the file",
            "Images are given a `width` and `height` or a CSS max-width",
          ],
          starter: {
            html: `<img src="https://picsum.photos/id/1015/400/250" alt="" />
<img src="https://picsum.photos/id/1016/400/250" alt="" />
<img src="https://picsum.photos/id/1018/400/250" alt="" />`,
            css: `img { max-width: 100%; height: auto; border-radius: 8px; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "Why is the `alt` attribute important?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It makes the image load faster", correct: false },
            { text: "It describes the image for screen reader users and when it fails to load", correct: true },
            { text: "It sets the image size", correct: false },
            { text: "It links the image to a file", correct: false },
          ],
          explanation:
            "Alt text is read aloud by screen readers and shown when an image cannot load. For a purely decorative image, an empty `alt=\"\"` is the correct choice.",
          xpReward: 10,
        },
        {
          question: "Does the `<img>` element need a closing tag?",
          type: "TRUE_FALSE",
          options: [
            { text: "True — every tag must be closed", correct: false },
            { text: "False — <img> is a void element with no closing tag", correct: true },
          ],
          explanation:
            "False. `<img>` is a void element, so it has no content and no closing tag. Writing `</img>` is invalid HTML.",
          xpReward: 10,
        },
        {
          question: "Which alt text is best for an image of a smiling barista pouring coffee?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "alt=\"image\"", correct: false },
            { text: "alt=\"IMG_4021.jpg\"", correct: false },
            { text: "alt=\"A barista smiling while pouring coffee\"", correct: true },
            { text: "alt=\"photo of photo of coffee\"", correct: false },
          ],
          explanation:
            "Good alt text describes the content and purpose of the image concisely. 'image' and file names convey nothing useful.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 07
    {
      slug: "html-lists",
      title: "HTML Lists",
      summary: "Ordered and unordered lists, and nesting them.",
      estimatedMinutes: 9,
      objective: "Group related items into ordered and unordered lists, including nested lists.",
      blocks: [
        {
          type: "paragraph",
          text: "Lists are how you show that several items belong together. There are two main types, and choosing the right one changes how screen readers announce it.",
        },
        {
          type: "code",
          lang: "html",
          code: `<!-- Unordered: the order does not matter -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<!-- Ordered: the order matters -->
<ol>
  <li>Open your editor</li>
  <li>Write some HTML</li>
  <li>Save and open in a browser</li>
</ol>`,
        },
        {
          type: "table",
          head: ["Element", "Name", "Use when"],
          rows: [
            ["<ul>", "Unordered list", "Order is irrelevant — features, ingredients, tags"],
            ["<ol>", "Ordered list", "Steps, rankings, a recipe method"],
            ["<li>", "List item", "Each entry inside either list"],
          ],
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Use the right list, not just any list",
          text: "A `<ul>` tells assistive technology 'this is a group of related items' and lets the user jump between them. A pile of `<div>`s, or a grid of styled `<p>` tags, loses that meaning entirely. Style your lists freely with CSS, but keep the semantics.",
        },
        {
          type: "heading",
          text: "Nesting lists",
        },
        {
          type: "paragraph",
          text: "You can put a list inside a list item to show sub-points. The nested list goes **inside** the `<li>`, not as a sibling of it.",
        },
        {
          type: "code",
          lang: "html",
          code: `<ul>
  <li>Frontend skills
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend skills
    <ul>
      <li>Node.js</li>
    </ul>
  </li>
</ul>`,
        },
        {
          type: "callout",
          variant: "mistake",
          title: "The most common list bug",
          text: "Writing `<ul><ul>...` as a sibling of the first list instead of nesting it inside an `<li>`. If your indentation does not line up, the nesting is wrong.",
        },
        {
          type: "playground",
          instructions: "Notice the default bullets and numbers. The CSS below removes them — the HTML still says 'this is a list'.",
          height: 260,
          files: {
            html: `<h3>Shopping list (unordered)</h3>
<ul>
  <li>Bread</li>
  <li>Milk</li>
  <li>Apples</li>
</ul>

<h3>Steps (ordered)</h3>
<ol>
  <li>Mix the dry ingredients</li>
  <li>Add the wet ingredients</li>
  <li>Bake for 25 minutes</li>
</ol>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
ol { color: #b45309; }`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Create an unordered list of your top five favourite things, and an ordered list of the steps for making a cup of tea. Nest a sub-list inside the ordered list.",
          checklist: [
            "One `<ul>` with five `<li>` items",
            "One `<ol>` with at least three steps",
            "At least one `<li>` contains a nested list",
            "The nested list is inside an `<li>`, not a sibling of `<ol>`",
          ],
          starter: {
            html: `<h3>Favourite things</h3>
<ul>
  <li></li>
</ul>

<h3>Making tea</h3>
<ol>
  <li></li>
</ol>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "Which element should you use for a numbered set of instructions?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "<ul>", correct: false },
            { text: "<ol>", correct: true },
            { text: "<dl>", correct: false },
            { text: "<p>", correct: false },
          ],
          explanation:
            "`<ol>` creates an ordered list and is rendered with numbers, which suits sequential steps.",
          xpReward: 10,
        },
        {
          question: "Where must a nested list be placed?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Directly inside the parent <ul> or <ol>", correct: false },
            { text: "Inside an <li> of the parent list", correct: true },
            { text: "After the closing tag of the parent list", correct: false },
            { text: "Inside a <p>", correct: false },
          ],
          explanation:
            "A nested list must live inside a list item. Placing `<ul>` directly inside `<ul>` is invalid and browsers will correct it in unpredictable ways.",
          xpReward: 10,
        },
        {
          question: "What does `<li>` stand for?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Line index", correct: false },
            { text: "Link item", correct: false },
            { text: "List item", correct: true },
            { text: "List indent", correct: false },
          ],
          explanation: "`<li>` is the list item element used inside `<ul>` and `<ol>`.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 08
    {
      slug: "html-tables",
      title: "HTML Tables",
      summary: "Displaying tabular data properly, including headers and captions.",
      estimatedMinutes: 12,
      objective:
        "Use tables to present tabular data with proper headers, captions and row scope.",
      blocks: [
        {
          type: "paragraph",
          text: "A table shows data where **rows and columns** both matter — a price list, a timetable, a set of results. If the data has no natural grid, it is not a table.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Never use a table for layout",
          text: "This was common practice in the early 2000s and it is now considered a serious mistake. Tables are for data. Use CSS Grid or Flexbox for layout — those pages are lighter, more accessible, and far easier to maintain.",
        },
        {
          type: "heading",
          text: "The basic structure",
        },
        {
          type: "code",
          lang: "html",
          code: `<table>
  <caption>Opening hours</caption>
  <thead>
    <tr>
      <th scope="col">Day</th>
      <th scope="col">Hours</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Monday</th>
      <td>09:00 – 17:00</td>
    </tr>
    <tr>
      <th scope="row">Saturday</th>
      <td>10:00 – 14:00</td>
    </tr>
  </tbody>
</table>`,
        },
        {
          type: "list",
          items: [
            "`<table>` is the table itself.",
            "`<caption>` describes the table's purpose. Place it first, always.",
            "`<thead>` wraps the header row.",
            "`<tbody>` wraps the body rows.",
            "`<tr>` is a row, `<td>` a data cell, `<th>` a header cell.",
          ],
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "What the scope attribute does",
          text: "`scope=\"col\"` marks a column header, `scope=\"row\"` marks a row header. Screen readers use it to announce 'Hours, 09:00 to 17:00' instead of just reading the cell value with no context. It is a small addition with a large effect on accessibility.",
        },
        {
          type: "code",
          lang: "css",
          code: `table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  text-align: left;
}

thead th {
  background: #f1f5f9;
}`,
          caption: "The minimum styling to make a table readable.",
        },
        {
          type: "playground",
          instructions: "Edit the cells. Notice how the browser keeps the columns aligned automatically.",
          height: 220,
          files: {
            html: `<table>
  <caption>JavaScript quiz scores</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Score</th>
      <th scope="col">Grade</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Alex</th>
      <td>92</td>
      <td>A</td>
    </tr>
    <tr>
      <th scope="row">Sam</th>
      <td>78</td>
      <td>B</td>
    </tr>
  </tbody>
</table>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
table { border-collapse: collapse; width: 100%; max-width: 420px; }
caption { text-align: left; font-weight: 600; padding-bottom: 8px; }
th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
thead th { background: #f1f5f9; }`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Build a table showing a product list with four columns: product name, category, price and stock. Include a caption, a header row, and at least four data rows.",
          checklist: [
            "A `<caption>` describes the table",
            "A `<thead>` row uses `<th scope=\"col\">` for each column",
            "At least four `<tbody>` rows, each starting with a `<th scope=\"row\">`",
            "The table is styled so it is readable",
          ],
          starter: {
            html: `<table>
  <caption></caption>
  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Category</th>
      <th scope="col">Price</th>
      <th scope="col">Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"></th>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>`,
            css: `table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
thead th { background: #f1f5f9; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What element defines a header cell in a table?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "<td>", correct: false },
            { text: "<th>", correct: true },
            { text: "<tr>", correct: false },
            { text: "<thead>", correct: false },
          ],
          explanation:
            "`<th>` defines a header cell. `<td>` is a normal data cell and `<tr>` is a row.",
          xpReward: 10,
        },
        {
          question: "What is the `scope` attribute on `<th>` for?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Setting the width of the column", correct: false },
            { text: "Telling assistive technology whether the header labels a column or a row", correct: true },
            { text: "Grouping columns together", correct: false },
            { text: "Sorting the column", correct: false },
          ],
          explanation:
            "`scope=\"col\"` or `scope=\"row\"` lets screen readers associate a data cell with its header, so they read 'Monday, 09:00 to 17:00' rather than a bare value.",
          xpReward: 10,
        },
        {
          question: "Should a `<table>` be used to lay out a page's sidebar and main content?",
          type: "TRUE_FALSE",
          options: [
            { text: "True", correct: false },
            { text: "False", correct: true },
          ],
          explanation:
            "False. Tables are for tabular data. Layout tables are hard for screen readers to navigate and impossible to make responsive — use CSS Grid or Flexbox.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 09
    {
      slug: "html-forms",
      title: "HTML Forms",
      summary: "Collecting user input with forms, inputs, labels and buttons.",
      estimatedMinutes: 14,
      objective:
        "Build a form with labelled inputs, understand name attributes, and know why a form needs a submit button.",
      blocks: [
        {
          type: "paragraph",
          text: "Forms let a page collect input — a login, a search box, a sign-up form. A form is made of a `<form>` wrapper containing controls and usually a submit button.",
        },
        {
          type: "code",
          lang: "html",
          code: `<form>
  <div>
    <label for="email">Email address</label>
    <input type="email" id="email" name="email" />
  </div>

  <div>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" />
  </div>

  <button type="submit">Sign up</button>
</form>`,
        },
        {
          type: "heading",
          text: "Labels are not optional",
        },
        {
          type: "paragraph",
          text: "Notice the `for` attribute on each `<label>` and the matching `id` on the input. That pairing does three things at once: clicking the label focuses the input, screen readers announce the label when the input is focused, and it gives the field a visible accessible name.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Why `name` matters",
          text: "The `name` attribute is how the input identifies itself when the form is submitted. An input with an `id` but no `name` will be ignored by the server — it looks perfect in the browser and sends nothing at all. This is one of the most confusing beginner bugs because nothing visibly breaks.",
        },
        {
          type: "heading",
          text: "Common input types",
        },
        {
          type: "table",
          head: ["Type", "Shows", "Notes"],
          rows: [
            ["text", "A single-line text box", "The default"],
            ["email", "Text box + email validation", "Browsers check the format"],
            ["password", "Masked text", "Never logged or displayed"],
            ["number", "Number picker", "Use `min` and `max`"],
            ["date", "Date picker", "Format varies by locale"],
            ["checkbox", "Tick box", "For independent on/off options"],
            ["radio", "Round selector", "Options in a group share one `name`"],
            ["submit", "A button", "Sends the form"],
          ],
        },
        {
          type: "playground",
          instructions: "Fill the form in and press Sign up. HTML validation is built into the browser — try an invalid email to see it.",
          height: 340,
          files: {
            html: `<form>
  <p>
    <label for="name">Full name</label><br />
    <input type="text" id="name" name="name" required />
  </p>

  <p>
    <label for="email">Email</label><br />
    <input type="email" id="email" name="email" required />
  </p>

  <p>
    <label for="pw">Password</label><br />
    <input type="password" id="pw" name="pw" required minlength="8" />
  </p>

  <p>
    <label>
      <input type="checkbox" name="terms" />
      I accept the terms
    </label>
  </p>

  <button type="submit">Sign up</button>
</form>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 340px; }
label { font-weight: 600; font-size: 14px; }
input[type="text"], input[type="email"], input[type="password"] {
  padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; width: 100%;
  margin-top: 4px; box-sizing: border-box;
}
button { padding: 9px 16px; background: #4f46e5; color: white; border: 0; border-radius: 6px; cursor: pointer; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Give the browser something to validate against",
          text: "`required`, `type=\"email\"`, `minlength`, `min` and `max` all give you free client-side validation. It is not a security measure — a determined user can bypass it — but it catches typos and saves everyone a round trip.",
        },
        {
          type: "callout",
          variant: "mistake",
          title: "Common mistakes",
          text: "1. Wrapping an `<input>` in a `<label>` without a `for`/`id` pair for other fields. 2. Using `type=\"submit\"` on a button that should not submit. 3. Forgetting that checkboxes and radios need `value` attributes to send a meaningful value.",
        },
        {
          type: "exercise",
          prompt:
            "Build a sign-up form with a name field, an email field, a password field with a minimum length of 8, a terms checkbox, and a submit button. Every field must have a label.",
          checklist: [
            "A `<form>` element wraps all the controls",
            "Every input has a matching `<label for>` and `id`",
            "Every input has a `name` attribute",
            "The password input has `minlength=\"8\"` and `required`",
            "There is a `<button type=\"submit\">`",
          ],
          starter: {
            html: `<form>
  <p>
    <label for="">Full name</label><br />
    <input type="text" id="" name="" />
  </p>

  <p>
    <label for="">Email</label><br />
    <input type="text" id="" name="" />
  </p>

  <p>
    <label for="">Password</label><br />
    <input type="text" id="" name="" />
  </p>

  <p>
    <label><input type="checkbox" name="" /> I agree to the terms</label>
  </p>

  <button type="submit">Create account</button>
</form>`,
            css: `label { font-weight: 600; font-size: 14px; }
input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; margin-top: 4px; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What does the `name` attribute on an input do?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Sets the visible label text", correct: false },
            { text: "Identifies the field when the form is submitted", correct: true },
            { text: "Styles the field", correct: false },
            { text: "Makes the field required", correct: false },
          ],
          explanation:
            "`name` is the key the field's value is submitted under. An input with an `id` but no `name` looks correct but sends nothing.",
          xpReward: 10,
        },
        {
          question: "Why must every input have a `<label>`?",
          type: "MULTIPLE_ANSWER",
          options: [
            { text: "Screen readers announce it as the field's accessible name", correct: true },
            { text: "Clicking the label focuses the input", correct: true },
            { text: "It is required by the HTML specification for every input", correct: false },
            { text: "It makes the browser validate the field", correct: false },
          ],
          explanation:
            "Labels give inputs an accessible name and a larger click target. The other two are false — `label` is not mandatory in the spec, and validation comes from `required`, `type` and constraints, not from the label.",
          xpReward: 15,
        },
        {
          question: "Which input type shows masked characters?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "text", correct: false },
            { text: "password", correct: true },
            { text: "hidden", correct: false },
            { text: "email", correct: false },
          ],
          explanation: "`type=\"password\"` masks the characters as dots as the user types.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 10
    {
      slug: "html-semantic-html",
      title: "Semantic HTML",
      summary: "Choosing elements for their meaning, not their appearance.",
      estimatedMinutes: 11,
      objective:
        "Use semantic elements to describe the purpose of page regions, improving accessibility and SEO.",
      blocks: [
        {
          type: "paragraph",
          text: "You could build an entire page out of `<div>` elements and it would look fine. But `<div>` means nothing — it is a generic container. **Semantic HTML** uses elements whose names describe what the content *is*.",
        },
        {
          type: "code",
          lang: "html",
          code: `<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="article">...</div>
</div>
<div class="footer">...</div>

<!-- Same layout, but now the browser, screen readers and
     search engines all understand the page: -->

<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>`,
          caption: "Identical appearance, completely different meaning.",
        },
        {
          type: "table",
          head: ["Element", "Use it for"],
          rows: [
            ["<header>", "Introductory content, usually at the top of a page or section"],
            ["<nav>", "Major navigation links"],
            ["<main>", "The primary content — exactly one per page"],
            ["<article>", "A self-contained piece that would make sense on its own"],
            ["<section>", "A thematic grouping with a heading"],
            ["<aside>", "Content tangentially related, like a sidebar"],
            ["<footer>", "Closing content, usually at the bottom"],
            ["<figure>", "An image or diagram with a caption"],
          ],
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Why this actually matters to you",
          text: "Screen reader users navigate by landmark: jump to main, jump to navigation, jump to headings. Search engines use landmarks to work out what a page is about. And for you as a developer, a semantic page is far easier to style and debug because the structure is already expressed in the markup.",
        },
        {
          type: "playground",
          instructions: "This page uses semantic elements. Open the developer tools and look at how the regions appear.",
          height: 280,
          files: {
            html: `<header>
  <h1>My Blog</h1>
  <nav>
    <a href="#">Home</a> &nbsp;
    <a href="#">Posts</a> &nbsp;
    <a href="#">About</a>
  </nav>
</header>

<main>
  <article>
    <h2>Understanding CSS box model</h2>
    <p>The box model is the single most useful concept in CSS layout.</p>
  </article>
</main>

<aside>
  <h3>Related links</h3>
  <ul>
    <li><a href="#">Box model reference</a></li>
    <li><a href="#">Flexbox guide</a></li>
  </ul>
</aside>

<footer>
  <p>&copy; 2026 My Blog</p>
</footer>`,
            css: `body { font-family: system-ui, sans-serif; padding: 0; margin: 0; }
header, main, aside, footer { padding: 16px 20px; }
header { background: #eef2ff; border-bottom: 1px solid #c7d2fe; }
nav a { color: #4f46e5; margin-right: 8px; }
aside { background: #f8fafc; border-top: 1px solid #e2e8f0; }
footer { border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "mistake",
          title: "A note on the W3C validator",
          text: "One `<main>` per page is the rule. Two `<main>` elements is invalid HTML and screen readers cannot tell which one is the content. If you need multiple, the correct pattern is `<main>` once, with `<article>` or `<section>` inside it.",
        },
        {
          type: "exercise",
          prompt:
            "Rebuild a simple page layout using semantic elements: a header with navigation, a main area with two articles, an aside, and a footer.",
          checklist: [
            "One `<main>` element wrapping the primary content",
            "A `<header>` containing a `<nav>`",
            "At least two `<article>` elements inside `<main>`",
            "An `<aside>` and a `<footer>` present",
            "No layout-critical `<div>` soup left in the markup",
          ],
          starter: {
            html: `<header>
  <nav><a href="#">Home</a></nav>
</header>

<main>

</main>

<aside>

</aside>

<footer>

</footer>`,
            css: `body { font-family: system-ui, sans-serif; margin: 0; }
header, main, aside, footer { padding: 16px 20px; }
nav a { margin-right: 10px; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "How many `<main>` elements should a page contain?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "One", correct: true },
            { text: "One per section", correct: false },
            { text: "As many as needed", correct: false },
            { text: "None — use a <div>", correct: false },
          ],
          explanation:
            "Exactly one `<main>` per page identifies the primary content. Multiple `<main>` elements are invalid HTML.",
          xpReward: 10,
        },
        {
          question: "Which element should wrap the main navigation links of a page?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "<div>", correct: false },
            { text: "<nav>", correct: true },
            { text: "<menu>", correct: false },
            { text: "<list>", correct: false },
          ],
          explanation:
            "`<nav>` marks a block of major navigation links, which lets screen reader users jump straight to navigation.",
          xpReward: 10,
        },
        {
          question: "What is the main advantage of semantic HTML?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It makes the page load faster", correct: false },
            { text: "It makes pages smaller", correct: false },
            { text: "It conveys meaning, improving accessibility and SEO", correct: true },
            { text: "It removes the need for CSS", correct: false },
          ],
          explanation:
            "Semantic elements describe the purpose of content, so assistive technology, search engines and browsers all understand the page structure without extra CSS.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 11
    {
      slug: "html-accessibility",
      title: "HTML Accessibility",
      summary: "Building pages everyone can use, including people using keyboards and screen readers.",
      estimatedMinutes: 12,
      objective:
        "Apply the core accessibility practices that every web developer needs to know.",
      blocks: [
        {
          type: "paragraph",
          text: "Accessibility means your page works for everyone — including people who navigate with a keyboard only, use a screen reader, have low vision, or have motor impairments. Most of it comes free if you use the right elements from the start.",
        },
        {
          type: "heading",
          text: "1. Always write alt text",
        },
        {
          type: "paragraph",
          text: "Covered in the images lesson, but it is the single biggest accessibility win. Decorative images get `alt=\"\"` so they are skipped rather than announced as noise.",
        },
        {
          type: "heading",
          text: "2. Never remove the focus outline",
        },
        {
          type: "paragraph",
          text: "When you see a focus ring around a link or button as you press Tab, that is how keyboard users know where they are. A common CSS reset deletes it, which makes the site unusable by keyboard.",
        },
        {
          type: "code",
          lang: "css",
          code: `/* This is fine — it replaces the default with a clearer one */
:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* This breaks keyboard navigation — never do it */
:focus {
  outline: none;
}`,
        },
        {
          type: "heading",
          text: "3. Use the right element for buttons and links",
        },
        {
          type: "code",
          lang: "html",
          code: `<!-- Goes somewhere: use <a> -->
<a href="/pricing">See pricing</a>

<!-- Does something on this page: use <button> -->
<button type="button" id="openMenu">Open menu</button>`,
        },
        {
          type: "paragraph",
          text: "A styled `<div onclick=\"...\">` is not a button. It cannot be focused with Tab, does not respond to Enter or Space, and is invisible to screen readers. It looks identical and is unusable.",
        },
        {
          type: "heading",
          text: "4. Label every form control",
        },
        {
          type: "paragraph",
          text: "Placeholder text is not a label. It disappears as soon as the user types, is often too low-contrast to read, and screen readers may skip it entirely. Keep placeholder text as a hint, and always use a real `<label>`.",
        },
        {
          type: "heading",
          text: "5. Make content order match the visual order",
        },
        {
          type: "paragraph",
          text: "Never reorder things with CSS `order`, `position: absolute` or a grid that scrambles reading order. If the DOM order and the visual order disagree, a screen reader user gets a jumbled page that makes no sense.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "The fastest way to test",
          text: "Put your mouse down, press Tab repeatedly, and try to use your page. If you get stuck or cannot tell where you are, neither can a keyboard user. There is no substitute for this five-second test.",
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "The four principles, summarised",
          text: "**Perceivable** — information is available to more than one sense. **Operable** — everything works by keyboard. **Understandable** — clear language, predictable behaviour. **Robust** — works with assistive technology now and in future.",
        },
        {
          type: "exercise",
          prompt:
            "Take your form from the previous lesson and audit it: every control needs a real label, a visible focus state, and the right element type.",
          checklist: [
            "Every input has a `<label>` with a matching `for`/`id`",
            "No placeholder is being used as the only label",
            "Focus outlines are visible, not removed",
            "Actionable controls use `<button>`, navigational ones use `<a>`",
          ],
          starter: {
            html: `<form>
  <p>
    <input type="email" placeholder="Email address" />
  </p>
  <p>
    <input type="password" placeholder="Password" />
  </p>
  <div onclick="alert('hi')">Submit</div>
</form>`,
            css: `input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
:focus { outline: none; }
div[onclick] { display: inline-block; padding: 9px 16px; background: #4f46e5; color: white; border-radius: 6px; cursor: pointer; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "You want a clickable element that performs an action on the current page. What should you use?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "<a> with no href", correct: false },
            { text: "<button>", correct: true },
            { text: "<div> with onclick", correct: false },
            { text: "<span> with onclick", correct: false },
          ],
          explanation:
            "`<button>` is focusable, responds to Enter and Space, and is announced correctly. A `<div>` with onclick is not — it cannot be reached by keyboard at all.",
          xpReward: 10,
        },
        {
          question: "Why is it a problem to remove the focus outline with `outline: none`?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It makes the page slower", correct: false },
            { text: "Keyboard users can no longer see where they are on the page", correct: true },
            { text: "It breaks the CSS", correct: false },
            { text: "It only affects mobile users", correct: false },
          ],
          explanation:
            "The focus ring is the only indication a keyboard user has of their position. Replace it with `:focus-visible` styling rather than deleting it.",
          xpReward: 10,
        },
        {
          question: "What alt text should a purely decorative image have?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "alt=\"decorative\"", correct: false },
            { text: "No alt attribute at all", correct: false },
            { text: "alt=\"\"", correct: true },
            { text: "alt=\"image\"", correct: false },
          ],
          explanation:
            "An empty `alt=\"\"` tells screen readers the image carries no information and to skip it. Omitting the attribute entirely makes some readers announce the filename instead.",
          xpReward: 10,
        },
      ],
    },

    // ---------------------------------------------------------------- 12
    {
      slug: "html-project",
      title: "HTML Project: Personal Profile Page",
      summary: "Put everything together in a complete, semantic profile page.",
      estimatedMinutes: 25,
      isProject: true,
      objective:
        "Combine headings, text, links, images, lists and semantic elements into a complete profile page.",
      blocks: [
        {
          type: "paragraph",
          text: "This is the final HTML lesson. You will build a complete profile page using everything from the previous eleven lessons. Take your time — read the requirements, then build it in the editor.",
        },
        {
          type: "heading",
          text: "Requirements",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "A `<header>` with an `<h1>` for your name and a short tagline paragraph.",
            "A profile photo with meaningful alt text.",
            "A `<main>` section with an `<h2>` about you and at least two paragraphs.",
            "An unordered list of your skills.",
            "A section listing three projects, each as an `<article>` with an `<h3>` and a link.",
            "A `<nav>` with links to your projects section and your contact section.",
            "A `<footer>` with a copyright line.",
            "A contact `<section>` with an email `mailto:` link.",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "Start with the outline, not the styling",
          text: "Get the tags and their nesting right first, with no CSS at all. Once the structure is correct, add CSS to make it look good. Fixing a nested-tag mistake after you have styled everything is far more painful.",
        },
        {
          type: "exercise",
          prompt:
            "Build the complete profile page described above. Work through the requirements one at a time and tick them off as you go.",
          checklist: [
            "`<header>` with `<h1>` and tagline",
            "Profile image with descriptive alt text",
            "`<main>` with an `<h2>` and two paragraphs",
            "Unordered list of at least four skills",
            "Three `<article>` project entries with `<h3>` and links",
            "`<nav>` with two links",
            "Contact section with a `mailto:` link",
            "`<footer>` with a copyright line",
            "Exactly one `<h1>` on the page",
            "No heading levels skipped",
          ],
          starter: {
            html: `<header>
  <img src="https://picsum.photos/id/1005/200/200" alt="" />
  <h1>Your Name</h1>
  <p>Your one-line tagline goes here.</p>
  <nav>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<main>
  <section>
    <h2>About me</h2>
    <p>Write about yourself here.</p>
    <p>Write a second paragraph here.</p>
  </section>

  <section>
    <h2>Skills</h2>
    <ul>
      <li></li>
    </ul>
  </section>

  <section id="projects">
    <h2>Projects</h2>
    <article>
      <h3>Project one</h3>
      <p>What it does and why you built it.</p>
      <a href="#">View project</a>
    </article>
  </section>
</main>

<footer>
  <p>&copy; 2026 Your Name</p>
</footer>`,
            css: `body {
  font-family: system-ui, sans-serif;
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
  line-height: 1.6;
}
header img { border-radius: 50%; }
nav a { margin-right: 12px; }
article { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "When you finish",
          text: "View your page's source and read it as a document. Does it make sense? If the headings alone tell the story, you have done it right. That is the HTML course complete — move on to CSS Fundamentals next.",
        },
      ],
      questions: [
        {
          question: "How many `<h1>` elements does this project require?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "One, in the header", correct: true },
            { text: "One per section", correct: false },
            { text: "One per project", correct: false },
            { text: "None", correct: false },
          ],
          explanation:
            "The page has one main subject — you — so a single `<h1>` with your name is correct. Sections and projects use `<h2>` and `<h3>`.",
          xpReward: 10,
        },
        {
          question: "Which element should wrap each project entry?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "<div>", correct: false },
            { text: "<article>", correct: true },
            { text: "<span>", correct: false },
            { text: "<aside>", correct: false },
          ],
          explanation:
            "`<article>` is designed for a self-contained piece of content that would still make sense on its own — exactly what a project entry is.",
          xpReward: 10,
        },
        {
          question: "Why should you build the structure before adding any CSS?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "CSS does not work without HTML", correct: false },
            { text: "It is faster and makes structural mistakes much easier to spot and fix", correct: true },
            { text: "Browsers require it", correct: false },
            { text: "It reduces the file size", correct: false },
          ],
          explanation:
            "Getting nesting and semantics right first, unstyled, makes errors obvious. Restructuring correctly-labelled markup after styling it is far more work.",
          xpReward: 10,
        },
      ],
    },
  ],
};
