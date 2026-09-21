import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Input, FormField } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { Avatar } from '../components/ui/Avatar'
import { useApp } from '../context/appContext'
import { formatDate } from '../lib/format'

// const TIMEZONES = [
//   { value: 'America/New_York (UTC-05:00)', label: 'America/New_York (UTC-05:00)' },
//   { value: 'Europe/London (UTC+00:00)', label: 'Europe/London (UTC+00:00)' },
//   { value: 'Europe/Berlin (UTC+01:00)', label: 'Europe/Berlin (UTC+01:00)' },
//   { value: 'Asia/Singapore (UTC+08:00)', label: 'Asia/Singapore (UTC+08:00)' },
// ]

export function ProfilePage() {
  const { user, logout } = useApp()

  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [role, setRole] = useState(user?.role)
  const [department, setDepartment] = useState(user?.department)
  // const [timezone, setTimezone] = useState(user.timezone)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [taskReminders, setTaskReminders] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [mentionAlerts, setMentionAlerts] = useState(true)

  const save = () => {
    // TODO: replace with a real update-profile API call.
    console.info('[POC] saveProfile placeholder — wire to API here.', {
      name,
      email,
      role,
      department,
    })
  }

  return (
    <div className="page-stack">
      <div className="card profile-card">
        <div className="profile-head">
         {user &&  <Avatar name={user?.name} color="#2563eb" size="lg" />}
          <div className="profile-head-info">
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-role">{user?.role} · {user?.department}</p>
            <p className="profile-email">{user?.email}</p>
            <p className="profile-bio">{user?.bio}</p>
          </div>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <Icon name="briefcase" size={15} />
            <span>{user?.department} team</span>
          </div>
          <div className="profile-stat">
            <Icon name="calendar" size={15} />
            {user &&<span>Joined {formatDate(user.joinedAt)}</span>}
          </div>
          {/* <div className="profile-stat">
            <Icon name="clock" size={15} />
            <span>{user.timezone}</span>
          </div> */}
        </div>
      </div>

      <div className="card form-card">
        <div className="settings-section-head">
          <h3 className="card-title">Account information</h3>
          <p className="card-subtitle">Update your basic profile details.</p>
        </div>

        <div className="form-grid">
          <FormField label="Full name" htmlFor="profile-name">
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FormField>
          <FormField label="Email address" htmlFor="profile-email">
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled
            />
          </FormField>
          <FormField label="Job title" htmlFor="profile-role">
            <Input
              id="profile-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
          </FormField>
          <FormField label="Department" htmlFor="profile-department">
            <Input
              id="profile-department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            />
          </FormField>
          {/* <FormField label="Timezone" htmlFor="profile-timezone">
            <Select
              id="profile-timezone"
              value={timezone}
              options={TIMEZONES}
              onChange={(event) => setTimezone(event.target.value)}
            />
          </FormField> */}
        </div>

        <div className="form-actions">
          <Button onClick={save}>Save changes</Button>
        </div>
      </div>

      <div className="card form-card">
        <div className="settings-section-head">
          <h3 className="card-title">Notifications</h3>
          <p className="card-subtitle">Choose what you want to be notified about.</p>
        </div>

        <div className="toggle-list">
          <Toggle
            label="Email notifications"
            description="Receive task updates in your inbox."
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
          <Toggle
            label="Task reminders"
            description="Remind me before tasks are due."
            checked={taskReminders}
            onChange={setTaskReminders}
          />
          <Toggle
            label="Weekly digest"
            description="A summary of your team’s activity every Monday."
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
          <Toggle
            label="Mention alerts"
            description="Notify me when someone mentions me in a comment."
            checked={mentionAlerts}
            onChange={setMentionAlerts}
          />
        </div>
      </div>

      <div className="card form-card danger-zone">
        <div className="settings-section-head">
          <h3 className="card-title">Session</h3>
          <p className="card-subtitle">End your current session on this device.</p>
        </div>
        <Button variant="danger" onClick={logout} icon={<Icon name="logout" size={16} />}>
          Log out
        </Button>
      </div>
    </div>
  )
}