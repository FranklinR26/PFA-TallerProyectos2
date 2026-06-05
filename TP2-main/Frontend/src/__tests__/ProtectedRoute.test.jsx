import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { ProtectedRoute } from '../router/ProtectedRoute'
import { useAuthStore } from '../store/authStore'

vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(),
}))

function Protected() {
  return <div>Protected content</div>
}

function Login() {
  return <div>Login page</div>
}

function Unauthorized() {
  return <div>Unauthorized page</div>
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({ token: null, user: null })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to login when there is no token', () => {
    render(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/secret" element={<ProtectedRoute roles={['admin']}><Protected /></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('redirects to unauthorized when the role is not allowed', () => {
    useAuthStore.mockReturnValue({ token: 'token', user: { name: 'Carlos', role: 'estudiante' } })

    render(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/secret" element={<ProtectedRoute roles={['admin']}><Protected /></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Unauthorized page')).toBeInTheDocument()
  })

  it('renders the protected content when user has the right role', () => {
    useAuthStore.mockReturnValue({ token: 'token', user: { name: 'Laura', role: 'admin' } })

    render(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path="/secret" element={<ProtectedRoute roles={['admin']}><Protected /></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})
