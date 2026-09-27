/** Shape returned by every server action for use with `useActionState`. */
export type ActionState = {
  error?: string;
  success?: string;
  fields?: Record<string, string>;
} | null;
