import { createContext, useContext } from 'react'
import type { AllUsers, Route, Task, ToastItem, ToastType, UpdateUserProfile, UserProfile } from '../types'

export interface AppContextValue {
  route: Route
  navigate: (route: Route) => void
  isAuthenticated: boolean
  login: (email: string , password:string) => void
  signUp: (name: string , email: string , password:string) => void
  logout: () => void
  user: UserProfile | null
  allUsers : AllUsers[] | null
  tasks: Task[]
  /** LOCAL-ONLY placeholder for the add-comment UI. Replace with API later. */
  addComment: (taskId: number, content: string) => void
  /** LOCAL-ONLY placeholder hook point for create/edit forms. */
  saveTask: (taskId: number | null, values: {
    title: string
    description: string
    status: Task['status']
    priority: Task['priority']
    assignedToId: string | undefined
    createdById : string | undefined
  }) => void
  loading : boolean, 
  apiError : string,
  clearErrorState : () => void

  /** Toast notifications — call showToast from anywhere via useApp(). */
  toasts: ToastItem[]
  showToast: (message: string, type?: ToastType) => void
  dismissToast: (id: number) => void

  /** LOCAL-ONLY placeholder for the delete action. */
  deleteTask: (taskId: number) => void
  updateUserDetails : (user : UpdateUserProfile) => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within an <AppProvider>')
  }
  return ctx
}