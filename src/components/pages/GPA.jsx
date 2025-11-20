import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { courseService } from "@/services/api/courseService"
import { gradeService } from "@/services/api/gradeService"

const GPA = () => {
  const [courses, setCourses] = useState([])
  const [gradeEntries, setGradeEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [calculating, setCalculating] = useState(false)
  const [currentGPA, setCurrentGPA] = useState(0.0)
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [coursesData, gradesData] = await Promise.all([
        courseService.getAll(),
        gradeService.getAll()
      ])
      setCourses(coursesData)
      setGradeEntries(gradesData)
    } catch (err) {
      console.error("Error loading GPA data:", err)
      setError("Failed to load GPA data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    calculateGPA()
  }, [gradeEntries, selectedSemester])

const [newGradeEntry, setNewGradeEntry] = useState({
    courseId_c: "",
    grade_c: "",
    credits_c: 3
  })

  const gradeOptions = [
    { letter: "A+", points: 4.0 },
    { letter: "A", points: 4.0 },
    { letter: "A-", points: 3.7 },
    { letter: "B+", points: 3.3 },
    { letter: "B", points: 3.0 },
    { letter: "B-", points: 2.7 },
    { letter: "C+", points: 2.3 },
    { letter: "C", points: 2.0 },
    { letter: "C-", points: 1.7 },
    { letter: "D+", points: 1.3 },
    { letter: "D", points: 1.0 },
    { letter: "D-", points: 0.7 },
    { letter: "F", points: 0.0 }
  ]

  const semesterOptions = ["Fall 2024", "Spring 2025", "Summer 2025"]

  const calculateGPA = async () => {
    if (gradeEntries.length === 0) {
      setCurrentGPA(0.0)
      return
    }

    try {
      setCalculating(true)
const semesterGrades = gradeEntries.filter(entry => {
        const course = courses.find(c => c.Id === (entry.courseId_c || entry.courseId))
        return (course?.semester_c || course?.semester) === selectedSemester
      })
      
      const gpa = await gradeService.calculateGPA(semesterGrades)
      setCurrentGPA(gpa)
    } catch (error) {
      console.error("Error calculating GPA:", error)
      setCurrentGPA(0.0)
    } finally {
      setCalculating(false)
    }
  }

const handleAddGrade = async (e) => {
    e.preventDefault()
    
    if (!newGradeEntry.courseId_c || !newGradeEntry.grade_c) {
      toast.error("Please select both course and grade")
      return
    }

    try {
      const gradeData = {
        courseId_c: parseInt(newGradeEntry.courseId_c),
        grade_c: newGradeEntry.grade_c,
        credits_c: parseInt(newGradeEntry.credits_c),
        gradePoint_c: gradeService.letterToGPA(newGradeEntry.grade_c)
      }

      const result = await gradeService.create(gradeData)
      if (result) {
        setGradeEntries(prev => [...prev, result])
        
        setNewGradeEntry({
          courseId_c: "",
          grade_c: "",
          credits_c: 3
        })
        
        toast.success("Grade added successfully!")
      }
    } catch (error) {
      console.error("Error adding grade:", error)
      toast.error("Failed to add grade")
    }
  }

  const getGradeColor = (gradePoint) => {
    if (gradePoint >= 3.7) return "text-green-600 bg-green-50 border-green-200"
    if (gradePoint >= 3.0) return "text-blue-600 bg-blue-50 border-blue-200"
    if (gradePoint >= 2.0) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getGPAStatus = (gpa) => {
    if (gpa >= 3.7) return { label: "Excellent", color: "success", icon: "Award" }
    if (gpa >= 3.0) return { label: "Good", color: "primary", icon: "Star" }
    if (gpa >= 2.0) return { label: "Satisfactory", color: "warning", icon: "Target" }
    return { label: "Needs Improvement", color: "danger", icon: "AlertTriangle" }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  if (courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="Calculator"
          title="Add courses first"
          message="You need to add courses before you can calculate your GPA."
          actionText="Add Your First Course"
          onAction={() => window.location.href = "/courses"}
        />
      </div>
    )
  }

const semesterGrades = gradeEntries.filter(entry => {
    const course = courses.find(c => c.Id === (entry.courseId_c || entry.courseId))
    return (course?.semester_c || course?.semester) === selectedSemester
  })

  const totalCredits = semesterGrades.reduce((sum, entry) => sum + entry.credits, 0)
  const gpaStatus = getGPAStatus(currentGPA)

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
          GPA Calculator
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Track your academic performance and calculate your grade point average across semesters
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GPA Display */}
        <div className="lg:col-span-1">
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Calculator" className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Current GPA</h2>
              <div className="relative">
                {calculating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg font-medium text-gray-600">Calculating...</span>
                  </div>
                ) : (
                  <h3 className="text-5xl font-bold text-gradient">{currentGPA.toFixed(2)}</h3>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium">Out of 4.00</p>
              
              <Badge variant={gpaStatus.color} className="inline-flex items-center gap-1">
                <ApperIcon name={gpaStatus.icon} className="w-3 h-3" />
                {gpaStatus.label}
              </Badge>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Semester:</span>
                <span className="text-gray-900 font-semibold">{selectedSemester}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Total Credits:</span>
                <span className="text-gray-900 font-semibold">{totalCredits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Courses:</span>
                <span className="text-gray-900 font-semibold">{semesterGrades.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Semester Selector */}
          <motion.div
            className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FormField
              label="Select Semester"
              type="select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <Select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                {semesterOptions.map(semester => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </Select>
            </FormField>
          </motion.div>
        </div>

        {/* Grade Entry Form & Current Grades */}
        <div className="lg:col-span-2 space-y-8">
          {/* Add Grade Form */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Plus" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Grade</h2>
                <p className="text-sm text-gray-500">Enter grades for your courses to calculate GPA</p>
              </div>
            </div>

            <form onSubmit={handleAddGrade} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Course"
                  required
                >
                  <Select
                    value={newGradeEntry.courseId}
                    onChange={(e) => setNewGradeEntry(prev => ({ ...prev, courseId: e.target.value }))}
                  >
                    <option value="">Select a course</option>
                    {courses
.filter(course => (course.semester_c || course.semester) === selectedSemester)
                      .map(course => (
                      <option key={course.Id} value={course.Id}>
                        {course.code_c || course.code} - {course.Name || course.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField
                  label="Grade"
                  required
                >
                  <Select
                    value={newGradeEntry.grade}
                    onChange={(e) => setNewGradeEntry(prev => ({ ...prev, grade: e.target.value }))}
                  >
                    <option value="">Select grade</option>
                    {gradeOptions.map(grade => (
                      <option key={grade.letter} value={grade.letter}>
                        {grade.letter} ({grade.points.toFixed(1)})
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField
                  label="Credits"
                  type="number"
                  min="1"
                  max="6"
                  required
                  value={newGradeEntry.credits}
                  onChange={(e) => setNewGradeEntry(prev => ({ ...prev, credits: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full md:w-auto">
                <ApperIcon name="Plus" className="w-4 h-4" />
                Add Grade
              </Button>
            </form>
          </motion.div>

          {/* Current Grades */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Current Grades</h2>
                  <p className="text-sm text-gray-500">{selectedSemester}</p>
                </div>
              </div>
              <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                {semesterGrades.length} {semesterGrades.length === 1 ? "course" : "courses"}
              </Badge>
            </div>

            {semesterGrades.length === 0 ? (
              <Empty
                icon="GraduationCap"
                title="No grades yet"
                message="Add grades for your courses to see them here and calculate your GPA."
                actionText="Add Your First Grade"
                onAction={() => {
                  // Focus on the course select
                  const courseSelect = document.querySelector('select[value="' + newGradeEntry.courseId + '"]')
                  courseSelect?.focus()
                }}
              />
            ) : (
              <div className="space-y-3">
{semesterGrades.map((entry, index) => {
                  const course = courses.find(c => c.Id === (entry.courseId_c || entry.courseId))
                  return (
                    <motion.div
                      key={index}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-200",
                        getGradeColor(entry.gradePoint_c || entry.gradePoint)
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: course?.color || "#4f46e5" }}
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {course?.code} - {course?.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {entry.credits} {entry.credits === 1 ? "credit" : "credits"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{entry.grade}</div>
                          <div className="text-sm font-medium">{entry.gradePoint.toFixed(1)} GPA</div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default GPA