"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { refreshAchievements } from "@/app/(app)/actions/settings";

/**
 * Achievements are granted as a side effect of other actions, so this lets a
 * learner re-run the check after doing something outside the app (a bookmark,
 * for example) and collect anything that has since qualified.
 */
export function AchievementCheckButton() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function check() {
    startTransition(async () => {
      const response = await refreshAchievements();
      if (!response.ok) {
        toast.error("Could not re-check your achievements.");
        return;
      }

      const unlocked = response.unlocked ?? [];
      if (unlocked.length === 0) {
        toast.success("Nothing new — keep going");
        return;
      }

      toast.success(`${unlocked.length} new badge(s) unlocked`);
      router.refresh();
    });
  }

  return (
    <Button onClick={check} size="sm" variant="outline" loading={pending}>
      <RefreshCw />
      Check again
    </Button>
  );
}
