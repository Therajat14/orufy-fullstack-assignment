import { useState } from 'react'

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: '' }))
  }

  const setError = (field, msg) =>
    setErrors((err) => ({ ...err, [field]: msg }))

  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  return { values, errors, handleChange, setError, setValues, reset }
}
