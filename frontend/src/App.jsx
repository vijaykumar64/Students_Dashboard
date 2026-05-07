/**
 * App.jsx — Root component with routing.
 *
 * Layout:
 *   ┌──────────┬──────────────────────────────┐
 *   │          │  Navbar (top)                │
 *   │ Sidebar  ├──────────────────────────────┤
 *   │  (left)  │  Page content (changes with  │
 *   │          │  URL via React Router)        │
 *   └──────────┴──────────────────────────────┘
 *
 * Routes:
 *   /              → Dashboard
 *   /students      → Students List
 *   /students/:id  → Student Details
 */

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import StudentsList from './pages/StudentsList'
import StudentDetails from './pages/StudentDetails'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <p className="text-8xl font-bold text-gray-200">404</p>
      <p className="text-xl font-semibold text-gray-600">Page not found</p>
      <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors">
        Go to Dashboard
      </a>
    </div>
  )
}

function App() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left sidebar — always visible */}
      <Sidebar />

      {/* Right side: Navbar + page content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* Main content area — scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentsList />} />
            <Route path="/students/:id" element={<StudentDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
