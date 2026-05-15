const { ZodError } = require('zod')

/**
 * Returns an Express middleware that validates req.body against a Zod schema.
 * On failure it responds 422 with { errors: [{ field, message }] }.
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.') || 'body',
        message: e.message,
      }))
      return res.status(422).json({ message: 'Validation failed', errors })
    }
    req.body = result.data
    next()
  }
}

module.exports = validate
