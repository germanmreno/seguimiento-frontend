import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 shadow hover:bg-gray-900/80",
        secondary:
          "border-transparent bg-blue-100 text-blue-700 shadow hover:bg-blue-200/80",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600/80",
        outline: "border-transparent bg-gray-100 text-gray-800 shadow hover:bg-gray-200/80",
        pending:
          "border-transparent bg-yellow-100 text-yellow-800 shadow hover:bg-yellow-200/80",
        completed:
          "border-transparent bg-green-100 text-green-800 shadow hover:bg-green-200/80",
        normal:
          "border-transparent bg-blue-100 text-blue-800 shadow hover:bg-blue-200/80",
        medium:
          "border-transparent bg-orange-100 text-orange-800 shadow hover:bg-orange-200/80",
        urgency:
          "border-transparent bg-red-100 text-red-800 shadow hover:bg-red-200/80",
        officeBadge:
          "border-transparent bg-gray-100 text-gray-800 shadow hover:bg-gray-200/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
