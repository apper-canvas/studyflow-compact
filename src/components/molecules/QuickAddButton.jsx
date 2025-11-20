import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const QuickAddButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full shadow-2xl flex items-center justify-center"
      whileHover={{ 
        scale: 1.1,
        background: "linear-gradient(135deg, #4338ca, #0891b2)"
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <ApperIcon name="Plus" className="w-6 h-6" />
    </motion.button>
  )
}

export default QuickAddButton