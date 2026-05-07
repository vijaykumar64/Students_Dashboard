/**
 * SearchBar — text input for searching students by name or ID.
 *
 * Uses debouncing: waits 400ms after user stops typing before calling onChange.
 * This avoids making an API call on every single keystroke.
 */

import { useState, useEffect, useRef } from 'react'

export default function SearchBar({ value, onChange, placeholder = 'Search by name or ID...' }) {
  const [localValue, setLocalValue] = useState(value)
  const isMounted = useRef(false)

  // Sync local state when parent resets the value (e.g., clearFilters)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce: skip first render, then wait 400ms after user stops typing
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    const timer = setTimeout(() => onChange(localValue), 400)
    return () => clearTimeout(timer)
  }, [localValue, onChange])

  return (
    <div className="relative">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl
                   bg-white text-gray-700 placeholder-gray-400 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200"
      />

      {/* Clear button */}
      {localValue && (
        <button
          onClick={() => { setLocalValue(''); onChange('') }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
