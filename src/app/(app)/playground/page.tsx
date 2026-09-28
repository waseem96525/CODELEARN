import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/app-shell";
import { PracticeStudio } from "@/components/playground/practice-studio";
import { getTemplate } from "@/components/playground/playground-templates";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Directly practice HTML, CSS and JavaScript in a live editor with instant preview, templates, autosave and sharing.",
  robots: { index: false, follow: false },
};

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const user = await requireUser("/playground");
  const params = await searchParams;

  const settings = await prisma.user.findUnique({
    where: { id: user.id },
    select: { editorTheme: true },
  });

  const theme =
    settings?.editorTheme === "light" || settings?.editorTheme === "dark"
      ? settings.editorTheme
      : "system";

  const initialTemplateId = getTemplate(params.template).id;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Playground"
        description="Directly practice HTML, CSS and JavaScript — pick a template, edit, and watch the live preview. Autosaves in your browser; nothing is graded."
      />

      <PracticeStudio initialTemplateId={initialTemplateId} themePreference={theme} />
    </div>
  );
}
