import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDataStore } from '../store/dataStore'

const apiMocks = vi.hoisted(() => ({
  getBootstrap: vi.fn(),
  getTeachers: vi.fn(),
  getClassrooms: vi.fn(),
  getSections: vi.fn(),
  getCourses: vi.fn(),
  getStudents: vi.fn(),
  createTeacher: vi.fn(),
  updateTeacher: vi.fn(),
  deleteTeacher: vi.fn(),
}))

vi.mock('../api/dataApi', () => apiMocks)

const resetStore = () => {
  useDataStore.setState({
    teachers: [], classrooms: [], sections: [], courses: [], students: [], loading: false, error: null,
  })
}

describe('useDataStore', () => {
  beforeEach(() => {
    resetStore()
    vi.clearAllMocks()
  })

  it('fetchAll loads all data from the bootstrap endpoint', async () => {
    apiMocks.getBootstrap.mockResolvedValue({
      data: {
        teachers: [{ _id: 't1', name: 'Ana' }],
        classrooms: [{ _id: 'c1', name: 'Aula 1' }],
        sections: [{ _id: 's1', code: 'S1' }],
        courses: [{ _id: 'co1', name: 'Matemática' }],
        students: [{ _id: 'st1', name: 'Luis' }],
      },
    })

    await useDataStore.getState().fetchAll()

    expect(apiMocks.getBootstrap).toHaveBeenCalledTimes(1)
    expect(useDataStore.getState().teachers).toHaveLength(1)
    expect(useDataStore.getState().courses[0].name).toBe('Matemática')
    expect(useDataStore.getState().loading).toBe(false)
  })

  it('falls back to individual endpoints when bootstrap fails', async () => {
    apiMocks.getBootstrap.mockRejectedValue(new Error('boom'))
    apiMocks.getTeachers.mockResolvedValue({ data: [{ _id: 't1' }] })
    apiMocks.getClassrooms.mockResolvedValue({ data: [{ _id: 'c1' }] })
    apiMocks.getSections.mockResolvedValue({ data: [{ _id: 's1' }] })
    apiMocks.getCourses.mockResolvedValue({ data: [{ _id: 'co1' }] })
    apiMocks.getStudents.mockResolvedValue({ data: [{ _id: 'st1' }] })

    await useDataStore.getState().fetchAll()

    expect(apiMocks.getTeachers).toHaveBeenCalled()
    expect(useDataStore.getState().students).toHaveLength(1)
  })

  it('adds a new teacher to the local list', async () => {
    apiMocks.createTeacher.mockResolvedValue({ data: { _id: 't2', name: 'Nora' } })

    const created = await useDataStore.getState().addTeacher({ name: 'Nora' })

    expect(created.name).toBe('Nora')
    expect(useDataStore.getState().teachers).toContainEqual({ _id: 't2', name: 'Nora' })
  })
})
