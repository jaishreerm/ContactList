import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/20/solid'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchBar = ({ value, onChange, placeholder = "Search contacts..." }: SearchBarProps) => {
  return (
    <div className="mb-4 sm:mb-6 px-4 sm:px-0">
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-lg border-0 py-2.5 sm:py-3 pl-10 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm sm:text-base transition-colors duration-200"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="sr-only">Clear search</span>
            <XCircleIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar