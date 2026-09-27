"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/(auth)/actions";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function signOut() {
    // The action performs the redirect, so the local one is a no-op safety net.
    await logoutAction();
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label="Sign out"
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          signOut().catch(() => toast.error("Could not sign out. Try again."));
        });
      }}
    >
      <LogOut />
    </Button>
  );
}
