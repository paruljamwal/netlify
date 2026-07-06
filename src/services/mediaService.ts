import { ENDPOINTS } from '@/constants'
import { apiClient } from './apiClient'

/** Domain-specific API calls — one service per resource (media, user, etc.) */
export const mediaService = {
  getTrending: () => apiClient(ENDPOINTS.TRENDING),
  search: (query: string) => apiClient(`${ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`),
  getDetail: (id: string) => apiClient(ENDPOINTS.DETAIL(id)),
}
