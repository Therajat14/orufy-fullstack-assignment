import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendOtp } from '../api/auth'
import { useForm } from '../hooks/useForm'
import AuthLayout from '../layouts/AuthLayout'
import { ROUTES } from '../constants/routes'

export default function SignupPage() {
  const navigate = useNavigate()
  const { values, errors, handleChange, setError } = useForm({ identifier: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!values.identifier.trim()) {
      setError('identifier', 'Please enter your email or phone number')
      return
    }
    setLoading(true)
    try {
      const data = await sendOtp(values.identifier.trim())
      navigate(ROUTES.VERIFY_OTP, {
        state: { identifier: values.identifier.trim(), demoOtp: data.otp },
      })
    } catch (err) {
      setError('identifier', err.response?.data?.message || 'Failed to send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      bottomSlot={
        <div className="border border-gray-200 rounded-2xl py-4 px-6 text-center bg-gray-50/60">
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Already have an account?
          </p>
          <Link to={ROUTES.LOGIN} className="text-[13px] font-semibold text-[#1e1b8e] hover:underline">
            Login here
          </Link>
        </div>
      }
    >
      <h1 className="text-[22px] font-bold text-gray-900 leading-snug mb-2">
        Create your Productr Account
      </h1>
      <p className="text-[13px] text-gray-500 mb-7">
        Enter your email or phone — we'll send an OTP to verify.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-gray-600 mb-2">
            Email or Phone number
          </label>
          <input
            type="text"
            value={values.identifier}
            onChange={handleChange('identifier')}
            placeholder="Enter email or phone number"
            className="w-full border border-gray-200 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition placeholder:text-gray-400"
          />
          {errors.identifier && (
            <p className="text-red-500 text-xs mt-1.5">{errors.identifier}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1e1b8e] hover:bg-[#17158a] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 text-sm mt-1"
        >
          {loading ? 'Sending OTP…' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  )
}
