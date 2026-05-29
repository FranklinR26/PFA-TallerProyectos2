/**
 * TDD - controlador de sostenibilidad (GreenFrame).
 * Crea y elimina el archivo de reporte real en public/assets para verificar
 * la lectura asincrona y el manejo de "no hay reporte".
 */
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { writeFile, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import request from 'supertest';
import { readLatestReport, getSustainabilityReport } from '../controllers/sustainability.controller.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(here, '..', 'public', 'assets');
const JSON_REPORT = path.join(ASSETS, 'greenframe-latest.json');
const TXT_REPORT = path.join(ASSETS, 'greenframe-latest.txt');

beforeAll(async () => {
  await mkdir(ASSETS, { recursive: true });
});

afterEach(async () => {
  await rm(JSON_REPORT, { force: true });
  await rm(TXT_REPORT, { force: true });
});

describe('readLatestReport', () => {
  it('devuelve null cuando no existe reporte', async () => {
    expect(await readLatestReport()).toBeNull();
  });

  it('lee y parsea el reporte JSON', async () => {
    await writeFile(JSON_REPORT, JSON.stringify({ co2: 1.2, wh: 3.4 }));
    const r = await readLatestReport();
    expect(r.format).toBe('json');
    expect(r.data).toEqual({ co2: 1.2, wh: 3.4 });
  });

  it('recurre al texto plano si no hay JSON', async () => {
    await writeFile(TXT_REPORT, 'CO2: 1.2 g, 3.4 Wh');
    const r = await readLatestReport();
    expect(r.format).toBe('text');
    expect(r.data).toContain('CO2');
  });
});

describe('GET /api/sustainability', () => {
  const app = express();
  app.get('/api/sustainability', getSustainabilityReport);

  it('responde 404 sin analisis previo', async () => {
    const res = await request(app).get('/api/sustainability');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('no_report');
  });

  it('responde 200 con el reporte JSON', async () => {
    await writeFile(JSON_REPORT, JSON.stringify({ co2: 0.9 }));
    const res = await request(app).get('/api/sustainability');
    expect(res.status).toBe(200);
    expect(res.body.report).toEqual({ co2: 0.9 });
  });
});
