import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  id: string;
  children: ReactNode;
}

function FieldShell({ label, hint, error, required, className, id, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-text">
          {label}
          {required && <span className="ml-0.5 text-accent">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const control =
  "h-12 w-full rounded-xl border-[1.5px] border-border bg-surface px-4 text-[15px] text-text placeholder:text-muted/80 transition-colors focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:bg-surface-2 disabled:text-muted";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: ReactNode;
  rightSlot?: ReactNode;
  wrapperClassName?: string;
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, iconLeft, rightSlot, wrapperClassName, className, id: idProp, required, ...props },
  ref,
) {
  const generated = useId();
  const id = idProp ?? generated;

  return (
    <FieldShell label={label} hint={hint} error={error} required={required} id={id} className={wrapperClassName}>
      <div className="relative">
        {iconLeft && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            control,
            iconLeft && "pl-11",
            rightSlot && "pr-28",
            error && "border-danger focus:border-danger focus:ring-red-100",
            className,
          )}
          {...props}
        />
        {rightSlot && <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{rightSlot}</span>}
      </div>
    </FieldShell>
  );
});

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
  id?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, wrapperClassName, className, id: idProp, required, ...props },
  ref,
) {
  const generated = useId();
  const id = idProp ?? generated;

  return (
    <FieldShell label={label} hint={hint} error={error} required={required} id={id} className={wrapperClassName}>
      <textarea
        ref={ref}
        id={id}
        required={required}
        aria-invalid={!!error}
        className={cn(control, "h-auto min-h-28 resize-y py-3", error && "border-danger", className)}
        {...props}
      />
    </FieldShell>
  );
});

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
  id?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, wrapperClassName, className, id: idProp, required, children, ...props },
  ref,
) {
  const generated = useId();
  const id = idProp ?? generated;

  return (
    <FieldShell label={label} hint={hint} error={error} required={required} id={id} className={wrapperClassName}>
      <select
        ref={ref}
        id={id}
        required={required}
        className={cn(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23b9aea3%22 stroke-width=%222.2%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[position:right_1rem_center] bg-no-repeat pr-10", className)}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
});
