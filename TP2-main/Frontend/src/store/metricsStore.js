import { create } from 'zustand';
import { getMetrics } from '../api/metricsApi';

export const useMetricsStore = create((set) => ({
  metrics: null,
  loading: false,
  error:   null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getMetrics();
      set({ metrics: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },
}));
