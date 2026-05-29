/**
 * TDD — controlador del dashboard ambiental (funciones puras).
 * No requiere MongoDB: prueba helpers de formato y el render del HTML.
 */
import { describe, it, expect } from 'vitest';
import {
  escapeHtml, formatCo2, formatBytes, renderDashboardHtml,
} from '../controllers/environmental.controller.js';

describe('escapeHtml', () => {
  it('escapa caracteres peligrosos', () => {
    expect(escapeHtml('<script>"&\'')).toBe('&lt;script&gt;&quot;&amp;&#39;');
  });
});

describe('formatBytes', () => {
  it('formatea unidades', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.00 KB');
  });
});

describe('formatCo2', () => {
  it('usa mg para valores muy pequeños y g en otros casos', () => {
    expect(formatCo2(0)).toBe('0 g');
    expect(formatCo2(0.0005)).toMatch(/mg$/);
    expect(formatCo2(0.5)).toMatch(/ g$/);
  });
});

describe('renderDashboardHtml', () => {
  const summary = {
    totalRequests: 3, totalCo2: 0.05, totalBytes: 150000, avgCo2: 0.0166,
    avgResponseTime: 12.5,
    mostPolluting: { _id: { method: 'GET', route: '/api/metrics' }, requests: 1, totalCo2: 0.04, avgResponseTime: 20 },
    mostUsed:      { _id: { method: 'GET', route: '/api/data' },    requests: 2, totalCo2: 0.01, avgResponseTime: 5 },
    ranking: [
      { _id: { method: 'GET', route: '/api/metrics' }, requests: 1, totalCo2: 0.04, avgResponseTime: 20 },
      { _id: { method: 'GET', route: '/api/data' },    requests: 2, totalCo2: 0.01, avgResponseTime: 5 },
    ],
  };
  const rows = [
    { timestamp: new Date('2026-05-29T10:00:00Z'), method: 'GET', route: '/api/data', statusCode: 200, responseTimeMs: 5.123, bytes: 50000, co2Grams: 0.01 },
  ];

  it('genera un documento HTML con los indicadores', () => {
    const html = renderDashboardHtml({ summary, rows });
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Total de solicitudes');
    expect(html).toContain('/api/metrics');   // endpoint más contaminante
    expect(html).toContain('CO2.js');         // contexto del monitoreo
  });

  it('muestra estado vacío sin filas', () => {
    const empty = {
      ...summary, totalRequests: 0, mostPolluting: null, mostUsed: null, ranking: [],
    };
    const html = renderDashboardHtml({ summary: empty, rows: [] });
    expect(html).toContain('Aún no hay mediciones');
  });
});
