import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Get started by adding your first item", 
  actionText = "Add Item",
  onAction,
  icon = "PlusCircle",
  className 
}) => {
  return (
    <div className={cn("min-h-[400px] flex items-center justify-center p-8", className)}>
      <div className="text-center max-w-md space-y-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-gray-300">
            <ApperIcon name={icon} className="w-12 h-12 text-gray-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="Sparkles" className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            {actionText}
          </button>
        )}
        
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 pt-4">
          <div className="flex items-center gap-1">
            <ApperIcon name="Zap" className="w-4 h-4" />
            <span>Quick & Easy</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Target" className="w-4 h-4" />
            <span>Stay Organized</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Empty