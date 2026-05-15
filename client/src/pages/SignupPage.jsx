import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "../api/auth";
import { useForm } from "../hooks/useForm";
import { useToast } from "../hooks/useToast";
import AuthLayout from "../layouts/AuthLayout";
import { ROUTES } from "../constants/routes";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";

export default function SignupPage() {
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "68px",
              border: "1px solid #e2e6ee",
              borderRadius: "10px",
              padding: "12px 20px",
              textAlign: "center",
              backgroundColor: "#ffffff",
              gap: "2px",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#a0aabb" }}>
              Already have an account?
            </p>
            <Link
              to={ROUTES.LOGIN}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1e2a8a",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Login Here
            </Link>
          </div>
        }
      >
        <h1
          style={{
            margin: "0 0 20px",
            fontSize: "22px",
            fontWeight: 700,
            color: "#1e2a8a",
            lineHeight: "1.25",
            letterSpacing: "-0.02em",
          }}
        >
          Create your Productr Account
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "#344054",
                marginBottom: "5px",
                letterSpacing: "0.01em",
              }}
            >
              Email or Phone number
            </label>
            <input
              type="text"
              value={values.identifier}
              onChange={handleChange("identifier")}
              placeholder="Enter email or phone number"
              style={{
                width: "100%",
                height: "34px",
                borderRadius: "6px",
                border: `1px solid ${errors.identifier ? "#ef4444" : "#dde1ea"}`,
                backgroundColor: "#ffffff",
                padding: "0 11px",
                fontSize: "12.5px",
                color: "#1e2a8a",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                letterSpacing: "0.01em",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#1e2a8a";
                e.target.style.boxShadow = "0 0 0 3px rgba(30,42,138,0.10)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.identifier
                  ? "#ef4444"
                  : "#dde1ea";
                e.target.style.boxShadow = "none";
              }}
            />
            {errors.identifier && (
              <p
                style={{ margin: "4px 0 0", fontSize: "11px", color: "#ef4444" }}
              >
                {errors.identifier}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} variant="auth" fullWidth>
            {loading ? "Sending OTP..." : "Create Account"}
          </Button>
        </form>
      </AuthLayout>
      <Toast message={toast} onClose={clearToast} duration={10000} />
    </>
  );
}
