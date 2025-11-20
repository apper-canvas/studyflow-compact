import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <div className={cn("min-h-[400px] flex items-center justify-center p-8", className)}>
      <div className="text-center max-w-md space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertCircle" className="w-10 h-10 text-red-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <ApperIcon name="X" className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">Oops! Something went wrong</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </button>
        )}
        
        <p className="text-sm text-gray-500">
          If the problem persists, try refreshing the page or check your internet connection.
        </p>
      </div>
    </div>
  )
}

export default ErrorView