/**
 * StudentDetails Page — full profile of a single student.
 *
 * Route: /students/:id
 * API:   GET /api/students/{student_id}/
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { getDeptColor } from '../components/DepartmentFilter'

// GPA ring component
function GpaRing({ gpa }) {
  const pct  = (gpa / 10) * 100
  const r    = 40
  const circ = 2 * Math.PI * r
  const dash = (circ * pct) / 100
  const color = gpa >= 9 ? '#22c55e' : gpa >= 8 ? '#3b82f6' : gpa >= 7.5 ? '#eab308' : '#ef4444'

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{gpa.toFixed(1)}</p>
        <p className="text-xs text-gray-400">/ 10</p>
      </div>
    </div>
  )
}

// Info field row
function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight || 'text-gray-800'}`}>{value}</span>
    </div>
  )
}

export default function StudentDetails() {
  const { id } = useParams()           // Get student_id from URL
  const navigate = useNavigate()

  const [student, setStudent]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/students/${id}/`)
        setStudent(res.data)
      } catch (err) {
        if (err.response?.status === 404) {
          setError(`Student "${id}" not found.`)
        } else {
          setError('Failed to load student details.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id])

  if (loading) return <LoadingSpinner message="Loading student profile..." />

  if (error) return (
    <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mx-auto">!</div>
      <p className="text-red-600 font-medium">{error}</p>
      <button
        onClick={() => navigate('/students')}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
      >
        ← Back to Students
      </button>
    </div>
  )

  const gpaLabel = student.gpa >= 9.0 ? 'Outstanding' :
                   student.gpa >= 8.5 ? 'Excellent'   :
                   student.gpa >= 8.0 ? 'Very Good'   :
                   student.gpa >= 7.5 ? 'Good'        : 'Average'

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">

      {/* ── Back Button ───────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Students
      </button>

      {/* ── Profile Hero Card ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500
                          flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0">
            {student.name.charAt(0)}
          </div>

          {/* Name + badges */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-slate-400 text-sm mt-1">{student.student_id}</p>

            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className={`dept-badge text-xs px-3 py-1 ${getDeptColor(student.department)}`}>
                {student.department}
              </span>
              <span className={`dept-badge text-xs px-3 py-1 ${student.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                {student.gender}
              </span>
              <span className="dept-badge text-xs px-3 py-1 bg-slate-600 text-slate-200">
                Semester {student.semester}
              </span>
            </div>
          </div>

          {/* GPA Ring */}
          <div className="text-center">
            <GpaRing gpa={student.gpa} />
            <p className="text-sm text-slate-300 mt-1 font-medium">{gpaLabel}</p>
          </div>
        </div>
      </div>

      {/* ── Details Grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Academic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-lg">🎓</span> Academic Information
          </h3>
          <div>
            <InfoRow label="Student ID"   value={student.student_id} highlight="text-blue-600 font-mono" />
            <InfoRow label="Department"   value={student.department} />
            <InfoRow label="Semester"     value={`Semester ${student.semester}`} />
            <InfoRow label="GPA"          value={`${student.gpa.toFixed(2)} / 10.00`}
                      highlight={student.gpa >= 9 ? 'text-green-600' : student.gpa >= 8 ? 'text-blue-600' : 'text-yellow-600'} />
            <InfoRow label="Grade"        value={gpaLabel} />
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-lg">👤</span> Personal Information
          </h3>
          <div>
            <InfoRow label="Full Name" value={student.name} />
            <InfoRow label="Age"       value={`${student.age} years`} />
            <InfoRow label="Gender"    value={student.gender}
                      highlight={student.gender === 'Female' ? 'text-pink-600' : 'text-blue-600'} />
          </div>

          {/* GPA performance badge */}
          <div className="mt-4 p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">GPA Progress</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  student.gpa >= 9 ? 'bg-green-500' :
                  student.gpa >= 8 ? 'bg-blue-500' :
                  student.gpa >= 7.5 ? 'bg-yellow-500' : 'bg-red-400'
                }`}
                style={{ width: `${(student.gpa / 10) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.0</span>
              <span className="font-medium text-gray-700">{student.gpa.toFixed(2)}</span>
              <span>10.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Footer ─────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/students')}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium
                     hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
        >
          ← Back to All Students
        </button>
      </div>

    </div>
  )
}
