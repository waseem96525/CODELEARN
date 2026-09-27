"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Check,
  Copy,
  Maximize2,
  Minimize2,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeFiles } from "@/lib/types";
import { buildPreviewDocument } from "@/lib/playground/preview-document";
import { Button } from "@/components/ui/button";
import { CodeEditor, type EditorLanguage } from "./code-editor";
import { ConsolePanel, type ConsoleEntry, type ConsoleLevel } from "./console-panel";

const EMPTY_FILES: CodeFiles = { html: "", css: "", js: "" };

const TABS: { key: keyof CodeFiles; label: string; language: EditorLanguage; file: string }[] = [
  { key: "html", label: "HTML", language: "html", file: "index.html" },
  { key: "css", label: "CSS", language: "css", file: "style.css" },
  { key: "js", label: "JS", language: "javascript", file: "script.js" },
];

const AUTORUN_DELAY_MS = 700;

export interface CodePlaygroundProps {
  initialFiles?: Partial<CodeFiles>;
  /** Called by the Save button. Omit to hide it. */
  onSave?: (files: CodeFiles) => Promise<void> | void;
  height?: number;
  showConsole?: boolean;
  className?: string;
  /** Editor theme override; defaults to the app theme. */
  themePreference?: "light" | "dark" | "system";
  instructions?: string;
  readOnly?: boolean;
}

let entryId = 0;

