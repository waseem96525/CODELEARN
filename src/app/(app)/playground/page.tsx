import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { CodePlayground } from "@/components/playground/code-playground";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app-shell";
import type { CodeFiles } from "@/lib/types";

export const metadata: Metadata = {
  title: "Playground",
  description: "A free-form editor and live preview for HTML, CSS and JavaScript.",
  robots: { index: false, follow: false },
};

const STARTER: CodeFiles = {
  html: `<main class="card">
  <h1>Hello, world</h1>
  <p>Edit any tab and the preview updates as you type.</p>
  <button id="shout">Shout it</button>
</main>`,
  css: `body {
  display: grid;
  place-items: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  background: #f4f4f5;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.08);
  text-align: center;
}

button {
  margin-top: 16px;
  border: 0;
  border-radius: 8px;
  padding: 10px 18px;
  background: #4f46e5;
  color: white;
  font-weight: 600;
  cursor: pointer;
}`,
  js: `const button = document.querySelector("#shout");
const heading = document.querySelector("h1");

button.addEventListener("click", () => {
  heading.textContent = heading.textContent.toUpperCase() + "!";
  console.log("Shouted at", new Date().toLocaleTimeString());
});`,
};

export default async function PlaygroundPage() {
  const user = await requireUser("/playground");

  const settings = await prisma.user.findUnique({
    where: { id: user.id },
    select: { editorTheme: true },
  });

  const theme =
    settings?.editorTheme === "light" || settings?.editorTheme === "dark"
      ? settings.editorTheme
      : "system";

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Playground"
        description="A blank editor with a live preview. Nothing here is saved or graded — it is yours to experiment in."
      />

      <CodePlayground
        initialFiles={STARTER}
        height={460}
        themePreference={theme}
        instructions="Your code runs in a sandboxed frame with no network access and no access to this page."
      />

      <Card className="p-5">
        <h2 className="font-semibold">Good things to try</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li>&middot; Reproduce a CSS bug from a lesson, then fix it.</li>
          <li>&middot; Rewrite a challenge solution from memory before checking it.</li>
          <li>&middot; Start a project here first — the Projects editor keeps your files.</li>
        </ul>
      </Card>
    </div>
  );
}
