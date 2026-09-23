export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'pending'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskComment {
  id: number
  author: string
  role: string
  content: string
  createdAt: string
}

export interface TaskMock {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  createdBy: string
  createdAt: string
  updatedAt: string
  comments: TaskComment[]
}

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt: string
  assignedToId : AllUsers | null
  createdById : AllUsers | null
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  department: string
  bio: string
  joinedAt: string
}


export interface AllUsers {
  id: number
  name: string
  email: string

}

export interface TaskFilters {
  search: string
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
}

export type Route =
  | { name: 'login' }
  | { name: 'dashboard' }
  | { name: 'tasks' }
  | { name: 'create-task' }
  | { name: 'edit-task'; taskId: number }
  | { name: 'task-detail'; taskId: number }
  | { name: 'profile' }

export interface TaskFormValues {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignedToId : string | undefined
  createdById : string | undefined
}

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}