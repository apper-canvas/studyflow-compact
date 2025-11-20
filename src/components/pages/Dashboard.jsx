import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Courses from "@/components/pages/Courses";
import Calendar from "@/components/pages/Calendar";
import Assignments from "@/components/pages/Assignments";
import GPA from "@/components/pages/GPA";
import Button from "@/components/atoms/Button";

const Dashboard = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ])
      setCourses(coursesData)
      setAssignments(assignmentsData)
    } catch (err) {
      console.error("Error loading dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  const upcomingAssignments = assignments
.filter(a => (a.status_c || a.status) === "pending")
    .sort((a, b) => new Date(a.dueDate_c || a.dueDate) - new Date(b.dueDate_c || b.dueDate))
    .slice(0, 5)

  const dueTodayCount = assignments.filter(a => 
    (a.status_c || a.status) === "pending" && isToday(new Date(a.dueDate_c || a.dueDate))
  ).length

  const dueTomorrowCount = assignments.filter(a => 
    (a.status_c || a.status) === "pending" && isTomorrow(new Date(a.dueDate_c || a.dueDate))
  ).length

  const overdueCount = assignments.filter(a => 
    (a.status_c || a.status) === "pending" && isPast(new Date(a.dueDate_c || a.dueDate))
  ).length

  const completionRate = assignments.length > 0 
    ? Math.round((assignments.filter(a => (a.status_c || a.status) === "completed").length / assignments.length) * 100)
    : 0

  const currentGPA = courses.length > 0
    ? (courses.reduce((sum, course) => sum + (course.currentGrade_c || course.currentGrade || 0), 0) / courses.length / 100 * 4).toFixed(2)
    : "0.00"

const getCourseById = (courseId) => courses.find(c => c.Id === (courseId || courseId_c))

  const handleToggleAssignment = async (assignment) => {
    try {
      await assignmentService.toggleStatus(assignment.Id)
      loadData() // Reload data to update stats
    } catch (error) {
      console.error("Error toggling assignment:", error)
    }
  }

  if (courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="GraduationCap"
          title="Welcome to StudyFlow!"
          message="Get started by adding your courses and assignments to stay organized with your studies."
          actionText="Add Your First Course"
          onAction={() => navigate("/courses")}
        />
      </div>
    )
  }

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
          Academic Dashboard
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Stay on top of your studies with a clear overview of assignments, deadlines, and academic progress
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Due Today"
          value={dueTodayCount}
          subtitle={dueTodayCount === 1 ? "assignment" : "assignments"}
          icon="Clock"
          color={dueTodayCount > 0 ? "warning" : "success"}
        />
        <StatCard
          title="Due Tomorrow"
          value={dueTomorrowCount}
          subtitle={dueTomorrowCount === 1 ? "assignment" : "assignments"}
          icon="Calendar"
          color="secondary"
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          subtitle={overdueCount === 1 ? "assignment" : "assignments"}
          icon="AlertTriangle"
          color={overdueCount > 0 ? "danger" : "success"}
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle="assignments completed"
          icon="CheckCircle"
          color="success"
        />
      </div>

      {/* Academic Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current GPA Card */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Award" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-600 uppercase tracking-wide">Current GPA</h3>
              <p className="text-4xl font-bold text-gradient mt-2">{currentGPA}</p>
              <p className="text-sm text-gray-500 font-medium mt-1">Out of 4.00</p>
            </div>
            <Button
              onClick={() => navigate("/gpa")}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <ApperIcon name="Calculator" className="w-4 h-4" />
              Calculate GPA
            </Button>
          </div>
        </motion.div>

        {/* Active Courses */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Active Courses</h3>
              <Button
                onClick={() => navigate("/courses")}
                variant="ghost"
                size="sm"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {courses.slice(0, 3).map((course) => (
                <div key={course.Id} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
style={{ backgroundColor: course.color_c || course.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{course.code_c || course.code}</p>
                    <p className="text-xs text-gray-500 truncate">{course.Name || course.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{(course.currentGrade_c || course.currentGrade || 0).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
              {courses.length > 3 && (
                <button 
                  onClick={() => navigate("/courses")}
                  className="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                >
                  View all {courses.length} courses
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/assignments")}
                variant="ghost"
                className="w-full justify-start"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                Add Assignment
              </Button>
              <Button
                onClick={() => navigate("/calendar")}
                variant="ghost"
                className="w-full justify-start"
              >
                <ApperIcon name="Calendar" className="w-4 h-4" />
                View Calendar
              </Button>
              <Button
                onClick={() => navigate("/gpa")}
                variant="ghost"
                className="w-full justify-start"
              >
                <ApperIcon name="Calculator" className="w-4 h-4" />
                Calculate GPA
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Assignments */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
              <p className="text-sm text-gray-500">Stay on track with your deadlines</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/assignments")}
            variant="outline"
            size="sm"
          >
            <ApperIcon name="ArrowRight" className="w-4 h-4" />
            View All
          </Button>
        </div>

        {upcomingAssignments.length === 0 ? (
          <Empty
            icon="CheckCircle"
            title="All caught up!"
            message="You don't have any upcoming assignments. Great work staying organized!"
            actionText="View All Assignments"
            onAction={() => navigate("/assignments")}
          />
        ) : (
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <AssignmentItem
key={assignment.Id}
                assignment={assignment}
                course={getCourseById(assignment.courseId_c || assignment.courseId)}
                onToggle={handleToggleAssignment}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Dashboard