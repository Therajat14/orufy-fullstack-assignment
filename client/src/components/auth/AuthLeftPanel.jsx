import authBg from "../../assets/auth/auth-background.png";
import showcaseCard from "../../assets/auth/auth-showcase-card.jpg";
import logo from "../../assets/logo/Logo.png";

export default function AuthLeftPanel() {
  return (
    <div
      className="
        relative
        w-full
        h-full
        rounded-[32px]
        overflow-hidden
        border
        border-[#d7dce5]
      "
      style={{ backgroundColor: "#f5f0f5" }}
    >
      <img
        src={authBg}
        alt=""
        aria-hidden="true"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          pointer-events-none
          select-none
        "
        style={{
          opacity: 0.86,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              180deg,
              #010860 0%,
              #002283 19.23%,
              #734AA3 38.46%,
              #E7959C 57.21%,
              #E4A182 76.92%,
              #BF3613 100%
            )
          `,
          mixBlendMode: "overlay",
          opacity: 0.56,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,39,138,0.26) 0%, rgba(255,255,255,0.4) 47%, rgba(255,186,156,0.42) 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 52% 18%, rgba(218,224,255,0.58), transparent 34%), radial-gradient(circle at 50% 92%, rgba(255,208,188,0.58), transparent 40%)",
        }}
      />

      <div className="absolute top-6 left-4 z-20">
        <img
          src={logo}
          alt="Productr"
          className="h-[34px] w-auto object-contain"
        />
      </div>

      {/* Showcase Card */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[310px]
          h-[480px]
          rounded-[42px]
          overflow-hidden
          z-20
        "
        style={{
          border: "1px solid rgba(255,255,255,0.28)",
          boxShadow: "0 16px 38px rgba(64, 41, 32, 0.34)",
        }}
      >
        {/* Image */}
        <img
          src={showcaseCard}
          alt="Product showcase"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            object-center
          "
        />

        {/* Top Glow */}
        <div
          className="
            absolute
            top-[-30px]
            left-1/2
            -translate-x-1/2
            w-[200px]
            h-[100px]
            rounded-full
            blur-3xl
            bg-[#fff1b8]/40
          "
        />

        {/* Bottom Overlay */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[140px]
          "
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
          }}
        />

        {/* Text */}
        <div
          className="
            absolute
            bottom-10
            left-1/2
            -translate-x-1/2
            text-center
            w-full
            px-6
          "
        >
          <p
            className="
              text-white
              text-[20px]
              leading-[22px]
              font-bold
              tracking-[-0.01em]
            "
          >
            Uplift your
            <br />
            product to market
          </p>
        </div>
      </div>
    </div>
  );
}
