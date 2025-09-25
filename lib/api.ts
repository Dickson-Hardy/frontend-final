import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Create axios instance with default config
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("auth_token")
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url)
    console.log('🔑 Token for request:', token ? token.substring(0, 50) + '...' : 'null')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  (error: AxiosError) => {
    console.log('❌ API Error:', error.response?.status, error.config?.url)
    console.log('❌ Error details:', error.response?.data)

    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Emit a global event so UI/auth layer can handle sign-out gracefully
      try {
        window.dispatchEvent(new Event('auth-unauthorized'))
      } catch {}
    }
    return Promise.reject(error)
  },
)

// API Types
export interface Volume {
  _id: string
  number: number
  year: number
  title: string
  description: string
  coverImage?: string
  publishedDate: Date
  status: "draft" | "published" | "archived"
  issues: Issue[]
  totalArticles: number
  totalPages: number
}

export interface Issue {
  _id: string
  number: number
  title: string
  description: string
  publishedDate: Date
  articles: Article[]
}

export interface Article {
  _id: string
  title: string
  abstract: string
  authors: Author[]
  keywords: string[]
  doi?: string
  pages: { start: number; end: number }
  submissionDate: Date
  publishedDate?: Date
  status: string
  files: ArticleFile[]
  volume: string
  issue: string
  articleNumber?: string
  manuscriptFile?: any
  supplementaryFiles?: any[]
  viewCount?: number
  downloadCount?: number
  content?: string
  references?: string[]
  funding?: string
  acknowledgments?: string
  conflictOfInterest?: string
}

export interface Author {
  _id: string
  firstName: string
  lastName: string
  email: string
  affiliation: string
  orcid?: string
}

export interface ArticleFile {
  _id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  type: "manuscript" | "supplementary" | "figure"
}

export interface NewsItem {
  _id: string
  title: string
  content: string
  type: "announcement" | "news" | "update"
  priority: "low" | "medium" | "high"
  publishedDate: Date
  author: string
  featured: boolean
}

export interface JournalStatistics {
  totalArticles: number
  totalCountries: number
  impactFactor: number
  totalVolumes: number
  totalUsers: number
}

// API Services
export const volumeService = {
  getAll: () => api.get<Volume[]>("/volumes"),
  getById: (id: string) => api.get<Volume>(`/volumes/${id}`),
  create: (data: Partial<Volume>) => api.post<Volume>("/volumes", data),
  update: (id: string, data: Partial<Volume>) => api.put<Volume>(`/volumes/${id}`, data),
  delete: (id: string) => api.delete(`/volumes/${id}`),
  getCurrent: () => api.get<Volume>("/volumes/current"),
  getRecent: (limit = 4) => api.get<Volume[]>(`/volumes/recent?limit=${limit}`),
}

export const articleService = {
  getAll: () => api.get<Article[]>("/articles"),
  getById: (id: string) => api.get<Article>(`/articles/${id}`),
  getByVolume: (volumeNumber: number) => api.get<Article[]>(`/articles/volume/${volumeNumber}`),
  getByVolumeAndArticleNumber: (volumeNumber: number, articleNumber: string) => 
    api.get<Article>(`/articles/volume/${volumeNumber}/article/${articleNumber}`),
  getFeatured: (limit = 6) => api.get<Article[]>(`/articles/featured?limit=${limit}`),
  create: (data: Partial<Article>) => api.post<Article>("/articles", data),
  update: (id: string, data: Partial<Article>) => api.put<Article>(`/articles/${id}`, data),
  updateArticleNumber: (id: string, articleNumber: string) => 
    api.patch<Article>(`/articles/${id}/article-number`, { articleNumber }),
  delete: (id: string) => api.delete(`/articles/${id}`),
}

export const newsService = {
  getAll: () => api.get<NewsItem[]>("/news"),
  getById: (id: string) => api.get<NewsItem>(`/news/${id}`),
  getFeatured: (limit = 5) => api.get<NewsItem[]>(`/news/featured?limit=${limit}`),
  create: (data: Partial<NewsItem>) => api.post<NewsItem>("/news", data),
  update: (id: string, data: Partial<NewsItem>) => api.put<NewsItem>(`/news/${id}`, data),
  delete: (id: string) => api.delete(`/news/${id}`),
}

export const uploadService = {
  uploadFile: (file: File, type: string) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  uploadMultiple: (files: File[], type: string) => {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))
    formData.append("type", type)
    return api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}

export const authService = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (userData: any) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data: any) => api.post("/auth/profile", data),
}

export const statisticsService = {
  getJournalStatistics: () => api.get<JournalStatistics>("/statistics/journal"),
}
