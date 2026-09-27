import Link from "next/link";
import { getLevelInfo } from "@/lib/levels";
import { cn, formatXp } from "@/lib/utils";

/**
 * Level + XP indicator. Purely presentational: takes the values as props so it
 * can render in both server components and client components.
 */
export function LevelPill({
  level,
  xp,
  showXp = true,
  className,
}: {
  level: number;
  xp: number;
  showXp?: boolean;
  className?: string;
}) {
  const info = getLevelInfo(xp);
  return (
    <Link
      href="/profile"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-xs font-semibold transition-colors hover:border-primary/40",
        className,
      )}
      title={`${info.name} — ${xp} XP total`}
    >
      <span className="text-primary">Lv {level}</span>
      <span className="text-muted-foreground">{info.name}</span>
      {showXp && (
        <span className="text-muted-foreground/80">
          {formatXp(xp)} XP
        </span>
      )}
    </Link>
  );
}
