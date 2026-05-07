/**
 * StudentsList Page — browse, search, filter, and paginate all students.
 *
 * API calls:
 *   GET /api/students/?search=X&department=Y&ordering=Z&page=N
 *
 * Features:
 *   - Search by name / ID
 *   - Filter by department
 *   - Sort by GPA / Name
 *   - Toggle between Table and Card view
 *   - Pagination with prev/next
 */

import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'
import DepartmentFilter from '../components/DepartmentFilter'
import GPAFilter from '../components/GPAFilter'
import StudentTable from '../components/StudentTable'
import StudentCard from '../components/StudentCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function StudentsList() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [students, setStudents]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [viewMode, setViewMode]       = useState('table') // 'table' | 'cards'

  // Filters
  const [search, setSearch]           = useState('')
  const [department, setDepartment]   = useState('')
  const [ordering, setOrdering]       = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount]   = useState(0)
  const [nextUrl, setNextUrl]         = useState(null)
  const [prevUrl, setPrevUrl]         = useState(null)
  const pageSize = 10

  // ── Fetch students whenever filters change ─────────────────────────────────
  const fetchStudents = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        page,
        page_size: pageSize,
      }
      if (search)     params.search = search
      if (department) params.department = department
      if (ordering)   params.ordering = ordering

      const res = await api.get('/students/', { params })

      setStudents(res.data.results || [])
      setTotalCount(res.data.count || 0)
      setNextUrl(res.data.next)
      setPrevUrl(res.data.previous)
    } catch (err) {
      setError('Could not load students. Is the Django server running on port 8000?')
    } finally {
      setLoading(false)
    }
  }, [search, department, ordering])

  // Re-fetch when filters change (reset to page 1)
  useEffect(() => {
    setCurrentPage(1)
    fetchStudents(1)
  }, [search, department, ordering, fetchStudents])

  // Re-fetch when page changes
  const goToPage = (page) => {
    setCurrentPage(page)
    fetchStudents(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Computed ────────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(totalCount / pageSize)
  const startItem  = (currentPage - 1) * pageSize + 1
  const endItem    = Math.min(currentPage * pageSize, totalCount)

  const clearFilters = () => {
    setSearch('')
    setDepartment('')
    setOrdering('')
    setCurrentPage(1)
  }

  const hasFilters = search || department || ordering

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Students</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Loading...' : `${totalCount} student${totalCount !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            title="Table view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            title="Card view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Filters Bar ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Department filter */}
          <div className="w-full lg:w-48">
            <DepartmentFilter value={department} onChange={setDepartment} />
          </div>

          {/* Clear button */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl
                         hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Sort options */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-400 font-medium">Sort by:</span>
            <GPAFilter value={ordering} onChange={setOrdering} />
          </div>
        </div>
      </div>

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {loading ? (
        <LoadingSpinner message="Fetching students..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : students.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'table' ? (
        <StudentTable students={students} ordering={ordering} onOrderingChange={setOrdering} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {students.map(student => (
            <StudentCard key={student.student_id} student={student} />
          ))}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
          {/* Info */}
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{startItem}–{endItem}</span> of{' '}
            <span className="font-medium text-gray-700">{totalCount}</span> students
          </p>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!prevUrl}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={idx} className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goToPage(item)}
                    className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                      item === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!nextUrl}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
