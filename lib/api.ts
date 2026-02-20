import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Normalize: strip trailing slash, then append /api/v1 if not already present
const normalizedBase = API_BASE_URL.replace(/\/$/, '')
export const API_URL = normalizedBase.endsWith('/api/v1') ? normalizedBase : `${normalizedBase}/api/v1`

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS requests
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
      // Only clear auth on 401 if it's not a profile validation request
      const isProfileRequest = error.config?.url?.includes('/auth/profile')
      if (!isProfileRequest) {
        console.log('❌ 401 error on non-profile request, clearing auth')
        try {
          window.dispatchEvent(new Event('auth-unauthorized'))
        } catch {}
      }
    }
    return Promise.reject(error)
  },
)

// API Types
export type ArticleStatus = "draft" | "submitted" | "under_review" | "revision_requested" | "accepted" | "published" | "rejected"
export type VolumeStatus = "draft" | "in_progress" | "published" | "archived"

export interface Volume {
  _id: string
  volume: number
  issue?: number
  year: number
  title: string
  description?: string
  status: VolumeStatus
  coverImage?: string
  publishDate?: Date
  doi?: string
  pages?: string
  articles?: string[]  // Array of article IDs
  editor?: string     // Editor user ID
  issn?: string
  isbn?: string
  featured?: boolean
  downloadCount?: number
  viewCount?: number
  // Computed fields (added by backend)
  totalArticles?: number
  totalPages?: number
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
  pages?: string  // Page range as string (e.g., "123-145")
  submissionDate: Date
  publishedDate?: Date
  status: ArticleStatus
  files: ArticleFile[]
  volume: Volume | string  // Can be populated object or just ID
  issue?: number  // Issue number
  articleNumber?: string
  manuscriptFile?: UploadResult
  supplementaryFiles?: UploadResult[]
  viewCount?: number
  downloadCount?: number
  content?: string
  references?: string[]
  funding?: string
  acknowledgments?: string
  conflictOfInterest?: string
  featured?: boolean
  type?: string
  categories?: string[]
}

export interface Author {
  title?: string
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

export interface UploadResult {
  publicId: string
  url: string
  secureUrl: string
  format: string
  bytes: number
  width?: number
  height?: number
  originalName?: string
  mimeType?: string
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
  totalVolumes: number
  totalUsers: number
}

// Create Volume DTO interface to match backend exactly
export interface CreateVolumeDto {
  volume: number
  issue?: number
  year: number
  title: string
  description?: string
  status: VolumeStatus
  coverImage?: string
  publishDate?: string
  doi?: string
  pages?: string
  editor?: string
  issn?: string
  isbn?: string
  featured?: boolean
}

// API Services
export const volumeService = {
  getAll: () => api.get<Volume[]>("/volumes"),
  getById: (id: string) => api.get<Volume>(`/volumes/${id}`),
  create: (data: CreateVolumeDto) => api.post<Volume>("/volumes", data),
  update: (id: string, data: Partial<Volume>) => api.patch<Volume>(`/volumes/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch<Volume>(`/volumes/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/volumes/${id}`),
  getCurrent: () => api.get<Volume>("/volumes/current"),
  getRecent: (limit = 4) => api.get<Volume[]>(`/volumes/recent?limit=${limit}`),
  assignArticles: (id: string, articleIds: string[]) => api.post(`/volumes/${id}/articles`, { articleIds }),
  removeArticle: (id: string, articleId: string) => api.delete(`/volumes/${id}/articles/${articleId}`),
  getArticles: (id: string) => api.get(`/volumes/${id}/articles`),
}

export const articleService = {
  getAll: () => api.get<Article[]>("/articles"),
  getById: (id: string) => api.get<Article>(`/articles/${id}`),
  getByVolume: (volumeNumber: number) => api.get<Article[]>(`/articles/volume/${volumeNumber}`),
  getByVolumeAndArticleNumber: (volumeNumber: number, articleNumber: string) => 
    api.get<Article>(`/articles/volume/${volumeNumber}/article/${articleNumber}`),
  getFeatured: (limit = 6) => api.get<Article[]>(`/articles/featured?limit=${limit}`),
  create: (data: Partial<Article>) => api.post<Article>("/articles", data),
  update: (id: string, data: Partial<Article>) => api.patch<Article>(`/articles/${id}`, data),
  updateArticleNumber: (id: string, articleNumber: string) => 
    api.patch<Article>(`/articles/${id}/article-number`, { articleNumber }),
  delete: (id: string) => api.delete(`/articles/${id}`),
}

export const newsService = {
  getAll: () => api.get<NewsItem[]>("/news"),
  getById: (id: string) => api.get<NewsItem>(`/news/${id}`),
  getFeatured: (limit = 5) => api.get<NewsItem[]>(`/news/featured?limit=${limit}`),
  create: (data: Partial<NewsItem>) => api.post<NewsItem>("/news", data),
  update: (id: string, data: Partial<NewsItem>) => api.patch<NewsItem>(`/news/${id}`, data),
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
  extractMetadata: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return api.post("/upload/extract-metadata", formData, {
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

export const announcementService = {
  getAll: () => api.get("/announcements"),
  getById: (id: string) => api.get(`/announcements/${id}`),
  create: (data: any) => api.post("/announcements", data),
  update: (id: string, data: any) => api.patch(`/announcements/${id}`, data),
  delete: (id: string) => api.delete(`/announcements/${id}`),
}

export const editorialDecisionService = {
  create: (data: any) => api.post("/editorial-decisions", data),
  getById: (id: string) => api.get(`/editorial-decisions/${id}`),
  getByArticle: (articleId: string) => api.get(`/editorial-decisions/article/${articleId}`),
}

export const settingsService = {
  getAll: () => api.get("/settings"),
  getPublic: () => api.get("/settings/public"),
  update: (settings: Record<string, any>) => api.put("/settings", { settings }),
}



export const adminArticleService = {
  getAll: () => api.get<Article[]>("/admin/articles"),
  getById: (id: string) => api.get<Article>(`/admin/articles/${id}`),
  update: (id: string, data: FormData | Partial<Article>) => {
    const config: AxiosRequestConfig = data instanceof FormData 
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {}
    return api.patch<Article>(`/admin/articles/${id}`, data, config)
  },
  replaceManuscript: (id: string, file: File) => {
    const formData = new FormData()
    formData.append("manuscript", file)
    return api.post<Article>(`/admin/articles/${id}/manuscript`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  addSupplementaryFiles: (id: string, files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append("supplementary", file))
    return api.post<Article>(`/admin/articles/${id}/supplementary`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  removeSupplementaryFile: (id: string, fileIndex: number) => 
    api.delete(`/admin/articles/${id}/supplementary/${fileIndex}`),
  delete: (id: string) => api.delete(`/admin/articles/${id}`),
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  affiliation?: string
  department?: string
  orcidId?: string
  bio?: string
  specializations?: string[]
  profileImage?: UploadResult
  lastLogin?: Date
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UsersListResponse {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const userService = {
  getAll: (params?: { page?: number; limit?: number; role?: string; search?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.role) queryParams.append('role', params.role)
    if (params?.search) queryParams.append('search', params.search)
    return api.get<UsersListResponse>(`/users?${queryParams.toString()}`)
  },
  getById: (id: string) => api.get<User>(`/users/${id}`),
  getReviewers: () => api.get<User[]>('/users/reviewers'),
  create: (data: Partial<User>) => api.post<User>("/users", data),
  update: (id: string, data: Partial<User>) => api.patch<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}
