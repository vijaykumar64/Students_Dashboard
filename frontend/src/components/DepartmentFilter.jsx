/**
 * DepartmentFilter — dropdown to filter students by department.
 * Fetches department list from the API on mount.
 */

import { useState, useEffect } from 'react'
import api from '../api/axios'

// Color map for department badges
const deptColors = {
  CSE:   'bg-blue-100 text-blue-800',
  ECE:   'bg-purple-100 text-purple-800',
  IT:    'bg-green-100 text-green-800',
  EEE:   'bg-yellow-100 text-yellow-800',
  MECH:  'bg-orange-100 text-orange-800',
  CIVIL: 'bg-red-100 text-red-800',
}

export function getDeptColor(dept) {
  return deptColors[dept] || 'bg-gray-100 text-gray-800'
}

export default function DepartmentFilter({ value, onChange }) {
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    // Fetch unique departments from backend
    api.get('/students/departments/')
      .then(res => setDepartments(res.data))
      .catch(() => setDepartments(['CSE', 'ECE', 'IT', 'EEE', 'MECH', 'CIVIL']))
  }, [])

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl
                   bg-white text-gray-700 text-sm appearance-none cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200"
      >
        <option value="">All Departments</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      {/* Dropdown arrow icon */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
