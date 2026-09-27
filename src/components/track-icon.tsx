import * as React from "react";
import { iconFor } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Track colours are written out in full rather than interpolated, because
 * Tailwind's scanner cannot see class names built at runtime.
 */
const TRACK_STYLES: Record<string, string> = {
  HTML: "bg-track-html/12 text-track-html",
  CSS: "bg-track-css/12 text-track-css",
  JAVASCRIPT: "bg-track-js/12 text-track-js",
};

const TONES: Record<string, string> = {
  html: "bg-track-html/12 text-track-html",
  css: "bg-track-css/12 text-track-css",
  javascript: "bg-track-js/12 text-track-js",
};

export function TrackIcon({
  track,
  icon,
  className,
  size = "md",
}: {
  track: string;
  icon?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dimension = size === "lg" ? "size-12" : size === "sm" ? "size-8" : "size-10";
  const glyphSize = size === "lg" ? "size-6" : size === "sm" ? "size-4" : "size-5";

  // The icon name is data (it comes from the seed), so it is resolved to a
  // component reference and instantiated here rather than being a JSX tag.
  const glyph = React.createElement(iconFor(icon ?? "Sparkles"), {
    className: glyphSize,
  });

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg",
        dimension,
        TRACK_STYLES[track] ?? "bg-primary-soft text-primary",
        className,
      )}
    >
      {glyph}
    </span>
  );
}

/** Small text badge in the track's colour, used in lists and headers. */
export function TrackChip({
  track,
  className,
}: {
  track: string;
  className?: string;
}) {
  const label =
    track === "JAVASCRIPT" ? "JavaScript" : track.charAt(0) + track.slice(1).toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        TONES[track.toLowerCase()] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
