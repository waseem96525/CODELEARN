import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app-shell";
import { SettingsForm, type SettingsValues } from "@/components/settings-form";
import { LogoutButton } from "@/components/logout-button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Settings",
  description: "Your goals, appearance and notification preferences.",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const user = await requireUser("/settings");

  const record = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      name: true,
      createdAt: true,
      dailyGoalMinutes: true,
      editorTheme: true,
      notifyLessons: true,
      notifyStreaks: true,
      notifyBadges: true,
      notifyProjects: true,
      notifyMarketing: true,
      reduceMotion: true,
    },
  });

  const values: SettingsValues = {
    name: record.name,
    dailyGoalMinutes: record.dailyGoalMinutes,
    editorTheme:
      record.editorTheme === "light" || record.editorTheme === "dark"
        ? record.editorTheme
        : "system",
    notifyLessons: record.notifyLessons,
    notifyStreaks: record.notifyStreaks,
    notifyBadges: record.notifyBadges,
    notifyProjects: record.notifyProjects,
    notifyMarketing: record.notifyMarketing,
    reduceMotion: record.reduceMotion,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader title="Settings" description="Everything about how CodeLearn works for you." />

      <SettingsForm values={values} />

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="font-semibold">Account</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Signed in as {user.email} &middot; member since {formatDate(record.createdAt)}
          </p>
        </div>
        <LogoutButton />
      </Card>
    </div>
  );
}
