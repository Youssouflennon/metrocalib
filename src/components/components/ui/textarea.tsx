import * as React from "react";
import { cn } from "../../../components/lib/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string; // Label pour le textarea
  register?: UseFormRegisterReturn; // Liaison avec react-hook-form
  errorMessage?: string; // Message d'erreur
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, register, errorMessage, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-muted-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
          {...register}
        />
        {errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
