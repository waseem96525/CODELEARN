import { AuthForm } from "@/components/auth-form";

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const { next } = await searchParams;
  const target = Array.isArray(next) ? next[0] : next;
  return <AuthForm mode="signup" next={target} />;
}
