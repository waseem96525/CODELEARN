"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { updateProfile } from "@/app/(app)/actions/settings";

export interface ProfileFormValues {
  name: string;
  bio: string;
  dailyGoalMinutes: number;
  editorTheme: "light" | "dark" | "system";
}

export function ProfileForm({ values }: { values: ProfileFormValues }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const response = await updateProfile({
        name: String(data.get("name") ?? ""),
        bio: String(data.get("bio") ?? ""),
        dailyGoalMinutes: Number(data.get("dailyGoalMinutes") ?? 30),
        editorTheme: String(data.get("editorTheme") ?? "system") as ProfileFormValues["editorTheme"],
      });

      if (!response.ok) {
        setError(response.error ?? "Could not save your profile.");
        return;
      }

      toast.success(response.success ?? "Profile updated");
      router.refresh();
    });
  }

  return (
    <Card className="p-5">
      <h2 className="font-semibold">Edit profile</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        This is how your name appears across the app.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit} className="mt-4 space-y-4">
        <Field label="Name" htmlFor="profile-name">
          <Input
            id="profile-name"
            name="name"
            defaultValue={values.name}
            required
            minLength={2}
            maxLength={50}
            autoComplete="name"
          />
        </Field>

        <Field
          label="Bio"
          htmlFor="profile-bio"
          hint="Up to 280 characters. Optional."
        >
          <Textarea
            id="profile-bio"
            name="bio"
            defaultValue={values.bio}
            maxLength={280}
            rows={3}
            placeholder="What are you learning and why?"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Daily goal"
            htmlFor="profile-goal"
            hint="Between 10 and 120 minutes."
          >
            <Select
              id="profile-goal"
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

          <Field label="Editor theme" htmlFor="profile-editor-theme">
            <Select
              id="profile-editor-theme"
              name="editorTheme"
              defaultValue={values.editorTheme}
            >
              <option value="system">Match the app</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </Field>
        </div>

        <Button type="submit" loading={pending}>
          <Save />
          Save changes
        </Button>
      </form>
    </Card>
  );
}
