import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../../../components/lib/utils";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string; // Ajoute une étiquette au Switch
  errorMessage?: string; // Message d'erreur
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, label, errorMessage, ...props }, ref) => (
  <div className="flex flex-col space-y-1">
    {label && (
      <label
        htmlFor={props.id}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </label>
    )}
    <SwitchPrimitives.Root
      className={cn(
        "relative inline-flex h-6 w-11 rounded-full bg-gray-200 transition-colors data-[state=checked]:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
    {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
  </div>
));
Switch.displayName = "Switch";

export { Switch };
