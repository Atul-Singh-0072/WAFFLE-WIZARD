import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
  onJump?: (index: number) => void;
}

export function Stepper({ steps, current, onJump }: StepperProps) {
  return (
    <ol className="flex items-center gap-2" aria-label="Checkout progress">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 last:flex-none">
            <button
              type="button"
              onClick={() => done && onJump?.(index)}
              disabled={!done}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full pr-3 text-left text-xs font-bold transition-colors disabled:cursor-default",
                done && "text-primary-800 hover:bg-primary-50",
                active && "text-text",
                !done && !active && "text-muted",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] tabular",
                  done && "border-primary bg-primary text-white",
                  active && "border-primary bg-surface text-primary-800 ring-4 ring-primary-100",
                  !done && !active && "border-border bg-surface",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              <span className="max-sm:sr-only">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <span className={cn("h-0.5 min-w-4 flex-1 rounded-full", done ? "bg-primary" : "bg-border")} aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
