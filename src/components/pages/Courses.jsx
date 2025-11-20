import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import CourseCard from "@/components/molecules/CourseCard"
import CourseModal from "@/components/organisms/CourseModal"
import QuickAddButton from "@/components/molecules/QuickAddButton"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await courseService.getAll()
      setCourses(data)
    } catch (err) {
      console.error("Error loading courses:", err)
      setError("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleAddCourse = () => {
    setEditingCourse(null)
    setShowModal(true)
  }

  const handleEditCourse = (course) => {
    setEditingCourse(course)
    setShowModal(true)
  }

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.name}"? This will also delete all associated assignments.`)) {
      return
    }

    try {
      // Delete associated assignments first
      const assignments = await assignmentService.getByCourseId(course.Id)
      await Promise.all(assignments.map(assignment => assignmentService.delete(assignment.Id)))
      
      // Delete the course
      await courseService.delete(course.Id)
      toast.success("Course deleted successfully!")
      loadCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course")
    }
  }

  const handleModalSuccess = () => {
    loadCourses()
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadCourses} />

  if (courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="BookOpen"
          title="No courses yet"
          message="Start by adding your courses to organize your academic schedule and track your progress."
          actionText="Add Your First Course"
          onAction={handleAddCourse}
        />
        <CourseModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          course={editingCourse}
          onSuccess={handleModalSuccess}
        />
      </div>
    )
  }

const totalCredits = courses.reduce((sum, course) => sum + (course.credits_c || course.credits || 0), 0)
  const averageGrade = courses.length > 0 
    ? courses.reduce((sum, course) => sum + (course.currentGrade_c || course.currentGrade || 0), 0) / courses.length 
    : 0

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
          My Courses
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Manage your academic courses, track progress, and stay organized with your class schedule
        </motion.p>
      </div>

      {/* Summary Stats */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-primary-600">{courses.length}</h3>
            <p className="text-sm text-gray-600 font-medium">{courses.length === 1 ? "Course" : "Courses"}</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto">
              <ApperIcon name="Award" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-600">{totalCredits}</h3>
            <p className="text-sm text-gray-600 font-medium">Total Credits</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-accent-600">{averageGrade.toFixed(1)}%</h3>
            <p className="text-sm text-gray-600 font-medium">Average Grade</p>
          </div>
        </div>
      </motion.div>

      {/* Action Bar */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Course List</h2>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg">
            {courses.length}
          </span>
        </div>
        <Button onClick={handleAddCourse}>
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Course
        </Button>
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {courses.map((course, index) => (
          <motion.div
            key={course.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <CourseCard
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Add Button */}
      <QuickAddButton onClick={handleAddCourse} />

      {/* Course Modal */}
      <CourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        course={editingCourse}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}

export default Courses