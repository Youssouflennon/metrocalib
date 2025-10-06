import * as React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { cn } from "../../../components/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode; // Icône à gauche
  rightIcon?: React.ReactNode; // Icône à droite
  isLoading?: boolean; // État de chargement
  hasError?: boolean; // Indicateur d'erreur manuelle
  errorMessage?: string; // Message d'erreur personnalisé
  fieldError?: FieldError; // Objet d'erreur pour le champ
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      leftIcon,
      rightIcon,
      isLoading,
      hasError,
      errorMessage,

      fieldError,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex flex-col">
        <div
          className={cn("relative flex items-center", {
            "border-red-500": hasError || fieldError,
          })}>
          {leftIcon && (
            <span className="absolute left-3 text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              (hasError || fieldError) &&
                "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {isLoading && (
            <span className="absolute right-3">
              <svg
                className="h-5 w-5 animate-spin text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
          {rightIcon && !isLoading && (
            <span className="absolute right-3 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>
        {(fieldError?.message || errorMessage) && (
          <span className="mt-1 text-sm text-red-500">
            {fieldError?.message || errorMessage}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
