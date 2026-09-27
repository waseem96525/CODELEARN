"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  Lightbulb,
  Loader2,
  Play,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeFiles, TestResult, ValidationTest } from "@/lib/types";
import { buildChallengeDocument } from "@/lib/playground/challenge-document";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeEditor, type EditorLanguage } from "@/components/playground/code-editor";
import { ConsolePanel, type ConsoleEntry, type ConsoleLevel } from "@/components/playground/console-panel";
import { revealHint, submitChallenge } from "@/app/(app)/actions/challenges";

const EMPTY: CodeFiles = { html: "", css: "", js: "" };

const TABS: { key: keyof CodeFiles; label: string; language: EditorLanguage }[] = [
  { key: "html", label: "index.html", language: "html" },
  { key: "css", label: "style.css", language: "css" },
  { key: "js", label: "script.js", language: "javascript" },
];

let entryId = 0;

export interface ChallengeSolverProps {
  challengeId: string;
  starterCode: CodeFiles;
  solution: CodeFiles;
  tests: ValidationTest[];
  /** Pass on server, so a solved challenge still shows its code and tests. */
  alreadyPassed: boolean;
  attempts: number;
}

/**
 * Challenge workspace: edit, run the sandboxed preview, read the test report,
 * then submit. Tests execute inside the iframe — the parent only ever receives
 * the reported results and re-checks the count server-side before awarding XP.
 */
