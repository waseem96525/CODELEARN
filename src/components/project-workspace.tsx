"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Eye,
  FileCode2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeFiles } from "@/lib/types";
import { buildPreviewDocument } from "@/lib/playground/preview-document";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CodeEditor, type EditorLanguage } from "@/components/playground/code-editor";
import { ConsolePanel, type ConsoleEntry, type ConsoleLevel } from "@/components/playground/console-panel";
import { saveProject, deleteProject, duplicateProject, resetProject } from "@/app/(app)/actions/projects";

const EMPTY_FILES: CodeFiles = { html: "", css: "", js: "" };

let entryId = 0;

function languageFor(file: string): EditorLanguage {
  if (file.endsWith(".css")) return "css";
  if (file.endsWith(".js") || file.endsWith(".mjs")) return "javascript";
  return "html";
}

/**
 * Wraps the project's files into a single sandboxed document.
 *
 * The preview always renders the HTML file and merges in every stylesheet and
 * script, whichever tab is open in the editor — a .css tab is not a document.
 */
function buildDocument(files: Record<string, string>): string {
  const names = Object.keys(files);
  const htmlName =
    names.find((n) => n.toLowerCase() === "index.html") ??
    names.find((n) => n.endsWith(".html")) ??
    "";
  const source = htmlName ? files[htmlName] : "";

  // Drop <link> and external <script> tags: their contents are merged below, so
  // leaving them in would try to fetch files the sandbox cannot resolve.
  const stripped = source
    .replace(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "")
    .replace(/<script[^>]*\bsrc=[^>]*><\/script>/gi, "");

  const css = names
    .filter((n) => n.endsWith(".css"))
    .map((n) => `/* ${n} */\n${files[n]}`)
    .join("\n\n");
  const js = names
    .filter((n) => n.endsWith(".js") || n.endsWith(".mjs"))
    .map((n) => `// ${n}\n${files[n]}`)
    .join("\n\n");

  return buildPreviewDocument({ files: { ...EMPTY_FILES, html: stripped, css, js } });
}

export interface ProjectWorkspaceProps {
  projectId: string;
  /** The user's saved copy, or null when they have not started this project. */
  userProject: {
    id: string;
    name: string;
    files: Record<string, string>;
    checklist: number[];
    completed: boolean;
  } | null;
  starterFiles: Record<string, string>;
  checklist: string[];
  requirements: string[];
  designReference: CodeFiles;
  xpReward: number;
  /** Passed so a finished project still renders as finished. */
  completed: boolean;
}

/**
 * Multi-file project workspace. The user's own files are the source of truth;
 * the starter files are only a fallback for a project they have not saved yet.
 */
