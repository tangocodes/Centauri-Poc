import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { type AllUsers, type Notification, type Route, type Task, type TaskComment, type TaskCommentPost, type TaskFormValues, type ToastItem, type ToastType, type UpdateUserProfile, type UserProfile } from '../types'
import { NOTIFICATION_POLL_MS, deleteNotification, fetchNotifications, markNotificationRead, sortByNewest } from '../lib/notifications'
import { AppContext } from './appContext'
import { apiConstant } from '../api/apiConstants'


export function AppProvider({ children }: { children: ReactNode }) {
  // const API_URL = import.meta.env.VITE_API_URL
  const [route, setRoute] = useState<Route>({ name: 'login' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [comments,setTaskComments] = useState<TaskComment[]>([])
  const [loading, setLoading] = useState(false)
  const [apiError, setAPIError] = useState("")
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastIdRef = useRef(0)
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null)
  const [allUserData, setAllUserData] = useState<AllUsers[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationsError, setNotificationsError] = useState("")

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // Keep at most 4 visible; splice from the front.
    setToasts((prev) => [...prev.slice(-3), { id: ++toastIdRef.current, message, type }])
  }, [])





  useEffect(() => {
    if (getToken() !== null) {
      setIsAuthenticated(true)
      setRoute({ name: 'dashboard' })
      getUserData()
      fetchTask()
      getAllUsers()
    }
  }, [])


  useEffect(()=>{

    fetchTask()

  },[userDetails])


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



  const createTask = async (values : TaskFormValues) => {


    try {

      const payload = {
        ...values,
        createdById:  values.createdById
          ? Number(values.createdById)
          : undefined,
        assignedToId: values.assignedToId
          ? Number(values.assignedToId)
          : undefined,
        lastUpdatedById : values.lastUpdatedById ? Number(values.lastUpdatedById) : undefined
        
      }
      clearErrorState()
      setLoading(true)
      let response = await fetch(apiConstant.TASKS.CREATE_TASK,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`

          },
          method: 'POST',
          body: JSON.stringify(payload)
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
      let response = await fetch(apiConstant.TASKS.DELETE_TASK_BY_ID(id),
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
      let response = await fetch(apiConstant.TASKS.GET_ALL_TASKS, {
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


  const editTaskFetch = async (id: number, values: TaskFormValues) => {
    try {
      const payload = {
        ...values,
        createdById:  values.createdById
          ? Number(values.createdById)
          : undefined,
        assignedToId: values.assignedToId
          ? Number(values.assignedToId)
          : undefined,
        lastUpdatedById : values.lastUpdatedById ? Number(values.lastUpdatedById) : undefined
        
        
      }
      clearErrorState()
      setLoading(true)
      let response = await fetch(apiConstant.TASKS.EDIT_TASK_BY_ID(id),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`

          },
          method: 'PATCH',
          body: JSON.stringify(payload)
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
      const response = await fetch(apiConstant.AUTH.LOGIN_USER, {
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
        localStorage.setItem('access_token', access_token);
        setIsAuthenticated(true)
        setRoute({ name: 'dashboard' })
        fetchTask()
        getAllUsers()

      }

    }
    catch (err) {
      console.log(err)
    }

  }


  const signUp = async (name: string, email: string, password: string) => {

    const details = { name, email, password }
    try {
      const response = await fetch(apiConstant.AUTH.SIGN_UP, {
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
        const response = await fetch(apiConstant.AUTH.GET_USER_DATA, {
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

  const getAllUsers = async () => {

    const access_token = getToken()
    if (access_token) {
      try {
        const response = await fetch(apiConstant.AUTH.GET_ALL_USERS_DATA, {
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
          const users = await response.json()
          setAllUserData(users)

        }

      }
      catch (err) {
        console.log(err)
      }
    }

  }


   const updateUserData = async (values : UpdateUserProfile) => {

    try {

      clearErrorState()
      setLoading(true)
      let response = await fetch(apiConstant.AUTH.UPDATE_USER_DATA,
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
        await getUserData()
        showToast('Updated User Details successfully', 'success')
        // setTimeout(() => {
        //   setRoute({ name: 'tasks' })
        // }, 2000)


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


  const addNewComment = async (values : TaskCommentPost) => {


      try {

      clearErrorState()
      setLoading(true)
      let response = await fetch(apiConstant.COMMENTS.ADD_NEW_COMMENT,
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
        await getTaskComments(values.taskId)
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
      setTimeout(() => 
      {
        setLoading(false)
      }, 1000)
    }

  }


  const getTaskComments = async(taskID: number) =>{
      try {

      clearErrorState()
      setLoading(true)
      let response = await fetch(apiConstant.COMMENTS.GET_COMMENTS_BY_TASKID(taskID),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          method: 'GET',
        })
      if (response.ok) {
       const comments = await response.json()
       setTaskComments(comments)

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
      setTimeout(() => 
      {
        setLoading(false)
      }, 1000)
    }

  }


  /** Pull the signed-in user's notifications from the microservice. */
  const getNotifications = useCallback(async () => {
    const access_token = getToken()
    if (!access_token) return

    setNotificationsLoading(true)
    try {
      const result = await fetchNotifications(access_token)
      if (result.unauthorized) {
        handleUnauthorized()
        return
      }
      if (!result.ok) {
        setNotificationsError(`Request failed ${result.status}`)
        return
      }
      setNotificationsError("")
      setNotifications(sortByNewest(result.data ?? []))
    }
    catch (err) {
      console.log(err)
      setNotificationsError('Could not reach the notification service')
    }
    finally {
      setNotificationsLoading(false)
    }
  }, [])

  const markNotificationAsRead = useCallback(async (id: number) => {
    const access_token = getToken()
    if (!access_token) return

    // Flip locally first so the badge reacts instantly; the next poll reconciles.
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    )
    try {
      const result = await markNotificationRead(access_token, id)
      if (result.unauthorized) {
        handleUnauthorized()
        return
      }
      if (!result.ok) {
        setNotificationsError(`Request failed ${result.status}`)
      }
    }
    catch (err) {
      console.log(err)
      setNotificationsError('Could not update the notification')
    }
  }, [])

  const markAllNotificationsAsRead = useCallback(async () => {
    const access_token = getToken()
    if (!access_token) return

    const unreadIds = notifications
      .filter((item) => !item.isRead)
      .map((item) => item.id)

    if (unreadIds.length === 0) return

    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
    try {
      const results = await Promise.all(
        unreadIds.map((id) => markNotificationRead(access_token, id)),
      )
      if (results.some((result) => result.unauthorized)) {
        handleUnauthorized()
        return
      }
      if (results.some((result) => !result.ok)) {
        setNotificationsError('Some notifications could not be marked as read')
      }
    }
    catch (err) {
      console.log(err)
      setNotificationsError('Could not update the notifications')
    }
  }, [notifications])

  const removeNotification = useCallback(async (id: number) => {
    const access_token = getToken()
    if (!access_token) return

    const previous = notifications
    setNotifications((prev) => prev.filter((item) => item.id !== id))
    try {
      const result = await deleteNotification(access_token, id)
      if (result.unauthorized) {
        handleUnauthorized()
        return
      }
      if (!result.ok) {
        setNotificationsError(`Request failed ${result.status}`)
        setNotifications(previous)
      }
    }
    catch (err) {
      console.log(err)
      setNotificationsError('Could not delete the notification')
      setNotifications(previous)
    }
  }, [notifications])

  // Load once shortly after sign-in, then keep polling so the bell badge stays
  // fresh. The first tick is deferred (0 ms) so the effect body itself never
  // flips state synchronously, which would cascade an extra render.
  useEffect(() => {
    if (!isAuthenticated) return

    let timer = 0
    const load = () => {
      getNotifications()
      timer = window.setTimeout(load, NOTIFICATION_POLL_MS)
    }

    timer = window.setTimeout(load, 0)

    return () => window.clearTimeout(timer)
  }, [isAuthenticated, getNotifications])

  const login = useCallback((email: string, password: string) => {

    loginUser(email, password)
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setRoute({ name: 'login' })
    showToast("Hope you visit again!", "success")
    localStorage.removeItem('access_token')
    setNotifications([])
    setNotificationsError("")
  }, [])





  //Edit or Create
  const saveTask = useCallback(async (taskId: number | null, values: TaskFormValues) => {


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


  const updateUserDetails = (data : UpdateUserProfile)=>{

    updateUserData(data)
  }

  const addComment = 
  useCallback((values : TaskCommentPost) => {
    
    addNewComment(values)

  }, [])

  const getComments = 
  useCallback((taskId : number) => {

    getTaskComments(taskId)
  }, [])





  return (
    <AppContext.Provider
      value={{
        route,
        navigate: setRoute,
        isAuthenticated,
        signUp,
        login,
        logout,
        allUsers: allUserData,
        user: userDetails,
        updateUserDetails,
        tasks,
        getComments,
        addComment,
        taskComments : comments,
        saveTask,
        loading,
        deleteTask,
        apiError,
        clearErrorState,
        toasts,
        showToast,
        dismissToast,
        notifications,
        notificationsLoading,
        notificationsError,
        getNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeNotification
      }}
    >
      {children}
    </AppContext.Provider>
  )
}