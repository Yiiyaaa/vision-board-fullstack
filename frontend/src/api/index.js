import axios from 'axios'

// Dev: vite proxies /api -> Django :8000. Prod: same origin.
// VITE_API_BASE lets a static build talk to an absolute API host (e.g. local preview).
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || '/api', timeout: 10000 })

export const getSiteInfo = () => api.get('/site-info/').then((r) => r.data)
export const getServices = () => api.get('/services/').then((r) => r.data)
export const getShowcases = (featured = false) =>
  api.get('/showcases/', { params: featured ? { featured: 'true' } : {} }).then((r) => r.data)
export const postInquiry = (payload) => api.post('/inquiries/', payload).then((r) => r.data)

export default api
