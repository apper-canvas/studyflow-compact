import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import AssignmentItem from "@/components/molecules/AssignmentItem"
import AssignmentModal from "@/components/organisms/AssignmentModal"
import QuickAddButton from "@/components/molecules/QuickAddButton"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    course: "all",
    sort: "dueDate"
  })

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
      console.error("Error loading assignments:", err)
      setError("Failed to load assignments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddAssignment = () => {
    setEditingAssignment(null)
    setShowModal(true)
  }

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment)
    setShowModal(true)
  }

  const handleDeleteAssignment = async (assignment) => {
    if (!window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      return
    }

    try {
      await assignmentService.delete(assignment.Id)
      toast.success("Assignment deleted successfully!")
      loadData()
    } catch (error) {
      console.error("Error deleting assignment:", error)
      toast.error("Failed to delete assignment")
    }
  }

  const handleToggleAssignment = async (assignment) => {
    try {
      await assignmentService.toggleStatus(assignment.Id)
      loadData()
      toast.success(
        assignment.status === "completed" 
          ? "Assignment marked as pending" 
          : "Assignment completed! Great work! 🎉"
      )
    } catch (error) {
      console.error("Error toggling assignment:", error)
      toast.error("Failed to update assignment")
    }
  }

  const handleModalSuccess = () => {
    loadData()
  }

  const getCourseById = (courseId) => courses.find(c => c.Id === courseId)

const filteredAndSortedAssignments = assignments
    .filter(assignment => {
      if (filters.status !== "all" && (assignment.status_c || assignment.status) !== filters.status) return false
      if (filters.priority !== "all" && (assignment.priority_c || assignment.priority) !== filters.priority) return false
      if (filters.course !== "all" && (assignment.courseId_c || assignment.courseId) !== parseInt(filters.course)) return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "dueDate":
          return new Date(a.dueDate_c || a.dueDate) - new Date(b.dueDate_c || b.dueDate)
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority_c || a.priority] - priorityOrder[b.priority_c || b.priority]
        case "course":
          const courseA = getCourseById(a.courseId_c || a.courseId)?.Name || getCourseById(a.courseId_c || a.courseId)?.name || ""
          const courseB = getCourseById(b.courseId_c || b.courseId)?.Name || getCourseById(b.courseId_c || b.courseId)?.name || ""
          return courseA.localeCompare(courseB)
        case "title":
          return (a.title_c || a.title).localeCompare(b.title_c || b.title)
        default:
          return 0
      }
    })

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  if (courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="BookOpen"
          title="Add courses first"
          message="You need to add at least one course before you can create assignments."
          actionText="Add Your First Course"
          onAction={() => window.location.href = "/courses"}
        />
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="FileText"
          title="No assignments yet"
          message="Start by adding assignments to track your academic tasks and deadlines effectively."
          actionText="Add Your First Assignment"
          onAction={handleAddAssignment}
        />
        <AssignmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          assignment={editingAssignment}
          courses={courses}
          onSuccess={handleModalSuccess}
        />
      </div>
    )
  }

const totalAssignments = assignments.length
  const completedAssignments = assignments.filter(a => (a.status_c || a.status) === "completed").length
  const pendingAssignments = assignments.filter(a => (a.status_c || a.status) === "pending").length
  const overdueCount = assignments.filter(a => 
    (a.status_c || a.status) === "pending" && isPast(new Date(a.dueDate_c || a.dueDate))
  ).length

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
          Assignments
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Track your assignments, manage deadlines, and stay organized with your academic tasks
        </motion.p>
      </div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto">
            <ApperIcon name="FileText" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary-600">{totalAssignments}</h3>
            <p className="text-sm text-gray-600 font-medium">Total</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto">
            <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600">{completedAssignments}</h3>
            <p className="text-sm text-gray-600 font-medium">Completed</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto">
            <ApperIcon name="Clock" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-600">{pendingAssignments}</h3>
            <p className="text-sm text-gray-600 font-medium">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-600">{overdueCount}</h3>
            <p className="text-sm text-gray-600 font-medium">Overdue</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <ApperIcon name="Filter" className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700">Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <div>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Select>
            </div>

            <div>
              <Select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="text-sm"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </Select>
            </div>

            <div>
              <Select
                value={filters.course}
                onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                className="text-sm"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.Id} value={course.Id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="text-sm"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="course">Sort by Course</option>
                <option value="title">Sort by Title</option>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Bar */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-gray-900">Assignment List</h2>
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            {filteredAndSortedAssignments.length} {filteredAndSortedAssignments.length === 1 ? "assignment" : "assignments"}
          </Badge>
        </div>
        <Button onClick={handleAddAssignment}>
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Assignment
        </Button>
      </motion.div>

      {/* Assignments List */}
      {filteredAndSortedAssignments.length === 0 ? (
        <Empty
          icon="Search"
          title="No assignments match your filters"
          message="Try adjusting your filter criteria to see more assignments."
          actionText="Clear Filters"
          onAction={() => setFilters({ status: "all", priority: "all", course: "all", sort: "dueDate" })}
        />
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {filteredAndSortedAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
<AssignmentItem
                assignment={assignment}
                course={getCourseById(assignment.courseId_c || assignment.courseId)}
                onToggle={handleToggleAssignment}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Add Button */}
      <QuickAddButton onClick={handleAddAssignment} />

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        assignment={editingAssignment}
        courses={courses}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}

export default Assignments