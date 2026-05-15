import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { sendOtp, verifyOtp } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../layouts/AuthLayout'
import { ROUTES } from '../constants/routes'

const OTP_LENGTH = 6

export default function OTPPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const identifier = location.state?.identifier || ''
  const demoOtp = location.state?.demoOtp || null

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(20)
  const [resending, setResending] = useState(false)
  const [shownOtp, setShownOtp] = useState(demoOtp)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!identifier) navigate(ROUTES.LOGIN)
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
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus()
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
    if (code.length < OTP_LENGTH) { setError('Please enter a valid OTP'); return }
    setLoading(true)
    setError('')
    try {
      const data = await verifyOtp(identifier, code)
      login(data.user, data.token)
      navigate(ROUTES.HOME)
    } catch {
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
      const data = await sendOtp(identifier)
      setShownOtp(data.otp)
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
    <AuthLayout>
      <h1 className="text-[22px] font-bold text-gray-900 leading-snug mb-1.5">
        Login to your Productr Account
      </h1>
      <p className="text-[13px] text-gray-500 mb-5">
        OTP sent to <span className="font-medium text-gray-700">{identifier}</span>
      </p>

      {shownOtp && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <span className="text-amber-600 text-xs font-semibold uppercase tracking-wide">Demo OTP</span>
          <span className="text-amber-800 font-mono font-bold text-lg tracking-widest">{shownOtp}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-gray-600 mb-3">
            Enter OTP
          </label>
          <div className="flex gap-2.5" onPaste={handlePaste}>
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
                className={`w-11 h-12 text-center text-lg font-semibold border rounded-xl outline-none transition
                  ${error
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !filled}
          className="w-full bg-[#1e1b8e] hover:bg-[#17158a] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 text-sm"
        >
          {loading ? 'Verifying…' : 'Enter your OTP'}
        </button>
      </form>

      <p className="mt-4 text-[13px] text-gray-500 text-center">
        Didn't receive OTP?{' '}
        {resendTimer > 0 ? (
          <span className="text-gray-400">Resend in {resendTimer}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-[#1e1b8e] font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend'}
          </button>
        )}
      </p>
    </AuthLayout>
  )
}