export function ProjectWorkspace({
  projectId,
  userProject,
  starterFiles,
  checklist,
  requirements,
  designReference,
  xpReward,
  completed: initiallyCompleted,
}: ProjectWorkspaceProps) {
  const router = useRouter();
  const initialFiles = userProject?.files ?? starterFiles;

  const [files, setFiles] = React.useState<Record<string, string>>(initialFiles);
  const [activeFile, setActiveFile] = React.useState(() => Object.keys(initialFiles)[0] ?? "index.html");
  const [name, setName] = React.useState(userProject?.name ?? "");
  const [ticked, setTicked] = React.useState<Set<number>>(
    () => new Set(userProject?.checklist ?? []),
  );
  const [completed, setCompleted] = React.useState(initiallyCompleted);
  const [showReference, setShowReference] = React.useState(false);
  const [entries, setEntries] = React.useState<ConsoleEntry[]>([]);
  const [runNonce, setRunNonce] = React.useState(0);
  const [documentSrc, setDocumentSrc] = React.useState(() =>
    buildDocument(initialFiles),
  );
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const run = React.useCallback(() => {
    setEntries([]);
    setDocumentSrc(buildDocument(files));
    setRunNonce((n) => n + 1);
  }, [files]);

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object" || data.__codelearn !== true) return;
      const level = (data.level as ConsoleLevel) ?? "log";
      if (level === "ready" || typeof data.text !== "string" || !data.text) return;
      setEntries((prev) => [...prev.slice(-150), { id: entryId++, level, text: data.text }]);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function toggleChecklist(index: number) {
    setTicked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function persist(next: {
    files: Record<string, string>;
    checklist: number[];
    completed: boolean;
    name: string;
  }) {
    setSaving(true);
    const response = await saveProject({
      projectId,
      name: next.name,
      files: next.files,
      checklist: next.checklist,
      completed: next.completed,
    });
    setSaving(false);

    if (!response.ok) {
      toast.error(response.error ?? "Could not save your project.");
      return null;
    }
    return response;
  }

  async function save() {
    const checklist = [...ticked];
    const response = await persist({ files, checklist, completed, name: name.trim() });
    if (!response) return;

    if (response.justCompleted) {
      setCompleted(true);
      router.refresh();
      toast.success(`Project complete — +${response.xpGained} XP`, {
        description: "It is now part of your portfolio.",
      });
      if (response.levelUp) {
        toast.success(`Level up! You reached level ${response.level}.`, {
          description: response.levelName,
        });
      }
      for (const badge of response.newBadges) {
        toast.success(`🏆 ${badge.name}`, { description: `+${badge.xpReward} XP` });
      }
      if (response.certificateId) {
        toast.success("📜 Certificate earned", {
          description: "You finished your whole learning path.",
        });
      }
    } else {
      toast.success("Project saved");
    }
  }

  function markComplete() {
    const willComplete = !completed;
    if (willComplete && ticked.size < checklist.length) {
      toast.error("Finish the checklist first", {
        description: `${checklist.length - ticked.size} item(s) left.`,
      });
      return;
    }
    if (willComplete && name.trim().length < 1) {
      toast.error("Give your project a name first.");
      return;
    }

    setCompleted(willComplete);
    void persist({
      files,
      checklist: [...ticked],
      completed: willComplete,
      name: name.trim() || "Untitled project",
    }).then((response) => {
      if (!response) {
        setCompleted(!willComplete);
        return;
      }
      if (response.justCompleted) {
        router.refresh();
        toast.success(`Project complete — +${response.xpGained} XP`);
        if (response.certificateId) {
          toast.success("📜 Certificate earned", {
            description: "You finished your whole learning path.",
          });
        }
      } else {
        toast.success("Project updated");
      }
    });
  }

  async function handleReset() {
    const response = await resetProject(userProject!.id);
    if (!response.ok) {
      toast.error(response.error ?? "Could not reset this project.");
      return;
    }
    setFiles(starterFiles);
    setTicked(new Set());
    setCompleted(false);
    setActiveFile(Object.keys(starterFiles)[0] ?? "index.html");
    setDocumentSrc(buildDocument(starterFiles));
    setRunNonce((n) => n + 1);
    toast.success("Reset to the starter files");
  }

  async function handleDuplicate() {
    const response = await duplicateProject(userProject!.id);
    if (!response.ok) {
      toast.error(response.error ?? "Could not duplicate this project.");
      return;
    }
    router.push(`/projects/${response.newId}`);
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this copy? The project brief stays available, but your code is gone.",
    );
    if (!confirmed) return;

    const response = await deleteProject(userProject!.id);
    if (!response.ok) {
      toast.error(response.error ?? "Could not delete this project.");
      return;
    }
    router.push("/projects");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* ------------------------------ Toolbar ------------------------------ */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={run} size="sm">
          <Play />
          Run
        </Button>
        <Button onClick={save} size="sm" variant="outline" loading={saving}>
          <Save />
          Save
        </Button>
        <Button
          onClick={markComplete}
          size="sm"
          variant={completed ? "outline" : "success"}
        >
          <Check />
          {completed ? "Mark as not finished" : `Mark complete (+${xpReward} XP)`}
        </Button>
        <Button
          onClick={() => setShowReference((v) => !v)}
          size="sm"
          variant={showReference ? "subtle" : "ghost"}
          aria-pressed={showReference}
        >
          <Eye />
          {showReference ? "Showing reference" : "Show reference"}
        </Button>

        <div className="ml-auto flex items-center gap-2">
          {userProject && (
            <>
              <Button onClick={handleDuplicate} size="sm" variant="ghost">
                <Copy />
                <span className="hidden sm:inline">Duplicate</span>
              </Button>
              <Button onClick={handleReset} size="sm" variant="ghost">
                <RotateCcw />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button
                onClick={handleDelete}
                size="sm"
                variant="ghost"
                className="text-danger hover:bg-danger-soft"
              >
                <Trash2 />
                <span className="sr-only">Delete this project</span>
              </Button>
            </>
          )}
          <Button
            onClick={() => setIsFullscreen((v) => !v)}
            size="icon-sm"
            variant="ghost"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>
      </div>

      {/* ------------------------------ Workspace ------------------------------ */}
      <Card
        className={cn(
          "overflow-hidden",
          isFullscreen && "fixed inset-0 z-50 rounded-none",
        )}
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/60 px-3 py-2">
          <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="File">
            {Object.keys(files).map((file) => (
              <button
                key={file}
                type="button"
                role="tab"
                aria-selected={activeFile === file}
                onClick={() => {
                  setActiveFile(file);
                  setDocumentSrc(buildDocument(files));
                  setRunNonce((n) => n + 1);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  activeFile === file
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <FileCode2 className="size-3.5" />
                {file}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {showReference ? "Reference design" : "Sandboxed"}
          </span>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="border-b border-border lg:border-b-0 lg:border-r">
            <CodeEditor
              value={files[activeFile] ?? ""}
              language={languageFor(activeFile)}
              onChange={(value) => setFiles((prev) => ({ ...prev, [activeFile]: value }))}
              minHeight={340}
              className="min-h-[340px]"
              aria-label={`${activeFile} editor`}
            />
          </div>
          <div className="flex flex-col">
            {showReference ? (
              <iframe
                title="Reference design"
                srcDoc={buildPreviewDocument({ files: designReference })}
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
                className="h-[340px] w-full bg-white"
              />
            ) : (
              <iframe
                key={runNonce}
                ref={iframeRef}
                title="Project preview"
                srcDoc={documentSrc}
                sandbox="allow-scripts allow-modals allow-forms"
                referrerPolicy="no-referrer"
                className="h-[340px] w-full bg-white"
              />
            )}
            <ConsolePanel
              entries={entries}
              onClear={() => setEntries([])}
              className="h-32 shrink-0 border-t border-border"
            />
          </div>
        </div>
      </Card>

      {/* --------------------------- Brief + checklist --------------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-semibold">Requirements</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {requirement}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">Checklist</h2>
            <Badge tone={ticked.size === checklist.length ? "success" : "neutral"}>
              {ticked.size}/{checklist.length}
            </Badge>
          </div>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Project name
            </span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="My landing page"
              maxLength={80}
              className="mt-1.5"
            />
          </label>

          <ul className="mt-4 space-y-2">
            {checklist.map((item, index) => {
              const done = ticked.has(index);
              return (
                <li key={index}>
                  <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleChecklist(index)}
                      className="mt-0.5 size-4 shrink-0 rounded border-input accent-[hsl(var(--primary))]"
                    />
                    <span className={cn(done && "text-muted-foreground line-through")}>{item}</span>
                  </label>
                </li>
              );
            })}
          </ul>

          {completed && (
            <p className="mt-4 rounded-lg border border-success/30 bg-success-soft/40 p-3 text-sm font-medium text-success">
              Completed — this is in your portfolio.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
