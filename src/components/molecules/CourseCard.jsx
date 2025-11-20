import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const CourseCard = ({ course, onEdit, onDelete, className }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600" 
    if (grade >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <motion.div
      className={cn(
        "bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden",
        className
      )}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Color stripe */}
      <div 
        className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
        style={{ backgroundColor: course.color }}
      />
      
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                className="font-bold text-xs px-2 py-1"
                style={{ 
                  backgroundColor: `${course.color}15`,
                  color: course.color,
                  border: `1px solid ${course.color}30`
                }}
              >
                {course.code}
              </Badge>
              <span className="text-sm text-gray-500 font-medium">{course.credits} credits</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{course.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{course.instructor}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(course)
              }}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(course)
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Grade */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Current Grade</span>
            <div className="flex items-center gap-2">
              <span className={cn("text-2xl font-bold", getGradeColor(course.currentGrade))}>
                {course.currentGrade.toFixed(1)}%
              </span>
              <div className="p-1.5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
                <ApperIcon name="TrendingUp" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          {/* Grade Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${course.currentGrade}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Semester Badge */}
        <div className="flex justify-between items-center">
          <Badge variant="default" className="font-medium">
            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
            {course.semester}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}

export default CourseCard