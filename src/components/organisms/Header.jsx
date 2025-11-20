import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Header = () => {
  const location = useLocation()
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/courses", label: "Courses", icon: "BookOpen" },
    { path: "/assignments", label: "Assignments", icon: "FileText" },
    { path: "/calendar", label: "Calendar", icon: "Calendar" },
    { path: "/gpa", label: "GPA", icon: "Calculator" }
  ]

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname)
    return current?.label || "StudyFlow"
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">StudyFlow</h1>
              <p className="text-xs text-gray-500 font-medium -mt-0.5">Academic Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                    isActive
                      ? "text-primary-700 bg-gradient-to-r from-primary-50 to-secondary-50"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon name={item.icon} className="w-4 h-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="px-3 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
              <h2 className="text-sm font-bold text-primary-700">{getPageTitle()}</h2>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <nav className="flex items-center justify-around py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "relative flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "text-primary-700 bg-gradient-to-r from-primary-50 to-secondary-50"
                      : "text-gray-500 hover:text-primary-600"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span className="text-xs font-semibold">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"
                        layoutId="activeMobileTab"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header