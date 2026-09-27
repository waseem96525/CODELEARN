import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { OnboardingFlow } from "@/components/onboarding-flow";

export const metadata: Metadata = {
  title: "Set up your learning path",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const user = await requireUser("/onboarding");
  // Never re-onboard someone who has already chosen a path.
  if (user.onboardingDone) redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center px-4 py-10">
      <OnboardingFlow />
    </div>
  );
}
