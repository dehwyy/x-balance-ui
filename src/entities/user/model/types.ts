export interface User {
  id: string
  name: string
  overdraftLimit: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export function isDeleted(user: User): boolean {
  return !!user.deletedAt
}
