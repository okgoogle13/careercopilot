import * as React from "react";
// Using inline variant logic instead of class-variance-authority for simplicity
import { cn } from "./utils";

type CardVariant = "default" | "interactive" | "selected" | "loading" | "error";

export interface CardProps extends React.ComponentProps<"div"> {
  variant?: CardVariant;
}

const getCardVariantClasses = (variant: CardVariant = "default") => {
  const baseClasses =
    "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border transition-all duration-200";

  switch (variant) {
    case "interactive":
      return `${baseClasses} border-border hover:border-border/80 hover:shadow-lg hover:shadow-primary/10 cursor-pointer`;
    case "selected":
      return `${baseClasses} border-primary border-2 shadow-lg shadow-primary/20`;
    case "loading":
      return `${baseClasses} border-border`;
    case "error":
      return `${baseClasses} border-destructive/50 bg-destructive/5`;
    case "default":
    default:
      return `${baseClasses} border-border`;
  }
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(getCardVariantClasses(variant), className)}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "flex flex-col space-y-1.5 p-6 pb-0 [.border-t]:pt-6",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"h3">>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn("flex items-center gap-2 px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  ),
);
CardAction.displayName = "CardAction";

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-6 py-0 [.border-t]:pt-6", className)}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  type CardVariant,
  type CardProps
};
