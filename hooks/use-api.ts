import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { volumeService, articleService, newsService, type Volume, type Article, type NewsItem, type CreateVolumeDto } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

// Volume hooks
export const useVolumes = () => {
  return useQuery({
    queryKey: ["volumes"],
    queryFn: () => volumeService.getAll().then((res) => res.data),
  })
}

export const useCurrentVolume = () => {
  return useQuery({
    queryKey: ["volumes", "current"],
    queryFn: () => volumeService.getCurrent().then((res) => res.data),
  })
}

export const useRecentVolumes = (limit = 4) => {
  return useQuery({
    queryKey: ["volumes", "recent", limit],
    queryFn: () => volumeService.getRecent(limit).then((res) => res.data),
  })
}

export const useCreateVolume = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVolumeDto) => volumeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volumes"] })
      queryClient.invalidateQueries({ queryKey: ["volumes", "current"] })
      queryClient.invalidateQueries({ queryKey: ["volumes", "recent"] })
      toast({ title: "Volume created successfully" })
    },
    onError: () => {
      toast({ title: "Failed to create volume", variant: "destructive" })
    },
  })
}

export const useUpdateVolume = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Volume> }) => volumeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volumes"] })
      queryClient.invalidateQueries({ queryKey: ["volumes", "current"] })
      queryClient.invalidateQueries({ queryKey: ["volumes", "recent"] })
      toast({ title: "Volume updated successfully" })
    },
    onError: () => {
      toast({ title: "Failed to update volume", variant: "destructive" })
    },
  })
}

// Article hooks
export const useFeaturedArticles = (limit = 6) => {
  return useQuery({
    queryKey: ["articles", "featured", limit],
    queryFn: () => articleService.getFeatured(limit).then((res) => res.data),
  })
}

export const useArticlesByVolume = (volumeId: string) => {
  return useQuery({
    queryKey: ["articles", "volume", volumeId],
    queryFn: () => articleService.getByVolume(parseInt(volumeId)).then((res) => res.data),
    enabled: !!volumeId,
  })
}

export const useCreateArticle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Article>) => articleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      queryClient.invalidateQueries({ queryKey: ["articles", "featured"] })
      toast({ title: "Article created successfully" })
    },
    onError: () => {
      toast({ title: "Failed to create article", variant: "destructive" })
    },
  })
}

export const useAssignArticles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ volumeId, articleIds }: { volumeId: string; articleIds: string[] }) => 
      volumeService.assignArticles(volumeId, articleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volumes"] })
      queryClient.invalidateQueries({ queryKey: ["volumes", "current"] })
      queryClient.invalidateQueries({ queryKey: ["volumes", "recent"] })
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      queryClient.invalidateQueries({ queryKey: ["articles", "featured"] })
      toast({ title: "Articles assigned successfully" })
    },
    onError: () => {
      toast({ title: "Failed to assign articles", variant: "destructive" })
    },
  })
}

// News hooks
export const useFeaturedNews = (limit = 5) => {
  return useQuery({
    queryKey: ["news", "featured", limit],
    queryFn: () => newsService.getFeatured(limit).then((res) => res.data),
  })
}

export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => newsService.getAll().then((res) => res.data),
  })
}

export const useCreateNews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<NewsItem>) => newsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] })
      toast({ title: "News item created successfully" })
    },
    onError: () => {
      toast({ title: "Failed to create news item", variant: "destructive" })
    },
  })
}

export const useUpdateNews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsItem> }) => newsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] })
      toast({ title: "News item updated successfully" })
    },
    onError: () => {
      toast({ title: "Failed to update news item", variant: "destructive" })
    },
  })
}

// Generic API hook
export const useApi = <T = any>(endpoint: string, options?: any) => {
  return useQuery<T>({
    queryKey: [endpoint],
    queryFn: () => api.get(endpoint).then((res) => res.data),
    enabled: !!endpoint && endpoint.trim() !== '',
    ...options,
  })
}
