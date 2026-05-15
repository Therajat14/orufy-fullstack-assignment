const { z } = require('zod')

const identifierSchema = z
  .string({ required_error: 'Email or phone number is required' })
  .trim()
  .min(1, 'Email or phone number is required')
  .refine(
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?\d{7,15}$/.test(v),
    { message: 'Enter a valid email address or phone number' }
  )

exports.sendOtpSchema = z.object({
  identifier: identifierSchema,
})

exports.verifyOtpSchema = z.object({
  identifier: identifierSchema,
  otp: z
    .string({ required_error: 'OTP is required' })
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
})
