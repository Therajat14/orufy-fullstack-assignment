const { z } = require('zod')

const positiveNumber = (field) =>
  z
    .string({ required_error: `${field} is required` })
    .trim()
    .min(1, `${field} is required`)
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, {
      message: `${field} must be a valid non-negative number`,
    })

exports.createProductSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .trim()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be 200 characters or fewer'),

  productType: z
    .string({ required_error: 'Product type is required' })
    .trim()
    .min(1, 'Product type is required'),

  quantityStock: positiveNumber('Quantity stock'),

  mrp: positiveNumber('MRP'),

  sellingPrice: positiveNumber('Selling price'),

  brandName: z
    .string({ required_error: 'Brand name is required' })
    .trim()
    .min(1, 'Brand name is required'),

  exchangeEligibility: z
    .enum(['true', 'false', 'Yes', 'No', true, false], {
      errorMap: () => ({ message: 'Exchange eligibility must be true or false' }),
    })
    .optional(),
})

exports.updateProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name cannot be empty').max(200).optional(),
  productType: z.string().trim().min(1, 'Product type cannot be empty').optional(),
  quantityStock: positiveNumber('Quantity stock').optional(),
  mrp: positiveNumber('MRP').optional(),
  sellingPrice: positiveNumber('Selling price').optional(),
  brandName: z.string().trim().min(1, 'Brand name cannot be empty').optional(),
  exchangeEligibility: z
    .enum(['true', 'false', 'Yes', 'No', true, false])
    .optional(),
})

exports.publishSchema = z.object({
  published: z.boolean({ required_error: 'published must be a boolean' }),
})
