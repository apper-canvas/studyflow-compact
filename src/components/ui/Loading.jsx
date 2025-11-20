import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ className }) => {
  return (
    <div className={cn("min-h-[400px] flex items-center justify-center", className)}>
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary-500 rounded-full animate-spin mx-auto" style={{ animationDelay: "0.15s", animationDuration: "1.2s" }}></div>
        </div>
        <div className="space-y-3">
          <div className="flex space-x-3 justify-center">
            <div className="w-4 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-4 h-4 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your study data...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading