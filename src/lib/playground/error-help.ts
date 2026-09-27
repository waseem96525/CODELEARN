/**
 * Turns raw runtime errors into something a beginner can act on.
 *
 * The browser's messages are correct but terse ("x is not defined"). Each entry
 * gives the plain-English meaning, why it happened here, and a fixed example.
 * Unmatched errors still render — they just fall back to the raw text, which is
 * better than hiding the message.
 */

export interface ErrorExplanation {
  title: string;
  meaning: string;
  fix: string;
  example?: { lang: "html" | "css" | "javascript"; code: string };
}

type Rule = {
  match: RegExp;
  build: (m: RegExpMatchArray) => ErrorExplanation;
};

const RULES: Rule[] = [
  {
    match: /(\w[\w$]*) is not defined/,
    build: (m) => ({
      title: `${m[1]} is not defined`,
      meaning: `Your code used the name "${m[1]}", but JavaScript has never seen that name before. It is like typing a word that is not in the dictionary yet.`,
      fix: `Create the variable before you use it, and check the spelling — JavaScript is case-sensitive, so "total" and "Total" are two different names.`,
      example: {
        lang: "javascript",
        code: `let total = 5;\nconsole.log(total); // works now`,
      },
    }),
  },
  {
    match: /(\w[\w$]*) is not a function/,
    build: (m) => ({
      title: `${m[1]} is not a function`,
      meaning: `You put parentheses after "${m[1]}" expecting it to be a function you can call, but it is a value of some other type — a number, a string, or an object.`,
      fix: `Check what you assigned to "${m[1]}". If you meant a function, define it with the function keyword or an arrow function before calling it.`,
      example: {
        lang: "javascript",
        code: `let add = function (a, b) {\n  return a + b;\n};\n\nconsole.log(add(2, 3)); // 5`,
      },
    }),
  },
  {
    match: /Cannot read propert(?:y|ies) of (undefined|null)/,
    build: () => ({
      title: "Cannot read property of undefined",
      meaning: `Your code asked for a property of something that is empty. The value you expected to be an object is actually undefined (never created) or null (intentionally empty).`,
      fix: `Log the value just before the failing line to see what it really is. It is usually a misspelled selector, an array index that does not exist, or a function called before the element exists in the page.`,
      example: {
        lang: "javascript",
        code: `const el = document.querySelector("#title");\nconsole.log(el); // null? check the selector\n\nif (el) {\n  el.textContent = "Hello";\n}`,
      },
    }),
  },
  {
    match: /Unexpected token '?(.)'?/,
    build: (m) => ({
      title: `Unexpected token "${m[1]}"`,
      meaning: `JavaScript found a character in a place where it did not expect one. This is almost always a missing or extra bracket, quote or comma.`,
      fix: `Look at the line mentioned in the error. Check that every opening bracket ( and { has a matching closing bracket ) and }, and that each string has both its quote marks.`,
    }),
  },
  {
    match: /Uncaught SyntaxError/,
    build: () => ({
      title: "Syntax error",
      meaning: `Your code could not even be read before running. Something is written in a way JavaScript does not allow.`,
      fix: `Check for a missing semicolon or comma, an unclosed bracket, or a reserved word used as a variable name (like "class" or "if").`,
    }),
  },
  {
    match: /Maximum call stack size exceeded/i,
    build: () => ({
      title: "Maximum call stack size exceeded",
      meaning: `A function kept calling itself forever. Each call needs a little memory, and eventually the browser runs out of room.`,
      fix: `Add a base case: a condition where the function stops calling itself and returns a result. Also check that a recursive function is not being called with the same value each time.`,
      example: {
        lang: "javascript",
        code: `function factorial(n) {\n  if (n <= 1) return 1;        // base case\n  return n * factorial(n - 1);\n}`,
      },
    }),
  },
  {
    match: /Assignment to constant variable/i,
    build: () => ({
      title: "Assignment to constant variable",
      meaning: `You declared a variable with const and then tried to give it a new value. A const value is fixed once it is set.`,
      fix: `Use let instead of const if you really need to change the value later. Keep const when the value should never change.`,
      example: {
        lang: "javascript",
        code: `let score = 10;\nscore = 20; // fine\n\nconst level = 3;\nlevel = 4;    // Error! use let if you need this`,
      },
    }),
  },
  {
    match: /Failed to (?:load|fetch)|net::ERR/i,
    build: () => ({
      title: "Something could not be loaded",
      meaning: `The preview tried to load a file or a web address and could not reach it.`,
      fix: `Check the spelling of the address. If it points to a local file, remember that the preview cannot open files from your computer — only web addresses and the code you typed in the editor work here.`,
    }),
  },
  {
    match: /Invalid regular expression/i,
    build: () => ({
      title: "Invalid regular expression",
      meaning: `The pattern passed to a match expression is not valid.`,
      fix: `Check for a missing slash at the start or end, and escape special characters like . * + ? with a backslash.`,
    }),
  },
];

export function explainError(message: string): ErrorExplanation {
  for (const rule of RULES) {
    const match = message.match(rule.match);
    if (match) return rule.build(match);
  }

  return {
    title: "This code stopped running",
    meaning: `The browser reported an error it did not have a specific explanation for. Read the message below and check the line it points to.`,
    fix: `Try commenting out parts of your code until it runs again — that quickly narrows down which line is responsible.`,
  };
}
