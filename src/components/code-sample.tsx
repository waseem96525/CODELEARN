"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const KEYWORDS: Record<string, string> = {
  keyword: "text-[#7c3aed] dark:text-[#c4b5fd] font-medium",
  tag: "text-[#0b7285] dark:text-[#22d3ee]",
  string: "text-[#b45309] dark:text-[#fcd34d]",
  comment: "text-muted-foreground italic",
  number: "text-[#047857] dark:text-[#34d399]",
  attr: "text-[#4f46e5] dark:text-[#a5b4fc]",
  punct: "text-muted-foreground",
};

/**
 * Tiny, dependency-free highlighter for the short snippets shown in lessons.
 * The full Monaco editor is reserved for the interactive playground — a lesson
 * has many small samples and loading an editor for each would be wasteful.
 */
function tokenize(code: string, lang: string): React.ReactNode[] {
  const patterns: { type: keyof typeof KEYWORDS; re: RegExp }[] = [];

  if (lang === "html") {
    patterns.push(
      { type: "comment", re: /<!--[\s\S]*?-->/ },
      { type: "string", re: /"[^"]*"|'[^']*'/ },
      { type: "tag", re: /<\/?[A-Za-z][\w-]*/ },
      { type: "attr", re: /\s[A-Za-z-]+(?==)/ },
    );
  } else if (lang === "css") {
    patterns.push(
      { type: "comment", re: /\/\*[\s\S]*?\*\// },
      { type: "string", re: /"[^"]*"|'[^']*'/ },
      { type: "number", re: /#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|deg|fr|vh|vw)?\b/g },
      { type: "keyword", re: /@[a-z-]+|--[a-z-]+|\.[a-zA-Z-]+|#[\w-]+/g },
      { type: "attr", re: /\b[a-z-]+(?=\s*:)/ },
    );
  } else if (lang === "javascript") {
    patterns.push(
      { type: "comment", re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
      { type: "string", re: /`[^`]*`|"[^"]*"|'[^']*'/ },
      { type: "number", re: /\b\d+(?:\.\d+)?\b/ },
      {
        type: "keyword",
        re: /\b(?:const|let|var|function|return|if|else|for|while|of|in|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|this)\b/g,
      },
    );
  } else {
    patterns.push({ type: "comment", re: /#[^\n]*/ });
  }

  const combined = new RegExp(patterns.map((p) => `(${p.re.source})`).join("|"), "g");

  const out: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of code.matchAll(combined)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      out.push(<span key={key++}>{code.slice(lastIndex, index)}</span>);
    }

    const value = match[0];
    const type = patterns.find((p) => new RegExp(`^(?:${p.re.source})$`).test(value))?.type;

    out.push(
      <span key={key++} className={type ? KEYWORDS[type] : undefined}>
        {value}
      </span>,
    );
    lastIndex = index + value.length;
  }

  if (lastIndex < code.length) {
    out.push(<span key={key++}>{code.slice(lastIndex)}</span>);
  }

  return out;
}

const LANG_LABEL: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  bash: "Shell",
};

export function CodeSample({
  code,
  lang,
  caption,
  className,
}: {
  code: string;
  lang: "html" | "css" | "javascript" | "bash";
  caption?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className={cn("overflow-hidden rounded-xl border border-border bg-editor", className)}>
      <figcaption className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {LANG_LABEL[lang] ?? lang}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={copy}
          aria-label="Copy code"
          className="h-6 w-6"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
      </figcaption>

      <pre className="overflow-x-auto p-4 text-[13px] leading-6">
        <code className="font-mono">{tokenize(code, lang)}</code>
      </pre>

      {caption && (
        <p className="border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          {caption}
        </p>
      )}
    </figure>
  );
}
