import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Task } from '../types'
import { currentUser } from '../data/mockData'
import { AppContext } from './appContext'


export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'login' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading,setLoading] = useState(false)

  



  useEffect(() => {
  
    fetchTask()
    // const timer = window.setTimeout(() => setLoading(false), 500)
    // return () => window.clearTimeout(timer)

  }, [])

  useEffect(()=>{

  },[tasks])

   const createTask = async (values : Partial<Task>)=>
    {
  
      try
      {
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

      }
      }
      catch(err) 
      {
         
         console.log(err)
      }
       finally
      {
        setLoading(false)
      }
  
    }

      const deleteTaskFetch = async (id : number)=>
    {
  
      try
      {
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

      }
      }
      catch(err) 
      {
         console.log(err)
      }
       finally
      {
        setLoading(false)
      }
  
    }


    const fetchTask  = async()=>{
       try
      {
      setLoading(true)
    let response = await fetch('http://localhost:3000/tasks/')
      if(response.ok)
      {
  
  
         let data = await response.json()
         setTasks(data)
      }
      }
      catch(err) 
      {
         console.log(err)
      }
      finally
      {
        setLoading(false)
      }
    }


    const editTaskFetch = async (id : number ,values : Partial<Task>)=>{
       try
      {
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
      }
      }
      catch(err) 
      {
         console.log(err)
      }
       finally
      {
        setLoading(false)
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
      setRoute({ name: 'tasks' })

    }
    else
    {
     await editTaskFetch(taskId,values)

      
    setRoute({ name: 'task-detail',taskId })

      

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
      }}
    >
      {children}
    </AppContext.Provider>
  )
}