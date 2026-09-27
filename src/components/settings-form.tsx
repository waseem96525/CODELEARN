"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { updateSettings } from "@/app/(app)/actions/settings";
import { ThemeToggle } from "@/components/theme-toggle";

export interface SettingsValues {
  name: string;
  dailyGoalMinutes: number;
  editorTheme: "light" | "dark" | "system";
  notifyLessons: boolean;
  notifyStreaks: boolean;
  notifyBadges: boolean;
  notifyProjects: boolean;
  notifyMarketing: boolean;
  reduceMotion: boolean;
}

const NOTIFICATIONS: { key: keyof SettingsValues; label: string; description: string }[] = [
  {
    key: "notifyLessons",
    label: "Lesson reminders",
    description: "A nudge when you have not practised for a few days.",
  },
  {
    key: "notifyStreaks",
    label: "Streak warnings",
    description: "Tell me before my streak is about to break.",
  },
  {
    key: "notifyBadges",
    label: "Badges and level ups",
    description: "Celebrate each new badge the moment it unlocks.",
  },
  {
    key: "notifyProjects",
    label: "Projects and certificates",
    description: "Updates when a project is finished or a certificate is issued.",
  },
  {
    key: "notifyMarketing",
    label: "Product news",
    description: "Occasional emails about new courses. No more than monthly.",
  },
];

export function SettingsForm({ values }: { values: SettingsValues }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = React.useState(values.reduceMotion);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const response = await updateSettings({
        name: String(data.get("name") ?? ""),
        dailyGoalMinutes: Number(data.get("dailyGoalMinutes") ?? 30),
        editorTheme: String(data.get("editorTheme") ?? "system") as SettingsValues["editorTheme"],
        notifyLessons: data.get("notifyLessons") === "on",
        notifyStreaks: data.get("notifyStreaks") === "on",
        notifyBadges: data.get("notifyBadges") === "on",
        notifyProjects: data.get("notifyProjects") === "on",
        notifyMarketing: data.get("notifyMarketing") === "on",
        reduceMotion,
      });

      if (!response.ok) {
        setError(response.error ?? "Could not save your settings.");
        return;
      }

      toast.success(response.success ?? "Settings saved");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ------------------------------ Account ------------------------------ */}
      <Card className="p-5">
        <h2 className="font-semibold">Learning</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your daily target drives the goal ring and streak reminders.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Display name" htmlFor="settings-name">
            <Input
              id="settings-name"
              name="name"
              defaultValue={values.name}
              required
              minLength={2}
              maxLength={50}
            />
          </Field>

          <Field label="Daily goal" htmlFor="settings-goal" hint="Between 10 and 120 minutes.">
            <Select
              id="settings-goal"
              name="dailyGoalMinutes"
              defaultValue={String(values.dailyGoalMinutes)}
            >
              {[10, 15, 20, 30, 45, 60, 90, 120].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      {/* ---------------------------- Appearance ---------------------------- */}
      <Card className="p-5">
        <h2 className="font-semibold">Appearance</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Applies to the app shell and the code editor.
        </p>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">App theme</p>
            <ThemeToggle />
          </div>

          <Field label="Code editor theme" htmlFor="settings-editor-theme">
            <Select
              id="settings-editor-theme"
              name="editorTheme"
              defaultValue={values.editorTheme}
            >
              <option value="system">Match the app</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </Field>

          <label className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <span>
              <span className="block text-sm font-medium">Reduce motion</span>
              <span className="block text-sm text-muted-foreground">
                Turns off progress bar animations and card transitions.
              </span>
            </span>
            <Switch
              checked={reduceMotion}
              onCheckedChange={setReduceMotion}
              aria-label="Reduce motion"
            />
          </label>
        </div>
      </Card>

      {/* --------------------------- Notifications --------------------------- */}
      <Card className="p-5">
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          We only email you about things you asked for.
        </p>

        <ul className="mt-4 space-y-2">
          {NOTIFICATIONS.map((item) => (
            <li key={item.key}>
              <label className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-sm text-muted-foreground">{item.description}</span>
                </span>
                <Switch
                  name={item.key}
                  defaultChecked={values[item.key] as boolean}
                  aria-label={item.label}
                />
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <Button type="submit" loading={pending}>
        <Save />
        Save settings
      </Button>
    </form>
  );
}
