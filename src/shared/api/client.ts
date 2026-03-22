export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL ?? ''
  const response = await fetch(`${baseUrl}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = await response.json()
      if (typeof body?.message === 'string') {
        message = body.message
      } else if (typeof body?.error === 'string') {
        message = body.error
      }
    } catch {
      // keep statusText as message
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}
