import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Task, ToastItem, ToastType } from '../types'
import { currentUser } from '../data/mockData'
import { AppContext } from './appContext'


export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'login' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading,setLoading] = useState(false)
  const [apiError,setAPIError] = useState("")
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastIdRef = useRef(0)

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // Keep at most 4 visible; splice from the front.
    setToasts((prev) => [...prev.slice(-3), { id: ++toastIdRef.current, message, type }])
  }, [])

  useEffect(() => {
  
    fetchTask()
    // const timer = window.setTimeout(() => setLoading(false), 500)
    // return () => window.clearTimeout(timer)

  }, [])

  useEffect(()=>{

  },[tasks])


  const clearErrorState = ()=>{
    setAPIError("")
  }

   const createTask = async (values : Partial<Task>)=>
    {
  
      try
      {
      clearErrorState()
      setLoading(true)
    let response = await fetch('http://localhost:3000/tasks/', 
      {
         headers: {
        'Content-Type': 'application/json' 
      },
      method : 'POST',
      body: JSON.stringify(values)
    })
      if(response.ok)
      {
  
         await response.json()
         await fetchTask()
         showToast('Task created successfully', 'success')
         setTimeout(() => {
           setRoute({ name: 'tasks' })
         }, 2000)


      }
      if(response.ok===false)
      {
         setAPIError(`Request failed ${response.status}`)
        throw new Error(`Request failed ${response.status}`)
      }
      }
      catch(err) 
      {


         console.log(err)
      }
       finally
      {
setTimeout(()=>{
        setLoading(false)

        },1000)      }
  
    }

      const deleteTaskFetch = async (id : number)=>
    {
  
      try
      {
      clearErrorState()
      setLoading(true)
    let response = await fetch(`http://localhost:3000/tasks/${id}`, 
      {
         headers: {
        'Content-Type': 'application/json' 
      },
      method : 'DELETE',
    })
      if(response.ok)
      {
  
         await response.json()
         await fetchTask()
         showToast('Task deleted successfully', 'success')
         
      }
      if(response.ok===false)
      {
        setAPIError(`Request failed ${response.status}`)
        showToast('unable to delete', 'error')
        throw new Error(`Request failed ${response.status}`)
      }
      }
      catch(err) 
      {
         console.log(err)
      }
       finally
      {
setTimeout(()=>{
        setLoading(false)

        },1000)      }
  
    }


    const fetchTask  = async()=>{
       try
      {
      clearErrorState()
      setLoading(true)
    let response = await fetch('http://localhost:3000/tasks/')
      if(response.ok)
      {
  
  
         let data = await response.json()
         setTasks(data)
      }
      if(response.ok===false)
      {
        setAPIError(`Request failed ${response.status}`)

        throw new Error(`Request failed ${response.status}`)
      }
      }
      catch(err) 
      {
         console.log(err)
      }
      finally
      {
        setTimeout(()=>{
        setLoading(false)

        },1000)
      }
    }


    const editTaskFetch = async (id : number ,values : Partial<Task>)=>{
       try
      {
      clearErrorState()
      setLoading(true)
    let response = await fetch(`http://localhost:3000/tasks/${id}`, 
      {
         headers: {
        'Content-Type': 'application/json' 
      },
      method : 'PATCH',
      body: JSON.stringify(values)
    })  
      if(response.ok)
      {
  
         await response.json()
         await fetchTask()
        showToast('Task updated successfully', 'success')
        setTimeout(() => {
          setRoute({ name: 'task-detail', taskId: id })
        }, 2000)

      }
      if(response.ok===false)
      {
        setAPIError(`Request failed ${response.status}`)
        throw new Error(`Request failed ${response.status}`)
      }
      }
      catch(err) 
      {

         console.log(err,"Error")
      }
       finally
      {
setTimeout(()=>{
        setLoading(false)

        },1000)
      }
  
    }
  // ── Mock "auth". Replace with your real login/logout implementation. ──────
  const login = useCallback(() => {
    setIsAuthenticated(true)
    setRoute({ name: 'dashboard' })
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setRoute({ name: 'login' })
  }, [])

  
  //Edit or Create
  const saveTask = useCallback(async (taskId: number | null, values: {
    title: string
    description: string
    status: Task['status']
    priority: Task['priority']
  }) => {
console.log(taskId ,"Hello")
    if(taskId==null)
    { 
     await createTask(values)
    }
    else
    {
     await editTaskFetch(taskId,values)
      

    }
   
  }, [])

  const deleteTask = useCallback((taskId: number) => {
    deleteTaskFetch(taskId)
  }, [])

  const addComment = useCallback((taskId: number, content: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          updatedAt: new Date().toISOString(),
          comments: [
            ...task?.comments,
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