export function ChallengeSolver({
  challengeId,
  starterCode,
  solution,
  tests,
  alreadyPassed,
  attempts,
}: ChallengeSolverProps) {
  const router = useRouter();
  const [files, setFiles] = React.useState<CodeFiles>({ ...EMPTY, ...starterCode });
  const [activeTab, setActiveTab] = React.useState<keyof CodeFiles>("html");
  const [results, setResults] = React.useState<TestResult[] | null>(null);
  const [entries, setEntries] = React.useState<ConsoleEntry[]>([]);
  const [runNonce, setRunNonce] = React.useState(0);
  const [documentSrc, setDocumentSrc] = React.useState(() =>
    buildChallengeDocument({ files: { ...EMPTY, ...starterCode }, tests }),
  );
  const [hints, setHints] = React.useState<string[]>([]);
  const [, startTransition] = React.useTransition();
  const [submitting, setSubmitting] = React.useState(false);
  const [solved, setSolved] = React.useState(alreadyPassed);
  const [showSolution, setShowSolution] = React.useState(false);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const run = React.useCallback(() => {
    setResults(null);
    setEntries([]);
    setDocumentSrc(buildChallengeDocument({ files, tests }));
    setRunNonce((n) => n + 1);
  }, [files, tests]);

  // Only accept messages from our own frame, and only the payload shape the
  // sandbox is allowed to send.
  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object" || data.__codelearn !== true) return;

      if (data.level === "tests" && Array.isArray(data.results)) {
        setResults(data.results as TestResult[]);
        return;
      }

      const level = (data.level as ConsoleLevel) ?? "log";
      if (level === "ready" || typeof data.text !== "string" || !data.text) return;
      setEntries((prev) => [...prev.slice(-150), { id: entryId++, level, text: data.text }]);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function updateFile(key: keyof CodeFiles, value: string) {
    setFiles((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setFiles({ ...EMPTY, ...starterCode });
    setResults(null);
    setEntries([]);
    setDocumentSrc(buildChallengeDocument({ files: { ...EMPTY, ...starterCode }, tests }));
    setRunNonce((n) => n + 1);
  }

  function loadSolution() {
    setFiles(solution);
    setShowSolution(true);
    toast.info("Solution loaded into the editor", {
      description: "Read it, change it, then run the tests to see why it works.",
    });
  }

  async function nextHint() {
    const response = await revealHint(challengeId, hints.length);
    if (!response.ok || !response.hint) {
      toast.error("No more hints for this challenge.");
      return;
    }
    setHints((prev) => [...prev, response.hint as string]);
  }

  function submit() {
    if (!results) {
      toast.error("Run your code first", { description: "Tests report once the preview loads." });
      return;
    }

    setSubmitting(true);
    startTransition(async () => {
      const response = await submitChallenge({
        challengeId,
        code: files,
        results,
        hintsUsed: hints.length,
      });
      setSubmitting(false);

      if (!response.ok) {
        toast.error(response.error ?? "Could not record your attempt.");
        return;
      }

      setSolved(response.passed);
      router.refresh();

      if (response.passed) {
        toast.success(
          response.xpGained > 0
            ? `Challenge passed — +${response.xpGained} XP`
            : "Challenge passed",
          {
            description:
              response.xpGained > 0
                ? "You have already claimed this challenge's XP."
                : "You solved this one before, so no extra XP this time.",
          },
        );
        if (response.levelUp) {
          toast.success(`Level up! You reached level ${response.level}.`, {
            description: response.levelName,
          });
        }
        for (const badge of response.newBadges) {
          toast.success(`🏆 ${badge.name}`, { description: `+${badge.xpReward} XP` });
        }
      } else {
        toast.warning(`${response.passedCount} of ${response.total} tests passed`, {
          description: "Fix the failing tests and submit again.",
        });
      }
    });
  }

  const passedCount = results?.filter((r) => r.passed).length ?? 0;
  const allPassed = results !== null && passedCount === results.length && results.length > 0;

  return (
    <div className="space-y-4">
      {/* ------------------------------ Toolbar ------------------------------ */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={run} size="sm">
          <Play />
          Run tests
        </Button>
        <Button onClick={submit} size="sm" variant={allPassed ? "success" : "primary"} loading={submitting}>
          <Send />
          Submit
        </Button>
        <Button onClick={reset} size="sm" variant="ghost">
          <RotateCcw />
          Reset
        </Button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {solved && (
            <Badge tone="success">
              <Check className="size-3" />
              Solved
            </Badge>
          )}
          <Button onClick={nextHint} size="sm" variant="ghost">
            <Lightbulb />
            Hint ({hints.length})
          </Button>
          <Button onClick={loadSolution} size="sm" variant="ghost" aria-pressed={showSolution}>
            <Lightbulb />
            Show solution
          </Button>
        </div>
      </div>

      {/* ------------------------------- Hints ------------------------------- */}
      {hints.length > 0 && (
        <Card className="border-warning/30 bg-warning-soft/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-warning">
            Hints ({hints.length} used — each one costs 5 XP)
          </p>
          <ol className="mt-2 space-y-1.5 text-sm">
            {hints.map((hint, index) => (
              <li key={index}>
                <span className="font-semibold">{index + 1}.</span> {hint}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {showSolution && (
        <Card className="border-info/30 bg-info-soft/30 p-4 text-sm">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-info" />
            <div>
              <p className="font-semibold">Reference solution</p>
              <p className="mt-1 text-muted-foreground">
                It has been loaded into the editor. Study it, change it, and run the tests to
                see each assertion pass.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ------------------------- Editor and preview ------------------------- */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 px-2 py-1.5">
          <div role="tablist" aria-label="File" className="flex flex-wrap items-center gap-1">
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
          <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Sandboxed
          </span>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="border-b border-border lg:border-b-0 lg:border-r">
            <CodeEditor
              value={files[activeTab]}
              language={TABS.find((t) => t.key === activeTab)!.language}
              onChange={(value) => updateFile(activeTab, value)}
              minHeight={300}
              className="min-h-[300px]"
              aria-label={`${activeTab} editor`}
            />
          </div>
          <div className="flex flex-col">
            <iframe
              key={runNonce}
              ref={iframeRef}
              title="Challenge preview and test runner"
              srcDoc={documentSrc}
              sandbox="allow-scripts allow-modals allow-forms"
              referrerPolicy="no-referrer"
              className="h-[300px] w-full bg-white"
            />
            <ConsolePanel
              entries={entries}
              onClear={() => setEntries([])}
              className="h-32 shrink-0 border-t border-border"
            />
          </div>
        </div>
      </Card>

      {/* ---------------------------- Test results ---------------------------- */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Tests</h2>
          {results ? (
            <Badge tone={allPassed ? "success" : "warning"}>
              {passedCount} of {results.length} passing
            </Badge>
          ) : (
            <Badge tone="neutral">Not run yet</Badge>
          )}
        </div>

        {results === null ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Press <span className="font-medium text-foreground">Run tests</span> to check your
            code against {tests.length} assertion{tests.length === 1 ? "" : "s"}.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {results.map((result, index) => (
              <li
                key={`${result.label}-${index}`}
                className={cn(
                  "flex items-start gap-2.5 rounded-lg border p-3 text-sm",
                  result.passed
                    ? "border-success/30 bg-success-soft/40"
                    : "border-danger/30 bg-danger-soft/30",
                )}
              >
                {result.passed ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-danger" />
                )}
                <div className="min-w-0">
                  <p className="font-medium">{result.label}</p>
                  <p className="text-xs text-muted-foreground">{result.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {solved && (
          <p className="mt-4 text-sm text-muted-foreground">
            Solved with {attempts} attempt{attempts === 1 ? "" : "s"} on record. You can keep
            refining your solution — resubmitting will not award XP again.
          </p>
        )}
      </Card>

      {submitting && (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Recording your attempt…
        </p>
      )}
    </div>
  );
}
