import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { IconButton } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { useApp } from '../../context/appContext'
import type { Route } from '../../types'
import { avatarColor } from '../../lib/format'

const PAGE_TITLES: Partial<Record<Route['name'], string>> = {
  dashboard: 'Dashboard',
  tasks: 'All Tasks',
  'create-task': 'New Task',
  'edit-task': 'Edit Task',
  'task-detail': 'Task Details',
  profile: 'Settings',
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { route, user, navigate, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  const title = PAGE_TITLES[route.name] ?? 'TaskTrack'

  const closeMenu = () => {
    setMenuOpen(false)
    navigate({ name: 'profile' })
  }

  return (
    <header className="header">
      <div className="header-left">
        <IconButton
          label="Open navigation"
          className="header-menu-btn"
          onClick={onMenuClick}
        >
          <Icon name="menu" size={20} />
        </IconButton>
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <IconButton label="Notifications" className="header-bell">
          <Icon name="bell" size={19} />
          <span className="header-bell-dot" aria-hidden="true" />
        </IconButton>

        <div className="header-user">
          <button
            type="button"
            className="header-user-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            {user && <Avatar name={user?.name} color={avatarColor(user?.name)} size="sm" />}
            <span className="header-user-text">
              <span className="header-user-name">{user?.name}</span>
              <span className="header-user-role">{user?.role}</span>
            </span>
            <Icon name="chevronDown" size={16} className="header-user-chevron" />
          </button>

          {menuOpen && (
            <>
              <div className="dropdown-backdrop" onClick={() => setMenuOpen(false)} />
              <div className="dropdown" role="menu">
                <button type="button" role="menuitem" onClick={closeMenu}>
                  <Icon name="user" size={16} />
                  Profile & Settings
                </button>
                <div className="dropdown-divider" />
                <button type="button" role="menuitem" onClick={logout}>
                  <Icon name="logout" size={16} />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}