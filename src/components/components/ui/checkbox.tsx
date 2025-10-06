import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { FieldError, UseFormRegister } from "react-hook-form";

import { cn } from "../../../components/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string; // Label for the checkbox
  errorMessage?: string; // Custom error message
  fieldError?: FieldError; // React Hook Form field error object
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, errorMessage, fieldError, ...props }, ref) => {
  return (
    <div className="flex flex-col">
      <label className="flex items-center space-x-2">
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-current")}
          >
            <Check className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
      </label>
      {(fieldError?.message || errorMessage) && (
        <span className="mt-1 text-sm text-red-500">
          {fieldError?.message || errorMessage}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
