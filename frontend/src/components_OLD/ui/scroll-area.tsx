import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("relative overflow-hidden", className)}
            {...props}
        >
            <div className="h-full w-full rounded-[inherit] overflow-auto">
                {children}
            </div>
        </div>
    )
)
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("", className)} {...props} />
    )
)
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
