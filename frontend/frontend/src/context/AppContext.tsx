import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Task, ToastItem, ToastType, UserProfile } from '../types'
import { AppContext } from './appContext'


export function AppProvider({ children }: { children: ReactNode }) {
  const API_URL = import.meta.env.VITE_API_URL
  const [route, setRoute] = useState<Route>({ name: 'login' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [apiError, setAPIError] = useState("")
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastIdRef = useRef(0)
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null)

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // Keep at most 4 visible; splice from the front.
    setToasts((prev) => [...prev.slice(-3), { id: ++toastIdRef.current, message, type }])
  }, [])

  // useEffect(() => {

  //   fetchTask()
  //   // const timer = window.setTimeout(() => setLoading(false), 500)
  //   // return () => window.clearTimeout(timer)

  // }, [])



  useEffect(() => {
    if (getToken() !== null) {
      setIsAuthenticated(true)
      setRoute({ name: 'dashboard' })
      getUserData()
      fetchTask()
    }
  }, [])


  const handleUnauthorized = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    setRoute({ name: 'login' })
    showToast('Session expired. Please login again.', 'error')
  }

  const clearErrorState = () => {
    setAPIError("")
  }

  const getToken = () => {
    return localStorage.getItem('access_token')
  }



  const createTask = async (values: Partial<Task>) => {

    try {
      clearErrorState()
      setLoading(true)
      let response = await fetch(`${API_URL}/tasks/`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`

          },
          method: 'POST',
          body: JSON.stringify(values)
        })
      if (response.ok) {

        await response.json()
        await fetchTask()
        showToast('Task created successfully', 'success')
        setTimeout(() => {
          setRoute({ name: 'tasks' })
        }, 2000)


      }
      if (response.status === 401) {
        handleUnauthorized()
        return
      }
      if (response.ok === false) {
        setAPIError(`Request failed ${response.status}`)
        throw new Error(`Request failed ${response.status}`)
      }
    }
    catch (err) {


      console.log(err)
    }
    finally {
      setTimeout(() => {
        setLoading(false)

      }, 1000)
    }

  }

  const deleteTaskFetch = async (id: number) => {

    try {
      clearErrorState()
      setLoading(true)
      let response = await fetch(`${API_URL}/tasks/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          method: 'DELETE',
        })
      if (response.ok) {

        await response.json()
        await fetchTask()
        showToast('Task deleted successfully', 'success')

      }
      if (response.status === 401) {
        handleUnauthorized()
        return
      }
      if (response.ok === false) {
        setAPIError(`Request failed ${response.status}`)
        showToast('unable to delete', 'error')
        throw new Error(`Request failed ${response.status}`)
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setTimeout(() => {
        setLoading(false)

      }, 1000)
    }

  }


  const fetchTask = async () => {
    try {
      clearErrorState()
      setLoading(true)
      let response = await fetch(`${API_URL}/tasks/`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`


        }
      })
      if (response.ok) {


        let data = await response.json()
        setTasks(data)
      }
      if (response.status === 401) {
        handleUnauthorized()
        return
      }
      if (response.ok === false) {
        setAPIError(`Request failed ${response.status}`)

        throw new Error(`Request failed ${response.status}`)
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setTimeout(() => {
        setLoading(false)

      }, 1000)
    }
  }


  const editTaskFetch = async (id: number, values: Partial<Task>) => {
    try {
      clearErrorState()
      setLoading(true)
      let response = await fetch(`${API_URL}/tasks/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`

          },
          method: 'PATCH',
          body: JSON.stringify(values)
        })
      if (response.ok) {

        await response.json()
        await fetchTask()
        showToast('Task updated successfully', 'success')
        setTimeout(() => {
          setRoute({ name: 'task-detail', taskId: id })
        }, 2000)

      }
      if (response.status === 401) {
        handleUnauthorized()
        return
      }
      if (response.ok === false) {
        setAPIError(`Request failed ${response.status}`)
        throw new Error(`Request failed ${response.status}`)
      }
    }
    catch (err) {

      console.log(err, "Error")
    }
    finally {
      setTimeout(() => {
        setLoading(false)

      }, 1000)
    }

  }

  const loginUser = async (email: string, password: string) => {

    const details = { email, password }
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(details),

      })

      if (response.status == 401) {

        showToast("Unauthorized! please enter correct email and password", "error")
      }

      if (!response.ok) {
        throw new Error
      }
      else {
        const data = await response.json()
        const access_token = data.access_token
        const userData = data.userDetails

        setUserDetails(userData)
        console.log(access_token)

        localStorage.setItem('access_token', access_token);
        setIsAuthenticated(true)
        setRoute({ name: 'dashboard' })
        fetchTask()

      }

    }
    catch (err) {
      console.log(err)
    }

  }


  const signUp = async (name: string, email: string, password: string) => {

    const details = { name, email, password }
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(details),

      })

      if (response.status == 409) {

        showToast("User Already registered! Please signup with new email id", "error")
      }

      if (!response.ok) {
        throw new Error
      }
      else {

        showToast("Signup Successfull! ", "success")
        loginUser(email, password)


      }

    }
    catch (err) {

      console.log(err)
    }


  }

  const getUserData = async () => {
    const access_token = getToken()
    if (access_token) {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${access_token}`
          },

        })

       if (response.status === 401) {
        handleUnauthorized()
        return
      }

       if (response.ok === false) {
        setAPIError(`Request failed ${response.status}`)

        throw new Error(`Request failed ${response.status}`)
      }
        else {
          const user = await response.json()
          console.log(user)
          setUserDetails(user)
        }

      }
      catch (err) {
        console.log(err)
      }
    }
  }


  // ── Mock "auth". Replace with your real login/logout implementation. ──────
  const login = useCallback((email: string, password: string) => {

    loginUser(email, password)
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setRoute({ name: 'login' })
    showToast("Hope you visit again!", "success")
    localStorage.removeItem('access_token')
  }, [])


  //Edit or Create
  const saveTask = useCallback(async (taskId: number | null, values: {
    title: string
    description: string
    status: Task['status']
    priority: Task['priority']
  }) => {
    console.log(taskId, "Hello")
    if (taskId == null) {
      await createTask(values)
    }
    else {
      await editTaskFetch(taskId, values)


    }

  }, [])

  const deleteTask = useCallback((taskId: number) => {
    deleteTaskFetch(taskId)
  }, [])

  // const addComment = 
  // useCallback((taskId: number, content: string) => {
  //   setTasks((prev) =>
  //     prev.map((task) => {
  //       if (task.id !== taskId) return task
  //       return {
  //         ...task,
  //         updatedAt: new Date().toISOString(),
  //         comments: [
  //           ...task?.comments,
  //           {
  //             id: `local-${Date.now()}`,
  //             author: currentUser.name,
  //             role: currentUser.role,
  //             content,
  //             createdAt: new Date().toISOString(),
  //           },
  //         ],
  //       }
  //     }),
  //   )
  // }, [])

  const addComment = () => { }




  return (
    <AppContext.Provider
      value={{
        route,
        navigate: setRoute,
        isAuthenticated,
        signUp,
        login,
        logout,
        user: userDetails,
        tasks,
        addComment,
        saveTask,
        loading,
        deleteTask,
        apiError,
        clearErrorState,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  )
}