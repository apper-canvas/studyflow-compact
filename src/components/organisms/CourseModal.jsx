import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"

const CourseModal = ({ isOpen, onClose, course, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    credits: 3,
    color: "#4f46e5",
    semester: "Fall 2024"
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const colorOptions = [
    { value: "#4f46e5", label: "Indigo", bg: "bg-indigo-600" },
    { value: "#06b6d4", label: "Cyan", bg: "bg-cyan-600" },
    { value: "#f59e0b", label: "Amber", bg: "bg-amber-600" },
    { value: "#10b981", label: "Emerald", bg: "bg-emerald-600" },
    { value: "#ef4444", label: "Red", bg: "bg-red-600" },
    { value: "#8b5cf6", label: "Violet", bg: "bg-violet-600" },
    { value: "#ec4899", label: "Pink", bg: "bg-pink-600" },
    { value: "#84cc16", label: "Lime", bg: "bg-lime-600" }
  ]

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || "",
        code: course.code || "",
        instructor: course.instructor || "",
        credits: course.credits || 3,
        color: course.color || "#4f46e5",
        semester: course.semester || "Fall 2024"
      })
    } else {
      setFormData({
        name: "",
        code: "",
        instructor: "",
        credits: 3,
        color: "#4f46e5",
        semester: "Fall 2024"
      })
    }
    setErrors({})
  }, [course, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validation
      const newErrors = {}
      if (!formData.name.trim()) newErrors.name = "Course name is required"
      if (!formData.code.trim()) newErrors.code = "Course code is required"
      if (!formData.instructor.trim()) newErrors.instructor = "Instructor name is required"
      if (formData.credits < 1 || formData.credits > 6) newErrors.credits = "Credits must be between 1 and 6"

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setLoading(false)
        return
      }

      const courseData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        instructor: formData.instructor.trim(),
        credits: parseInt(formData.credits),
        color: formData.color,
        semester: formData.semester
      }

      if (course) {
        await courseService.update(course.Id, courseData)
        toast.success("Course updated successfully!")
      } else {
        await courseService.create(courseData)
        toast.success("Course created successfully!")
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Error saving course:", error)
      toast.error("Failed to save course. Please try again.")
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
                  <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {course ? "Edit Course" : "Add Course"}
                  </h2>
                  <p className="text-sm text-gray-500">Manage your course details</p>
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
                label="Course Name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={errors.name}
                placeholder="e.g., Introduction to Computer Science"
              />

              <FormField
                label="Course Code"
                required
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                error={errors.code}
                placeholder="e.g., CS 101"
              />

              <FormField
                label="Instructor"
                required
                value={formData.instructor}
                onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                error={errors.instructor}
                placeholder="e.g., Dr. Sarah Johnson"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Credits"
                  type="number"
                  min="1"
                  max="6"
                  required
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
                  error={errors.credits}
                />

                <FormField
                  label="Semester"
                  type="select"
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                >
                  <Select
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                  >
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2025">Summer 2025</option>
                  </Select>
                </FormField>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 leading-none block">
                  Course Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={cn(
                        "relative w-full h-12 rounded-xl transition-all duration-200",
                        color.bg,
                        formData.color === color.value && "ring-2 ring-offset-2 ring-gray-400 scale-110"
                      )}
                    >
                      {formData.color === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ApperIcon name="Check" className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
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
                      {course ? "Update" : "Create"} Course
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

export default CourseModal