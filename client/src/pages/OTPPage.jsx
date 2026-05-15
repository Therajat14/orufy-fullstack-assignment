import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendOtp, verifyOtp } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../layouts/AuthLayout";
import { ROUTES } from "../constants/routes";
import Button from "../components/ui/Button";

const OTP_LENGTH = 6;

export default function OTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const identifier = location.state?.identifier || "";

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(20);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!identifier) navigate(ROUTES.LOGIN);
    inputRefs.current[0]?.focus();
  }, [identifier, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError("");
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const updated = [...otp];
    for (let i = 0; i < pasted.length; i++) updated[i] = pasted[i];
    setOtp(updated);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) { setError("Please enter a valid OTP"); return; }
    setLoading(true);
    setError("");
    try {
      const data = await verifyOtp(identifier, code);
      login(data.user, data.token);
      navigate(ROUTES.HOME);
    } catch {
      setError("Please enter a valid OTP");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    try {
      await sendOtp(identifier);
      setResendTimer(20);
      setOtp(Array(OTP_LENGTH).fill(""));
      setError("");
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <h1
        className="w-full text-center text-[24px] leading-[29px] font-semibold text-[#11194f]"
        style={{ marginBottom: 42 }}
      >
        Login to your Productr Account
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 24 }}>
          <label className="block text-[14px] leading-5 font-medium text-[#111827] mb-2">
            Enter OTP
          </label>
          <div className="grid grid-cols-6 gap-4" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-full h-10 text-center text-base font-medium border rounded-lg outline-none transition-all
                  ${error
                    ? "border-[#ff3b30] bg-white text-[#344054] focus:border-[#ff3b30]"
                    : "border-[#cfd5df] bg-white text-[#344054] focus:border-[#8a8fd6] focus:ring-1 focus:ring-[#8a8fd6]"
                  }`}
              />
            ))}
          </div>
          {error && <p className="text-[#ff3b30] text-sm mt-1.5">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="auth"
          fullWidth
          className="text-[14px]"
        >
          {loading ? "Verifying..." : "Enter your OTP"}
        </Button>
      </form>

      <p
        className="text-[14px] leading-5 text-[#98a2b3] text-center"
        style={{ marginTop: 24 }}
      >
        Didnt recive OTP ?{" "}
        {resendTimer > 0 ? (
          <span className="text-[#071074] font-semibold">Resend in {resendTimer}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-[#071074] font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend"}
          </button>
        )}
      </p>
    </AuthLayout>
  );
}
