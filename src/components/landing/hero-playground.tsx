"use client";

import * as React from "react";
import { CodePlayground } from "@/components/playground/code-playground";

const HERO_FILES = {
  html: `<div class="card">
  <h1 id="title">Hello World!</h1>
  <p>Edit me — the preview updates as you type.</p>
  <button id="greet" onclick="greet()">Click me</button>
</div>`,
  css: `.card {
  padding: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eef2ff, #fce7f3);
  border: 1px solid #c7d2fe;
  text-align: center;
}
h1 { color: #4f46e5; margin: 0 0 8px; }
p { color: #475569; margin: 0 0 16px; }
button {
  background: #4f46e5;
  color: white;
  border: 0;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
button:hover { background: #4338ca; }`,
  js: `function greet() {
  const title = document.getElementById("title");
  title.textContent = "Welcome to CodeLearn!";
  console.log("Greeted at", new Date().toLocaleTimeString());
}`,
};

/**
 * The real editor, mounted only once it is near the viewport. Monaco is a large
 * dependency, so the landing page does not pay for it on first paint.
 */
export function HeroPlayground() {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = React.useState(false);

  React.useEffect(() => {
    const node = hostRef.current;
    if (!node || shouldMount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldMount]);

  return (
    <div ref={hostRef} className="w-full">
      {shouldMount ? (
        <CodePlayground initialFiles={HERO_FILES} height={280} showConsole={false} />
      ) : (
        <div
          className="flex h-[380px] items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground"
          aria-hidden
        >
          Loading interactive editor...
        </div>
      )}
    </div>
  );
}
