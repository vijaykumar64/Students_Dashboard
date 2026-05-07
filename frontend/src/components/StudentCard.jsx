/**
 * StudentCard — card view for a single student.
 * Used in grid layouts on the Students List page.
 * Clicking the card navigates to Student Details.
 */

import { useNavigate } from 'react-router-dom'
import { getDeptColor } from './DepartmentFilter'

// GPA color: green = high, yellow = medium, red = low
function getGpaColor(gpa) {
  if (gpa >= 9.0) return 'text-green-600'
  if (gpa >= 8.0) return 'text-blue-600'
  if (gpa >= 7.5) return 'text-yellow-600'
  return 'text-red-500'
}

// Gender icon
function GenderIcon({ gender }) {
  return gender === 'Female'
    ? <span className="text-pink-500">♀</span>
    : <span className="text-blue-500">♂</span>
}

export default function StudentCard({ student }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/students/${student.student_id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5
                 cursor-pointer hover:shadow-md hover:-translate-y-1
                 transition-all duration-200 animate-fade-in"
    >
      {/* Top: Avatar + Basic Info */}
      <div className="flex items-start gap-4">
        {/* Avatar with initials */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600
                        flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {student.name.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-800 truncate">{student.name}</h3>
          <p className="text-xs text-gray-500">{student.student_id}</p>

          {/* Department badge */}
          <span className={`dept-badge mt-1 ${getDeptColor(student.department)}`}>
            {student.department}
          </span>
        </div>

        {/* GPA badge */}
        <div className="text-right">
          <span className={`text-xl font-bold ${getGpaColor(student.gpa)}`}>
            {student.gpa.toFixed(1)}
          </span>
          <p className="text-xs text-gray-400">GPA</p>
        </div>
      </div>

      {/* Bottom: Stats */}
      <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-400">Age</p>
          <p className="font-semibold text-gray-700 text-sm">{student.age}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Sem</p>
          <p className="font-semibold text-gray-700 text-sm">{student.semester}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Gender</p>
          <p className="font-semibold text-gray-700 text-sm">
            <GenderIcon gender={student.gender} />
          </p>
        </div>
      </div>
    </div>
  )
}
