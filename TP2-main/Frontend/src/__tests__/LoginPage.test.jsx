import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '../pages/LoginPage'
import { useAuthStore } from '../store/authStore'

const { navigateMock, loginRequestMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  loginRequestMock: vi.fn(),
}))

vi.mock('../api/authApi', () => ({
  loginRequest: loginRequestMock,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../components/LogoUC', () => ({
  default: () => <div>LogoUC</div>,
}))

const resetStore = () => {
  useAuthStore.setState({ token: null, user: null })
}

describe('LoginPage', () => {
  beforeEach(() => {
    resetStore()
    navigateMock.mockReset()
    loginRequestMock.mockReset()
  })

  it('renders the four role cards available for login', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    expect(screen.getByRole('button', { name: /Administrador/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Coordinador/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Docente/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Estudiante/i })).toBeInTheDocument()
  })

  it('selects a role by clicking its card and marks it as active', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    const docenteCard = screen.getByRole('button', { name: /Docente/i })
    await user.click(docenteCard)

    expect(docenteCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows validation when the submit form is empty', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /Entrar/i }))

    expect(loginRequestMock).not.toHaveBeenCalled()
  })

  it('submits credentials and redirects to the docente portal on success', async () => {
    const user = userEvent.setup()
    loginRequestMock.mockResolvedValue({
      data: { token: 'jwt', user: { name: 'Ana', role: 'docente' } },
    })

    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    await user.type(screen.getByLabelText(/Email institucional/i, { selector: 'input' }), 'ana@uc.cl')
    await user.type(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), 'secret')
    await user.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => expect(loginRequestMock).toHaveBeenCalledWith('ana@uc.cl', 'secret'))
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/portal'))
  })

  it('redirects admins to the data page after a successful login', async () => {
    const user = userEvent.setup()
    loginRequestMock.mockResolvedValue({
      data: { token: 'jwt', user: { name: 'Luis', role: 'admin' } },
    })

    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    await user.type(screen.getByLabelText(/Email institucional/i, { selector: 'input' }), 'luis@uc.cl')
    await user.type(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), 'secret')
    await user.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/datos'))
  })

  it('shows a login error message when the request fails', async () => {
    const user = userEvent.setup()
    loginRequestMock.mockRejectedValue({ response: { data: { message: 'Credenciales inválidas' } } })

    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    await user.type(screen.getByLabelText(/Email institucional/i, { selector: 'input' }), 'bad@uc.cl')
    await user.type(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), 'wrong')
    await user.click(screen.getByRole('button', { name: /Entrar/i }))

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument()
  })

  it('toggles password visibility and changes the input type', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    const passwordInput = screen.getByLabelText(/Contraseña/i, { selector: 'input' })
    const toggleButton = screen.getByRole('button', { name: /Mostrar contraseña/i })

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButton)

    expect(screen.getByRole('button', { name: /Ocultar contraseña/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i, { selector: 'input' })).toHaveAttribute('type', 'text')
  })

  it('keeps the password field hidden on initial render', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    expect(screen.getByLabelText(/Contraseña/i, { selector: 'input' })).toHaveAttribute('type', 'password')
  })

  it('allows selecting the first role by default on load', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    expect(screen.getByRole('button', { name: /Administrador/i })).toHaveAttribute('aria-pressed', 'true')
  })
})
