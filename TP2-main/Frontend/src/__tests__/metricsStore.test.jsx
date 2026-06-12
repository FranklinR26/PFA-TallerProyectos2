import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMetricsStore } from '../store/metricsStore'

const getMetricsMock = vi.hoisted(() => vi.fn())

vi.mock('../api/metricsApi', () => ({
  getMetrics: getMetricsMock,
}))

const resetStore = () => {
  useMetricsStore.setState({ metrics: null, loading: false, error: null })
}

describe('useMetricsStore', () => {
  beforeEach(() => {
    resetStore()
    vi.clearAllMocks()
  })

  it('loads metrics from the API and stores them', async () => {
    getMetricsMock.mockResolvedValue({ data: { total: 5 } })

    await useMetricsStore.getState().fetch()

    expect(getMetricsMock).toHaveBeenCalledTimes(1)
    expect(useMetricsStore.getState().metrics).toEqual({ total: 5 })
    expect(useMetricsStore.getState().loading).toBe(false)
  })

  it('stores an error message when the metrics request fails', async () => {
    getMetricsMock.mockRejectedValue({ message: 'fail' })

    await useMetricsStore.getState().fetch()

    expect(useMetricsStore.getState().error).toBe('fail')
  })
})
