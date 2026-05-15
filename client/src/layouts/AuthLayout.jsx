import AuthLeftPanel from '../components/auth/AuthLeftPanel'
import logo from '../assets/logo/Logo.png'

export default function AuthLayout({ children, bottomSlot }) {
  return (
    <div className="min-h-screen flex bg-white">

      {/* Left panel (52% width, flush edges, right corners rounded) */}
      <div className="hidden lg:block w-[52%] shrink-0 self-stretch">
        <AuthLeftPanel />
      </div>

      {/* Right column */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile logo */}
        <div className="lg:hidden px-8 pt-8 pb-4">
          <img src={logo} alt="Productr" className="h-8 w-auto" />
        </div>

        {/* Form area — positioned at ~30% from top */}
        <div className="pt-[30vh] px-14">
          <div className="w-full max-w-90">
            {children}
          </div>
        </div>

        <div className="flex-1" />

        {/* Optional bottom slot (signup / login links) */}
        {bottomSlot && (
          <div className="px-14 pb-10">
            <div className="w-full max-w-90">
              {bottomSlot}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
