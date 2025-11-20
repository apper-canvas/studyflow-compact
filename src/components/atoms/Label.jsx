import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-semibold text-gray-900 leading-none mb-2 block",
      className
    )}
    {...props}
  />
))

Label.displayName = "Label"

export default Label