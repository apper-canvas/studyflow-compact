import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { assignmentService } from "@/services/api/assignmentService"

const AssignmentModal = ({ isOpen, onClose, assignment, courses, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    maxPoints: 100,
    weight: 0.1
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (assignment) {
      const dueDate = new Date(assignment.dueDate)
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        courseId: assignment.courseId || "",
        dueDate: dueDate.toISOString().split("T")[0],
        dueTime: dueDate.toTimeString().slice(0, 5),
        priority: assignment.priority || "medium",
        maxPoints: assignment.maxPoints || 100,
        weight: assignment.weight || 0.1
      })
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setFormData({
        title: "",
        description: "",
        courseId: courses?.[0]?.Id || "",
        dueDate: tomorrow.toISOString().split("T")[0],
        dueTime: "23:59",
        priority: "medium",
        maxPoints: 100,
        weight: 0.1
      })
    }
    setErrors({})
  }, [assignment, courses, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validation
      const newErrors = {}
      if (!formData.title.trim()) newErrors.title = "Title is required"
      if (!formData.courseId) newErrors.courseId = "Course is required"
      if (!formData.dueDate) newErrors.dueDate = "Due date is required"
      if (!formData.dueTime) newErrors.dueTime = "Due time is required"

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setLoading(false)
        return
      }

      // Combine date and time
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}:00`)

      const assignmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        courseId: parseInt(formData.courseId),
        dueDate: dueDateTime.toISOString(),
        priority: formData.priority,
        maxPoints: parseInt(formData.maxPoints),
        weight: parseFloat(formData.weight)
      }

      if (assignment) {
        await assignmentService.update(assignment.Id, assignmentData)
        toast.success("Assignment updated successfully!")
      } else {
        await assignmentService.create(assignmentData)
        toast.success("Assignment created successfully!")
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Error saving assignment:", error)
      toast.error("Failed to save assignment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <ApperIcon name="FileText" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {assignment ? "Edit Assignment" : "Add Assignment"}
                  </h2>
                  <p className="text-sm text-gray-500">Manage your assignment details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Assignment Title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                error={errors.title}
                placeholder="e.g., Programming Assignment 1"
              />

              <FormField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the assignment"
              >
                <textarea
                  className="flex min-h-[80px] w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the assignment"
                />
              </FormField>

              <FormField
                label="Course"
                type="select"
                required
                value={formData.courseId}
                onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                error={errors.courseId}
              >
                <Select
                  value={formData.courseId}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.Id} value={course.Id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Due Date"
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  error={errors.dueDate}
                />

                <FormField
                  label="Due Time"
                  type="time"
                  required
                  value={formData.dueTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                  error={errors.dueTime}
                />
              </div>

              <FormField
                label="Priority"
                type="select"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              >
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </Select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Max Points"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: e.target.value }))}
                />

                <FormField
                  label="Weight"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <ApperIcon name="Save" className="w-4 h-4" />
                      {assignment ? "Update" : "Create"} Assignment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AssignmentModal