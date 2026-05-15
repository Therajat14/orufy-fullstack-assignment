import authBg from '../../assets/auth/auth-background.png'
import showcaseCard from '../../assets/auth/auth-showcase-card.jpg'
import logo from '../../assets/logo/Logo.png'

export default function AuthLeftPanel() {
  return (
    <div
      className="hidden lg:flex relative w-full h-full overflow-hidden items-center justify-center"
      style={{
        borderRadius: '0 32px 32px 0',
        background: `linear-gradient(
          180deg,
          #010860 0%,
          #002283 19.23%,
          #734AA3 38.46%,
          #E7959C 57.21%,
          #E4A182 76.92%,
          #BF3613 100%
        )`,
      }}
    >
      {/* White lattice texture — lightens gradient into pastel tones */}
      <img
        src={authBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.72 }}
      />

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <img src={logo} alt="Productr" className="h-9 w-auto" />
      </div>

      {/* Showcase card */}
      <div
        className="relative z-10 overflow-hidden"
        style={{
          width: 312,
          height: 480,
          borderRadius: 40,
          border: '1.5px solid rgba(255, 220, 180, 0.5)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        <img
          src={showcaseCard}
          alt="Product showcase"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Bottom gradient overlay for text legibility */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6 pt-14"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 100%)',
          }}
        >
          <p className="text-white font-bold text-[15px] leading-6 text-center px-4">
            Uplift your<br />product to market
          </p>
        </div>
      </div>
    </div>
  )
}
