import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const OTP_LENGTH = 6

export default function OTPPage() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(20)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const identifier = location.state?.identifier || ''

  useEffect(() => {
    if (!identifier) navigate('/login')
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const updated = [...otp]
    updated[index] = value
    setOtp(updated)
    setError('')
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const updated = [...otp]
    for (let i = 0; i < pasted.length; i++) updated[i] = pasted[i]
    setOtp(updated)
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      setError('Please enter a valid OTP')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/verify-otp', { identifier, otp: code })
      login(data.user, data.token)
      navigate('/home')
    } catch (err) {
      setError('Please enter a valid OTP')
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return
    setResending(true)
    try {
      await api.post('/auth/send-otp', { identifier })
      setResendTimer(20)
      setOtp(Array(OTP_LENGTH).fill(''))
      setError('')
      inputRefs.current[0]?.focus()
    } catch {
      setError('Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  const filled = otp.every((d) => d !== '')

  return (
    <div className="min-h-screen flex">
      {/* Left hero panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-pink-200 via-blue-200 to-orange-100 items-center justify-center">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-pink-300/40 blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-300/40 blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/3 right-0 w-48 h-48 rounded-full bg-orange-200/50 blur-2xl translate-x-1/4" />
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
            style={{ width: 220, height: 380, background: 'linear-gradient(160deg,#f97316 0%,#fb923c 40%,#fed7aa 100%)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 120 200" width="110" height="200" fill="none">
                <ellipse cx="60" cy="100" rx="55" ry="95" fill="rgba(0,0,0,0.15)" />
                <g fill="#1a1a2e" opacity="0.85">
                  <circle cx="68" cy="38" r="10" />
                  <path d="M60 50 Q55 70 50 85 L42 110 L55 115 L62 92 L72 80 L82 105 L72 130 L85 132 L95 100 L80 72 L75 55 Z" />
                  <path d="M50 85 L35 105 L45 110 L57 92 Z" />
                </g>
              </svg>
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm font-semibold px-4">
              <p>Uplift your</p>
              <p>product to market</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right OTP panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 bg-white">
        <div className="hidden lg:block absolute top-6 left-6">
          <ProductrLogo />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Login to your Productr Account
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            OTP sent to <span className="font-medium text-gray-700">{identifier}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter OTP
              </label>
              <div className="flex gap-2" onPaste={handlePaste}>
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
                    className={`w-10 h-11 text-center text-lg font-semibold border rounded-lg outline-none transition
                      ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'}`}
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !filled}
              className="w-full bg-[#1e1b8e] hover:bg-[#17158a] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 text-sm"
            >
              {loading ? 'Verifying...' : 'Enter your OTP'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Didn't receive OTP?{' '}
            {resendTimer > 0 ? (
              <span className="text-gray-400">Resend in {resendTimer}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-indigo-700 font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend'}
              </button>
            )}
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
