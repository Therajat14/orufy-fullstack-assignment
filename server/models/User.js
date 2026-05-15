const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true, trim: true },
  name: { type: String, default: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
