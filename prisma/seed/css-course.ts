import type { SeedCourse } from "./types";

/** CSS Fundamentals — same lesson shape as the HTML course. */
export const cssCourse: SeedCourse = {
  title: "CSS Fundamentals",
  slug: "css",
  description:
    "Learn how to design beautiful websites. CSS decides how HTML looks and feels — colour, layout, spacing, animation and responsive design.",
  tagline: "Learn how to design beautiful websites",
  track: "CSS",
  icon: "Palette",
  accent: "css",
  lessons: [
    {
      slug: "css-introduction",
      title: "Introduction to CSS",
      summary: "What CSS is, how to link it, and the three ways to add styles.",
      estimatedMinutes: 9,
      objective: "Understand what CSS is and connect a stylesheet to an HTML page.",
      blocks: [
        {
          type: "paragraph",
          text: "CSS stands for **Cascading Style Sheets**. Where HTML describes what content *is*, CSS describes how it *looks*. Keeping them separate means you can restyle a whole site without touching its structure.",
        },
        {
          type: "heading",
          text: "The anatomy of a CSS rule",
        },
        {
          type: "code",
          lang: "css",
          code: `h1 {
  color: blue;
  font-size: 32px;
}`,
          caption: "A selector, a declaration block, and declarations inside it.",
        },
        {
          type: "list",
          items: [
            "`h1` is the **selector** — which elements to style.",
            "`color: blue;` is a **declaration** — a property and a value.",
            "The `{ }` are the **declaration block**.",
            "The semicolon `;` separates declarations. The last one can skip it, but always include it.",
          ],
        },
        {
          type: "heading",
          text: "Three ways to add CSS",
        },
        {
          type: "table",
          head: ["Method", "How", "When"],
          rows: [
            ["External", "`<link rel=\"stylesheet\" href=\"style.css\">`", "Almost always — one file for the whole site"],
            ["Internal", "`<style>` inside `<head>`", "Small, page-specific styles"],
            ["Inline", "`style=\"...\"` on the element", "Rarely — hard to override and maintain"],
          ],
        },
        {
          type: "code",
          lang: "html",
          code: `<head>
  <link rel="stylesheet" href="style.css" />
</head>`,
        },
        {
          type: "playground",
          instructions: "Everything in the CSS tab applies to the HTML tab instantly.",
          height: 200,
          files: {
            html: `<h1>Styled with CSS</h1>
<p>Change the colour and size in the CSS tab.</p>`,
            css: `body {
  font-family: system-ui, sans-serif;
  padding: 20px;
}

h1 {
  color: #0b7285;
  font-size: 36px;
}`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Link a CSS file to a page and style a heading in a colour of your choice.",
          checklist: [
            "A `<link rel=\"stylesheet\">` is in the `<head>`",
            "At least two properties are set on an element",
            "Declarations end with semicolons",
          ],
          starter: {
            html: `<h1>My styled heading</h1>
<p>A paragraph to go with it.</p>`,
            css: `h1 {
  color: #0b7285;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What does CSS stand for?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Cascading Style Sheets", correct: true },
            { text: "Computer System Styling Sheets", correct: false },
            { text: "Cascading System Syntax", correct: false },
            { text: "Creative Style Selector", correct: false },
          ],
          explanation: "CSS stands for Cascading Style Sheets.",
          xpReward: 10,
        },
        {
          question: "In `p { color: red; }`, what is `p`?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "A property", correct: false },
            { text: "A selector", correct: true },
            { text: "A value", correct: false },
            { text: "A declaration block", correct: false },
          ],
          explanation:
            "`p` is the selector — it names which elements the rule applies to. `color` is the property and `red` is the value.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-selectors",
      title: "CSS Selectors",
      summary: "Targeting elements precisely with class, id and descendant selectors.",
      estimatedMinutes: 12,
      objective: "Write selectors that target exactly the elements you want, from simple to specific.",
      blocks: [
        {
          type: "paragraph",
          text: "A selector tells CSS which elements to style. The more precisely you can describe an element, the more maintainable your CSS becomes.",
        },
        {
          type: "table",
          head: ["Selector", "Syntax", "Targets"],
          rows: [
            ["Type", "`h1`", "Every `<h1>` on the page"],
            ["Class", "`.card`", "Every element with `class=\"card\"`"],
            ["ID", "`#header`", "The one element with `id=\"header\"` (unique)"],
            ["Descendant", "`nav a`", "Any `<a>` inside a `<nav>`"],
            ["Child", "`ul > li`", "Direct children only"],
            ["Grouping", "`h1, h2`", "Any of the listed elements"],
          ],
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Prefer classes over IDs",
          text: "IDs must be unique, so they cannot be reused. Classes can appear as many times as you like. A `.button` used 40 times is far more useful than 40 unique IDs.",
        },
        {
          type: "playground",
          instructions: "Try changing the selectors and watch which elements respond.",
          height: 300,
          files: {
            html: `<nav>
  <a href="#">Home</a>
  <a href="#" class="active">Projects</a>
  <a href="#">About</a>
</nav>

<div class="card">
  <h2 class="card-title">First card</h2>
  <p>Cards are styled by class.</p>
</div>

<div class="card">
  <h2 class="card-title">Second card</h2>
  <p>Same class, same styles.</p>
</div>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }

nav a {
  margin-right: 12px;
  color: #0b7285;
}

nav .active {
  color: white;
  background: #0b7285;
  padding: 4px 10px;
  border-radius: 4px;
}

.card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 12px;
}

.card-title { margin-top: 0; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "tip",
          title: "Debugging a selector",
          text: "If a rule 'does not work', check the specificity: a later rule only wins if it is at least as specific. `.card .title` beats `.title`. When a rule is being ignored, temporarily add `outline: 2px solid red` to see whether the selector matches at all.",
        },
        {
          type: "exercise",
          prompt:
            "Style a page using at least five different selector types.",
          checklist: [
            "A type selector is used",
            "At least two class selectors are used",
            "A descendant or child selector is used",
            "A grouping selector is used",
            "A class is reused on more than one element",
          ],
          starter: {
            html: `<div class="panel">
  <h2 class="panel-title">Panel</h2>
  <p class="panel-text">Some text inside.</p>
</div>

<div class="panel">
  <h2 class="panel-title">Another panel</h2>
  <p class="panel-text">More text.</p>
</div>`,
            css: `.panel {
  border: 1px solid #e2e8f0;
  padding: 16px;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "Which selector targets an element with `class=\"card\"`?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "#card", correct: false },
            { text: ".card", correct: true },
            { text: "card", correct: false },
            { text: "[card]", correct: false },
          ],
          explanation:
            "A dot introduces a class selector. A hash introduces an ID selector, which targets `id=\"card\"` instead.",
          xpReward: 10,
        },
        {
          question: "What does the selector `nav a` target?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Only <a> elements inside <nav>", correct: true },
            { text: "Any <nav> or <a> element", correct: false },
            { text: "The <a> element that is a direct child of <nav> only", correct: false },
            { text: "Nothing — it is invalid", correct: false },
          ],
          explanation:
            "`nav a` is a descendant selector: it matches any `<a>` anywhere inside a `<nav>`, at any depth. To restrict it to direct children, write `nav > a`.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-colors",
      title: "CSS Colors",
      summary: "Colour values, hex, rgb, hsl and variables.",
      estimatedMinutes: 11,
      objective: "Set colours on any element using keyword, hex, rgb and hsl notation.",
      blocks: [
        {
          type: "paragraph",
          text: "Colour is usually the first thing people change, because it has the biggest visual impact.",
        },
        {
          type: "table",
          head: ["Format", "Example", "Notes"],
          rows: [
            ["Keyword", "`color: red`", "Only 140 fixed names"],
            ["Hex", "`color: #0b7285`", "Compact and universal"],
            ["RGB", "`color: rgb(11, 114, 133)`", "Red, green, blue from 0-255"],
            ["RGBA", "`color: rgba(11,114,133,0.5)`", "Adds transparency from 0 to 1"],
            ["HSL", "`color: hsl(189, 84%, 28%)`", "Hue, saturation, lightness"],
            ["Variable", "`color: var(--brand)`", "Reusable, defined once"],
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "Why HSL is worth learning",
          text: "HSL is how designers actually think about colour. Hue is the base colour, saturation is intensity, lightness is brightness. To make a colour 20% lighter you change one number, not all three. With hex you would have to convert to RGB, adjust, and convert back.",
        },
        {
          type: "playground",
          instructions: "Every heading below is coloured differently. Change the values and compare.",
          height: 300,
          files: {
            html: `<h1 style="color: #e8590c">Keyword & hex</h1>
<h1 style="color: rgb(11, 114, 133)">RGB</h1>
<h1 style="color: hsl(46, 100%, 48%)">HSL</h1>
<h1 style="color: rgba(220, 38, 38, 0.6)">RGBA with opacity</h1>`,
            css: `body {
  font-family: system-ui, sans-serif;
  padding: 20px;
  background: #f8fafc;
}`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "mistake",
          title: "Common mistakes",
          text: "1. Using a colour with too little contrast against the background — the WCAG guideline is a 4.5:1 contrast ratio for body text. 2. Communicating meaning by colour alone. 3. Hard-coding the same colour in twenty places instead of using a custom property.",
        },
        {
          type: "exercise",
          prompt:
            "Create a page with four headings coloured using a keyword, a hex value, an rgb value and an hsl value. Then define your main colour as a CSS variable and use it.",
          checklist: [
            "Four headings, each using a different colour notation",
            "At least one colour defined as a `--custom-property`",
            "The variable is used by at least two rules",
          ],
          starter: {
            html: `<h1>Keyword</h1>
<h1>Hex</h1>
<h1>RGB</h1>
<h1>HSL</h1>`,
            css: `:root {
  --brand: #0b7285;
}

h1:nth-child(1) { color: teal; }
h1:nth-child(2) { color: #e8590c; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "How do you write a fully transparent colour using rgb?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "rgb(0, 0, 0, 0)", correct: true },
            { text: "rgb(0, 0, 0, none)", correct: false },
            { text: "rgb(0, 0, 0, -1)", correct: false },
            { text: "rgba(0, 0, 0, 0%)", correct: false },
          ],
          explanation:
            "Modern `rgb()` accepts an alpha value from 0 to 1, where 0 is fully transparent. The legacy `rgba()` function is equivalent.",
          xpReward: 10,
        },
        {
          question: "What is the minimum recommended contrast ratio for normal body text?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "2:1", correct: false },
            { text: "3:1", correct: false },
            { text: "4.5:1", correct: true },
            { text: "21:1", correct: false },
          ],
          explanation:
            "WCAG AA requires 4.5:1 for normal text. 21:1 is the AAA maximum (pure black on pure white); large text may use 3:1.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-typography",
      title: "CSS Typography",
      summary: "font-family, font-size, spacing and line height.",
      estimatedMinutes: 12,
      objective: "Control fonts, sizes, line height and letter spacing to make text readable.",
      blocks: [
        {
          type: "paragraph",
          text: "Typography is the craft of making text readable and pleasant. Most of it is five properties.",
        },
        {
          type: "code",
          lang: "css",
          code: `body {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: 0.01em;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
}`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Always provide a font stack",
          text: "List a font first, then fallbacks: `font-family: \"Inter\", system-ui, sans-serif;`. If Inter is not installed, the browser uses the next available font instead of falling back to its ugly default. The final `sans-serif` guarantees something sensible always.",
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Line height does more than spacing",
          text: "Body text reads best around 1.5 to 1.8. Headings want something tighter, around 1.1 to 1.25, because they are short. Setting `line-height` in the unitless form means it scales automatically with the font size — always prefer `1.6` over `160%`.",
        },
        {
          type: "playground",
          instructions: "Compare the three paragraphs below. Only the typography differs.",
          height: 300,
          files: {
            html: `<p class="tight">This text has a very tight line height, which makes it hard to read across a long line of text.</p>
<p class="normal">This text has a comfortable line height, which makes it much easier to read across a long line of text.</p>
<p class="loose">This text has a very generous line height, which is also fairly hard to read across a long line of text.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 480px; }
p { margin: 0 0 20px; font-size: 16px; }

.tight { line-height: 1; }
.normal { line-height: 1.6; }
.loose { line-height: 2.4; }`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Style a page so that headings and body text use different font sizes, weights and line heights. Set `body` to use `rem` units.",
          checklist: [
            "A `font-family` stack with at least one fallback",
            "At least one heading uses a different size and weight from body text",
            "Body text has a `line-height` between 1.4 and 1.8",
            "Sizes are set with `rem` units",
          ],
          starter: {
            html: `<h1>Readable Typography</h1>
<p>Body text should be comfortable to read for long periods.</p>
<h2>A subheading</h2>
<p>More body text to test the rhythm.</p>`,
            css: `body {
  font-family: system-ui, sans-serif;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "Why should you include fallback fonts in the font-family stack?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It makes text load faster", correct: false },
            { text: "So the browser has something to use if your chosen font is unavailable", correct: true },
            { text: "It increases the font size automatically", correct: false },
            { text: "It is required by the CSS specification", correct: false },
          ],
          explanation:
            "A font stack lists preferences in order. If the first is missing, the browser uses the next available, ending at the generic family.",
          xpReward: 10,
        },
        {
          question: "Which line-height value is generally best for body text?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "0.8", correct: false },
            { text: "1.6", correct: true },
            { text: "3.5", correct: false },
            { text: "0", correct: false },
          ],
          explanation:
            "Around 1.5 to 1.8 suits body text. Below 1.0 lines collide; far above 2.0 the text breaks into disconnected fragments.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-box-model",
      title: "CSS Box Model",
      summary: "The single most important concept in CSS layout.",
      estimatedMinutes: 13,
      objective: "Understand content, padding, border and margin, and predict the size of any element.",
      blocks: [
        {
          type: "paragraph",
          text: "Every element on a page is a box. Once you can picture that box, CSS layout stops being mysterious. The box has four nested layers.",
        },
        {
          type: "code",
          lang: "css",
          code: `.box {
  width: 200px;      /* the content area */
  padding: 20px;     /* space inside the border */
  border: 5px solid #e8590c;   /* the border itself */
  margin: 30px;      /* space outside the border */
}`,
        },
        {
          type: "list",
          items: [
            "**Content** — the actual text or image. This is what `width` and `height` set.",
            "**Padding** — space between the content and the border.",
            "**Border** — the visible line around the padding.",
            "**Margin** — space between this element and its neighbours. It is outside the border and is not affected by background colour.",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "Memorise this: padding is inside, margin is outside",
          text: "The most common beginner mix-up. To add breathing room *within* a coloured button, use padding. To push a button away from its neighbours, use margin.",
        },
        {
          type: "heading",
          text: "box-sizing: border-box",
        },
        {
          type: "paragraph",
          text: "By default, `width` refers only to the content area. So a `div` with `width: 200px; padding: 20px; border: 5px` actually occupies 250px on screen — which makes precise layout maths miserable.",
        },
        {
          type: "code",
          lang: "css",
          code: `* {
  box-sizing: border-box;
}`,
          caption: "With this, width includes padding and border. Set it once and never think about it again.",
        },
        {
          type: "playground",
          instructions: "Both boxes have width: 200px. Watch how box-sizing changes the total size they occupy.",
          height: 280,
          files: {
            html: `<div class="content-box">content-box</div>
<div class="border-box">border-box</div>

<p>Both are 200px wide with 20px padding and 5px borders.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }

.content-box, .border-box {
  width: 200px;
  padding: 20px;
  border: 5px solid #e8590c;
  background: #fff4e6;
  margin-bottom: 20px;
}

.content-box { box-sizing: content-box; }
.border-box { box-sizing: border-box; }`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Create a card with a set width, padding, border and margin, using `box-sizing: border-box`.",
          checklist: [
            "`box-sizing: border-box` is set",
            "The element has a fixed `width`",
            "`padding` and `margin` are different values",
            "A `border` is applied",
          ],
          starter: {
            html: `<div class="card">
  <h3>Card title</h3>
  <p>Content goes here.</p>
</div>`,
            css: `.card {
  width: 240px;
  border: 1px solid #e2e8f0;
  padding: 16px;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "Which property adds space *inside* an element's border?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "margin", correct: false },
            { text: "padding", correct: true },
            { text: "gap", correct: false },
            { text: "inset", correct: false },
          ],
          explanation:
            "Padding is inside the border. Margin is outside it, and separates the element from its neighbours.",
          xpReward: 10,
        },
        {
          question: "With `box-sizing: border-box`, what does `width` include?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Only the content area", correct: false },
            { text: "Content, padding and border", correct: true },
            { text: "Content, padding, border and margin", correct: false },
            { text: "Only the margin", correct: false },
          ],
          explanation:
            "`border-box` makes `width` the total rendered width including padding and border. Margin is always outside the box.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-display",
      title: "CSS Display",
      summary: "block, inline, inline-block, none and flex.",
      estimatedMinutes: 12,
      objective: "Control how an element participates in layout using the display property.",
      blocks: [
        {
          type: "paragraph",
          text: "Every element has a default `display` value that determines how it flows on the page. Changing it is how you completely rearrange a layout.",
        },
        {
          type: "table",
          head: ["Value", "Behaviour", "Default for"],
          rows: [
            ["block", "Own line, takes full width, respects width/height", "`<div>`, `<p>`, `<h1>`, `<section>`"],
            ["inline", "Flows inside text, ignores width/height", "`<span>`, `<a>`, `<strong>`"],
            ["inline-block", "Flows inline but accepts width/height", "`—` (you set it)"],
            ["none", "Removed from the page entirely", "`—`"],
            ["flex", "Children become flex items in a row or column", "`—`"],
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "The inline trap",
          text: "Setting `width` on an inline element does nothing. That is the single most common reason 'my CSS is not working'. Change the element to `inline-block` or `block` and the width suddenly appears.",
        },
        {
          type: "playground",
          instructions: "The three spans below have the same CSS except for `display`. Compare them.",
          height: 220,
          files: {
            html: `<p>
  <span class="a">inline</span>
  <span class="b">inline-block</span>
  <span class="c">block</span>
</p>

<p>All three have width: 120px, height: 40px and padding.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }

.a, .b, .c {
  width: 120px;
  height: 40px;
  padding: 8px;
  background: #c5f6fa;
  border: 1px solid #0b7285;
  margin: 4px;
  box-sizing: border-box;
}

.a { display: inline; }
.b { display: inline-block; }
.c { display: block; }`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Take three inline `<span>` elements and make each one behave differently: inline, inline-block and block.",
          checklist: [
            "One element is `display: inline` and ignores its width",
            "One element is `display: inline-block` and respects its width",
            "One element is `display: block` and takes a full line",
            "All three have identical padding, background and border",
          ],
          starter: {
            html: `<span class="a">A</span>
<span class="b">B</span>
<span class="c">C</span>`,
            css: `.a, .b, .c {
  width: 100px;
  padding: 10px;
  background: #c5f6fa;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "You set `width: 200px` on a `<span>` and nothing happens. Why?",
          type: "DEBUGGING",
          options: [
            { text: "The CSS has a syntax error", correct: false },
            { text: "Spans are inline by default, and inline elements ignore width", correct: true },
            { text: "Width does not exist in CSS", correct: false },
            { text: "The span has no content", correct: false },
          ],
          explanation:
            "Inline elements ignore width, height, and vertical padding. Set `display: inline-block` or `block` to make those properties apply.",
          xpReward: 10,
        },
        {
          question: "What does `display: none` do?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Hides the element but keeps its space", correct: false },
            { text: "Removes the element from the page entirely", correct: true },
            { text: "Makes it transparent", correct: false },
            { text: "Disables it until hover", correct: false },
          ],
          explanation:
            "`display: none` removes the element and its space from the layout. `visibility: hidden` hides it but keeps its space — a common confusion.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-position",
      title: "CSS Position",
      summary: "static, relative, absolute, fixed and sticky.",
      estimatedMinutes: 13,
      objective: "Take precise control of where an element sits using the position property.",
      blocks: [
        {
          type: "paragraph",
          text: "Most elements flow naturally down the page — that is `position: static`, the default. The other values take an element out of that natural flow and place it deliberately.",
        },
        {
          type: "table",
          head: ["Value", "Moved out of flow?", "Positioned relative to"],
          rows: [
            ["static", "No", "— (the default)"],
            ["relative", "No", "Its own normal position"],
            ["absolute", "Yes", "The nearest positioned ancestor"],
            ["fixed", "Yes", "The viewport (screen)"],
            ["sticky", "No", "Scroll position, until a threshold"],
          ],
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "The ancestor rule",
          text: "`absolute` positions relative to the closest ancestor that has `position` other than `static`. If none exists, it falls back to the page itself — which is why an absolutely-positioned element sometimes lands in a surprising place. Set `position: relative` on the parent when you want to contain it.",
        },
        {
          type: "playground",
          instructions: "Scroll this preview. The header is `sticky`, so it stays put while the content moves.",
          height: 320,
          files: {
            html: `<header>Sticky header</header>

<p>Scroll down to see the effect.</p>
<p>More text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
<p>More text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
<p>More text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
<p>More text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
<p>More text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>`,
            css: `body { font-family: system-ui, sans-serif; margin: 0; padding: 0 16px 16px; }

header {
  position: sticky;
  top: 0;
  background: #0b7285;
  color: white;
  padding: 12px 16px;
  margin: 0 -16px 16px;
}`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "mistake",
          title: "Overusing position",
          text: "Positioning is not a substitute for layout. Reaching for `absolute` to arrange a grid of items is a sign you should be using Flexbox or Grid — the browser can then respond to content changes and screen sizes on its own.",
        },
        {
          type: "exercise",
          prompt:
            "Create a card with a badge positioned in its top-right corner using `position: relative` on the card and `position: absolute` on the badge.",
          checklist: [
            "The card has `position: relative`",
            "The badge has `position: absolute` with `top` and `right` set",
            "The badge overlaps the card rather than the page",
          ],
          starter: {
            html: `<div class="card">
  <span class="badge">New</span>
  <h3>Article title</h3>
  <p>Content of the card.</p>
</div>`,
            css: `.card {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  max-width: 260px;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What is the default value of the `position` property?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "relative", correct: false },
            { text: "static", correct: true },
            { text: "block", correct: false },
            { text: "absolute", correct: false },
          ],
          explanation:
            "`static` is the default, and it means the element flows naturally in the document with no positioning applied.",
          xpReward: 10,
        },
        {
          question: "A `position: fixed` header stays visible while scrolling. What is it positioned relative to?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Its parent element", correct: false },
            { text: "The nearest positioned ancestor", correct: false },
            { text: "The viewport", correct: true },
            { text: "The document body", correct: false },
          ],
          explanation:
            "`fixed` positions relative to the viewport, so the element stays put regardless of scroll — unless an ancestor has a transform, which creates a new containing block.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-flexbox",
      title: "CSS Flexbox",
      summary: "One-dimensional layout: rows and columns with perfect distribution.",
      estimatedMinutes: 15,
      objective: "Lay out a row or column of items and control how they share the available space.",
      blocks: [
        {
          type: "paragraph",
          text: "Flexbox is a **one-dimensional** layout system. You mark one element as a flex container, and its direct children become flex items that the container arranges along an axis.",
        },
        {
          type: "code",
          lang: "css",
          code: `.container {
  display: flex;
  justify-content: space-between;  /* main axis: horizontal */
  align-items: center;          /* cross axis: vertical */
  gap: 16px;
}`,
        },
        {
          type: "list",
          items: [
            "`flex-direction: row` (default) lays items out horizontally; `column` goes vertically.",
            "`justify-content` distributes items along the **main** axis.",
            "`align-items` aligns items along the **cross** axis.",
            "`gap` sets the space between items without using margins.",
          ],
        },
        {
          type: "playground",
          instructions: "Change `justify-content` and watch the row redistribute. Try `column` too.",
          height: 320,
          files: {
            html: `<div class="row">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>

<div class="row column">
  <div class="box">A</div>
  <div class="box">B</div>
</div>`,
            css: `body { font-family: system-ui, sans-serif; padding: 16px; }

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #e6fcf5;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.column { flex-direction: column; align-items: stretch; }

.box {
  background: #0b7285;
  color: white;
  padding: 14px 20px;
  border-radius: 6px;
  font-weight: 600;
}`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "tip",
          title: "Reach for gap, not margins",
          text: "Margin-based spacing breaks when elements wrap — the last item in a row keeps its right margin, pushing the row off-centre. `gap` only ever adds space *between* items, so it survives wrapping.",
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "flex: 1 is the shortcut worth memorising",
          text: "`flex: 1` is shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 0%` — it tells an item to grow to fill available space, and to shrink before other items do. It is how you build equal-width columns that also stay equal when their content differs.",
        },
        {
          type: "exercise",
          prompt:
            "Build a horizontal row of three cards that are equal width, evenly spaced, and vertically centred.",
          checklist: [
            "The parent has `display: flex`",
            "Each card has `flex: 1`",
            "The parent uses `gap` for spacing",
            "The row is centred with `justify-content` or `margin: auto`",
          ],
          starter: {
            html: `<div class="cards">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
</div>`,
            css: `.cards {
  display: flex;
  gap: 16px;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "Which property distributes flex items along the cross axis?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "justify-content", correct: false },
            { text: "align-items", correct: true },
            { text: "place-content", correct: false },
            { text: "flex-basis", correct: false },
          ],
          explanation:
            "`align-items` works on the cross axis. `justify-content` distributes along the main axis. The two axes swap when `flex-direction: column` is set.",
          xpReward: 10,
        },
        {
          question: "What does `flex: 1` expand to?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "display: block", correct: false },
            { text: "flex-grow: 1; flex-shrink: 1; flex-basis: 0%", correct: true },
            { text: "width: 100%", correct: false },
            { text: "flex-grow: 1 only", correct: false },
          ],
          explanation:
            "`flex: 1` is shorthand for grow 1, shrink 1, basis 0%. The zero basis makes items start from equal zero size before sharing the free space, which is what keeps them equal width.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-grid",
      title: "CSS Grid",
      summary: "Two-dimensional layout: rows and columns at once.",
      estimatedMinutes: 15,
      objective: "Build two-dimensional page layouts and card grids with CSS Grid.",
      blocks: [
        {
          type: "paragraph",
          text: "If Flexbox is about one axis, **Grid** is about two. You define the columns and rows up front, then place items into that structure — which makes it the right tool for whole page layouts and card galleries.",
        },
        {
          type: "code",
          lang: "css",
          code: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}`,
        },
        {
          type: "list",
          items: [
            "`grid-template-columns` defines the column tracks.",
            "`repeat(3, 1fr)` means three equal, flexible columns.",
            "`1fr` is one share of the free space — the `fr` unit is unique to Grid and Flexbox.",
            "`gap` sets the space between tracks.",
          ],
        },
        {
          type: "playground",
          instructions: "Try `repeat(2, 1fr)` and `repeat(4, 1fr)`. Then try `200px 1fr` for a sidebar layout.",
          height: 340,
          files: {
            html: `<div class="grid">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>

<div class="layout">
  <aside>Sidebar</aside>
  <main>Main content</main>
</div>`,
            css: `body { font-family: system-ui, sans-serif; padding: 16px; }

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.item {
  background: #c5f6fa;
  border: 1px solid #0b7285;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  font-weight: 600;
}

.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px;
}

.layout aside { background: #f1f5f9; padding: 12px; border-radius: 6px; }
.layout main { background: #e6fcf5; padding: 12px; border-radius: 6px; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "tip",
          title: "Grid or Flexbox?",
          text: "Ask whether you are arranging items along **one** axis (Flexbox) or in **rows and columns at once** (Grid). A navigation bar of links: Flexbox. A page with a sidebar, main area and footer: Grid. A card gallery: Grid.",
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "fr beats percentages for grids",
          text: "`repeat(auto-fit, minmax(240px, 1fr))` builds a fully responsive grid with no media queries at all: it fits as many 240px-minimum columns as will fit, and shares the remaining space. It is the single most useful Grid pattern to memorise.",
        },
        {
          type: "exercise",
          prompt:
            "Build a responsive card grid that fits as many 220px columns as possible, plus a two-column sidebar layout.",
          checklist: [
            "A grid uses `repeat(auto-fit, minmax(...))`",
            "A second grid has explicit `200px 1fr` columns",
            "`gap` is used on both grids",
            "The page has no horizontal scrollbar",
          ],
          starter: {
            html: `<div class="cards">
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
  <div class="card">D</div>
</div>`,
            css: `.cards {
  display: grid;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What does `1fr` mean?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "One fixed pixel", correct: false },
            { text: "One share of the available free space", correct: true },
            { text: "One frame of animation", correct: false },
            { text: "One column, fixed", correct: false },
          ],
          explanation:
            "`fr` is a fraction unit. `1fr 1fr` splits available space into two equal halves, and `2fr 1fr` gives the first twice as much.",
          xpReward: 10,
        },
        {
          question: "Which is the main difference between Flexbox and Grid?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Grid is faster to render", correct: false },
            { text: "Flexbox is one-dimensional; Grid is two-dimensional", correct: true },
            { text: "Grid only works in modern browsers", correct: false },
            { text: "Flexbox cannot use gap", correct: false },
          ],
          explanation:
            "Flexbox distributes along one axis (a row or a column). Grid defines rows and columns simultaneously, making it the better fit for overall page structure.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-responsive",
      title: "Responsive Design & Media Queries",
      summary: "Making layouts adapt from a wide desktop down to a phone.",
      estimatedMinutes: 14,
      objective: "Write media queries so your layouts adapt to any screen size.",
      blocks: [
        {
          type: "paragraph",
          text: "Responsive design means a page works on a 4K monitor and a 320px phone. Rather than designing separately for each size, you write one layout and add breakpoints where the design actually needs to change.",
        },
        {
          type: "code",
          lang: "css",
          code: `/* Base styles come first — these target mobile by default */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Then override at wider viewports */
@media (min-width: 600px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 960px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}`,
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Mobile first",
          text: "Write the base styles for small screens, then progressively enhance with `min-width` queries. This is the opposite of desktop-first, and it is better: if the wide layout is correct on a small screen without a query, the page has no unnecessary CSS.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Prefer max-width for containers",
          text: "For text content, cap the width rather than letting it stretch: `.prose { max-width: 65ch; margin-inline: auto; }`. Lines longer than about 75 characters are genuinely hard to read.",
        },
        {
          type: "playground",
          instructions: "Narrow the browser window past 600px and 960px to watch the card grid change.",
          height: 320,
          files: {
            html: `<div class="cards">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
  <div class="card">Four</div>
  <div class="card">Five</div>
  <div class="card">Six</div>
</div>

<p class="note">Resize the window to see the breakpoints.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 16px; }

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 600px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 960px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}

.card {
  background: #c5f6fa;
  border: 1px solid #0b7285;
  border-radius: 8px;
  padding: 16px;
}

.note { color: #5b6b83; font-size: 14px; }`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Build a card grid that shows one column on mobile, two on tablet and three on desktop using media queries.",
          checklist: [
            "Base styles use a single column",
            "A `min-width: 600px` query switches to two columns",
            "A `min-width: 960px` query switches to three",
            "No horizontal overflow at 320px wide",
          ],
          starter: {
            html: `<div class="cards">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
  <div class="card">Four</div>
</div>`,
            css: `.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What does `@media (min-width: 768px)` mean?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Apply these styles on screens narrower than 768px", correct: false },
            { text: "Apply these styles when the viewport is at least 768px wide", correct: true },
            { text: "Apply these styles only on tablets", correct: false },
            { text: "Set the device width to 768px", correct: false },
          ],
          explanation:
            "`min-width` means 'at least this wide', so the styles apply from that width upward. That is the mobile-first pattern.",
          xpReward: 10,
        },
        {
          question: "Why is mobile-first usually the better approach?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Media queries do not work on desktop", correct: false },
            { text: "Base styles stay simple and you only enhance where needed", correct: true },
            { text: "It makes the page load faster", correct: false },
            { text: "Browsers require it", correct: false },
          ],
          explanation:
            "You write minimal CSS for the small case, then add enhancements at larger sizes. If the layout already works on mobile without queries, you ship less CSS and support more devices.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-transitions-animations",
      title: "Transitions & Animations",
      summary: "Smoothly animating changes with transition and keyframes.",
      estimatedMinutes: 12,
      objective: "Animate state changes with CSS transitions and multi-step animations with keyframes.",
      blocks: [
        {
          type: "paragraph",
          text: "A **transition** animates a change between two states — hovering, focusing, toggling. A **keyframe animation** runs a sequence you define, on a loop or once.",
        },
        {
          type: "code",
          lang: "css",
          code: `button {
  background: #0b7285;
  color: white;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

button:hover {
  background: #099268;
  transform: translateY(-2px);
}`,
        },
        {
          type: "list",
          items: [
            "`transition: property duration timing-function` — the shorthand.",
            "Duration needs a unit. `transition: all 0.3s` is valid; `transition: all 0.3` is not.",
            "`ease` is smooth, `linear` is constant, `ease-in-out` starts and ends gently.",
          ],
        },
        {
          type: "code",
          lang: "css",
          code: `@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}

.badge {
  animation: pulse 2s ease-in-out infinite;
}`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Always respect reduced motion",
          text: "Some people get motion sickness or migraines from animation. Wrap animations in `@media (prefers-reduced-motion: reduce)` and disable them. This is an accessibility requirement, not a nicety.",
        },
        {
          type: "playground",
          instructions: "Hover the button, and the badge is animating on a loop.",
          height: 240,
          files: {
            html: `<button>Hover me</button>

<p><span class="badge">Animated badge</span></p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }

button {
  background: #0b7285;
  color: white;
  border: 0;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

button:hover {
  background: #099268;
  transform: translateY(-2px);
}

.badge {
  display: inline-block;
  background: #ffe066;
  color: #7c5e00;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}

.badge { animation: pulse 2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .badge { animation: none; }
  button { transition: none; }
}`,
            js: ``,
          },
        },
        {
          type: "exercise",
          prompt:
            "Add a hover transition to a button and a looping keyframe animation to a badge. Disable both under `prefers-reduced-motion`.",
          checklist: [
            "The button has a `transition` with a duration and unit",
            "The button changes colour or size on hover",
            "A `@keyframes` rule is defined and applied",
            "A `prefers-reduced-motion` media query disables the animation",
          ],
          starter: {
            html: `<button>Click me</button>
<span class="badge">New</span>`,
            css: `button {
  padding: 10px 18px;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "What is the difference between a transition and a keyframe animation?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Transitions only work on hover", correct: false },
            { text: "Transitions animate between two states; keyframes animate a sequence of steps you define", correct: true },
            { text: "Keyframes are the older syntax", correct: false },
            { text: "They are interchangeable", correct: false },
          ],
          explanation:
            "A transition smoothly interpolates when a property changes between two values. `@keyframes` lets you define intermediate states and timing explicitly.",
          xpReward: 10,
        },
        {
          question: "Which media query respects the user's reduced-motion setting?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "@media (prefers-reduced-motion: reduce)", correct: true },
            { text: "@media (prefers-contrast: low)", correct: false },
            { text: "@media (max-width: 600px)", correct: false },
            { text: "@media (motion: none)", correct: false },
          ],
          explanation:
            "`prefers-reduced-motion: reduce` matches when the user has asked their operating system to minimise animation.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-variables",
      title: "CSS Variables",
      summary: "Reusable values, theming and cleaner stylesheets with custom properties.",
      estimatedMinutes: 10,
      objective: "Define and use CSS custom properties to build consistent, themeable styles.",
      blocks: [
        {
          type: "paragraph",
          text: "CSS variables (officially *custom properties*) let you store a value once and reuse it everywhere. Change it in one place and the whole page updates.",
        },
        {
          type: "code",
          lang: "css",
          code: `:root {
  --brand: #0b7285;
  --brand-dark: #095c6b;
  --radius: 8px;
  --spacing: 16px;
}

.button {
  background: var(--brand);
  color: white;
  padding: calc(var(--spacing) / 2) var(--spacing);
  border-radius: var(--radius);
  transition: background-color 0.2s ease;
}

.button:hover {
  background: var(--brand-dark);
}`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Why declare them on :root?",
          text: "`:root` is the `<html>` element and every element is inside it, so variables declared there are available everywhere on the page.",
        },
        {
          type: "playground",
          instructions: "Change `--brand` in the CSS tab and watch every element using `var(--brand)` update at once.",
          height: 280,
          files: {
            html: `<button class="button">Primary button</button>
<button class="button secondary">Secondary</button>

<div class="card">
  <h3>A card</h3>
  <p>It uses the same brand colour for its border.</p>
</div>`,
            css: `:root {
  --brand: #0b7285;
  --border: #0b7285;
}

body { font-family: system-ui, sans-serif; padding: 20px; }

.button {
  background: var(--brand);
  color: white;
  border: 0;
  padding: 10px 18px;
  border-radius: 8px;
  margin-right: 8px;
  cursor: pointer;
}

.secondary { background: white; color: var(--brand); border: 2px solid var(--border); }

.card {
  margin-top: 16px;
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 16px;
}

.card h3 { margin-top: 0; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "tip",
          title: "Fallback values",
          text: "`var(--brand, #0b7285)` supplies a fallback used when the variable is not defined. This prevents a whole section of styles collapsing if one variable is missing.",
        },
        {
          type: "exercise",
          prompt:
            "Define a set of colour and spacing variables on `:root` and use them for a button, a card and a heading.",
          checklist: [
            "At least four variables are declared on `:root`",
            "Every declared variable is used at least once",
            "No colour hex values are repeated outside `:root`",
          ],
          starter: {
            html: `<h2>Heading</h2>
<button class="button">Button</button>
<div class="card">Card</div>`,
            css: `:root {
  --brand: #0b7285;
}

body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: ``,
          },
        },
      ],
      questions: [
        {
          question: "On which element should you usually declare CSS variables?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: ":root", correct: true },
            { text: "body", correct: false },
            { text: "html", correct: false },
            { text: "A class on a wrapper", correct: false },
          ],
          explanation:
            "`:root` is the idiomatic choice — it refers to the `<html>` element, and custom properties declared there are inherited everywhere.",
          xpReward: 10,
        },
        {
          question: "What does `var(--brand, #000)` do when `--brand` is not defined?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It sets the value to #000", correct: true },
            { text: "It removes the declaration", correct: false },
            { text: "It throws an error", correct: false },
            { text: "It inherits the value from a parent", correct: false },
          ],
          explanation:
            "The second argument to `var()` is a fallback used when the custom property is missing, so the declaration still resolves.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "css-project",
      title: "CSS Project: Restaurant Landing Page",
      summary: "Build a complete, responsive, well-styled page from an empty stylesheet.",
      estimatedMinutes: 30,
      isProject: true,
      objective:
        "Apply variables, the box model, Flexbox, Grid and media queries to build a full responsive page.",
      blocks: [
        {
          type: "paragraph",
          text: "The final CSS project. You are given the HTML and a starter stylesheet, and you need to make it look like a real restaurant site that works on every screen size.",
        },
        {
          type: "heading",
          text: "Requirements",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Define a colour palette and spacing scale as variables on `:root`.",
            "A sticky header with a navigation bar using Flexbox.",
            "A hero section with a heading, a paragraph and a call-to-action button.",
            "A menu section laid out with CSS Grid — three columns on desktop, one on mobile.",
            "A footer with two or three columns, collapsing to a single column on mobile.",
            "Hover states on the navigation links and the button.",
            "A `:hover` transition on the button and card items.",
            "`box-sizing: border-box` applied globally.",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "Work in this order",
          text: "1. Variables. 2. `box-sizing` and base typography. 3. Layout with Grid and Flexbox. 4. Colours and spacing. 5. Hover states and transitions. 6. Media queries last, once the desktop layout works.",
        },
        {
          type: "exercise",
          prompt:
            "Style the restaurant page below to match the requirements. Build desktop-first, then add breakpoints.",
          checklist: [
            "Variables declared on `:root` and used throughout",
            "`box-sizing: border-box` set on all elements",
            "Header uses Flexbox and is `position: sticky`",
            "Menu uses CSS Grid with 3 columns",
            "Hover styles and a transition on the button",
            "A `max-width: 600px` query collapses the menu to one column",
            "No horizontal scrolling on mobile",
          ],
          starter: {
            html: `<header>
  <div class="logo">Olive &amp; Oak</div>
  <nav>
    <a href="#">Menu</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </nav>
</header>

<main>
  <section class="hero">
    <h1>Seasonal food, open fire</h1>
    <p>A neighbourhood kitchen serving small plates and natural wine.</p>
    <button class="cta">Book a table</button>
  </section>

  <section class="menu">
    <h2>This week's menu</h2>
    <div class="dishes">
      <article class="dish"><h3>Charred leeks</h3><p>Whipped ricotta, hazelnut</p><span>9</span></article>
      <article class="dish"><h3>Wood-fired trout</h3><p>Fennel, brown butter</p><span>18</span></article>
      <article class="dish"><h3>Burnt honey tart</h3><p>Sea salt, crème fraîche</p><span>7</span></article>
    </div>
  </section>
</main>

<footer>
  <p>12 Bridge Street</p>
  <p>open@oliveandoak.dev</p>
</footer>`,
            css: `* { box-sizing: border-box; }

body { font-family: system-ui, sans-serif; margin: 0; }`,
            js: ``,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Before you move on",
          text: "Try your page at 320px, 768px and 1280px wide. If nothing overflows and nothing is unreadable at any of them, you have a genuinely responsive page. That is the CSS course complete.",
        },
      ],
      questions: [
        {
          question: "What is the best order to work in when building a responsive page?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Write all media queries first, then the base styles", correct: false },
            { text: "Variables and base styles, then layout, then styling, then media queries last", correct: true },
            { text: "Styling, then layout, then media queries", correct: false },
            { text: "Media queries, then variables, then layout", correct: false },
          ],
          explanation:
            "Establish tokens and typography, get the desktop layout working with Grid and Flexbox, add colour and hover states, then add breakpoints. Debugging is far easier in that order.",
          xpReward: 10,
        },
        {
          question: "Why set `box-sizing: border-box` globally at the start of a project?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It makes colours render faster", correct: false },
            { text: "So declared widths match the real rendered size, making layout predictable", correct: true },
            { text: "It is required for CSS Grid", correct: false },
            { text: "It removes the need for padding", correct: false },
          ],
          explanation:
            "With `content-box` (the default), an element's `width` excludes padding and border, so `width: 200px` plus padding actually renders wider than 200px. `border-box` removes that whole category of maths.",
          xpReward: 10,
        },
      ],
    },
  ],
};
