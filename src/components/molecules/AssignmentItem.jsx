import React from "react"
import { motion } from "framer-motion"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const AssignmentItem = ({ assignment, course, onToggle, onEdit, onDelete, className }) => {
const dueDate = new Date(assignment.dueDate_c || assignment.dueDate)
  const isOverdue = isPast(dueDate) && (assignment.status_c || assignment.status) !== "completed"
  const isDueToday = isToday(dueDate)
  const isDueTomorrow = isTomorrow(dueDate)

  const formatDueDate = () => {
    if (isDueToday) return "Due Today"
    if (isDueTomorrow) return "Due Tomorrow"
    return format(dueDate, "MMM dd, h:mm a")
  }

  const getDueDateColor = () => {
    if (isOverdue) return "text-red-600"
    if (isDueToday) return "text-accent-600"
    if (isDueTomorrow) return "text-yellow-600"
    return "text-gray-600"
  }

  const getPriorityIcon = () => {
switch (assignment.priority_c || assignment.priority) {
      case "high": return "AlertCircle"
      case "medium": return "Clock"
      case "low": return "Minus"
      default: return "Minus"
    }
  }

  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100",
(assignment.status_c || assignment.status) === "completed" && "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
        isOverdue && (assignment.status_c || assignment.status) !== "completed" && "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
        className
      )}
      whileHover={{ y: -1 }}
      layout
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          onClick={() => onToggle?.(assignment)}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
(assignment.status_c || assignment.status) === "completed"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-500"
              : "border-gray-300 hover:border-primary-400 hover:bg-primary-50"
          )}
          whileTap={{ scale: 0.9 }}
        >
{(assignment.status_c || assignment.status) === "completed" && (
            <ApperIcon name="Check" className="w-4 h-4 text-white" />
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <h3 className={cn(
"font-semibold text-gray-900 leading-tight",
                (assignment.status_c || assignment.status) === "completed" && "line-through text-gray-500"
              )}>
                {assignment.title_c || assignment.title}
              </h3>
              
{(assignment.description_c || assignment.description) && (
                <p className="text-sm text-gray-600 line-clamp-2">{assignment.description_c || assignment.description}</p>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                {/* Course Badge */}
                {course && (
                  <Badge 
                    className="font-medium text-xs"
style={{
                      backgroundColor: `${course.color_c || course.color}15`,
                      color: course.color_c || course.color,
                      border: `1px solid ${course.color_c || course.color}30`
                    }}
                  >
                    {course.code_c || course.code}
                  </Badge>
                )}

                {/* Priority Badge */}
<Badge variant={assignment.priority_c || assignment.priority} className="flex items-center gap-1">
                  <ApperIcon name={getPriorityIcon()} className="w-3 h-3" />
                  <span className="capitalize">{assignment.priority_c || assignment.priority}</span>
                </Badge>

                {/* Due Date */}
                <div className={cn("flex items-center gap-1 text-xs font-medium", getDueDateColor())}>
                  <ApperIcon name="Clock" className="w-3 h-3" />
                  {formatDueDate()}
                </div>

                {/* Points */}
{(assignment.maxPoints_c || assignment.maxPoints) && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <ApperIcon name="Target" className="w-3 h-3" />
                    {assignment.maxPoints_c || assignment.maxPoints} pts
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(assignment)
                }}
                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(assignment)
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AssignmentItem