/**
 * Axios Configuration — central place for all API settings.
 *
 * Why a single axios instance?
 *   - One place to change the base URL (dev → production)
 *   - Consistent headers across all requests
 *   - Can add auth tokens here later
 *   - Easy to add request/response interceptors
 *
 * Usage in components:
 *   import api from '../api/axios'
 *   const response = await api.get('/students/')
 */

import axios from 'axios'

const api = axios.create({
  // Reads from .env file: VITE_API_BASE_URL=http://127.0.0.1:8000/api
  // Falls back to localhost for development
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',

  // Wait up to 10 seconds before timing out
  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ── Request Interceptor ───────────────────────────────────────────────────────
// Runs before every request — useful for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed in the future:
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──────────────────────────────────────────────────────
// Runs after every response — useful for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request was made but no response received (backend offline?)
      console.error('No response from server. Is Django running on port 8000?')
    } else {
      console.error('Request setup error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
