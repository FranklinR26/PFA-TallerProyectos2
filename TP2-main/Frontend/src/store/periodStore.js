import { create } from 'zustand';
import * as api from '../api/periodApi';

export const usePeriodStore = create((set, get) => ({
  periods: [],
  loading: false,
  error:   null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.getPeriods();
      set({ periods: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  create: async (data) => {
    await api.createPeriod(data);
    await get().fetch();
  },

  activate: async (id) => {
    await api.activatePeriod(id);
    await get().fetch();
  },

  remove: async (id) => {
    await api.deletePeriod(id);
    await get().fetch();
  },
}));
