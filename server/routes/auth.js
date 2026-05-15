const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const OTP = require('../models/OTP')
const validate = require('../middleware/validate')
const { sendOtpSchema, verifyOtpSchema } = require('../schemas/auth')

const router = express.Router()

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST /api/auth/send-otp
router.post('/send-otp', validate(sendOtpSchema), async (req, res) => {
  const { identifier } = req.body

  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min

  await OTP.deleteMany({ identifier: identifier.trim() })
  await OTP.create({ identifier: identifier.trim(), otp, expiresAt })

  // In production, send via email/SMS. For demo, return in response.
  console.log(`OTP for ${identifier}: ${otp}`)

  res.json({
    message: 'OTP sent successfully',
    // Remove the line below in production:
    otp,
  })
})

// POST /api/auth/verify-otp
router.post('/verify-otp', validate(verifyOtpSchema), async (req, res) => {
  const { identifier, otp } = req.body

  const record = await OTP.findOne({ identifier: identifier.trim() })
  if (!record) {
    return res.status(400).json({ message: 'OTP not found or expired' })
  }
  if (record.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' })
  }
  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: record._id })
    return res.status(400).json({ message: 'OTP has expired' })
  }

  await OTP.deleteOne({ _id: record._id })

  let user = await User.findOne({ identifier: identifier.trim() })
  if (!user) {
    const name = identifier.includes('@')
      ? identifier.split('@')[0]
      : `User${Math.floor(Math.random() * 1000)}`
    user = await User.create({ identifier: identifier.trim(), name })
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

  res.json({
    message: 'Login successful',
    token,
    user: { _id: user._id, name: user.name, identifier: user.identifier },
  })
})

module.exports = router
