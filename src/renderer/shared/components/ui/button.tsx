import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap base2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-1 text-n-1 shadow hover:bg-primary-1/90 border-2 border-primary-1 hover:border-transparent",
        destructive:
          "bg-accent-1 text-n-1 shadow-sm hover:bg-accent-1/90 border-2 border-accent-1 hover:border-transparent",
        outline:
          "border-2 border-n-3 bg-transparent text-n-7 hover:bg-n-3 dark:border-n-5 dark:text-n-1 dark:hover:bg-n-5",
        secondary:
          "bg-n-3 text-n-7 shadow-sm hover:bg-n-3/80 dark:bg-n-6 dark:text-n-1 dark:hover:bg-n-5",
        ghost: "hover:bg-n-3 hover:text-n-7 dark:hover:bg-n-6 dark:hover:text-n-1",
        link: "text-primary-1 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 rounded-xl",
        sm: "h-9 px-4 rounded-md border",
        lg: "h-13 px-5.5 rounded-xl",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "size"> {
  asChild?: boolean
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | null
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
