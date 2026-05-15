const express = require('express')
const multer = require('multer')
const path = require('path')
const Product = require('../models/Product')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    /^image\//.test(file.mimetype) ? cb(null, true) : cb(new Error('Images only'))
  },
})

const toBoolean = (v) => v === 'Yes' || v === 'true' || v === true

// GET /api/products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id }).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/products
router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { name, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligibility } = req.body
    if (!name || !productType || !quantityStock || !mrp || !sellingPrice || !brandName) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const imageUrls = (req.files || []).map(
      (f) => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`
    )

    const product = await Product.create({
      name, productType,
      quantityStock: Number(quantityStock),
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice),
      brandName,
      images: imageUrls,
      exchangeEligibility: toBoolean(exchangeEligibility),
      published: false,
      createdBy: req.user._id,
    })

    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' })
  }
})

// PUT /api/products/:id
router.put('/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, createdBy: req.user._id })
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const { name, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligibility } = req.body

    const newImages = (req.files || []).map(
      (f) => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`
    )

    Object.assign(product, {
      name: name || product.name,
      productType: productType || product.productType,
      quantityStock: quantityStock !== undefined ? Number(quantityStock) : product.quantityStock,
      mrp: mrp !== undefined ? Number(mrp) : product.mrp,
      sellingPrice: sellingPrice !== undefined ? Number(sellingPrice) : product.sellingPrice,
      brandName: brandName || product.brandName,
      exchangeEligibility: exchangeEligibility !== undefined ? toBoolean(exchangeEligibility) : product.exchangeEligibility,
      images: newImages.length > 0 ? [...product.images, ...newImages] : product.images,
    })

    await product.save()
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' })
  }
})

// PATCH /api/products/:id/publish
router.patch('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { published: req.body.published },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
