import { Icon } from '../ui/Icon'
import { Avatar } from '../ui/Avatar'
import { useApp } from '../../context/appContext'
import type { Route } from '../../types'

interface NavItem {
  route: Route['name']
  label: string
  icon: 'grid' | 'list' | 'settings'
}

const MAIN_NAV: NavItem[] = [
  { route: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { route: 'tasks', label: 'All Tasks', icon: 'list' },
]

const GENERAL_NAV: NavItem[] = [
  { route: 'profile', label: 'Settings', icon: 'settings' },
]

export function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark" aria-hidden="true">
        <Icon name="check" size={18} />
      </span>
      <span className="logo-text">
        TaskTrack
        <span className="logo-sub">for Centauri POC</span>
      </span>
    </span>
  )
}

interface SidebarProps {
  open: boolean
  onNavigate: () => void
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { route, navigate, user, logout } = useApp()

  const isActive = (name: Route['name']) =>
    route.name === name || (name === 'tasks' && route.name === 'task-detail')

  const go = (name: Route['name']) => {
    navigate({ name } as Route)
    onNavigate()
  }

  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <Logo />
        </div>

        <button type="button" className="sidebar-create" onClick={() => go('create-task')}>
          <Icon name="plus" size={16} />
          New Task
        </button>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Main</p>
          {MAIN_NAV.map((item) => (
            <button
              key={item.route}
              type="button"
              className={`sidebar-link ${isActive(item.route) ? 'is-active' : ''}`}
              onClick={() => go(item.route)}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}

          <p className="sidebar-section-label">General</p>
          {GENERAL_NAV.map((item) => (
            <button
              key={item.route}
              type="button"
              className={`sidebar-link ${isActive(item.route) ? 'is-active' : ''}`}
              onClick={() => go(item.route)}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            {user &&<Avatar name={user?.name} color="#2563eb" size="sm" />}
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">{user?.role}</span>
            </div>
            <button
              type="button"
              className="sidebar-logout"
              aria-label="Log out"
              title="Log out"
              onClick={logout}
            >
              <Icon name="logout" size={17} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}