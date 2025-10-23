const ContactSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  )
}

export default ContactSkeleton