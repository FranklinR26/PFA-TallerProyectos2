import { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/authStore'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

const restoreAuth = () => act(() => useAuthStore.setState({ token: null, user: null }))

describe('Navbar', () => {
  beforeEach(() => {
    restoreAuth()
    navigateMock.mockReset()
  })

  it.each([
    ['admin', ['Datos', 'Generar', 'Horario', 'Dashboard', 'Sostenibilidad', 'Evidencias']],
    ['coordinador', ['Datos', 'Generar', 'Horario', 'Dashboard', 'Sostenibilidad', 'Evidencias']],
    ['docente', ['Mi Horario', 'Sostenibilidad', 'Evidencias']],
    ['estudiante', ['Portal', 'Sostenibilidad', 'Evidencias']],
  ])('renders the expected links for %s users', (role, expectedLabels) => {
    act(() => {
      useAuthStore.setState({ token: 'token', user: { name: 'Usuario', role } })
    })

    render(
      <MemoryRouter initialEntries={['/portal']}>
        <Navbar />
      </MemoryRouter>
    )

    expectedLabels.forEach(label => expect(screen.getByText(label)).toBeInTheDocument())
  })

  afterEach(() => {
    restoreAuth()
    navigateMock.mockReset()
  })

  it('does not render when there is no authenticated user', () => {
    render(
      <MemoryRouter initialEntries={['/portal']}>
        <Navbar />
      </MemoryRouter>
    )

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('does not render on the login page even when authenticated', () => {
    act(() => {
      useAuthStore.setState({ token: 'token', user: { name: 'Ana', role: 'docente' } })
    })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Navbar />
      </MemoryRouter>
    )

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('renders the correct links and user info for a docente', () => {
    act(() => {
      useAuthStore.setState({ token: 'token', user: { name: 'Ana', role: 'docente' } })
    })

    render(
      <MemoryRouter initialEntries={['/portal']}>
        <Navbar />
      </MemoryRouter>
    )

    expect(screen.getByText('Mi Horario')).toBeInTheDocument()
    expect(screen.getByText('Evidencias')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Docente')).toBeInTheDocument()
  })

  it('logs out and navigates to login when the user clicks Salir', () => {
    act(() => {
      useAuthStore.setState({ token: 'token', user: { name: 'Ana', role: 'docente' } })
    })

    render(
      <MemoryRouter initialEntries={['/portal']}>
        <Navbar />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Salir' }))

    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(navigateMock).toHaveBeenCalledWith('/login')
  })
})
