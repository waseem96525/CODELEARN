import type { SeedCourse } from "./types";

/** JavaScript Fundamentals — the interactivity track. */
export const jsCourse: SeedCourse = {
  title: "JavaScript Fundamentals",
  slug: "javascript",
  description:
    "Learn how to make websites interactive. JavaScript is the programming language of the web — it responds to users, updates pages and talks to servers.",
  tagline: "Learn how to make websites interactive",
  track: "JAVASCRIPT",
  icon: "Braces",
  accent: "javascript",
  lessons: [
    {
      slug: "js-introduction",
      title: "Introduction to JavaScript",
      summary: "What JavaScript is, how to run it, and how to add it to a page.",
      estimatedMinutes: 9,
      objective: "Understand what JavaScript can do and run your first script in the browser.",
      blocks: [
        {
          type: "paragraph",
          text: "HTML gives a page structure and CSS gives it style. JavaScript makes it **behave** — it can respond to clicks, calculate values, fetch data and change the page after it has loaded.",
        },
        {
          type: "paragraph",
          text: "Unlike HTML and CSS, JavaScript is a real **programming language**: it has variables, conditions, loops and functions. It is also the only major language that runs natively in every browser.",
        },
        {
          type: "heading",
          text: "Where to put your code",
        },
        {
          type: "code",
          lang: "html",
          code: `<!-- In the body: runs immediately -->
<script src="script.js"></script>

<!-- Or inline, usually for short snippets -->
<script>
  console.log("Hello from JavaScript");
</script>`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "console.log is your best friend",
          text: "`console.log(value)` prints a value in the browser's developer tools. When something is not working, log the value at each step to see what your code actually has. Nearly every JavaScript bug is solved this way.",
        },
        {
          type: "playground",
          instructions: "Everything in the JS tab runs and its output appears in the console below the preview.",
          height: 240,
          files: {
            html: `<h1 id="title">Hello World</h1>
<button id="btn">Click me</button>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
button { padding: 8px 16px; border-radius: 6px; border: 1px solid #4f46e5; background: #eef2ff; cursor: pointer; }`,
            js: `console.log("Script loaded");
console.log("1 + 1 is", 1 + 1);

const title = document.getElementById("title");
console.log("Found the heading:", title);

document.getElementById("btn").addEventListener("click", () => {
  title.textContent = "You clicked the button!";
  console.log("Click handled");
});`,
          },
        },
        {
          type: "callout",
          variant: "info",
          title: "Open the console",
          text: "Press F12 (or right-click > Inspect) and open the Console tab. Everything you `console.log` shows up there, along with any errors your code produces.",
        },
        {
          type: "exercise",
          prompt:
            "Write JavaScript that logs three values: a number, a string and the result of adding them together.",
          checklist: [
            "At least three `console.log` calls",
            "A number, a string and a computed result are logged",
            "No errors appear in the console",
          ],
          starter: {
            html: `<p>Open the console below.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `console.log("Start here");`,
          },
        },
      ],
      questions: [
        {
          question: "What is the main job of JavaScript on a web page?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Styling the page", correct: false },
            { text: "Making the page interactive and dynamic", correct: true },
            { text: "Structuring the content", correct: false },
            { text: "Storing data on the server", correct: false },
          ],
          explanation:
            "HTML structures, CSS styles, JavaScript behaves — responding to users, updating content and talking to APIs.",
          xpReward: 10,
        },
        {
          question: "Where do you see the output of `console.log()`?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "In the browser's developer console", correct: true },
            { text: "On the page itself", correct: false },
            { text: "In a file called log.txt", correct: false },
            { text: "In the address bar", correct: false },
          ],
          explanation:
            "`console.log` writes to the developer tools console (press F12). It never appears on the page itself.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-variables",
      title: "JavaScript Variables",
      summary: "Storing values with let, const and var.",
      estimatedMinutes: 11,
      objective: "Create variables to store values, and choose between let, const and var.",
      blocks: [
        {
          type: "paragraph",
          text: "A variable is a labelled box for a value. You put something in it, and later you ask for it by name.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `let name = "Alex";
let age = 20;
let isLearning = true;

console.log(name);
console.log(age);
console.log(isLearning);`,
        },
        {
          type: "paragraph",
          text: "The three keywords differ in how changeable the box is:",
        },
        {
          type: "table",
          head: ["Keyword", "Can be reassigned?", "Scope", "Use when"],
          rows: [
            ["const", "No", "Block", "Default choice — the value will not change"],
            ["let", "Yes", "Block", "The value genuinely needs to change"],
            ["var", "Yes", "Function", "Almost never — legacy, confusing scope"],
          ],
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Start with const, switch to let when you need to",
          text: "Using `const` by default makes it obvious in your code when a value actually changes. The reverse is true with `var` — you cannot tell what will change without reading every line.",
        },
        {
          type: "playground",
          instructions: "Try reassigning a const value and see the error in the console.",
          height: 220,
          files: {
            html: `<p>See the console output.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const name = "Alex";
const age = 20;
let score = 0;

console.log(name, age, score);

score = score + 10;
console.log("score after update:", score);

console.log(typeof name, typeof age, typeof score);`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          title: "typeof tells you what something is",
          text: "`typeof value` returns `\"string\"`, `\"number\"`, `\"boolean\"` and so on. When a variable does not do what you expect, log `typeof` first — it is usually the answer.",
        },
        {
          type: "exercise",
          prompt:
            "Create variables for your name, age and city, log all three, then create a template string that combines them into one sentence.",
          checklist: [
            "Three variables are created with `const`",
            "All three are logged individually",
            "A template literal combines them into one sentence",
            "`typeof` is used at least once",
          ],
          starter: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const name = "Alex";
const age = 20;
const city = "London";

console.log(name, age, city);`,
          },
        },
      ],
      questions: [
        {
          question: "Which keyword should you use by default?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "var", correct: false },
            { text: "let", correct: false },
            { text: "const", correct: true },
            { text: "define", correct: false },
          ],
          explanation:
            "`const` makes reassignment impossible, so `let` becomes a deliberate signal that a value must change. Use `let` only where you actually reassign.",
          xpReward: 10,
        },
        {
          question: "What happens when you run `const x = 5; x = 10;`?",
          type: "CODE_OUTPUT",
          options: [
            { text: "A TypeError: Assignment to constant variable", correct: true },
            { text: "x becomes 10", correct: false },
            { text: "x becomes 5", correct: false },
            { text: "Nothing happens, no error", correct: false },
          ],
          explanation:
            "A `const` binding cannot be reassigned. JavaScript throws a TypeError, and the value stays 5.",
          xpReward: 10,
        },
        {
          question: "What does `typeof \"hello\"` return?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "\"text\"", correct: false },
            { text: "\"string\"", correct: true },
            { text: "\"char\"", correct: false },
            { text: "\"word\"", correct: false },
          ],
          explanation:
            "`typeof` returns `\"string\"` for text values, `\"number\"`, `\"boolean\"`, `\"object\"`, and `\"undefined\"` for a variable that has no value yet.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-data-types",
      title: "Data Types & Operators",
      summary: "Strings, numbers, booleans and the operators that combine them.",
      estimatedMinutes: 13,
      objective: "Work confidently with JavaScript's data types and arithmetic, comparison and logical operators.",
      blocks: [
        {
          type: "paragraph",
          text: "JavaScript has a handful of data types. In practice you will use strings, numbers, booleans, null and undefined constantly.",
        },
        {
          type: "table",
          head: ["Type", "Example", "Notes"],
          rows: [
            ["string", "`\"hello\"`", "In quotes, single or double"],
            ["number", "`42`", "No quotes — quoted numbers are strings"],
            ["boolean", "`true`", "Only true or false"],
            ["null", "`null`", "Intentionally empty — you set it"],
            ["undefined", "`undefined`", "No value assigned yet"],
          ],
        },
        {
          type: "heading",
          text: "Arithmetic",
        },
        {
          type: "code",
          lang: "javascript",
          code: `let a = 10;
let b = 3;

console.log(a + b);   // 13  addition
console.log(a - b);   // 7   subtraction
console.log(a * b);   // 30  multiplication
console.log(a / b);   // 3.33... division
console.log(a % b);   // 1   remainder
console.log(a ** b);  // 1000 exponentiation`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "The + operator does double duty",
          text: "`+` adds numbers, but concatenates strings. This bites everyone: `\"5\" + 3` is `\"53\"`, not `8`. Use `Number()` to convert, or template literals to build strings.",
        },
        {
          type: "heading",
          text: "Comparison and logic",
        },
        {
          type: "code",
          lang: "javascript",
          code: `let age = 20;

console.log(age === 20);   // true  strict equality (use this)
console.log(age == "20");  // true  loose equality (avoid)
console.log(age > 18);     // true
console.log(age >= 21);    // false

console.log(age > 18 && age < 65);  // true   and
console.log(age < 18 || age > 65);  // false  or
console.log(!(age > 18));           // false  not`,
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Always use === and !==",
          text: "Loose equality (`==`) converts types before comparing, so `\"\" == 0` and `null == undefined` are both `true` — almost never what you meant. Strict equality (`===`) compares both the value and the type. There is no situation where you need `==`.",
        },
        {
          type: "playground",
          instructions: "Predict each output, then run and check.",
          height: 240,
          files: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `let x = 10;
let y = 20;

console.log(x + y);
console.log("5" + 3);
console.log("5" - 3);
console.log(x === "10");
console.log(x > 5 && y < 30);
console.log(!x);`,
          },
        },
        {
          type: "exercise",
          prompt:
            "Create two number variables and log their sum, difference, product and remainder. Then compare them with `===` and combine conditions with `&&`.",
          checklist: [
            "Two `const` numbers are created",
            "Four arithmetic operations are logged",
            "`===` is used for comparison",
            "`&&` and `||` are both used",
          ],
          starter: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const x = 10;
const y = 3;

console.log(x + y);`,
          },
        },
      ],
      questions: [
        {
          question: "What does `\"5\" + 3` evaluate to?",
          type: "CODE_OUTPUT",
          code: `console.log("5" + 3);`,
          options: [
            { text: "8", correct: false },
            { text: "\"53\"", correct: true },
            { text: "\"8\"", correct: false },
            { text: "NaN", correct: false },
          ],
          explanation:
            "When either operand is a string, `+` performs string concatenation rather than addition, producing the string \"53\".",
          xpReward: 10,
        },
        {
          question: "What does `5 == \"5\"` return, and what does `5 === \"5\"` return?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "true and true", correct: false },
            { text: "true and false", correct: true },
            { text: "false and false", correct: false },
            { text: "false and true", correct: false },
          ],
          explanation:
            "Loose `==` converts the string to a number, so it is true. Strict `===` compares types as well as values, so it is false.",
          xpReward: 10,
        },
        {
          question: "What does `10 % 3` return?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "3.33", correct: false },
            { text: "1", correct: true },
            { text: "0", correct: false },
            { text: "30", correct: false },
          ],
          explanation:
            "The modulo operator `%` returns the remainder after division. 10 divided by 3 is 3 with a remainder of 1.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-conditions",
      title: "Conditions",
      summary: "Making decisions with if, else and the ternary operator.",
      estimatedMinutes: 11,
      objective: "Run different code depending on conditions using if, else if, else and switch.",
      blocks: [
        {
          type: "paragraph",
          text: "Conditions let your program take different paths depending on values. This is the core of all decision-making in code.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `let score = 78;

if (score >= 90) {
  console.log("Grade A");
} else if (score >= 80) {
  console.log("Grade B");
} else if (score >= 70) {
  console.log("Grade C");
} else {
  console.log("Needs improvement");
}`,
        },
        {
          type: "list",
          items: [
            "`if` runs its block when the condition is true.",
            "`else if` adds another branch to check.",
            "`else` catches everything that did not match.",
            "Blocks run **top to bottom**, so the first match wins. Order your conditions from most specific to least.",
          ],
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Ternary for simple either/or",
          text: "For a quick two-way choice, a ternary reads better than a full if/else: `const label = isDark ? \"Dark\" : \"Light\";`. Keep it for single expressions — anything longer is clearer as an if statement.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `// switch suits a fixed set of exact values
const day = "sat";

switch (day) {
  case "sat":
  case "sun":
    console.log("Weekend");
    break;
  case "fri":
    console.log("Nearly there");
    break;
  default:
    console.log("Weekday");
}`,
        },
        {
          type: "callout",
          variant: "mistake",
          title: "The missing break",
          text: "Without `break`, JavaScript keeps falling through to the next case. This is called *fall-through* and it is occasionally useful, but almost always a bug. If your switch behaves strangely, check for a missing `break`.",
        },
        {
          type: "playground",
          instructions: "Change the score in the JS tab and watch the grade change.",
          height: 220,
          files: {
            html: `<p id="result">Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const score = 78;

if (score >= 90) {
  console.log("Grade A");
} else if (score >= 80) {
  console.log("Grade B");
} else if (score >= 70) {
  console.log("Grade C");
} else {
  console.log("Needs improvement");
}`,
          },
        },
        {
          type: "exercise",
          prompt:
            "Write a function-free script that takes a `temperature` variable and logs 'Freezing', 'Cold', 'Warm' or 'Hot' using an if/else chain.",
          checklist: [
            "An `if` / `else if` / `else` chain is used",
            "At least four branches exist",
            "The console shows exactly one message",
          ],
          starter: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const temperature = 24;

if (temperature) {
  // your conditions here
} else {
  // fallback here
}`,
          },
        },
      ],
      questions: [
        {
          question: "What is a ternary operator?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "A loop that runs three times", correct: false },
            { text: "A compact if/else written as condition ? a : b", correct: true },
            { text: "A way to declare three variables", correct: false },
            { text: "A type of array", correct: false },
          ],
          explanation:
            "The conditional (ternary) operator `condition ? valueIfTrue : valueIfFalse` is a single-expression alternative to a simple if/else.",
          xpReward: 10,
        },
        {
          question: "Why should an if/else chain be ordered from most specific to least?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It runs faster", correct: false },
            { text: "Because the first matching branch wins, a broad condition placed first would swallow later cases", correct: true },
            { text: "JavaScript requires it", correct: false },
            { text: "It reduces memory use", correct: false },
          ],
          explanation:
            "Only the first true condition runs. If `score >= 0` came first, every score would match it and the more specific branches would never be reached.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-loops",
      title: "Loops",
      summary: "Repeating work with for and while loops.",
      estimatedMinutes: 12,
      objective: "Run a block of code repeatedly over a set of values using for, for...of and while.",
      blocks: [
        {
          type: "paragraph",
          text: "Loops let you repeat a block of code without writing it out again and again.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `// for: count a known number of times
for (let i = 0; i < 5; i++) {
  console.log("Line " + i);
}

// for...of: iterate over a list of values
const fruits = ["apple", "banana", "cherry"];

for (const fruit of fruits) {
  console.log(fruit);
}

// while: repeat while something is true
let attempts = 0;

while (attempts < 3) {
  console.log("Attempt " + (attempts + 1));
  attempts++;
}`,
        },
        {
          type: "paragraph",
          text: "The `for` loop header has three parts, separated by semicolons: **initialise** (`let i = 0`), **condition** (`i < 5`), and **update** (`i++`). The body runs while the condition is true.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Infinite loops",
          text: "If the condition never becomes false, the loop runs forever and freezes the browser tab. If a page suddenly stops responding, a `while` loop with a missing counter increment is the first thing to check.",
        },
        {
          type: "playground",
          instructions: "Careful — do not set the condition to always true, or the preview will freeze.",
          height: 240,
          files: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `for (let i = 1; i <= 5; i++) {
  console.log("Count:", i);
}

const fruits = ["apple", "banana", "cherry"];

for (const fruit of fruits) {
  console.log("Fruit:", fruit);
}`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          title: "Prefer for...of for arrays",
          text: "When you just need each value in a list, `for...of` is clearer and safer than index arithmetic — you cannot accidentally go out of bounds or skip an element.",
        },
        {
          type: "exercise",
          prompt:
            "Loop over an array of five names and log each one, then use a for loop to log the numbers 1 to 10.",
          checklist: [
            "A `for...of` loop iterates an array",
            "A `for` loop counts from 1 to 10",
            "The console shows 15 lines total",
            "No infinite loop occurs",
          ],
          starter: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const names = ["Alex", "Sam", "Priya", "Jordan", "Chen"];

for (const name of names) {
  console.log(name);
}`,
          },
        },
      ],
      questions: [
        {
          question: "How many times does `for (let i = 0; i < 5; i++)` run its body?",
          type: "CODE_OUTPUT",
          options: [
            { text: "4 times", correct: false },
            { text: "5 times", correct: true },
            { text: "6 times", correct: false },
            { text: "0 times", correct: false },
          ],
          explanation:
            "`i` takes the values 0, 1, 2, 3, 4. When it reaches 5 the condition `i < 5` is false and the loop stops, so the body runs 5 times.",
          xpReward: 10,
        },
        {
          question: "Which loop is best for iterating over the values of an array?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "for...of", correct: true },
            { text: "while", correct: false },
            { text: "switch", correct: false },
            { text: "if", correct: false },
          ],
          explanation:
            "`for...of` iterates directly over an iterable's values, giving you each item without index arithmetic.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-functions",
      title: "Functions",
      summary: "Packaging reusable logic, parameters and return values.",
      estimatedMinutes: 14,
      objective: "Define functions, pass in parameters, return values and reuse logic.",
      blocks: [
        {
          type: "paragraph",
          text: "A function is a reusable block of code you can run whenever you want, with different inputs each time.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alex"));
console.log(greet("Sam"));

// Arrow function: shorter, same behaviour
const add = (a, b) => a + b;
console.log(add(2, 3));`,
        },
        {
          type: "list",
          items: [
            "**Parameters** are the named inputs in the definition (`name`).",
            "**Arguments** are the actual values you pass in (`\"Alex\"`).",
            "`return` sends a value back to wherever the function was called.",
            "A function without `return` gives back `undefined`.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "return exits the function immediately",
          text: "Any code after a `return` in the same block never runs. It is also a common bug to write the calculation but forget to return it, so callers get `undefined`.",
        },
        {
          type: "playground",
          instructions: "Call the functions and watch the console output.",
          height: 260,
          files: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `function greet(name) {
  return "Hello, " + name + "!";
}

const add = (a, b) => {
  return a + b;
};

function square(n) {
  return n * n;
}

console.log(greet("Alex"));
console.log(add(2, 3));
console.log(square(7));
console.log(greet("Sam"));`,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "One job per function",
          text: "A function that does one thing is easy to name, test and reuse. If you cannot describe what a function does in a single sentence without using 'and', it is probably doing too much.",
        },
        {
          type: "exercise",
          prompt:
            "Write three functions: one that takes a name and returns a greeting, one that adds two numbers, and one that returns the area of a rectangle.",
          checklist: [
            "Three functions are defined",
            "Each accepts at least one parameter",
            "Each returns a value",
            "Each is called at least once and the result is logged",
          ],
          starter: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alex"));`,
          },
        },
      ],
      questions: [
        {
          question: "What does a function return if it has no `return` statement?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "null", correct: false },
            { text: "0", correct: false },
            { text: "undefined", correct: true },
            { text: "It throws an error", correct: false },
          ],
          explanation:
            "A function without a `return` gives back `undefined`. Note that `undefined` and `null` are different: `null` is a value you choose, `undefined` means 'no value'.",
          xpReward: 10,
        },
        {
          question: "In `function greet(name)`, what is `name`?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "The argument", correct: false },
            { text: "The parameter", correct: true },
            { text: "The return value", correct: false },
            { text: "The function name", correct: false },
          ],
          explanation:
            "`name` is a parameter — the placeholder defined in the function. The value passed at the call site is the argument.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-arrays",
      title: "Arrays",
      summary: "Storing ordered lists and transforming them with map, filter and reduce.",
      estimatedMinutes: 15,
      objective: "Create arrays and use map, filter, find and reduce to work with collections of data.",
      blocks: [
        {
          type: "paragraph",
          text: "An array stores an ordered list of values. Most real data you work with — a list of users, search results, cart items — arrives as an array.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `const scores = [82, 91, 47, 66, 73];

console.log(scores.length);          // 5
console.log(scores[0]);              // 82  (indexes start at 0)
console.log(scores[scores.length-1]); // 73  last item`,
        },
        {
          type: "heading",
          text: "The three methods that matter most",
        },
        {
          type: "code",
          lang: "javascript",
          code: `const scores = [82, 91, 47, 66, 73];

// map: transform every item, return a new array of the same length
const doubled = scores.map(s => s * 2);

// filter: keep only items that pass a test
const passed = scores.filter(s => s >= 60);

// reduce: combine everything into a single value
const total = scores.reduce((sum, s) => sum + s, 0);

// find: the first item that matches
const best = scores.find(s => s === 91);

// some / every: boolean questions about the whole array
const anyoneFailed = scores.some(s => s < 60);
const allPassed = scores.every(s => s >= 60);`,
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "map, filter and reduce return a new array",
          text: "None of these change the original array. To keep the result you must store it in a variable or use it directly. If you want to modify in place, `push`, `splice` and `sort` do that instead.",
        },
        {
          type: "playground",
          instructions: "These are the operations you will use constantly. Try changing the threshold in the filter.",
          height: 280,
          files: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const scores = [82, 91, 47, 66, 73];

console.log("All:", scores);
console.log("Doubled:", scores.map(s => s * 2));
console.log("Passed:", scores.filter(s => s >= 60));
console.log("Total:", scores.reduce((sum, s) => sum + s, 0));
console.log("Average:", (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1));
console.log("Highest:", Math.max(...scores));
console.log("Sorted:", [...scores].sort((a, b) => b - a));`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          title: "Spread an array into Math.max",
          text: "`Math.max(...scores)` finds the largest value. The `...` spreads the array into individual arguments, because `Math.max` only accepts numbers one at a time. The same trick gives you `Math.min`.",
        },
        {
          type: "exercise",
          prompt:
            "Create an array of five numbers, then log the sum, the average, only the values above 50, and the largest value.",
          checklist: [
            "An array of at least five numbers is created",
            "`reduce` computes the sum",
            "`filter` selects values above 50",
            "`Math.max(...array)` finds the largest",
          ],
          starter: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const scores = [82, 91, 47, 66, 73];`,
          },
        },
      ],
      questions: [
        {
          question: "What does `[10, 20, 30][1]` evaluate to?",
          type: "CODE_OUTPUT",
          options: [
            { text: "1", correct: false },
            { text: "20", correct: true },
            { text: "10", correct: false },
            { text: "undefined", correct: false },
          ],
          explanation:
            "Array indexes start at 0, so index 1 is the second element, which is 20.",
          xpReward: 10,
        },
        {
          question: "Which method returns only the items that pass a test?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "map", correct: false },
            { text: "filter", correct: true },
            { text: "reduce", correct: false },
            { text: "forEach", correct: false },
          ],
          explanation:
            "`filter` returns a new array containing only the items for which your test returns true. `map` transforms every item.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-objects",
      title: "Objects",
      summary: "Storing related data in key-value pairs.",
      estimatedMinutes: 13,
      objective: "Create objects, read and update their properties, and access nested data with optional chaining.",
      blocks: [
        {
          type: "paragraph",
          text: "An object groups related values together under named keys. Where an array represents a list, an object represents **one thing with attributes**.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `const user = {
  name: "Alex",
  age: 20,
  city: "London",
  hobbies: ["climbing", "cooking"]
};

console.log(user.name);        // dot notation
console.log(user["city"]);     // bracket notation

// Adding and updating
user.email = "alex@example.com";
user.age = 21;

const { name, city } = user;   // destructuring
console.log(name, city);`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Destructuring saves a lot of typing",
          text: "`const { name, city } = user;` pulls two properties out in one line. It is the most-used piece of syntax in modern JavaScript and you will write it constantly.",
        },
        {
          type: "playground",
          instructions: "Objects nest and can contain arrays. Try accessing a nested value.",
          height: 260,
          files: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const user = {
  name: "Alex",
  age: 20,
  address: {
    city: "London",
    postcode: "NW1 6XE"
  },
  hobbies: ["climbing", "cooking"]
};

console.log(user.name);
console.log(user.address.city);
console.log(user.hobbies[0]);

const { name, address } = user;
console.log(name, address.city);

// Adding a new property
user.email = "alex@example.com";
console.log(user);`,
          },
        },
        {
          type: "callout",
          variant: "warning",
          title: "Optional chaining avoids crashes",
          text: "`user?.address?.city` returns `undefined` instead of throwing if `address` is missing. Without the `?.`, a single missing property can crash your whole app. Use it whenever you read data from outside your program.",
        },
        {
          type: "exercise",
          prompt:
            "Create a `product` object with name, price, inStock and a nested `details` object. Log each property, update the price, and add a `discount` property.",
          checklist: [
            "An object with at least four properties is created",
            "A nested object exists and is accessed",
            "An existing property is updated",
            "A new property is added",
            "Destructuring is used at least once",
          ],
          starter: {
            html: `<p>Check the console.</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const product = {
  name: "Keyboard",
  price: 45,
  inStock: true
};

console.log(product);`,
          },
        },
      ],
      questions: [
        {
          question: "How do you add a new property to an existing object?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "object.add(\"key\", value)", correct: false },
            { text: "object.key = value", correct: true },
            { text: "object.push(\"key\", value)", correct: false },
            { text: "add(object, \"key\", value)", correct: false },
          ],
          explanation:
            "Dot or bracket assignment adds a property. There is no `add` method on objects, and `push` belongs to arrays.",
          xpReward: 10,
        },
        {
          question: "What does `user?.address?.city` return if `address` is undefined?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "undefined", correct: true },
            { text: "null", correct: false },
            { text: "A TypeError is thrown", correct: false },
            { text: "An empty object", correct: false },
          ],
          explanation:
            "Optional chaining short-circuits: if the value before `?.` is nullish, the whole expression evaluates to `undefined` instead of throwing.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-dom",
      title: "The DOM",
      summary: "Reading and changing HTML from JavaScript.",
      estimatedMinutes: 16,
      objective: "Select elements, read their content and change it with the DOM API.",
      blocks: [
        {
          type: "paragraph",
          text: "The **DOM** (Document Object Model) is the browser's live representation of your HTML. JavaScript uses it to find elements and change them.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `// Select an element
const heading = document.querySelector("h1");
const buttons = document.querySelectorAll(".btn");

// Read
console.log(heading.textContent);

// Change text
heading.textContent = "New heading";

// Change attributes
heading.style.color = "red";
document.body.classList.add("ready");

// Create and insert
const para = document.createElement("p");
para.textContent = "Added by JavaScript";
document.body.appendChild(para);`,
        },
        {
          type: "table",
          head: ["Method", "Returns", "When"],
          rows: [
            ["querySelector", "First match, or null", "One element"],
            ["querySelectorAll", "NodeList of all matches", "Several elements"],
            ["getElementById", "Element with that id", "When you know the id"],
            ["createElement", "A new detached element", "Building content"],
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Null means it found nothing",
          text: "`querySelector` returns `null` when nothing matches. Calling a method on `null` throws 'Cannot read properties of null'. Check with `if (el)` before using it — especially for selectors involving ids or classes you might typo.",
        },
        {
          type: "playground",
          instructions: "Click the button — the heading text is changed by JavaScript.",
          height: 280,
          files: {
            html: `<h1 id="title">Original heading</h1>
<p class="count">Clicks: 0</p>
<button id="btn">Click me</button>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
button { padding: 8px 16px; border-radius: 6px; border: 1px solid #4f46e5; background: #eef2ff; cursor: pointer; }`,
            js: `const title = document.getElementById("title");
const count = document.querySelector(".count");
let clicks = 0;

console.log("Found heading:", title);

document.getElementById("btn").addEventListener("click", () => {
  clicks++;
  count.textContent = "Clicks: " + clicks;
  title.textContent = "Clicked " + clicks + " time(s)";
  title.style.color = "#4f46e5";
});`,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Wait for the page to load",
          text: "If a `<script>` is in the `<head>` without `defer`, the DOM does not exist yet and `querySelector` returns null. Either put the script at the end of `<body>`, or add `defer`, or wrap the code in a `DOMContentLoaded` listener.",
        },
        {
          type: "exercise",
          prompt:
            "Select the heading and the button, then change the heading text and colour when the button is clicked.",
          checklist: [
            "Elements are selected with `querySelector` or `getElementById`",
            "The heading's `textContent` is changed",
            "A style property is changed on the heading",
            "A click event triggers the change",
          ],
          starter: {
            html: `<h1 id="title">Click the button</h1>
<button id="btn">Change me</button>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
button { padding: 8px 16px; }`,
            js: `const title = document.getElementById("title");
const btn = document.getElementById("btn");`,
          },
        },
      ],
      questions: [
        {
          question: "What does `document.querySelector(\".missing\")` return when nothing matches?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "An empty element", correct: false },
            { text: "null", correct: true },
            { text: "undefined element", correct: false },
            { text: "It throws an error", correct: false },
          ],
          explanation:
            "`querySelector` returns `null` when no element matches. Always check before using the result, or the next line throws.",
          xpReward: 10,
        },
        {
          question: "Which method changes the visible text of an element?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "element.html", correct: false },
            { text: "element.textContent", correct: true },
            { text: "element.content", correct: false },
            { text: "element.value", correct: false },
          ],
          explanation:
            "`textContent` reads or writes the text. `innerHTML` also exists but parses HTML, which is a security risk with untrusted input — prefer `textContent`.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-events",
      title: "Events",
      summary: "Responding to clicks, input, keyboard and more.",
      estimatedMinutes: 13,
      objective: "Handle user interactions with event listeners and the event object.",
      blocks: [
        {
          type: "paragraph",
          text: "An **event** is something the user does — a click, a keystroke, a mouse move. You register a function to run when it happens, using `addEventListener`.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `const button = document.getElementById("btn");

button.addEventListener("click", (event) => {
  console.log("Clicked!");
  console.log(event.type);        // "click"
  console.log(event.target);      // the element clicked
});

// Common events
input.addEventListener("input", (e) => console.log(e.target.value));
form.addEventListener("submit", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Always preventDefault on forms",
          text: "Pressing Enter in a form field submits the form and reloads the page, wiping your work. Call `event.preventDefault()` in your submit handler to take over that behaviour.",
        },
        {
          type: "playground",
          instructions: "Type in the field and press Enter. The form will not reload — the handler calls preventDefault.",
          height: 320,
          files: {
            html: `<form id="form">
  <input id="name" placeholder="Your name" />
  <button type="submit">Greet</button>
</form>
<p id="output"></p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
button { padding: 8px 16px; margin-left: 8px; }
#output { color: #4f46e5; font-weight: 600; }`,
            js: `const form = document.getElementById("form");
const output = document.getElementById("output");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  output.textContent = name ? "Hello, " + name + "!" : "Enter a name first";
  console.log("Submitted:", name);
});

document.getElementById("name").addEventListener("keydown", (event) => {
  console.log("Key pressed:", event.key);
});`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          title: "The event object is your friend",
          text: "Every handler receives an `event` with `event.target` (what triggered it), `event.key` (which key), `event.preventDefault()` and `event.currentTarget`. Learn these four and you can handle almost any interaction.",
        },
        {
          type: "exercise",
          prompt:
            "Add a click listener to a button that writes a message into a paragraph. Add a keydown listener that responds to the Enter key.",
          checklist: [
            "A `click` listener is registered",
            "A `keydown` listener is registered",
            "The event object is used to read `event.key` or `event.target`",
            "`preventDefault` is called where appropriate",
          ],
          starter: {
            html: `<button id="btn">Say hello</button>
<p id="output"></p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }
#output { color: #4f46e5; font-weight: 600; }`,
            js: `const btn = document.getElementById("btn");
const output = document.getElementById("output");`,
          },
        },
      ],
      questions: [
        {
          question: "What does `event.target` refer to?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "The element that triggered the event", correct: true },
            { text: "The parent of the element", correct: false },
            { text: "The whole document", correct: false },
            { text: "The function that is running", correct: false },
          ],
          explanation:
            "`event.target` is the element the event originated on. `event.currentTarget` is the element whose listener is running — the two differ inside nested elements.",
          xpReward: 10,
        },
        {
          question: "Why call `event.preventDefault()` in a submit handler?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "To stop the form refreshing the page", correct: true },
            { text: "To validate the input", correct: false },
            { text: "To make the submit button work", correct: false },
            { text: "To clear the form", correct: false },
          ],
          explanation:
            "The default submit action navigates to a new page, which would discard your app's state. `preventDefault` cancels that so your JavaScript can handle the submission.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-forms",
      title: "Handling Forms",
      summary: "Reading input values and validating before submit.",
      estimatedMinutes: 13,
      objective: "Read values from form fields and validate them in JavaScript.",
      blocks: [
        {
          type: "paragraph",
          text: "Forms are how users give your app data. Reading a field is easy; validating it properly is where most of the work is.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `const form = document.getElementById("signup");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // value reads what the user typed
  const email = document.getElementById("email").value.trim();

  // checked reads checkbox/radio state
  const agreed = document.getElementById("terms").checked;

  if (!email) {
    alert("Email is required");
    return;   // stop here — the rest must not run
  }

  console.log({ email, agreed });
});`,
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Trim and check every field",
          text: "Users paste values with trailing spaces. `.trim()` removes leading and trailing whitespace so `email.length` and your validation are accurate. It is the most common one-word fix for 'my validation is broken'.",
        },
        {
          type: "playground",
          instructions: "Submit with an empty field, then with an invalid email, then a valid one.",
          height: 340,
          files: {
            html: `<form id="signup">
  <p>
    <label for="email">Email</label>
    <input type="email" id="email" />
  </p>
  <p>
    <label><input type="checkbox" id="terms" /> I accept the terms</label>
  </p>
  <button type="submit">Sign up</button>
</form>
<p id="message"></p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 320px; }
label { font-weight: 600; font-size: 14px; }
input[type="email"] { padding: 8px; width: 100%; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px; }
button { padding: 9px 16px; background: #4f46e5; color: white; border: 0; border-radius: 6px; cursor: pointer; }
#message { font-weight: 600; }`,
            js: `const form = document.getElementById("signup");
const message = document.getElementById("message");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const agreed = document.getElementById("terms").checked;

  if (!email) {
    message.textContent = "Email is required";
    message.style.color = "red";
    return;
  }

  if (!email.includes("@")) {
    message.textContent = "That does not look like an email address";
    message.style.color = "red";
    return;
  }

  if (!agreed) {
    message.textContent = "You must accept the terms";
    message.style.color = "red";
    return;
  }

  message.textContent = "Welcome, " + email + "!";
  message.style.color = "green";
  console.log("Signed up", { email, agreed });
});`,
          },
        },
        {
          type: "callout",
          variant: "mistake",
          title: "Forgetting the return",
          text: "After an `if` that shows an error, you must `return` — otherwise the rest of the handler runs anyway and the user sees both the error and the success message. An early `return` is the cleanest way to bail out.",
        },
        {
          type: "exercise",
          prompt:
            "Build a form that validates an email field and a password field, showing a different message for each failure case.",
          checklist: [
            "Values are read with `.value.trim()`",
            "At least three different validation cases are handled",
            "Each failure path calls `return`",
            "Checkboxes are read with `.checked`",
          ],
          starter: {
            html: `<form id="form">
  <p><label for="email">Email</label><br /><input id="email" type="email" /></p>
  <p><label for="pw">Password</label><br /><input id="pw" type="password" /></p>
  <button type="submit">Submit</button>
</form>
<p id="msg"></p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 300px; }`,
            js: `const form = document.getElementById("form");
const msg = document.getElementById("msg");`,
          },
        },
      ],
      questions: [
        {
          question: "How do you read the current value of a text input?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "input.text", correct: false },
            { text: "input.value", correct: true },
            { text: "input.getValue()", correct: false },
            { text: "input.innerText", correct: false },
          ],
          explanation:
            "`.value` gets or sets what the user typed. `innerText` is for reading rendered text content, not form values.",
          xpReward: 10,
        },
        {
          question: "Why should you call `.trim()` on input values?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "To convert them to numbers", correct: false },
            { text: "To remove accidental leading and trailing whitespace", correct: true },
            { text: "To capitalise them", correct: false },
            { text: "To make them valid emails", correct: false },
          ],
          explanation:
            "Users often paste values with stray spaces. Trimming prevents empty-looking fields and malformed email addresses from passing or failing validation incorrectly.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-localstorage",
      title: "localStorage",
      summary: "Persisting data in the browser between visits.",
      estimatedMinutes: 11,
      objective: "Save and retrieve data in the browser with localStorage.",
      blocks: [
        {
          type: "paragraph",
          text: "`localStorage` is a simple key-value store built into the browser. Data survives closing the tab and restarting the computer, which makes it ideal for preferences, drafts and simple to-do lists.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `// Save (values are always strings)
localStorage.setItem("username", "Alex");

// Read — returns null if the key does not exist
const name = localStorage.getItem("username");

// Remove
localStorage.removeItem("username");

// Clear everything
localStorage.clear();

// JSON for objects and arrays
const user = { name: "Alex", theme: "dark" };
localStorage.setItem("user", JSON.stringify(user));

const parsed = JSON.parse(localStorage.getItem("user"));
console.log(parsed.name);`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Only strings can be stored",
          text: "Storing an object directly gives you `\"[object Object]\"`. You must use `JSON.stringify` to save and `JSON.parse` to read. Always check for `null` before parsing, or a missing key throws a syntax error.",
        },
        {
          type: "playground",
          instructions: "Add an item, then reload this preview — the list persists because the storage survives navigation.",
          height: 320,
          files: {
            html: `<h3>To-do list</h3>
<input id="task" placeholder="New task" />
<button id="add">Add</button>
<ul id="list"></ul>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 320px; }
input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
button { padding: 8px 14px; margin-left: 6px; }
li { margin: 6px 0; }`,
            js: `const list = document.getElementById("list");

function load() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  list.innerHTML = "";
  for (const task of tasks) {
    const li = document.createElement("li");
    li.textContent = task;
    list.appendChild(li);
  }
  console.log("Loaded", tasks.length, "tasks");
}

document.getElementById("add").addEventListener("click", () => {
  const input = document.getElementById("task");
  const value = input.value.trim();
  if (!value) return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(value);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  load();
});

load();`,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Never store secrets",
          text: "Anything in localStorage is readable by anyone with access to the browser and its dev tools. Never put passwords, API keys or tokens there. On this platform, your session lives in a server-side database precisely because of this.",
        },
        {
          type: "exercise",
          prompt:
            "Save a counter that survives a page reload, and show the current value on the page.",
          checklist: [
            "A value is saved with `localStorage.setItem`",
            "A null check happens before reading",
            "The value is displayed in the page, not just the console",
            "A button increments the counter",
          ],
          starter: {
            html: `<p>Count: <span id="count">0</span></p>
<button id="btn">Add one</button>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const countEl = document.getElementById("count");`,
          },
        },
      ],
      questions: [
        {
          question: "What does `localStorage.getItem(\"missing\")` return?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "null", correct: true },
            { text: "\"\"", correct: false },
            { text: "undefined value", correct: false },
            { text: "0", correct: false },
          ],
          explanation:
            "It returns `null` for a key that does not exist. Note that `null` is not the same as an empty string, which is what an intentionally blank value returns.",
          xpReward: 10,
        },
        {
          question: "How do you correctly store an object in localStorage?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "localStorage.setItem(\"key\", object)", correct: false },
            { text: "localStorage.setItem(\"key\", JSON.stringify(object))", correct: true },
            { text: "localStorage.setObject(\"key\", object)", correct: false },
            { text: "localStorage[\"key\"] = object", correct: false },
          ],
          explanation:
            "localStorage only holds strings, so objects must be serialised with `JSON.stringify` and read back with `JSON.parse`.",
          xpReward: 10,
        },
      ],
    },
    {
      slug: "js-async",
      title: "Promises & Async/Await",
      summary: "Waiting for data without freezing the page.",
      estimatedMinutes: 16,
      objective: "Handle asynchronous operations with promises, async functions and try/catch.",
      blocks: [
        {
          type: "paragraph",
          text: "Some JavaScript takes time: fetching data from a server, reading a file, waiting for a timer. **Asynchronous** code does not block the rest of your program while it waits.",
        },
        {
          type: "code",
          lang: "javascript",
          code: `// A promise represents a value that is not available yet
const wait = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000);
});

wait.then((value) => {
  console.log(value);        // "done" after 1 second
});

// async/await: the same thing, written like normal code
async function load() {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Something failed:", error.message);
  }
}

load();`,
        },
        {
          type: "list",
          items: [
            "`async function` always returns a promise.",
            "`await` pauses that function until a promise settles — the page stays responsive.",
            "`.then()` handles success, `.catch()` handles failure.",
            "`try` / `catch` is the `await` equivalent of then/catch, and is easier to read.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "try/catch is not optional for fetch",
          text: "A failed request does **not** throw by itself — a 404 or a dropped connection is a perfectly successful HTTP call as far as `fetch` is concerned. You must check `response.ok` and throw yourself, otherwise you silently try to parse an error page as JSON.",
        },
        {
          type: "playground",
          instructions: "This simulates a slow request so you can see the loading state.",
          height: 300,
          files: {
            html: `<button id="btn">Load data</button>
<p id="status">Idle</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 320px; }`,
            js: `function fakeRequest() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: "Alex", role: "Developer" }), 1200);
  });
}

async function load() {
  const status = document.getElementById("status");
  status.textContent = "Loading...";

  try {
    const data = await fakeRequest();
    status.textContent = "Loaded: " + data.name + " (" + data.role + ")";
  } catch (error) {
    status.textContent = "Failed: " + error.message;
  }
}

document.getElementById("btn").addEventListener("click", load);`,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "Await is sequential, Promise.all is parallel",
          text: "Two `await` lines run one after the other. If the requests are independent, wrap them in `Promise.all([a(), b()])` so they run at the same time and you wait once for both.",
        },
        {
          type: "exercise",
          prompt:
            "Write an async function that waits 1 second, then returns a greeting, and logs the result with a loading message first.",
          checklist: [
            "An `async` function is defined",
            "`await` is used with a promise",
            "`try` / `catch` handles failure",
            "A loading message is set before the await",
          ],
          starter: {
            html: `<button id="btn">Run</button>
<p id="out">Ready</p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; }`,
            js: `const out = document.getElementById("out");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
          },
        },
      ],
      questions: [
        {
          question: "What does the `await` keyword do?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "Stops the entire program until the promise settles", correct: false },
            { text: "Pauses only the current async function, leaving the page responsive", correct: true },
            { text: "Converts a value to a promise", correct: false },
            { text: "Catches any error automatically", correct: false },
          ],
          explanation:
            "`await` suspends the enclosing async function only. The browser continues rendering and responding to the user while the promise is pending.",
          xpReward: 10,
        },
        {
          question: "What is wrong with this code? `const data = await fetch(url); const json = await data.json();`",
          type: "DEBUGGING",
          options: [
            { text: "Nothing, it is correct", correct: false },
            { text: "It does not check response.ok, so a 404 error page will be parsed as JSON", correct: true },
            { text: "fetch cannot be awaited", correct: false },
            { text: "json is a reserved word", correct: false },
          ],
          explanation:
            "`fetch` only rejects on a network failure. A 404 or 500 is a successful HTTP response, so you must check `response.ok` and throw yourself before parsing.",
          xpReward: 15,
        },
      ],
    },
    {
      slug: "js-project",
      title: "JavaScript Project: Interactive To-Do App",
      summary: "Build a working to-do app with localStorage persistence.",
      estimatedMinutes: 35,
      isProject: true,
      objective:
        "Combine the DOM, events, arrays, objects and localStorage into a working application.",
      blocks: [
        {
          type: "paragraph",
          text: "This is the JavaScript capstone. You will build a to-do app that adds, completes, deletes and persists tasks. It uses everything from this course.",
        },
        {
          type: "heading",
          text: "Requirements",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "An input and a button to add a task.",
            "Empty or whitespace-only input is ignored with a message.",
            "Each task shows as a list item with a checkbox and a delete button.",
            "Checking a task's checkbox marks it complete, with a visual style change.",
            "Deleting a task removes it from the list.",
            "The task list is saved to `localStorage` and restored on load.",
            "A counter shows how many tasks remain.",
            "Pressing Enter in the input adds the task, without reloading the page.",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "Structure the code first",
          text: "Break it into small functions: `loadTasks()`, `saveTasks()`, `renderTasks()`, `addTask(text)`, `toggleTask(id)`, `deleteTask(id)`. Each one does one job, and `renderTasks()` is called whenever the data changes. This structure makes bugs much easier to find.",
        },
        {
          type: "exercise",
          prompt:
            "Build the to-do app described above. Start with the data model, then rendering, then the events.",
          checklist: [
            "A task is a JavaScript object with `id` and `text`",
            "Tasks are stored in an array and persisted with `JSON.stringify`",
            "The list is re-rendered whenever anything changes",
            "A checkbox marks a task complete",
            "A delete button removes a task",
            "Whitespace-only input is rejected",
            "Enter in the input adds a task",
            "A remaining-tasks counter updates correctly",
            "Tasks survive a page reload",
          ],
          starter: {
            html: `<h1>To-do</h1>

<form id="add-form">
  <input id="task-input" placeholder="What needs doing?" />
  <button type="submit">Add</button>
</form>

<p id="message"></p>
<ul id="tasks"></ul>
<p id="count"></p>`,
            css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 380px; }
form { display: flex; gap: 6px; }
input { flex: 1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
button { padding: 8px 14px; border: 0; border-radius: 6px; background: #4f46e5; color: white; cursor: pointer; }
ul { list-style: none; padding: 0; }
li { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
li.done span { text-decoration: line-through; color: #94a3b8; }
li button { margin-left: auto; background: #fef2f2; color: #dc2626; padding: 4px 10px; }
#message { color: #dc2626; font-size: 14px; min-height: 20px; }
#count { color: #5b6b83; font-size: 14px; }`,
            js: `const STORAGE_KEY = "todos";
let tasks = [];

const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const list = document.getElementById("tasks");
const message = document.getElementById("message");
const count = document.getElementById("count");

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  // your code here
}

loadTasks();
renderTasks();`,
          },
        },
        {
          type: "callout",
          variant: "best-practice",
          title: "When you finish",
          text: "Reload the page and check your tasks are still there. Then look at your code: is every function short and doing one job? If so, you have written code at a professional standard. Next up is the JavaScript Challenges track.",
        },
      ],
      questions: [
        {
          question: "Why should the to-do app call `renderTasks()` after every change instead of only on page load?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "To make the page load faster", correct: false },
            { text: "So the displayed list always matches the stored data after any action", correct: true },
            { text: "Because localStorage requires it", correct: false },
            { text: "To reduce memory usage", correct: false },
          ],
          explanation:
            "A single render function driven by the data means the UI and the data can never drift out of sync. Add, toggle or delete all just update the array, save, and re-render.",
          xpReward: 10,
        },
        {
          question: "What is a good reason to give each task a unique id rather than using the array index?",
          type: "MULTIPLE_CHOICE",
          options: [
            { text: "It makes the code shorter", correct: false },
            { text: "Indices change when items are removed, so they cannot reliably identify a task", correct: true },
            { text: "localStorage requires ids", correct: false },
            { text: "It improves performance significantly", correct: false },
          ],
          explanation:
            "Deleting item 0 shifts every later index down by one, so a stored index would then point at the wrong task. A stable id keeps working after any change.",
          xpReward: 15,
        },
      ],
    },
  ],
};
