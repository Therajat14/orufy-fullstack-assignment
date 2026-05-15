import api from '../services/api'

export const sendOtp = (identifier) =>
  api.post('/auth/send-otp', { identifier }).then((r) => r.data)

export const verifyOtp = (identifier, otp) =>
  api.post('/auth/verify-otp', { identifier, otp }).then((r) => r.data)
