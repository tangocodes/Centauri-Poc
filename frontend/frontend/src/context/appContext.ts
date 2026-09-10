import { createContext, useContext } from 'react'
import type { Route, Task, UserProfile } from '../types'

export interface AppContextValue {
  route: Route
  navigate: (route: Route) => void
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  user: UserProfile
  tasks: Task[]
  /** LOCAL-ONLY placeholder for the add-comment UI. Replace with API later. */
  addComment: (taskId: string, content: string) => void
  /** LOCAL-ONLY placeholder hook point for create/edit forms. */
  saveTask: (taskId: string | null, values: {
    title: string
    description: string
    status: Task['status']
    priority: Task['priority']
  }) => void
  /** LOCAL-ONLY placeholder for the delete action. */
  deleteTask: (taskId: string) => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within an <AppProvider>')
  }
  return ctx
}