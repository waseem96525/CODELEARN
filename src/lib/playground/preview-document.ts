import type { CodeFiles } from "@/lib/types";

/**
 * Builds the document loaded into the live-preview iframe.
 *
 * Isolation model (see src/components/playground/code-playground.tsx):
 *   - the iframe is rendered with `sandbox="allow-scripts"` and deliberately
 *     WITHOUT `allow-same-origin`, so it runs on an opaque origin
 *   - an opaque origin cannot read the parent document, cookies, localStorage,
 *     or the app's session, and `window.parent` is a cross-origin handle only
 *   - user code is escaped so it cannot break out of its own <script> tag
 *
 * Nothing here runs in the app's own context.
 */

/** Prevents `</script>` inside injected code from closing the tag early. */
function escapeScript(code: string): string {
  return code.replace(/<\/(script)/gi, "<\\/$1").replace(/<!--/g, "<\\!--");
}

/** Same idea for CSS inside a <style> block. */
function escapeStyle(code: string): string {
  return code.replace(/<\/(style)/gi, "<\\/$1");
}

/**
 * Bridge injected before user code. Replaces console methods and error events
 * with postMessage calls so the parent can render a real console panel.
 * Written as an ES5 string and free of any `</script>` sequence.
 */
const CONSOLE_BRIDGE = `
(function () {
  function fmt(v) {
    if (typeof v === "string") return v;
    if (v === undefined) return "undefined";
    if (v === null) return "null";
    if (v instanceof Error) return v.name + ": " + v.message;
    if (typeof v === "function") return "[Function " + (v.name || "anonymous") + "]";
    try {
      var seen = typeof WeakSet !== "undefined" ? new WeakSet() : null;
      return JSON.stringify(v, function (k, val) {
        if (typeof val === "object" && val !== null) {
          if (seen) { if (seen.has(val)) return "[Circular]"; seen.add(val); }
          if (val.nodeType === 1) return "<" + val.nodeName.toLowerCase() + ">";
        }
        if (typeof val === "bigint") return val.toString() + "n";
        return val;
      });
    } catch (e) {
      return String(v);
    }
  }
  function send(level, args) {
    try {
      var parts = [];
      for (var i = 0; i < args.length; i++) parts.push(fmt(args[i]));
      parent.postMessage({ __codelearn: true, level: level, text: parts.join(" ") }, "*");
    } catch (e) { /* bridge must never throw into user code */ }
  }
  var levels = ["log", "info", "warn", "error", "debug"];
  for (var i = 0; i < levels.length; i++) {
    (function (level) {
      var original = console[level];
      console[level] = function () {
        send(level, arguments);
        if (original) original.apply(console, arguments);
      };
    })(levels[i]);
  }
  window.addEventListener("error", function (event) {
    var where = event.lineno ? " (line " + event.lineno + ")" : "";
    send("error", [event.message + where]);
  });
  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    send("error", ["Unhandled promise rejection: " + (reason && reason.message ? reason.message : String(reason))]);
  });
  // Signals the parent that initial evaluation finished without throwing.
  try {
    parent.postMessage({ __codelearn: true, level: "ready", text: "" }, "*");
  } catch (e) { /* ignore */ }
})();
`;

const RESET_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    padding: 16px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #1f2937;
    background: #ffffff;
    line-height: 1.5;
  }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; }
  a { color: #4f46e5; }
  h1 { font-size: 2em; } h2 { font-size: 1.5em; } h3 { font-size: 1.17em; }
`;

export interface PreviewDocumentOptions {
  files: CodeFiles;
  /** Resets user styles between runs, matching the browser-refresh model. */
  resetStyles?: boolean;
}

export function buildPreviewDocument({ files, resetStyles = true }: PreviewDocumentOptions): string {
  const styleBlock = `<style>\n${RESET_STYLES}\n${escapeStyle(files.css)}\n<\/style>`;
  const scriptBlock = `<script>\n${CONSOLE_BRIDGE}\ntry {\n${escapeScript(files.js)}\n} catch (err) {\n  parent.postMessage({ __codelearn: true, level: "error", text: String(err && err.message ? err.message : err) }, "*");\n}\n<\/script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
${styleBlock}
</head>
<body>
${files.html}
${scriptBlock}
</body>
</html>`;
}
