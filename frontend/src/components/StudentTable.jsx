/**
 * StudentTable — tabular view of students.
 * Clicking a row navigates to that student's detail page.
 * Clicking a column header sorts by that column.
 */

import { useNavigate } from 'react-router-dom'
import { getDeptColor } from './DepartmentFilter'

function GpaBar({ gpa }) {
  // Visual GPA bar (max 10)
  const pct = (gpa / 10) * 100
  const color = gpa >= 9 ? 'bg-green-500' : gpa >= 8 ? 'bg-blue-500' : gpa >= 7.5 ? 'bg-yellow-500' : 'bg-red-400'

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-800 w-8">{gpa.toFixed(1)}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  )
}

export default function StudentTable({ students, ordering, onOrderingChange }) {
  const navigate = useNavigate()

  const SortIcon = ({ field }) => {
    if (ordering === field) return <span className="text-blue-500">↑</span>
    if (ordering === `-${field}`) return <span className="text-blue-500">↓</span>
    return <span className="text-gray-300">↕</span>
  }

  const handleSort = (field) => {
    // Toggle: default → asc → desc → default
    if (ordering === field) onOrderingChange(`-${field}`)
    else if (ordering === `-${field}`) onOrderingChange('')
    else onOrderingChange(field)
  }

  const headers = [
    { label: 'ID', field: 'student_id' },
    { label: 'Name', field: 'name' },
    { label: 'Age', field: 'age' },
    { label: 'Gender', field: null },
    { label: 'Department', field: null },
    { label: 'Semester', field: 'semester' },
    { label: 'GPA', field: 'gpa' },
  ]

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {headers.map((h) => (
              <th
                key={h.label}
                onClick={() => h.field && handleSort(h.field)}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider
                            ${h.field ? 'cursor-pointer hover:text-gray-800 select-none' : ''}`}
              >
                {h.label} {h.field && <SortIcon field={h.field} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {students.map((student) => (
            <tr
              key={student.student_id}
              onClick={() => navigate(`/students/${student.student_id}`)}
              className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{student.student_id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600
                                  flex items-center justify-center text-white font-bold text-xs">
                    {student.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-800">{student.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{student.age}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full
                                  ${student.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                  {student.gender}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`dept-badge ${getDeptColor(student.department)}`}>
                  {student.department}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 text-center">{student.semester}</td>
              <td className="px-4 py-3 min-w-[120px]">
                <GpaBar gpa={student.gpa} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
