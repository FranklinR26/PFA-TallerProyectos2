import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from '../store/authStore'

const resetStore = () => {
  useAuthStore.setState({ token: null, user: null })
}

const scenarios = [
  { name: 'Marta', role: 'admin', token: 'jwt-admin' },
  { name: 'Pedro', role: 'coordinador', token: 'jwt-coord' },
  { name: 'Ana', role: 'docente', token: 'jwt-doc' },
  { name: 'Sofía', role: 'estudiante', token: 'jwt-student' },
]

describe('authStore', () => {
  beforeEach(() => {
    resetStore()
  })

  afterEach(() => {
    resetStore()
  })

  it('stores the authenticated user and token', () => {
    useAuthStore.getState().setAuth('jwt-token', { name: 'Marta', role: 'admin' })

    expect(useAuthStore.getState().token).toBe('jwt-token')
    expect(useAuthStore.getState().user).toEqual({ name: 'Marta', role: 'admin' })
  })

  it('clears the session when the user logs out', () => {
    useAuthStore.getState().setAuth('jwt-token', { name: 'Marta', role: 'admin' })

    useAuthStore.getState().clearAuth()

    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it.each(scenarios)('stores a $role user with its token', ({ name, role, token }) => {
    useAuthStore.getState().setAuth(token, { name, role })

    expect(useAuthStore.getState().token).toBe(token)
    expect(useAuthStore.getState().user).toEqual({ name, role })
  })

  it.each(scenarios)('clears the stored $role session safely', ({ name, role, token }) => {
    useAuthStore.getState().setAuth(token, { name, role })

    useAuthStore.getState().clearAuth()

    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it.each(scenarios)('keeps previous values untouched until setAuth is called for $role', ({ name, role, token }) => {
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()

    useAuthStore.getState().setAuth(token, { name, role })

    expect(useAuthStore.getState().token).toBe(token)
    expect(useAuthStore.getState().user).toMatchObject({ name, role })
  })

  it.each(scenarios)('returns the correct role label for $role after authentication', ({ name, role, token }) => {
    useAuthStore.getState().setAuth(token, { name, role })

    expect(useAuthStore.getState().user?.role).toBe(role)
  })

  it('persists the auth session in sessionStorage instead of localStorage', () => {
    sessionStorage.clear()
    localStorage.clear()

    useAuthStore.getState().setAuth('jwt-token', { name: 'Marta', role: 'admin' })

    expect(sessionStorage.getItem('auth-storage')).toContain('jwt-token')
    expect(localStorage.getItem('auth-storage')).toBeNull()
  })
})
