export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex min-h-[calc(100vh-170px)] flex-col items-center justify-center gap-5 text-center">
      <div className="text-[#08148a]">
        {icon}
      </div>
      <div>
        <p className="font-bold text-[#344054] text-[22px] leading-7">{title}</p>
        {description && (
          <p className="text-[15px] text-[#98a2b3] mt-2 max-w-[360px] mx-auto leading-5">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
