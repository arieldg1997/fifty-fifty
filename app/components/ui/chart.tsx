import * as React from "react";
import { BarChart as BarChartIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: Record<string, { label: string; color: string }>;
  }
>(({ className, config, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props}>
    {config && (
      <div className="flex items-center space-x-2">
        {Object.entries(config).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center space-x-1 text-sm">
            <div className={cn("h-3 w-3 rounded-full", color)} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    )}
    {props.children}
  </div>
));
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border bg-background px-3 py-1.5 text-sm shadow-sm",
      className
    )}
    {...props}
  />
));
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    indicator?: "dashed" | "solid";
  }
>(({ className, indicator = "solid", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center space-x-2",
      indicator === "dashed" && "border-dashed border-b pb-2",
      className
    )}
    {...props}
  />
));
ChartTooltipContent.displayName = "ChartTooltipContent";

export { ChartContainer, ChartTooltip, ChartTooltipContent };
