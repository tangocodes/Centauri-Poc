import { useLayoutEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input, Checkbox, FormField } from '../components/ui/Input'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/layout/Sidebar'
import { useApp } from '../context/appContext'

interface LoginErrors {
  email?: string
  password?: string
}

interface SignupErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

type AuthMode = 'login' | 'signup'

interface AuthTransition {
  prevMode: AuthMode
  nextMode: AuthMode
  phase: 'enter' | 'shrink'
}

/** Keep in sync with the CSS animation durations in index.css. */
const SWITCH_DURATION_MS = 360
const SHRINK_DURATION_MS = 240

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function LoginPage() {
  const { login,signUp } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  /* Signup form state — fields are UI-only so far (no API call) */
  const [name, setName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({})

  /* Mode switching + animated transition */
  const [mode, setMode] = useState<AuthMode>('login')
  const [transition, setTransition] = useState<AuthTransition | null>(null)

  const formsRef = useRef<HTMLDivElement>(null)
  const loginPanelRef = useRef<HTMLDivElement>(null)
  const signupPanelRef = useRef<HTMLDivElement>(null)

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

  const validateSignup = (): boolean => {
    const nextErrors: SignupErrors = {}
    const trimmedName = name.trim()
    const trimmedEmail = signupEmail.trim()

    if (trimmedName === '') {
      nextErrors.name = 'Name is required'
    }

    if (trimmedEmail === '') {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (signupPassword === '') {
      nextErrors.password = 'Password is required'
    } else if (signupPassword.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (confirmPassword === '') {
      nextErrors.confirmPassword = 'Confirm your password'
    } else if (signupPassword !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    setSignupErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const createAccount = () =>{
    if(!validateSignup()) return;
    signUp(name,signupEmail,signupPassword)

  }

  const handleSubmit = () => {
    // TODO: replace with real authentication (NestJS API).
    if (!validate()) return
    login(email,password)
  }

  const switchMode = (nextMode: AuthMode) => {
    if (nextMode === mode || transition) return
    setMode(nextMode)
    setTransition({
      prevMode: mode,
      nextMode,
      phase: 'enter',
    })
  }

  /* Grow / shrink the forms container smoothly while the panels swap. */
  useLayoutEffect(() => {
    if (!transition || transition.phase !== 'enter') return

    const container = formsRef.current
    const fromPanel =
      transition.prevMode === 'login' ? loginPanelRef.current : signupPanelRef.current
    const toPanel =
      transition.nextMode === 'login' ? loginPanelRef.current : signupPanelRef.current
    if (!container || !fromPanel || !toPanel) return

    const fromHeight = fromPanel.offsetHeight
    const toHeight = toPanel.offsetHeight
    const peakHeight = Math.max(fromHeight, toHeight)

    if (prefersReducedMotion()) {
      container.style.transition = 'none'
      container.style.height = `${toHeight}px`
      const done = window.setTimeout(() => {
        container.style.height = ''
        setTransition(null)
      }, 0)
      return () => window.clearTimeout(done)
    }

    // Snap to the currently visible height (before paint, so there is no flash),
    // then animate up to the taller of the two panels.
    container.style.transition = 'none'
    container.style.height = `${fromHeight}px`
    void container.offsetHeight // force a reflow so the height transition kicks in
    container.style.transition = `height ${SWITCH_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
    container.style.height = `${peakHeight}px`

    const growDone = window.setTimeout(() => {
      // Slide-out finished: drop the outgoing panel, shrink to the new height.
      container.style.transition = `height ${SHRINK_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
      container.style.height = `${toHeight}px`
      setTransition((current) => (current ? { ...current, phase: 'shrink' } : current))
    }, SWITCH_DURATION_MS)

    return () => window.clearTimeout(growDone)
  }, [transition])

  useLayoutEffect(() => {
    if (!transition || transition.phase !== 'shrink') return
    const done = window.setTimeout(() => {
      const container = formsRef.current
      if (container) {
        container.style.transition = 'none'
        container.style.height = ''
      }
      const incoming =
        transition.nextMode === 'login' ? loginPanelRef.current : signupPanelRef.current
      incoming?.querySelector<HTMLElement>('h2')?.focus()
      setTransition(null)
    }, SHRINK_DURATION_MS)
    return () => window.clearTimeout(done)
  }, [transition])

  const animating = transition?.phase === 'enter'

  const renderLogin =
    animating
      ? transition?.prevMode === 'login' || transition?.nextMode === 'login'
      : mode === 'login'
  const renderSignup =
    animating
      ? transition?.prevMode === 'signup' || transition?.nextMode === 'signup'
      : mode === 'signup'

  /* The swap always moves left → right: the incoming panel slides in from the
     left while the outgoing panel slides out to the right, in both directions. */
  const panelClassName = (panelMode: AuthMode): string => {
    if (!animating) return 'auth-panel'
    if (transition?.prevMode === panelMode) {
      return 'auth-panel auth-panel-exit-right'
    }
    return 'auth-panel auth-panel-enter-left'
  }

  const isPanelHidden = (panelMode: AuthMode) => animating && transition?.nextMode !== panelMode

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

          <div ref={formsRef} className="auth-forms">
            <div
              className={`auth-switch-stack ${animating ? 'auth-switch-stack--animating' : ''}`}
            >
              {renderLogin && (
                <div
                  ref={loginPanelRef}
                  className={panelClassName('login')}
                  aria-hidden={isPanelHidden('login')}
                >
                  <h2 className="login-form-title" tabIndex={-1}>
                    Welcome back
                  </h2>
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
                          {showPassword ? <Icon name="eye" size={17} /> : <Icon name="eyeOff" size={17} />}
                        </button>
                      </div>
                    </FormField>

                    <div className="login-options">
                      <Checkbox
                        label="Remember me"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                      />
                    </div>

                    <Button type="submit" size="lg" className="login-submit">
                      Log in
                    </Button>
                  </form>

                  <p className="auth-switch-text">
                    Don't have an account?{' '}
                    <button type="button" className="link-btn" onClick={() => switchMode('signup')}>
                      Sign up
                    </button>
                  </p>
                </div>
              )}

              {renderSignup && (
                <div
                  ref={signupPanelRef}
                  className={panelClassName('signup')}
                  aria-hidden={isPanelHidden('signup')}
                >
                  <h2 className="login-form-title" tabIndex={-1}>
                    Create your account
                  </h2>
                  <p className="login-form-subtitle">
                    Start tracking tasks with your team in seconds
                  </p>

                  <form
                    className="login-fields"
                    onSubmit={(event) => {
                      event.preventDefault()
                      validateSignup()
                      createAccount()

                    }}
                    noValidate
                  >
                    <FormField label="Name" htmlFor="signup-name" required error={signupErrors.name}>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Jane Cooper"
                        value={name}
                        invalid={Boolean(signupErrors.name)}
                        autoComplete="name"
                        icon={<Icon name="user" size={16} />}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </FormField>

                    <FormField label="Email address" htmlFor="signup-email" required error={signupErrors.email}>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        invalid={Boolean(signupErrors.email)}
                        autoComplete="email"
                        icon={<Icon name="mail" size={16} />}
                        onChange={(event) => setSignupEmail(event.target.value)}
                      />
                    </FormField>

                    <FormField label="Password" htmlFor="signup-password" required error={signupErrors.password}>
                      <div className="password-input">
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={signupPassword}
                          invalid={Boolean(signupErrors.password)}
                          autoComplete="new-password"
                          icon={<Icon name="lock" size={16} />}
                          onChange={(event) => setSignupPassword(event.target.value)}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowSignupPassword((value) => !value)}
                        >
                          {showSignupPassword ? <Icon name="eye" size={17} /> : <Icon name="eyeOff" size={17} />}
                        </button>
                      </div>
                    </FormField>

                    <FormField label="Confirm Password" htmlFor="signup-confirm-password" required error={signupErrors.confirmPassword}>
                      <div className="password-input">
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          invalid={Boolean(signupErrors.confirmPassword)}
                          autoComplete="new-password"
                          icon={<Icon name="lock" size={16} />}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowConfirmPassword((value) => !value)}
                        >
                          {showConfirmPassword ? <Icon name="eye" size={17} /> : <Icon name="eyeOff" size={17} />}
                        </button>
                      </div>
                    </FormField>

                    <Button type="submit" size="lg" className="login-submit">
                      Create Account
                    </Button>
                  </form>

                  <p className="auth-switch-text">
                    Already have an account?{' '}
                    <button type="button" className="link-btn" onClick={() => switchMode('login')}>
                      Sign in
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}