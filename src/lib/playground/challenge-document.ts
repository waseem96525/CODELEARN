import type { CodeFiles, ValidationTest } from "@/lib/types";
import { buildPreviewDocument } from "./preview-document";

/**
 * Builds the document used by the challenge runner.
 *
 * It reuses the sandboxed preview document and appends a test runner *inside*
 * the sandbox. The tests have to run there: they assert against the rendered
 * DOM, which only the iframe can see. The runner posts its results back with
 * `postMessage`; the parent page never executes user code.
 */

function escapeScript(code: string): string {
  return code.replace(/<\/(script)/gi, "<\\/$1").replace(/<!--/g, "<\\!--");
}

/** Serialises values for inlining into a <script> block. */
function literal(value: unknown): string {
  return JSON.stringify(value ?? null)
    .replace(/<\/(script)/gi, "<\\/$1")
    .replace(/<!--/g, "<\\!--")
    // U+2028/U+2029 are literal newlines in JS but not in JSON strings.
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * The runner itself. Written as an ES5 string because it is injected as source,
 * and deliberately free of any `</script>` sequence.
 */
function testRunner(tests: ValidationTest[], css: string): string {
  return `
(function () {
  var TESTS = ${literal(tests)};
  var CSS = ${literal(css)};

  function text(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\\s+/g, " ").trim();
  }

  function describe(kind, selector) {
    return selector ? kind + ' "' + selector + '"' : kind;
  }

  function cssDeclarations(property) {
    // Every "property: value" pair in the user's stylesheet, lowercased for
    // comparison. Good enough for a hint-level check, and it never throws on
    // malformed CSS the way the CSSOM would.
    var out = [];
    var re = /([a-z-]+)\\s*:\\s*([^;{}]+)/gi;
    var match;
    while ((match = re.exec(CSS)) !== null) {
      out.push({ property: match[1].toLowerCase(), value: match[2].trim() });
    }
    return out;
  }

  function run(test) {
    var selector = test.selector;
    var node = null;
    try {
      node = selector ? document.querySelector(selector) : null;
    } catch (e) {
      return { label: test.label, passed: false, detail: "Invalid selector: " + selector };
    }

    switch (test.kind) {
      case "exists":
        return {
          label: test.label,
          passed: !!node,
          detail: node ? "Found " + describe("element", selector) : "No element matches " + selector,
        };

      case "count": {
        var count = selector ? document.querySelectorAll(selector).length : 0;
        return {
          label: test.label,
          passed: count === test.expected,
          detail: "Expected " + test.expected + ", found " + count,
        };
      }

      case "atLeast": {
        var atLeast = selector ? document.querySelectorAll(selector).length : 0;
        return {
          label: test.label,
          passed: atLeast >= test.expected,
          detail: "Expected at least " + test.expected + ", found " + atLeast,
        };
      }

      case "attr": {
        if (!node) return { label: test.label, passed: false, detail: "No element matches " + selector };
        var actual = node.getAttribute(test.attr);
        var want = String(test.expected);
        return {
          label: test.label,
          passed: actual !== null && actual.trim().toLowerCase() === want.trim().toLowerCase(),
          detail: actual === null
            ? 'Missing attribute "' + test.attr + '"'
            : 'Expected "' + want + '", found "' + actual + '"',
        };
      }

      case "attrPresent": {
        if (!node) return { label: test.label, passed: false, detail: "No element matches " + selector };
        var has = node.hasAttribute(test.attr);
        return {
          label: test.label,
          passed: has,
          detail: has ? 'Has attribute "' + test.attr + '"' : 'Missing attribute "' + test.attr + '"',
        };
      }

      case "tagCount": {
        var tags = document.getElementsByTagName(test.tag).length;
        return {
          label: test.label,
          passed: tags === test.expected,
          detail: "Expected " + test.expected + " <" + test.tag + ">, found " + tags,
        };
      }

      case "textContains": {
        var haystack = (selector ? text(node) : text(document.body)).toLowerCase();
        var needle = String(test.text).toLowerCase();
        return {
          label: test.label,
          passed: haystack.indexOf(needle) !== -1,
          detail: haystack.indexOf(needle) !== -1 ? "Found the expected text" : 'Text does not contain "' + test.text + '"',
        };
      }

      case "cssHasProperty": {
        var prop = String(test.property || "");
        var raw = String(test.valuePattern || "");

        // With no value pattern the "property" is a literal fragment to look for
        // anywhere in the stylesheet (e.g. "var(--").
        if (raw === "") {
          var literalFound = prop !== "" && CSS.indexOf(prop) !== -1;
          return {
            label: test.label,
            passed: literalFound,
            detail: literalFound
              ? "Stylesheet contains " + prop
              : "Stylesheet does not use " + prop,
          };
        }

        // Otherwise valuePattern is a regular expression matched against the
        // declaration's value. An invalid pattern falls back to a literal
        // search rather than throwing inside the sandbox.
        var matcher;
        try {
          matcher = new RegExp(raw, "i");
        } catch (patternError) {
          matcher = new RegExp(raw.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&"), "i");
        }

        var wanted = prop.toLowerCase();
        var decls = cssDeclarations(prop);
        var hit = null;
        for (var i = 0; i < decls.length; i++) {
          if (decls[i].property === wanted && matcher.test(decls[i].value)) {
            hit = decls[i];
            break;
          }
        }
        return {
          label: test.label,
          passed: !!hit,
          detail: hit
            ? hit.property + ": " + hit.value
            : "No rule sets " + prop + " to match /" + raw + "/",
        };
      }

      case "cssHasSelector": {
        var pattern = String(test.pattern);
        var present = CSS.indexOf(pattern) !== -1;
        return {
          label: test.label,
          passed: present,
          detail: present ? "Stylesheet contains " + pattern : "Stylesheet has no " + pattern + " rule",
        };
      }

      default:
        return { label: test.label, passed: false, detail: "Unknown test type" };
    }
  }

  function report() {
    var results = [];
    for (var i = 0; i < TESTS.length; i++) results.push(run(TESTS[i]));
    parent.postMessage({ __codelearn: true, level: "tests", results: results }, "*");
  }

  try {
    // Twice: once for markup built synchronously, once for anything the user's
    // script adds on a timer. The parent keeps the latest report.
    report();
    setTimeout(report, 400);
  } catch (err) {
    parent.postMessage({
      __codelearn: true,
      level: "error",
      text: "Test runner failed: " + (err && err.message ? err.message : String(err)),
    }, "*");
  }
})();
`;
}

export function buildChallengeDocument({
  files,
  tests,
}: {
  files: CodeFiles;
  tests: ValidationTest[];
}): string {
  const base = buildPreviewDocument({ files });
  // The runner must be the last thing in the document so the user's markup and
  // script have already executed when it reports.
  return base.replace("</body>", `<script>${testRunner(tests, files.css)}<\/script>\n</body>`);
}

export { escapeScript };
