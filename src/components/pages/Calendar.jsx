import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("month")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ])
      setAssignments(assignmentsData)
      setCourses(coursesData)
    } catch (err) {
      console.error("Error loading calendar data:", err)
      setError("Failed to load calendar data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getCourseById = (courseId) => courses.find(c => c.Id === courseId)

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    )
  }

  const getSelectedDateAssignments = () => getAssignmentsForDate(selectedDate)

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = []
    let day = startDate

    while (day <= endDate) {
      const currentDay = day
      const dayAssignments = getAssignmentsForDate(currentDay)
      const isCurrentMonth = isSameMonth(currentDay, monthStart)
      const isCurrentDay = isToday(currentDay)
      const isSelected = isSameDay(currentDay, selectedDate)

      days.push(
        <motion.button
          key={currentDay.toISOString()}
          onClick={() => setSelectedDate(currentDay)}
          className={cn(
            "relative w-full aspect-square flex flex-col items-center justify-center text-sm font-medium rounded-lg border transition-all duration-200",
            isCurrentMonth ? "text-gray-900" : "text-gray-300",
            isCurrentDay && "bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-transparent shadow-lg",
            isSelected && !isCurrentDay && "bg-primary-50 border-primary-200 text-primary-700",
            !isSelected && !isCurrentDay && isCurrentMonth && "hover:bg-gray-50 border-gray-200",
            !isCurrentMonth && "border-transparent"
          )}
          whileHover={{ scale: isCurrentMonth ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{format(currentDay, "d")}</span>
          {dayAssignments.length > 0 && (
            <div className="absolute bottom-1 flex gap-0.5">
              {dayAssignments.slice(0, 3).map((assignment, index) => {
                const course = getCourseById(assignment.courseId)
                return (
                  <div
                    key={assignment.Id}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: course?.color || "#4f46e5" }}
                  />
                )
              })}
              {dayAssignments.length > 3 && (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              )}
            </div>
          )}
        </motion.button>
      )
      day = addDays(day, 1)
    }

    return days
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50"
      case "medium": return "border-l-yellow-500 bg-yellow-50"
      case "low": return "border-l-green-500 bg-green-50"
      default: return "border-l-gray-500 bg-gray-50"
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  if (courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="Calendar"
          title="Add courses first"
          message="You need to add courses and assignments to see them on your calendar."
          actionText="Add Your First Course"
          onAction={() => window.location.href = "/courses"}
        />
      </div>
    )
  }

  const selectedDateAssignments = getSelectedDateAssignments()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gradient"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Academic Calendar
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          View your assignment deadlines and class schedules in an organized calendar format
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ApperIcon name="ChevronRight" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
              </div>
            </div>

            {/* Legend */}
            <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Low Priority</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          {/* Date Info */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="Calendar" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {format(selectedDate, "EEEE")}
                </h3>
                <p className="text-lg text-gray-600 font-medium">
                  {format(selectedDate, "MMMM d, yyyy")}
                </p>
                {isToday(selectedDate) && (
                  <Badge className="mt-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 border-primary-200">
                    Today
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Assignments for Selected Date */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Assignments Due</h3>
                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                  {selectedDateAssignments.length}
                </Badge>
              </div>

              {selectedDateAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Calendar" className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No assignments due on this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateAssignments.map((assignment) => {
                    const course = getCourseById(assignment.courseId)
                    return (
                      <div
                        key={assignment.Id}
                        className={cn(
                          "p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md",
                          getPriorityColor(assignment.priority),
                          assignment.status === "completed" && "opacity-75"
                        )}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn(
                              "font-semibold text-gray-900 leading-tight",
                              assignment.status === "completed" && "line-through text-gray-500"
                            )}>
                              {assignment.title}
                            </h4>
                            {assignment.status === "completed" && (
                              <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 flex-wrap">
                            {course && (
                              <Badge 
                                className="text-xs font-medium"
                                style={{
                                  backgroundColor: `${course.color}15`,
                                  color: course.color,
                                  border: `1px solid ${course.color}30`
                                }}
                              >
                                {course.code}
                              </Badge>
                            )}
                            <Badge variant={assignment.priority} className="text-xs">
                              <ApperIcon 
                                name={assignment.priority === "high" ? "AlertCircle" : assignment.priority === "medium" ? "Clock" : "Minus"} 
                                className="w-3 h-3 mr-1" 
                              />
                              {assignment.priority}
                            </Badge>
                            <div className="text-xs text-gray-500 font-medium">
                              {format(new Date(assignment.dueDate), "h:mm a")}
                            </div>
                          </div>
                          
                          {assignment.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Calendar