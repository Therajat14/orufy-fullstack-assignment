import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!identifier.trim()) {
      setError('Please enter your email or phone number')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/send-otp', { identifier: identifier.trim() })
      navigate('/verify-otp', { state: { identifier: identifier.trim() } })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left hero panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-pink-200 via-blue-200 to-orange-100 items-center justify-center">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-pink-300/40 blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-300/40 blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/3 right-0 w-48 h-48 rounded-full bg-orange-200/50 blur-2xl translate-x-1/4" />

        {/* Phone mockup card */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
            style={{ width: 220, height: 380, background: 'linear-gradient(160deg,#f97316 0%,#fb923c 40%,#fed7aa 100%)' }}
          >
            {/* Runner silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 120 200" width="110" height="200" fill="none">
                <ellipse cx="60" cy="100" rx="55" ry="95" fill="rgba(0,0,0,0.15)" />
                <g fill="#1a1a2e" opacity="0.85">
                  {/* Simple runner shape */}
                  <circle cx="68" cy="38" r="10" />
                  <path d="M60 50 Q55 70 50 85 L42 110 L55 115 L62 92 L72 80 L82 105 L72 130 L85 132 L95 100 L80 72 L75 55 Z" />
                  <path d="M50 85 L35 105 L45 110 L57 92 Z" />
                </g>
              </svg>
            </div>
            {/* Bottom label */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm font-semibold px-4">
              <p>Uplift your</p>
              <p>product to market</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 bg-white">
        {/* Logo top-left (mobile) */}
        <div className="lg:hidden absolute top-6 left-6">
          <ProductrLogo />
        </div>

        {/* Top-left logo on right panel */}
        <div className="hidden lg:block absolute top-6 left-6">
          <ProductrLogo />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Login to your Productr Account
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Phone number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              />
              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e1b8e] hover:bg-[#17158a] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 text-sm"
            >
              {loading ? 'Sending OTP...' : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have a Productr Account?{' '}
            <a href="#" className="text-indigo-700 font-semibold hover:underline">
              Sign Up here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function ProductrLogo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-[#1a1a5c]">Productr</span>
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="#f97316" strokeWidth="2.5" fill="none" />
        <circle cx="18" cy="10" r="8" stroke="#f97316" strokeWidth="2.5" fill="none" />
      </svg>
    </div>
  )
}
