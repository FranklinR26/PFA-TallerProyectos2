import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePortalStore } from '../store/portalStore'

const portalApiMocks = vi.hoisted(() => ({
  getPortalData: vi.fn(),
  enrollCourse: vi.fn(),
  unenrollCourse: vi.fn(),
  joinWaitlist: vi.fn(),
  leaveWaitlist: vi.fn(),
}))

vi.mock('../api/portalApi', () => portalApiMocks)

const resetStore = () => {
  usePortalStore.setState({
    student: null,
    enrolledCourses: [],
    availableCourses: [],
    personalGrid: {},
    hasSchedule: false,
    totalBlocks: 0,
    loading: false,
    error: null,
  })
}

describe('usePortalStore', () => {
  beforeEach(() => {
    resetStore()
    vi.clearAllMocks()
  })

  it('fetches portal data and stores the response', async () => {
    portalApiMocks.getPortalData.mockResolvedValue({
      data: {
        student: { name: 'Test User' },
        enrolledCourses: [{ _id: 'c1' }],
        availableCourses: [{ _id: 'c2' }],
        personalGrid: { L1: 'A' },
        hasSchedule: true,
        totalBlocks: 4,
      },
    })

    await usePortalStore.getState().fetch()

    expect(portalApiMocks.getPortalData).toHaveBeenCalledTimes(1)
    expect(usePortalStore.getState().student.name).toBe('Test User')
    expect(usePortalStore.getState().hasSchedule).toBe(true)
  })

  it('captures an API error message when fetching fails', async () => {
    portalApiMocks.getPortalData.mockRejectedValue({ message: 'portal error' })

    await usePortalStore.getState().fetch()

    expect(usePortalStore.getState().error).toBe('portal error')
  })

  it('re-fetches after enrolling in a course', async () => {
    portalApiMocks.enrollCourse.mockResolvedValue({})
    portalApiMocks.getPortalData.mockResolvedValue({ data: { student: { name: 'X' } } })

    await usePortalStore.getState().enroll('c1')

    expect(portalApiMocks.enrollCourse).toHaveBeenCalledWith('c1')
    expect(portalApiMocks.getPortalData).toHaveBeenCalledTimes(1)
  })
})
