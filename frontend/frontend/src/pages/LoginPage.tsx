import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input, Checkbox, FormField } from '../components/ui/Input'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/layout/Sidebar'
import { useApp } from '../context/appContext'

interface LoginErrors {
  email?: string
  password?: string
}

export function LoginPage() {
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  const validate = (): boolean => {
    const nextErrors: LoginErrors = {}
    const trimmed = email.trim()

    if (trimmed === '') {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (password === '') {
      nextErrors.password = 'Password is required'
    } else if (password.length < 3) {
      nextErrors.password = 'Password must be at least 3 characters'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = () => {
    // TODO: replace with real authentication (NestJS API).
    if (!validate()) return
    login(email,password)


  }

  return (
    <div className="login-page">
      <aside className="login-brand desktop-only">
        <div className="login-brand-inner">
          <Logo />
          <h1 className="login-brand-title">
            Keep every task in view, from kickoff to completion.
          </h1>
          <p className="login-brand-subtitle">
            A clean, collaborative workspace for your team’s work — tracking,
            prioritizing, and shipping tasks has never felt this easy.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <span className="login-feature-icon">
                <Icon name="checkCircle" size={18} />
              </span>
              Track progress with live status and priorities
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">
                <Icon name="users" size={18} />
              </span>
              Collaborate with comments on every task
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">
                <Icon name="trendUp" size={18} />
              </span>
              Measure velocity with dashboard statistics
            </div>
          </div>
        </div>
      </aside>

      <main className="login-form">
        <div className="login-form-inner">
          <div className="mobile-brand mobile-only">
            <Logo />
          </div>

          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-subtitle">
            Sign in to your account to continue
          </p>

          <form
            className="login-fields"
            onSubmit={(event) => {
              event.preventDefault()
              handleSubmit()
            }}
            noValidate
          >
            <FormField label="Email address" htmlFor="login-email" required error={errors.email}>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                invalid={Boolean(errors.email)}
                autoComplete="email"
                icon={<Icon name="mail" size={16} />}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="login-password"
              required
              error={errors.password}
            >
              <div className="password-input">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  invalid={Boolean(errors.password)}
                  autoComplete="current-password"
                  icon={<Icon name="lock" size={16} />}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                 {showPassword ?<Icon name="eye" size={17} /> : <Icon name="logout" size={17} /> } 
                </button>
              </div>
            </FormField>

            <div className="login-options">
              <Checkbox
                label="Remember me"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <button type="button" className="link-btn">
                New User?
              </button>
            </div>

            <Button type="submit" size="lg" className="login-submit">
              Log in
            </Button>
          </form>

          {/* <p className="login-demo-hint">
            Demo mode — enter any credentials to continue.
          </p> */}
        </div>
      </main>
    </div>
  )
}