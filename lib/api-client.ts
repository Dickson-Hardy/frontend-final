import { api } from './api'

interface ApiMethods {
  get: <T = any>(endpoint: string) => Promise<T>
  post: <T = any>(endpoint: string, data?: any) => Promise<T>
  patch: <T = any>(endpoint: string, data?: any) => Promise<T>
  put: <T = any>(endpoint: string, data?: any) => Promise<T>
  del: <T = any>(endpoint: string) => Promise<T>
}

export const apiClient: ApiMethods = {
  get: async <T = any>(endpoint: string): Promise<T> => {
    const response = await api.get(endpoint)
    return response.data
  },

  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await api.post(endpoint, data)
    return response.data
  },

  patch: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await api.patch(endpoint, data)
    return response.data
  },

  put: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await api.put(endpoint, data)
    return response.data
  },

  del: async <T = any>(endpoint: string): Promise<T> => {
    const response = await api.delete(endpoint)
    return response.data
  },
}

// Hook version for consistency
export const useApiClient = () => apiClient
