"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

/**
 * Monaco is a large dependency, so it is code-split and only loaded when an
 * editor is actually on screen. The dynamic import lives here rather than in
 * each call site so the loading strategy is defined once.
 */
const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

export type EditorLanguage = "html" | "css" | "javascript";

interface CodeEditorProps {
  value: string;
  language: EditorLanguage;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  fontSize?: number;
  className?: string;
  /** Rendered above the editor as a filename tab. */
  fileName?: string;
  minHeight?: number;
  "aria-label"?: string;
}

export function CodeEditor({
  value,
  language,
  onChange,
  readOnly = false,
  fontSize = 14,
  className,
  fileName,
  minHeight = 200,
  "aria-label": ariaLabel,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  // The editor theme depends on resolvedTheme, which is only known after mount.
  // Rendering before that would flash the wrong colours.
  const mounted = useMounted();

  return (
    <div className={cn("flex min-h-0 flex-col overflow-hidden bg-editor", className)}>
      {fileName && (
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-3 py-1.5">
          <span
            aria-hidden
            className={cn(
              "size-2 rounded-full",
              language === "html"
                ? "bg-track-html"
                : language === "css"
                  ? "bg-track-css"
                  : "bg-track-js",
            )}
          />
          <span className="font-mono text-xs text-muted-foreground">{fileName}</span>
        </div>
      )}

      {!mounted ? (
        <div
          className="flex flex-1 items-center justify-center bg-editor text-xs text-muted-foreground"
          style={{ minHeight }}
        >
          Loading editor...
        </div>
      ) : (
        <React.Suspense
          fallback={
            <div
              className="flex flex-1 items-center justify-center bg-editor text-xs text-muted-foreground"
              style={{ minHeight }}
            >
              Loading editor...
            </div>
          }
        >
          <MonacoEditor
            value={value}
            language={language}
            theme={resolvedTheme === "dark" ? "codelearn-dark" : "codelearn-light"}
            onChange={(next) => onChange?.(next ?? "")}
            options={{
              readOnly,
              fontSize,
              fontFamily: 'var(--font-geist-mono), ui-monospace, "SFMono-Regular", monospace',
              fontLigatures: true,
              lineNumbers: "on",
              lineNumbersMinChars: 3,
              glyphMargin: false,
              folding: true,
              // Bracket matching and guides are on by default; keep them explicit.
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true, indentation: true },
              autoIndent: "full",
              formatOnPaste: true,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              renderLineHighlight: "line",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: 2,
              wordWrap: "on",
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              padding: { top: 12, bottom: 12 },
              scrollbar: { alwaysConsumeMouseWheel: false },
            }}
            loading={
              <div className="flex items-center justify-center text-xs text-muted-foreground">
                Loading editor...
              </div>
            }
          />
        </React.Suspense>
      )}

      <MonacoThemeRegistrar />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

/**
 * Registers CodeLearn's editor themes. Kept separate so the registration runs
 * once regardless of how many editors mount.
 */
function MonacoThemeRegistrar() {
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const monaco = await import("monaco-editor");
      if (cancelled) return;

      monaco.editor.defineTheme("codelearn-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "tag", foreground: "0F1729" },
          { token: "attribute.name", foreground: "4F46E5" },
          { token: "attribute.value", foreground: "B45309" },
          { token: "comment", foreground: "94A3B8", fontStyle: "italic" },
        ],
        colors: {
          "editor.background": "#FFFFFF",
          "editor.lineHighlightBackground": "#F8FAFC",
          "editorLineNumber.foreground": "#CBD5E1",
          "editorLineNumber.activeForeground": "#4F46E5",
        },
      });

      monaco.editor.defineTheme("codelearn-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "tag", foreground: "E8EEFB" },
          { token: "attribute.name", foreground: "A5B4FC" },
          { token: "attribute.value", foreground: "FCD34D" },
          { token: "comment", foreground: "64748B", fontStyle: "italic" },
        ],
        colors: {
          "editor.background": "#0D1421",
          "editor.lineHighlightBackground": "#141C2B",
          "editorLineNumber.foreground": "#334155",
          "editorLineNumber.activeForeground": "#818CF8",
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
