import { useState } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useApp } from '../../context/appContext'

interface AppLayoutProps {
  children: ReactNode
}

function routeKey(routeName: string): string {
  // Recreate the key whenever the route changes, so the shell remounts and
  // any transient UI state (e.g. the mobile drawer) resets naturally.
  return routeName
}

export function AppLayout({ children }: AppLayoutProps) {
  const { route } = useApp()
  return <AppShell key={routeKey(route.name)}>{children}</AppShell>
}

function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="app-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}