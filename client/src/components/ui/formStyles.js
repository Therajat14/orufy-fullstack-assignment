export const inputCls = (error) =>
  `w-full h-10 border rounded-lg px-3 text-sm text-[#344054] outline-none transition bg-white placeholder:text-[#98a2b3] ${
    error
      ? 'border-[#ff3b30] focus:border-[#ff3b30]'
      : 'border-[#d7dce5] focus:border-[#8a8fd6] focus:ring-1 focus:ring-[#8a8fd6]'
  }`
