import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Task } from '../types'
import { currentUser, initialTasks } from '../data/mockData'
import { AppContext } from './appContext'

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'login' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  // ── Mock "auth". Replace with your real login/logout implementation. ──────
  const login = useCallback(() => {
    setIsAuthenticated(true)
    setRoute({ name: 'dashboard' })
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setRoute({ name: 'login' })
  }, [])

  /** Mock mutation — demonstrates the UI only. Your API implementation will
   *  replace these with real create/edit/delete calls. */
  const saveTask = useCallback((taskId: string | null, values: {
    title: string
    description: string
    status: Task['status']
    priority: Task['priority']
  }) => {
    console.info('[POC] saveTask placeholder — wire to API here.', { taskId, values })
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...values,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    console.info('[POC] deleteTask placeholder — wire to API here.', { taskId })
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }, [])

  const addComment = useCallback((taskId: string, content: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          updatedAt: new Date().toISOString(),
          comments: [
            ...task.comments,
            {
              id: `local-${Date.now()}`,
              author: currentUser.name,
              role: currentUser.role,
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        }
      }),
    )
  }, [])

  return (
    <AppContext.Provider
      value={{
        route,
        navigate: setRoute,
        isAuthenticated,
        login,
        logout,
        user: currentUser,
        tasks,
        addComment,
        saveTask,
        deleteTask,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}