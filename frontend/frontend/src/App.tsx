import { AppProvider } from './context/AppContext'
import { useApp } from './context/appContext'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TasksPage } from './pages/TasksPage'
import { TaskCreatePage } from './pages/TaskCreatePage'
import { TaskEditPage } from './pages/TaskEditPage'
import { TaskDetailPage } from './pages/TaskDetailPage'
import { ProfilePage } from './pages/ProfilePage'

function Router() {
  const { route, isAuthenticated } = useApp()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  switch (route.name) {
    case 'dashboard':
      return (
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      )
    case 'tasks':
      return (
        <AppLayout>
          <TasksPage />
        </AppLayout>
      )
    case 'create-task':
      return (
        <AppLayout>
          <TaskCreatePage />
        </AppLayout>
      )
    case 'edit-task':
      return (
        <AppLayout>
          <TaskEditPage taskId={route.taskId} />
        </AppLayout>
      )
    case 'task-detail':
      return (
        <AppLayout>
          <TaskDetailPage taskId={route.taskId} />
        </AppLayout>
      )
    case 'profile':
      return (
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      )
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
