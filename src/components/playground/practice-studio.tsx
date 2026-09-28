"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, ExternalLink, Link2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CodeFiles } from "@/lib/types";
import { buildPreviewDocument } from "@/lib/playground/preview-document";
import { CodePlayground } from "./code-playground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PLAYGROUND_TEMPLATES,
  getTemplate,
  type PracticeTrack,
} from "./playground-templates";

const STORAGE_PREFIX = "codelearn:playground:";
const LAST_TEMPLATE_KEY = "codelearn:playground:last-template";

const TRACK_FILTERS: ("ALL" | PracticeTrack)[] = ["ALL", "HTML", "CSS", "JAVASCRIPT", "MIXED"];

function encodeFiles(files: CodeFiles): string {
  const json = JSON.stringify(files);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeFiles(encoded: string): CodeFiles | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json) as Partial<CodeFiles>;
    if (typeof parsed.html !== "string" || typeof parsed.css !== "string" || typeof parsed.js !== "string") {
      return null;
    }
    return { html: parsed.html, css: parsed.css, js: parsed.js };
  } catch {
    return null;
  }
}

function readStoredFiles(templateId: string): CodeFiles | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + templateId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CodeFiles>;
    if (typeof parsed.html !== "string" || typeof parsed.css !== "string" || typeof parsed.js !== "string") {
      return null;
    }
    return { html: parsed.html, css: parsed.css, js: parsed.js };
  } catch {
    return null;
  }
}

function countLines(code: string): number {
  if (!code) return 0;
  return code.split("\n").length;
}

