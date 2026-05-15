import api from '../services/api'

export const getAll = () => api.get('/products').then((r) => r.data)

export const create = (formData) =>
  api.post('/products', formData).then((r) => r.data)

export const update = (id, formData) =>
  api.put(`/products/${id}`, formData).then((r) => r.data)

export const togglePublish = (id, published) =>
  api.patch(`/products/${id}/publish`, { published }).then((r) => r.data)

export const remove = (id) =>
  api.delete(`/products/${id}`).then((r) => r.data)
