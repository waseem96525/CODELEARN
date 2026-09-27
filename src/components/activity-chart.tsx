"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

export interface ActivityPoint {
  date: string;
  label: string;
  xp: number;
  minutes: number;
}

// Design tokens hold raw colour values (not HSL components), so SVG attributes
// can reference them directly through var().
const BAR_COLOR = "var(--primary)";

/**
 * Weekly activity. Recharts is dynamically imported below the fold of the
 * dashboard, so its weight is not on the critical rendering path.
 */
export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  const hasActivity = data.some((d) => d.minutes > 0);

  if (!hasActivity) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
        No activity yet. Finish a lesson and your week will show up here.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.minutes), 10);

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--muted-foreground)"
            domain={[0, Math.ceil(max / 10) * 10]}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const amount = typeof value === "number" ? value : Number(value ?? 0);
              return name === "minutes"
                ? [`${amount} min`, "Studied"]
                : [`${amount} XP`, "Earned"];
            }}
          />
          <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={entry.minutes > 0 ? BAR_COLOR : "var(--muted)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