export function PracticeStudio({
  initialTemplateId,
  themePreference,
}: {
  initialTemplateId: string;
  themePreference: "light" | "dark" | "system";
}) {
  const router = useRouter();
  const [activeId, setActiveId] = React.useState(() => getTemplate(initialTemplateId).id);
  const [trackFilter, setTrackFilter] = React.useState<(typeof TRACK_FILTERS)[number]>("ALL");
  const [files, setFiles] = React.useState<CodeFiles>(() => getTemplate(initialTemplateId).files);
  const [hydrated, setHydrated] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  // Hydrate from ?template=, #code= share links, or localStorage autosaves.
  // Runs once so the editor keeps ownership of the code afterwards.
  // A mount effect is intentional: this state lives only in the browser, so
  // reading it during render would cause a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  React.useEffect(() => {
    const template = getTemplate(initialTemplateId);
    let next = template.files;

    const hash = window.location.hash;
    if (hash.startsWith("#code=")) {
      const shared = decodeFiles(hash.slice("#code=".length));
      if (shared) {
        next = shared;
        toast.success("Shared code loaded into the editor.");
      }
    } else {
      const stored = readStoredFiles(template.id);
      if (stored) next = stored;
    }

    const lastId = window.localStorage.getItem(LAST_TEMPLATE_KEY);
    if (!hash.startsWith("#code=") && lastId && lastId !== template.id) {
      const lastTemplate = getTemplate(lastId);
      const lastStored = readStoredFiles(lastTemplate.id);
      setActiveId(lastTemplate.id);
      next = lastStored ?? lastTemplate.files;
    }

    setFiles(next);
    setSavedAt(window.localStorage.getItem(STORAGE_PREFIX + template.id + ":at"));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function selectTemplate(id: string) {
    const template = getTemplate(id);
    setActiveId(template.id);
    const stored = readStoredFiles(template.id);
    setFiles(stored ?? template.files);
    setSavedAt(window.localStorage.getItem(STORAGE_PREFIX + template.id + ":at"));
    window.localStorage.setItem(LAST_TEMPLATE_KEY, template.id);
    router.replace(`/playground?template=${template.id}`, { scroll: false });
  }

  function handleFilesChange(next: CodeFiles) {
    setFiles(next);
    try {
      window.localStorage.setItem(STORAGE_PREFIX + activeId, JSON.stringify(next));
      const at = new Date().toLocaleTimeString();
      window.localStorage.setItem(STORAGE_PREFIX + activeId + ":at", at);
      setSavedAt(at);
    } catch {
      // Storage full or unavailable — the editor still works, it just won't persist.
    }
  }

  function handleReset() {
    const template = getTemplate(activeId);
    setFiles(template.files);
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + activeId);
      window.localStorage.removeItem(STORAGE_PREFIX + activeId + ":at");
    } catch {
      // ignore
    }
    setSavedAt(null);
    toast.success(`Reset to the ${template.title} starter.`);
  }

  function handleClear() {
    setFiles({ html: "", css: "", js: "" });
    handleFilesChange({ html: "", css: "", js: "" });
  }

  function handleDownload() {
    const doc = buildPreviewDocument({ files });
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeId}-practice.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as a single HTML file.");
  }

  function handleOpenPreview() {
    const doc = buildPreviewDocument({ files });
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("Pop-up blocked. Allow pop-ups to open the preview in a new tab.");
      return;
    }
    win.document.write(doc);
    win.document.close();
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}${window.location.pathname}?template=${activeId}#code=${encodeFiles(files)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied — anyone opening it gets this exact code.");
    } catch {
      toast.error("Could not copy. Your browser blocked clipboard access.");
    }
  }

  const visibleTemplates = PLAYGROUND_TEMPLATES.filter(
    (t) => trackFilter === "ALL" || t.track === trackFilter,
  );
  const active = getTemplate(activeId);

  return (
    <div className="space-y-6">
      {/* Template picker */}
      <section aria-label="Practice templates">
        <div className="flex flex-wrap items-center gap-2">
          {TRACK_FILTERS.map((track) => (
            <button
              key={track}
              type="button"
              onClick={() => setTrackFilter(track)}
              aria-pressed={trackFilter === track}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                trackFilter === track
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {track === "ALL" ? "All" : track === "JAVASCRIPT" ? "JavaScript" : track.charAt(0) + track.slice(1).toLowerCase()}
            </button>
          ))}
          {savedAt && (
            <span className="ml-auto text-xs text-muted-foreground">
              Autosaved locally · {savedAt}
            </span>
          )}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visibleTemplates.map((t) => {
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTemplate(t.id)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-card hover:border-primary/50",
                )}
              >
                <span className="flex items-center gap-2">
                  <Badge tone={isActive ? "primary" : "neutral"}>{t.track}</Badge>
                  <Badge tone={t.difficulty === "BEGINNER" ? "success" : t.difficulty === "INTERMEDIATE" ? "warning" : "danger"}>
                    {t.difficulty}
                  </Badge>
                </span>
                <span className="mt-2 block font-semibold">{t.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {t.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Actions bar */}
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{active.title}</p>
          <p className="text-xs text-muted-foreground">
            {countLines(files.html) + countLines(files.css) + countLines(files.js)} lines ·{" "}
            {files.html.length + files.css.length + files.js.length} chars · runs sandboxed, autosaves in this browser
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleCopyLink}>
            <Link2 />
            Copy link
          </Button>
          <Button size="sm" variant="outline" onClick={handleOpenPreview}>
            <ExternalLink />
            New tab
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download />
            Download
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RotateCcw />
            Reset
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClear} aria-label="Clear all code">
            <Trash2 />
          </Button>
        </div>
      </Card>

      {/* Editor + preview + console */}
      {hydrated && (
        <CodePlayground
          key={activeId}
          initialFiles={files}
          onFilesChange={handleFilesChange}
          height={460}
          themePreference={themePreference}
          instructions="Your code runs in a sandboxed frame with no network access and no access to this page. Edits autosave to this browser."
        />
      )}

      <Card className="p-5">
        <h2 className="font-semibold">Good things to try</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li>&middot; Pick a template above, break it on purpose, then fix it — that is the fastest way to learn.</li>
          <li>&middot; Rewrite a Practice challenge solution from memory here before checking it.</li>
          <li>&middot; Use Copy link to share a bug with a friend, or Download to keep a single-file copy.</li>
        </ul>
      </Card>
    </div>
  );
}
