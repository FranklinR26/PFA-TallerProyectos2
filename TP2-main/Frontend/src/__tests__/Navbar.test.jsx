import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/authStore'

const restoreAuth = () => act(() => useAuthStore.setState({ token: null, user: null }, true))

describe('Navbar', () => {
  beforeEach(() => {
    restoreAuth()
  })

  afterEach(() => {
    restoreAuth()
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
      useAuthStore.setState({ token: 'token', user: { name: 'Ana', role: 'docente' } }, true)
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
      useAuthStore.setState({ token: 'token', user: { name: 'Ana', role: 'docente' } }, true)
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
})
