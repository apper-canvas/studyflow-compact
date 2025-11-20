import React from "react"
import { cn } from "@/utils/cn"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false,
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {children || (
        type === "select" ? (
          <Select {...props} />
        ) : (
          <Input type={type} {...props} />
        )
      )}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}

export default FormField