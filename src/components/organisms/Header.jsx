import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useSelector(state => state.user)
  const { logout } = useAuth()

  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/courses", label: "Courses", icon: "BookOpen" },
    { path: "/assignments", label: "Assignments", icon: "FileText" },
    { path: "/calendar", label: "Calendar", icon: "Calendar" },
    { path: "/students", label: "Students", icon: "Users" },
    { path: "/gpa", label: "GPA", icon: "Calculator" }
  ]

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  StudyFlow
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-gray-50/50 rounded-2xl p-1">
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
            </div>
            
            {/* User Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="User" className="w-4 h-4" />
                    <span className="hidden lg:inline">
                      {user?.firstName || user?.name || 'User'}
                    </span>
                  </div>
                  <Button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200/50 z-50">
          <div className="max-w-lg mx-auto px-4">
            <div className="h-20 flex items-center">
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
        </div>
      </div>
    </header>
  )
}

export default Header