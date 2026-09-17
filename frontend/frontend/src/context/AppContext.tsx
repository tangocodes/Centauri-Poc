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

  // useEffect(() => {
  
  //   fetchTask()
  //   // const timer = window.setTimeout(() => setLoading(false), 500)
  //   // return () => window.clearTimeout(timer)

  // }, [])

  useEffect(()=>{

  },[tasks])


  const handleUnauthorized = () => {
  localStorage.removeItem('access_token')
  setIsAuthenticated(false)
  setRoute({ name: 'login' })
}

  const clearErrorState = ()=>{
    setAPIError("")
  }

  const getToken = ()=>{
   return localStorage.getItem('access_token')
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
        'Content-Type': 'application/json' ,
        'Authorization': `Bearer ${getToken()}`

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
      if(response.status===401)
      {
        handleUnauthorized()
        return
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
        'Content-Type': 'application/json' ,
        'Authorization': `Bearer ${getToken()}`
      },
      method : 'DELETE',
    })
      if(response.ok)
      {
  
         await response.json()
         await fetchTask()
         showToast('Task deleted successfully', 'success')
         
      }
      if(response.status===401)
      {
        handleUnauthorized()
        return
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
    let response = await fetch('http://localhost:3000/tasks/',{
      headers :{
                'Authorization': `Bearer ${getToken()}`


      }
    })
      if(response.ok)
      {
  
  
         let data = await response.json()
         setTasks(data)
      }
       if(response.status===401)
      {
        handleUnauthorized()
        return
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
        'Content-Type': 'application/json' ,
        'Authorization': `Bearer ${getToken()}`

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
       if(response.status===401)
      {
        handleUnauthorized()
        return
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

    const loginUser = async (email : string,password : string)=>{

      const details = {email,password}
      try 
      {
        const response = await fetch('http://localhost:3000/login' , {
           method:"POST",
           headers:{'Content-Type': 'application/json',

           } ,
           body:JSON.stringify(details),
           
        })

        if(response.status==401)
        {

          showToast("Unauthorized! please enter correct email and password","error")
        }

        if(!response.ok)
        {
          throw new Error
        }
        else
        {
          const data = await response.json()
          const access_token = data.access_token

          console.log(access_token)
          
          localStorage.setItem('access_token', access_token);
          setIsAuthenticated(true)
          setRoute({ name: 'dashboard' })
          fetchTask()
           
        }

      }
      catch(err)
      {
           console.log(err)
      }

    }


  // ── Mock "auth". Replace with your real login/logout implementation. ──────
  const login = useCallback((email : string, password : string) => {
    
    loginUser(email,password)
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setRoute({ name: 'login' })
    showToast("Please login again","error")
    localStorage.removeItem('access_token')
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