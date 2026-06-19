import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // H-06 MITIGACIÓN COMPLETA: No almacenar token en sessionStorage/localStorage.
      // El token ahora reside en una cookie httpOnly (inexpugnable ante XSS).
      // El navegador envía la cookie automáticamente en cada request.
      token: null, // Deprecated; mantener para retrocompatibilidad.
      user: null,
      setAuth: (user) => set({ user }), // Ahora solo recibe user, no token.
      clearAuth: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
