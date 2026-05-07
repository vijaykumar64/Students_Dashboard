/**
 * EmptyState — shown when search/filter returns no results.
 */
export default function EmptyState({ message = 'No students found', subMessage = 'Try adjusting your search or filters' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <div>
        <p className="text-gray-600 font-semibold text-lg">{message}</p>
        <p className="text-gray-400 text-sm mt-1">{subMessage}</p>
      </div>
    </div>
  )
}
