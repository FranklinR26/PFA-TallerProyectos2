import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../api/scheduleApi';

export const useScheduleStore = create(
  persist(
    (set, get) => ({
      weights: { pref: 5, balance: 4, gaps: 6, spread: 7, core: 3 },
      params:  { timeout: 8000, restarts: 3, maxNodes: 200_000 },

      solution:   null,
      scheduleId: null,
      score:      null,
      nodes:      null,
      timeMs:     null,

      generating: false,
      error:      null,
      log:        [],

      setWeights: (w) => set({ weights: w }),
      setParams:  (p) => set({ params: p }),

      addLog: (msg) => set(s => ({
        log: [...s.log, `[${new Date().toLocaleTimeString()}] ${msg}`],
      })),
      clearLog: () => set({ log: [] }),

      generate: async () => {
        const { weights, params, addLog, clearLog } = get();
        clearLog();
        set({ generating: true, error: null });

        addLog('→ Enviando solicitud al motor CSP…');
        addLog(`  Timeout: ${params.timeout}ms | Restarts: ${params.restarts}`);

        try {
          const res = await api.generateSchedule(weights, params);
          const { scheduleId, score, nodes, timeMs, assignment } = res.data;

          set({ solution: assignment, scheduleId, score, nodes, timeMs, generating: false });

          addLog(`✓ Solución encontrada en ${timeMs}ms`);
          addLog(`  Nodos explorados: ${nodes}`);
          addLog(`  Puntaje blando: ${score.toFixed(2)}`);
          addLog('→ Ve a la pestaña "Horario" para visualizar.');
        } catch (err) {
          const msg = err.response?.data?.message || err.message;
          set({ generating: false, error: msg });
          addLog(`✗ ${msg}`);
          addLog('  Sugerencias: revisar disponibilidad de docentes, tipo/capacidad de aulas.');
        }
      },

      loadActive: async () => {
        try {
          const res = await api.getActiveSchedule();
          const s = res.data;
          set({
            solution:   Object.fromEntries(s.solution),
            scheduleId: s._id,
            score:      s.score,
            nodes:      s.nodes,
            timeMs:     s.timeMs,
          });
        } catch {
          // Sin horario activo — silencioso
        }
      },
    }),
    {
      name: 'schedule-storage',
      partialize: (s) => ({ weights: s.weights, params: s.params }),
    }
  )
);
