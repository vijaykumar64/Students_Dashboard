/**
 * GPAFilter — buttons to sort students by GPA (ascending / descending).
 */

export default function GPAFilter({ value, onChange }) {
  const options = [
    { value: '',     label: 'Default' },
    { value: '-gpa', label: 'GPA ↑ High' },
    { value: 'gpa',  label: 'GPA ↓ Low' },
    { value: 'name', label: 'Name A-Z' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-2 text-sm rounded-xl border font-medium transition-all duration-200 ${
            value === opt.value
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