export function CodePlayground({
  initialFiles,
  onSave,
  height = 420,
  showConsole = true,
  className,
  themePreference,
  instructions,
  readOnly = false,
}: CodePlaygroundProps) {
  const starter = React.useMemo<CodeFiles>(
    () => ({ ...EMPTY_FILES, ...initialFiles }),
    [initialFiles],
  );

  const [files, setFiles] = React.useState<CodeFiles>(starter);
  const [activeTab, setActiveTab] = React.useState<keyof CodeFiles>("html");
  const [consoleEntries, setConsoleEntries] = React.useState<ConsoleEntry[]>([]);
  const [fontSize, setFontSize] = React.useState(14);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [mobilePane, setMobilePane] = React.useState<"editor" | "preview">("editor");

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [documentSrc, setDocumentSrc] = React.useState(() =>
    buildPreviewDocument({ files: starter }),
  );
  const [runNonce, setRunNonce] = React.useState(0);

  const { resolvedTheme } = useTheme();
  const editorTheme =
    themePreference === "system" || !themePreference ? resolvedTheme : themePreference;

  // Regenerating `documentSrc` (via the nonce) remounts the iframe, which
  // resets its DOM and re-runs the injected script. This mirrors pressing
  // "Run" and keeps user code fully isolated per run.
  // `files` is read at call time so Run always shows the current code, even if
  // the debounced auto-run has not fired yet.
  const run = React.useCallback(() => {
    setConsoleEntries([]);
    setDocumentSrc(buildPreviewDocument({ files }));
    setRunNonce((n) => n + 1);
  }, [files]);

  // Debounced auto-run: the preview keeps up with typing without reloading the
  // iframe on every keystroke.
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDocumentSrc(buildPreviewDocument({ files }));
    }, AUTORUN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [files]);

  // Receive console output from the sandbox.
  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Only trust messages from our own preview frame. Without this check any
      // iframe on the page could inject fake log output.
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object" || data.__codelearn !== true) return;

      const level = (data.level as ConsoleLevel) ?? "log";
      const text = typeof data.text === "string" ? data.text : "";
      if (level === "ready") return;
      if (!text) return;

      setConsoleEntries((prev) => {
        // Collapse runaway loops instead of freezing the tab.
        if (prev.length > 200) return [...prev.slice(-150), { id: entryId++, level, text }];
        return [...prev, { id: entryId++, level, text }];
      });
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Escape closes fullscreen.
  React.useEffect(() => {
    if (!isFullscreen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFullscreen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  function updateFile(key: keyof CodeFiles, value: string) {
    setFiles((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleReset() {
    setFiles(starter);
    setConsoleEntries([]);
    run();
  }

  async function handleCopy() {
    const lang = TABS.find((t) => t.key === activeTab)!;
    try {
      await navigator.clipboard.writeText(files[activeTab]);
      setSaved(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function handleSave() {
    if (!onSave) return;
    await onSave(files);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const previewPane = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">Preview</span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Sandboxed
        </span>
      </div>
      {/*
        The security boundary. `allow-scripts` without `allow-same-origin` puts
        this document on an opaque origin: it cannot reach the app's DOM,
        cookies, storage or session, and it is discarded on every run.
      */}
      <iframe
        key={runNonce}
        ref={iframeRef}
        title="Live preview"
        srcDoc={documentSrc}
        sandbox="allow-scripts allow-modals allow-forms"
        referrerPolicy="no-referrer"
        className="min-h-0 w-full flex-1 bg-white"
        style={{ height }}
      />
    </div>
  );

  const editorPane = (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/60 px-2 py-1">
        <div
          role="tablist"
          aria-label="File"
          className="flex items-center gap-1"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5">
          <IconButton
            label="Decrease font size"
            onClick={() => setFontSize((s) => Math.max(11, s - 1))}
          >
            <Minus />
          </IconButton>
          <span className="w-8 text-center text-[10px] tabular-nums text-muted-foreground">
            {fontSize}
          </span>
          <IconButton label="Increase font size" onClick={() => setFontSize((s) => Math.min(22, s + 1))}>
            <Plus />
          </IconButton>
        </div>
      </div>

      <CodeEditor
        value={files[activeTab]}
        language={TABS.find((t) => t.key === activeTab)!.language}
        onChange={(value) => updateFile(activeTab, value)}
        fontSize={fontSize}
        readOnly={readOnly}
        minHeight={height}
        className="min-h-0 flex-1"
        aria-label={`${TABS.find((t) => t.key === activeTab)!.file} editor`}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className,
      )}
    >
      {instructions && (
        <p className="border-b border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          {instructions}
        </p>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border bg-card px-3 py-2">
        <Button size="sm" onClick={run} aria-label="Run code">
          <Play />
          Run
        </Button>
        <Button size="sm" variant="ghost" onClick={handleReset} aria-label="Reset code">
          <RotateCcw />
          <span className="hidden sm:inline">Reset</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          aria-label={`Copy ${activeTab} to clipboard`}
        >
          {copied ? <Check /> : <Copy />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </Button>
        {onSave && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            aria-label="Save code"
          >
            {saved ? <Check /> : <Save />}
            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
          </Button>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {/* Pane switcher — the mobile layout shows one pane at a time. */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobilePane("editor")}
              aria-pressed={mobilePane === "editor"}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                mobilePane === "editor"
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => setMobilePane("preview")}
              aria-pressed={mobilePane === "preview"}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                mobilePane === "preview"
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Preview
            </button>
          </div>

          <IconButton
            label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={() => setIsFullscreen((v) => !v)}
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </IconButton>
        </div>
      </div>

      {/* Mobile: single pane. Desktop: side by side. */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className={cn("flex min-h-0 flex-col lg:w-1/2", mobilePane === "editor" ? "flex" : "hidden lg:flex")}>
          {editorPane}
        </div>
        <div
          className={cn(
            "flex min-h-0 flex-col border-t border-border lg:w-1/2 lg:border-l lg:border-t-0",
            mobilePane === "preview" ? "flex" : "hidden lg:flex",
          )}
        >
          {previewPane}
        </div>
      </div>

      {showConsole && (
        <ConsolePanel
          entries={consoleEntries}
          onClear={() => setConsoleEntries([])}
          className="h-48 shrink-0 border-t border-border"
        />
      )}

      <span className="sr-only" aria-live="polite">
        {editorTheme === "dark" ? "Dark editor theme" : "Light editor theme"}
      </span>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4"
    >
      {children}
    </button>
  );
}
