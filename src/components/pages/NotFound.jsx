import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated 404 */}
          <div className="relative">
            <motion.h1
              className="text-9xl md:text-[12rem] font-black text-gradient opacity-20 leading-none"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              404
            </motion.h1>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Search" className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Error Message */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 font-medium max-w-lg mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off from your study schedule. 
              Let's get you back to managing your academic success!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full sm:w-auto"
            >
              <ApperIcon name="Home" className="w-5 h-5" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              Go Back
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <p className="text-sm text-gray-500 font-medium mb-4">
              Or explore these sections of StudyFlow:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <button
                onClick={() => navigate("/courses")}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <ApperIcon name="BookOpen" className="w-4 h-4" />
                My Courses
              </button>
              <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
              <button
                onClick={() => navigate("/assignments")}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <ApperIcon name="FileText" className="w-4 h-4" />
                Assignments
              </button>
              <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
              <button
                onClick={() => navigate("/calendar")}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <ApperIcon name="Calendar" className="w-4 h-4" />
                Calendar
              </button>
              <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
              <button
                onClick={() => navigate("/gpa")}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <ApperIcon name="Calculator" className="w-4 h-4" />
                GPA Calculator
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full opacity-50"
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-accent-100 to-primary-100 rounded-full opacity-50"
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}

export default NotFound