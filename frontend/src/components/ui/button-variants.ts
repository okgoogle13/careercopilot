import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-[1.02] active:scale-[0.98] transform-gpu",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80 shadow-sm dark:shadow-primary/20',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/80 dark:hover:bg-destructive/70 shadow-sm dark:shadow-destructive/20',
        outline:
          'border bg-background text-foreground hover:bg-accent/50 hover:text-accent-foreground dark:bg-input/30 dark:border-input/50 dark:hover:bg-input/50 dark:hover:border-input/70 transition-colors duration-200 shadow-sm dark:shadow-foreground/5',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/80 dark:hover:bg-secondary/60 shadow-sm dark:shadow-secondary/20',
        ghost:
          'hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/30 dark:hover:text-accent-foreground transition-colors duration-200',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80 dark:hover:text-primary/90 transition-colors duration-200',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
