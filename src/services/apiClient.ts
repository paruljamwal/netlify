import { API_BASE_URL } from '@/constants'

/** Thin fetch wrapper — add auth headers, error handling, and retries here */
export async function apiClient<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, init)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json() as Promise<T>
}
