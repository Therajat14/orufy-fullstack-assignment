import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import logo from "../assets/logo/Logo.png";

export default function AuthLayout({ children, bottomSlot }) {
  return (
    <div
      className="bg-[#f8f9fc] overflow-hidden"
      style={{ height: "100vh", padding: 32 }}
    >
      <div className="flex h-full min-h-0">
        <div className="hidden lg:flex w-[52%] max-w-[690px] min-w-[620px]">
          <AuthLeftPanel />
        </div>

        <div className="flex-1 flex min-h-0 justify-center px-8 xl:px-16">
          <div
            className="flex h-full min-h-0 w-full max-w-[376px] flex-col"
            style={{
              paddingTop: "clamp(126px, 18vh, 184px)",
              paddingBottom: bottomSlot
                ? "clamp(20px, 3vh, 32px)"
                : "clamp(118px, 17.2vh, 176px)",
              transform: "translateX(15px)",
            }}
          >
            <div className="lg:hidden mb-10">
              <img src={logo} alt="Productr" className="h-8 w-auto" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-between">
              <div>{children}</div>
              {bottomSlot && <div>{bottomSlot}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
