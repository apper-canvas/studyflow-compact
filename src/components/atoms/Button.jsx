import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[0.97] active:scale-[0.95]"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:from-primary-700 hover:to-primary-800 hover:shadow-xl focus:ring-primary-500",
    secondary: "bg-gradient-to-r from-secondary-600 to-secondary-700 text-white shadow-lg hover:from-secondary-700 hover:to-secondary-800 hover:shadow-xl focus:ring-secondary-500",
    accent: "bg-gradient-to-r from-accent-600 to-accent-700 text-white shadow-lg hover:from-accent-700 hover:to-accent-800 hover:shadow-xl focus:ring-accent-500",
    outline: "border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 focus:ring-primary-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl focus:ring-red-500"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
    default: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-xl gap-2.5"
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button