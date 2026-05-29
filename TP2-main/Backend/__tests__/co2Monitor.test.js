/**
 * TDD — middleware co2Monitor + util co2.js
 *
 * Cubre:
 *  - Conteo de bytes (chunkSize) para Buffer, string y vacío.
 *  - Construcción de la métrica (buildMetric) y cálculo de CO₂ con CO2.js.
 *  - Integración real con Express: el middleware mide la respuesta y persiste
 *    la métrica (persistencia inyectada en memoria, sin MongoDB).
 */
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { chunkSize, buildMetric, co2Monitor } from '../middleware/co2Monitor.js';
import { estimateCo2Grams } from '../config/co2.js';

describe('chunkSize', () => {
  it('cuenta bytes de un Buffer', () => {
    expect(chunkSize(Buffer.from('abc'))).toBe(3);
  });
  it('cuenta bytes de un string (utf8 multibyte)', () => {
    expect(chunkSize('café')).toBe(5); // é = 2 bytes
  });
  it('devuelve 0 para chunk vacío/undefined', () => {
    expect(chunkSize(undefined)).toBe(0);
    expect(chunkSize(null)).toBe(0);
  });
});

describe('estimateCo2Grams', () => {
  it('devuelve 0 para 0 o valores no válidos', () => {
    expect(estimateCo2Grams(0)).toBe(0);
    expect(estimateCo2Grams(-10)).toBe(0);
    expect(estimateCo2Grams(NaN)).toBe(0);
  });
  it('crece monótonamente con los bytes', () => {
    expect(estimateCo2Grams(100_000)).toBeGreaterThan(estimateCo2Grams(10_000));
  });
});

describe('buildMetric', () => {
  it('arma el documento y calcula CO₂ a partir de los bytes', () => {
    const m = buildMetric({ method: 'GET', route: '/x', statusCode: 200, bytes: 50_000, responseTimeMs: 12.3 });
    expect(m).toMatchObject({ method: 'GET', route: '/x', statusCode: 200, bytes: 50_000, responseTimeMs: 12.3 });
    expect(m.co2Grams).toBeGreaterThan(0);
    expect(m.co2Grams).toBeCloseTo(estimateCo2Grams(50_000), 10);
  });
});

describe('co2Monitor (integración Express)', () => {
  it('mide cada respuesta y persiste la métrica', async () => {
    const persisted = [];
    const persist = vi.fn((metric) => { persisted.push(metric); return Promise.resolve(); });

    const app = express();
    app.use(co2Monitor({ persist }));
    app.get('/hello', (req, res) => res.json({ msg: 'hola mundo' }));

    const res = await request(app).get('/hello');
    expect(res.status).toBe(200);

    // El persist ocurre en el evento 'finish'; damos un tick al event loop.
    await new Promise((r) => setImmediate(r));

    expect(persist).toHaveBeenCalledTimes(1);
    const m = persisted[0];
    expect(m.method).toBe('GET');
    expect(m.route).toBe('/hello');
    expect(m.statusCode).toBe(200);
    expect(m.bytes).toBeGreaterThan(0);
    expect(m.co2Grams).toBeGreaterThan(0);
    expect(m.responseTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('no altera el cuerpo de la respuesta', async () => {
    const app = express();
    app.use(co2Monitor({ persist: () => Promise.resolve() }));
    app.get('/echo', (req, res) => res.json({ ok: true, n: 42 }));
    const res = await request(app).get('/echo');
    expect(res.body).toEqual({ ok: true, n: 42 });
  });
});
