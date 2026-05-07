/**
 * LoadingSpinner — shown while API requests are in-flight.
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Animated ring */}
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 text-sm font-medium">{message}</p>
    </div>
  )
}
