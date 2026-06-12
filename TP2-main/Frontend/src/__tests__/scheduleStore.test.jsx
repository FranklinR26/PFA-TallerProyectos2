import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useScheduleStore } from '../store/scheduleStore'

const scheduleApiMocks = vi.hoisted(() => ({
  generateSchedule: vi.fn(),
  getActiveSchedule: vi.fn(),
}))

vi.mock('../api/scheduleApi', () => scheduleApiMocks)

const resetStore = () => {
  useScheduleStore.setState({
    weights: { pref: 5, balance: 4, gaps: 6, spread: 7, core: 3 },
    params: { timeout: 8000, restarts: 3, maxNodes: 200_000 },
    solution: null,
    scheduleId: null,
    score: null,
    nodes: null,
    timeMs: null,
    generating: false,
    error: null,
    log: [],
  })
}

describe('useScheduleStore', () => {
  beforeEach(() => {
    resetStore()
    vi.clearAllMocks()
  })

  it('updates weights and params in the store', () => {
    useScheduleStore.getState().setWeights({ pref: 1, balance: 2, gaps: 3, spread: 4, core: 5 })
    useScheduleStore.getState().setParams({ timeout: 1000, restarts: 1, maxNodes: 1000 })

    expect(useScheduleStore.getState().weights.pref).toBe(1)
    expect(useScheduleStore.getState().params.timeout).toBe(1000)
  })

  it('generates a schedule and records a successful log', async () => {
    scheduleApiMocks.generateSchedule.mockResolvedValue({
      data: { scheduleId: 's1', score: 9.5, nodes: 120, timeMs: 400, assignment: { A: 'B' } },
    })

    await useScheduleStore.getState().generate()

    expect(useScheduleStore.getState().scheduleId).toBe('s1')
    expect(useScheduleStore.getState().score).toBe(9.5)
    expect(useScheduleStore.getState().generating).toBe(false)
    expect(useScheduleStore.getState().log.some(msg => msg.includes('Solución encontrada'))).toBe(true)
  })

  it('stores an error message when generation fails', async () => {
    scheduleApiMocks.generateSchedule.mockRejectedValue({ message: 'no schedule' })

    await useScheduleStore.getState().generate()

    expect(useScheduleStore.getState().error).toBe('no schedule')
  })

  it('loads the active schedule and converts Map-like solutions', async () => {
    scheduleApiMocks.getActiveSchedule.mockResolvedValue({
      data: { _id: 'active', solution: new Map([['a', 1]]), score: 7, nodes: 10, timeMs: 100 },
    })

    await useScheduleStore.getState().loadActive()

    expect(useScheduleStore.getState().scheduleId).toBe('active')
    expect(useScheduleStore.getState().solution).toEqual({ a: 1 })
  })
})
