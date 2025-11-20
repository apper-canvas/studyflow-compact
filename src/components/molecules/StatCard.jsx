import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = "primary",
  trend,
  className 
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600 text-primary-600",
    secondary: "from-secondary-500 to-secondary-600 text-secondary-600", 
    accent: "from-accent-500 to-accent-600 text-accent-600",
    success: "from-green-500 to-green-600 text-green-600",
    warning: "from-yellow-500 to-yellow-600 text-yellow-600",
    danger: "from-red-500 to-red-600 text-red-600"
  }

  return (
    <motion.div
      className={cn(
        "bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100",
        className
      )}
      whileHover={{ y: -2, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <div className="space-y-1">
            <h3 className={cn("text-3xl font-bold text-gradient", colorClasses[color].split(" ")[2])}>{value}</h3>
            {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                <ApperIcon 
                  name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
                  className={cn("w-4 h-4", trend.direction === "up" ? "text-green-500" : "text-red-500")}
                />
                <span className={cn("font-medium", trend.direction === "up" ? "text-green-600" : "text-red-600")}>
                  {trend.value}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={cn("p-3 rounded-xl bg-gradient-to-br", colorClasses[color].split(" text-")[0], "text-white")}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard