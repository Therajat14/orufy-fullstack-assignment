export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="p-5 bg-indigo-50 rounded-2xl">
        {icon}
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-800 text-[15px]">{title}</p>
        {description && (
          <p className="text-sm text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
