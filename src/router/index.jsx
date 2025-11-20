import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

// Lazy load page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const Courses = lazy(() => import("@/components/pages/Courses"))
const Assignments = lazy(() => import("@/components/pages/Assignments"))
const Calendar = lazy(() => import("@/components/pages/Calendar"))
const Students = lazy(() => import("@/components/pages/Students"))
const GPA = lazy(() => import("@/components/pages/GPA"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
)

const mainRoutes = [
  { 
    path: "", 
    index: true, 
    element: <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense> 
  },
  { 
    path: "courses", 
    element: <Suspense fallback={<LoadingSpinner />}><Courses /></Suspense> 
  },
  { 
    path: "assignments", 
    element: <Suspense fallback={<LoadingSpinner />}><Assignments /></Suspense> 
  },
  { 
    path: "calendar", 
    element: <Suspense fallback={<LoadingSpinner />}><Calendar /></Suspense> 
  },
  { 
path: "students", 
    element: <Suspense fallback={<LoadingSpinner />}><Students /></Suspense> 
  },
  {
    path: "gpa", 
    element: <Suspense fallback={<LoadingSpinner />}><GPA /></Suspense>
  },
  { 
    path: "*", 
    element: <Suspense fallback={<LoadingSpinner />}><NotFound /></Suspense> 
  }
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)