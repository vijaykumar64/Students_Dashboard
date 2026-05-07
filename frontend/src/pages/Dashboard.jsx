/**
 * Dashboard Page — analytics overview of all students.
 *
 * Fetches from: GET /api/students/stats/
 * Shows:
 *   - 4 stat cards (Total, Avg GPA, Departments, Gender split)
 *   - Per-department breakdown table
 *   - GPA distribution bar chart
 *   - Top 5 performers
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, gradient, icon }) {
  return (
    <div className={`${gradient} rounded-2xl p-6 text-white shadow-lg hover-lift`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  )
}

// ── GPA Distribution Bar ──────────────────────────────────────────────────────
function DistBar({ label, count, max }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        ></div>
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{count}</span>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [topStudents, setTopStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch stats and top students in parallel
        const [statsRes, topRes] = await Promise.all([
          api.get('/students/stats/'),
          api.get('/students/?ordering=-gpa&page_size=5'),
        ])
        setStats(statsRes.data)
        setTopStudents(topRes.data.results || [])
      } catch (err) {
        setError('Failed to load dashboard data. Is the Django server running?')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl">!</div>
      <p className="text-red-600 font-medium">{error}</p>
      <p className="text-gray-500 text-sm">Make sure Django is running: <code className="bg-gray-100 px-2 py-0.5 rounded">python manage.py runserver</code></p>
    </div>
  )

  const maxGpaDist = Math.max(...Object.values(stats?.gpa_distribution || {}), 1)
  const maleCount = stats?.gender_stats?.Male || 0
  const femaleCount = stats?.gender_stats?.Female || 0
  const total = maleCount + femaleCount
  const malePct = total > 0 ? Math.round((maleCount / total) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, Admin!</h2>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of all students across all departments.</p>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.total_students ?? '—'}
          subtitle="Enrolled students"
          gradient="card-blue"
          icon="🎓"
        />
        <StatCard
          title="Average GPA"
          value={stats?.avg_gpa?.toFixed(2) ?? '—'}
          subtitle="Across all departments"
          gradient="card-green"
          icon="📊"
        />
        <StatCard
          title="Departments"
          value={stats?.department_count ?? '—'}
          subtitle="Active departments"
          gradient="card-orange"
          icon="🏛️"
        />
        <StatCard
          title="Male / Female"
          value={`${maleCount} / ${femaleCount}`}
          subtitle={`${malePct}% Male · ${100 - malePct}% Female`}
          gradient="card-teal"
          icon="👥"
        />
      </div>

      {/* ── Middle Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Department breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Department Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Department</th>
                  <th className="pb-3 text-center">Students</th>
                  <th className="pb-3 text-center">Avg GPA</th>
                  <th className="pb-3">Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.dept_stats?.map(dept => (
                  <tr key={dept.department} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-700">{dept.department}</td>
                    <td className="py-3 text-center text-gray-600">{dept.count}</td>
                    <td className="py-3 text-center">
                      <span className={`font-bold ${dept.avg_gpa >= 8.5 ? 'text-green-600' : dept.avg_gpa >= 8 ? 'text-blue-600' : 'text-yellow-600'}`}>
                        {dept.avg_gpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 w-32">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                          style={{ width: `${(dept.count / stats.total_students) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GPA distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">GPA Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats?.gpa_distribution || {}).map(([range, count]) => (
              <DistBar key={range} label={range} count={count} max={maxGpaDist} />
            ))}
          </div>

          {/* Gender split */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-600 mb-3">Gender Split</h4>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-l-full"
                style={{ width: `${malePct}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>♂ Male {maleCount} ({malePct}%)</span>
              <span>♀ Female {femaleCount} ({100 - malePct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Performers ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Top 5 Performers</h3>
          <button
            onClick={() => navigate('/students')}
            className="text-sm text-blue-600 hover:underline"
          >
            View all →
          </button>
        </div>

        <div className="space-y-3">
          {topStudents.map((student, index) => (
            <div
              key={student.student_id}
              onClick={() => navigate(`/students/${student.student_id}`)}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {/* Rank badge */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-100 text-blue-600'}`}>
                {index + 1}
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600
                              flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {student.name.charAt(0)}
              </div>

              {/* Name + dept */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{student.name}</p>
                <p className="text-xs text-gray-500">{student.department} · Sem {student.semester}</p>
              </div>

              {/* GPA */}
              <span className="text-lg font-bold text-green-600">{student.gpa.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
