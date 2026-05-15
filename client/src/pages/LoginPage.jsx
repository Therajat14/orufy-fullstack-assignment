import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "../api/auth";
import { useForm } from "../hooks/useForm";
import { useToast } from "../hooks/useToast";
import AuthLayout from "../layouts/AuthLayout";
import { ROUTES } from "../constants/routes";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { values, errors, handleChange, setError } = useForm({
    identifier: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.identifier.trim()) {
      setError("identifier", "Please enter your email or phone number");
      return;
    }
    setLoading(true);
    try {
      const data = await sendOtp(values.identifier.trim());
      showToast(`Your demo OTP is: ${data.otp}`);
      await new Promise((r) => setTimeout(r, 2000));
      navigate(ROUTES.VERIFY_OTP, {
        state: { identifier: values.identifier.trim(), demoOtp: data.otp },
      });
    } catch (err) {
      setError(
        "identifier",
        err.response?.data?.message || "Failed to send OTP. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AuthLayout
      bottomSlot={
        // Frame 12: 376×80, radius 8px, border 1px #D4D4D4, white bg
        <div
          style={{
            width: "100%",
            height: "80px",
            borderRadius: "8px",
            border: "1px solid #D4D4D4",
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px", // Frame 18 gap: 4px
            boxSizing: "border-box",
          }}
        >
          {/* "Don't have a Productr Account" — Inter 12px, #a0aabb */}
          <p
            style={{
              margin: 0,
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              color: "#a0aabb",
              lineHeight: "100%",
            }}
          >
            Don't have a Productr Account
          </p>
          {/* "SignUp Here" — Inter 14px, semibold, #071074 */}
          <Link
            to={ROUTES.SIGNUP}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#071074",
              textDecoration: "none",
              lineHeight: "100%",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            SignUp Here
          </Link>
        </div>
      }
    >
      {/* Heading — Inter 24px, semibold 600, #111652, center aligned */}
      <h1
        style={{
          margin: "0 0 20px",
          fontFamily: "Inter, sans-serif",
          fontSize: "24px",
          fontWeight: 600,
          color: "#111652",
          lineHeight: "100%",
          letterSpacing: "0%",
          textAlign: "center",
          width: "100%",
        }}
      >
        Login to your Productr Account
      </h1>

      {/* Form — Frame 7: vertical, gap 8px */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px", // Frame 7 gap: 8px
          width: "100%",
        }}
      >
        {/* Label + Input wrapper — Frame 7 inner */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Label — Inter 14px, medium 500, #000000 */}
          <label
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#000000",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            Email or Phone number
          </label>

          {/* Input — Frame 5: 376×40, radius 8px, border 1px #D4D4D4, white */}
          <input
            type="text"
            value={values.identifier}
            onChange={handleChange("identifier")}
            placeholder="Enter email or phone number"
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              border: `1px solid ${errors.identifier ? "#ef4444" : "#D4D4D4"}`,
              backgroundColor: "#FFFFFF",
              padding: "0 12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#344054",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#111652";
              e.target.style.boxShadow = "0 0 0 3px rgba(17,22,82,0.10)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.identifier
                ? "#ef4444"
                : "#D4D4D4";
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.identifier && (
            <p
              style={{ margin: "2px 0 0", fontSize: "11px", color: "#ef4444" }}
            >
              {errors.identifier}
            </p>
          )}
        </div>

        {/* Login button — full width */}
        <Button type="submit" disabled={loading} variant="auth" fullWidth>
          {loading ? "Sending OTP..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
    <Toast message={toast} onClose={clearToast} duration={10000} />
    </>
  );
}
