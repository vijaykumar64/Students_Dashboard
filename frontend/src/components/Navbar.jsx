/**
 * Navbar — top bar showing page title and app branding.
 * Changes title based on current route.
 */

import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Dashboard',
  '/students': 'All Students',
}

export default function Navbar() {
  const location = useLocation()

  // Get page title — fallback for detail pages
  const title = pageTitles[location.pathname] || 'Student Details'

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-xs text-gray-500 mt-0.5">Student Management System</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>API Connected</span>
        </div>

        {/* Avatar placeholder */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          A
        </div>
      </div>
    </header>
  )
}
