import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "../api/auth";
import { useForm } from "../hooks/useForm";
import AuthLayout from "../layouts/AuthLayout";
import { ROUTES } from "../constants/routes";

export default function LoginPage() {
  const navigate = useNavigate();

  const { values, errors, handleChange, setError } = useForm({
    identifier: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.identifier.trim()) {
      setError("identifier", "Please enter your email or phone number");
      return;
    }

    setLoading(true);

    try {
      const data = await sendOtp(values.identifier.trim());

      navigate(ROUTES.VERIFY_OTP, {
        state: {
          identifier: values.identifier.trim(),
          demoOtp: data.otp,
        },
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
    <AuthLayout
      bottomSlot={
        <div className="min-h-[80px] flex flex-col items-center justify-center border border-[#d8dde7] rounded-lg px-6 text-center bg-white bg-[radial-gradient(#dfe4ec_1px,transparent_1px)] [background-size:14px_14px]">
          <p className="text-[14px] leading-5 text-[#9aa4b5]">
            Don&apos;t have a Productr Account?
          </p>

          <Link
            to={ROUTES.SIGNUP}
            className="text-[14px] leading-5 font-semibold text-[#071074] hover:underline"
          >
            Sign Up Here
          </Link>
        </div>
      }
    >
      {/* Heading */}
      <h1
        className="w-full text-center text-[24px] leading-[29px] font-semibold text-[#11194f]"
        style={{ marginBottom: 42 }}
      >
        Login to your Productr Account
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Input */}
        <div style={{ marginBottom: 24 }}>
          <label className="block text-[14px] leading-5 font-medium text-[#111827] mb-2">
            Email or Phone number
          </label>

          <input
            type="text"
            value={values.identifier}
            onChange={handleChange("identifier")}
            placeholder="Enter email or phone number"
            className="
              w-full
              h-10
              rounded-lg
              border
              border-[#cfd5df]
              bg-white
              px-4
              text-[14px]
              text-[#344054]
              outline-none
              transition-all
              placeholder:text-[#9aa4b5]
              focus:border-[#8a8fd6]
              focus:ring-1
              focus:ring-[#8a8fd6]
            "
          />

          {errors.identifier && (
            <p className="text-red-500 text-xs mt-2">{errors.identifier}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            h-10
            rounded-lg
            bg-[#071074]
            text-white
            text-[14px]
            font-semibold
            transition-all
            hover:bg-[#071070]
            active:scale-[0.99]
            disabled:opacity-60
          "
        >
          {loading ? "Sending OTP..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}
