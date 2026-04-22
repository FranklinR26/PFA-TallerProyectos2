import { create } from 'zustand';
import * as api from '../api/portalApi';

export const usePortalStore = create((set, get) => ({
  student:          null,
  enrolledCourses:  [],
  availableCourses: [],
  personalGrid:     {},
  hasSchedule:      false,
  totalBlocks:      0,
  loading:          false,
  error:            null,

  fetch: async () => {
    // Limpiar estado anterior para evitar mostrar datos de otra sesión
    set({
      loading: true, error: null,
      student: null, teacher: null,
      enrolledCourses: [], availableCourses: [],
      personalGrid: {}, hasSchedule: false, totalBlocks: 0,
      courses: [], sessionList: [],
    });
    try {
      const res = await api.getPortalData();
      set({ ...res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  enroll:       async (courseId) => { await api.enrollCourse(courseId);   await get().fetch(); },
  unenroll:     async (courseId) => { await api.unenrollCourse(courseId); await get().fetch(); },
  joinWaitlist: async (courseId) => { await api.joinWaitlist(courseId);   await get().fetch(); },
  leaveWaitlist:async (courseId) => { await api.leaveWaitlist(courseId);  await get().fetch(); },
}));
