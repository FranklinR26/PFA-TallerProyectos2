/**
 * TDD - controlador de sostenibilidad (Carbometer).
 * Manipula los archivos de reporte reales en public/assets, por lo que se
 * respaldan antes de la suite y se restauran al final para no alterar el
 * working tree (los carbometer-latest.* están versionados como evidencia).
 */
import { describe, it, expect, afterEach, beforeAll, afterAll } from 'vitest';
import { writeFile, rm, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import request from 'supertest';
import { readLatestReport, getSustainabilityReport } from '../controllers/sustainability.controller.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(here, '..', 'public', 'assets');
const JSON_REPORT = path.join(ASSETS, 'carbometer-latest.json');
const TXT_REPORT  = path.join(ASSETS, 'carbometer-latest.txt');

const backups = new Map();

beforeAll(async () => {
  await mkdir(ASSETS, { recursive: true });
  // Respaldar archivos existentes para restaurarlos al terminar
  for (const file of [JSON_REPORT, TXT_REPORT]) {
    try {
      backups.set(file, await readFile(file));
    } catch {
      // archivo no existía — nada que respaldar
    }
  }
  // Estado limpio antes del primer test
  await rm(JSON_REPORT, { force: true });
  await rm(TXT_REPORT,  { force: true });
});

afterEach(async () => {
  await rm(JSON_REPORT, { force: true });
  await rm(TXT_REPORT,  { force: true });
});

afterAll(async () => {
  // Restaurar archivos originales
  for (const [file, content] of backups) {
    await writeFile(file, content);
  }
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
