import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  // Repeated query params arrive as an array; take the first value.
  const target = Array.isArray(next) ? next[0] : next;
  return <AuthForm mode="login" next={target} />;
}
