#!/usr/bin/env node
/**
 * optimize-images.mjs - Compresion de imagenes (Green Software / tecnica 3)
 *
 * Recorre `public/` y `src/assets/` y optimiza imagenes rasterizadas:
 *   - PNG/JPG  -> WebP (lossy q80) cuando el resultado es mas pequeno.
 *   - WebP/PNG -> recodificado y, si se indica, redimensionado a un ancho maximo.
 *
 * NO toca archivos SVG (son vectoriales; minificarlos con SVGO rompe los
 * sprites con <symbol>, por eso se excluyen deliberadamente).
 *
 * Uso:
 *   npm run images:optimize           # informe + escritura de optimizados
 *   npm run images:report             # solo reporta, no escribe (--dry)
 *
 * Requiere: npm i -D sharp
 */
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DRY = process.argv.includes('--dry');
const ROOTS = ['public', 'src/assets'];
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp']);

// Ancho maximo por archivo (px). El icono se muestra a <=52px => 104px = 2x retina.
const MAX_WIDTH = { 'uc-icon.webp': 104 };

const kb = (b) => `${(b / 1024).toFixed(2)} KB`;

async function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (RASTER.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function optimize(file) {
  const before = (await stat(file)).size;
  const name = path.basename(file);
  let img = sharp(file);
  const meta = await img.metadata();

  const maxW = MAX_WIDTH[name];
  if (maxW && meta.width > maxW) img = img.resize({ width: maxW });

  const outPath = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const buf = await img.webp({ quality: 80, effort: 6 }).toBuffer();

  const willReplaceFormat = outPath !== file;
  // Solo aceptamos el cambio si reduce tamano (evita inflar PNGs de paleta).
  const accept = buf.length < before || Boolean(maxW);

  if (accept && !DRY) await sharp(buf).toFile(outPath);
  return { name, before, after: accept ? buf.length : before, accept, willReplaceFormat };
}

const files = (await Promise.all(ROOTS.map(walk))).flat();
let tb = 0, ta = 0;
console.log(`\nCompresion de imagenes ${DRY ? '(dry-run)' : ''}\n`);
console.log('Archivo'.padEnd(34), 'Antes'.padStart(12), 'Despues'.padStart(12), 'Ahorro'.padStart(9));
for (const f of files) {
  const r = await optimize(f);
  tb += r.before; ta += r.after;
  const pct = r.before ? ((1 - r.after / r.before) * 100).toFixed(1) : '0.0';
  const note = r.accept ? (r.willReplaceFormat ? '-> webp' : '') : '(sin cambio: ya optimo)';
  console.log(r.name.padEnd(34), kb(r.before).padStart(12), kb(r.after).padStart(12), `${pct}%`.padStart(9), note);
}
console.log('-'.repeat(70));
console.log('TOTAL'.padEnd(34), kb(tb).padStart(12), kb(ta).padStart(12),
  `${tb ? ((1 - ta / tb) * 100).toFixed(1) : 0}%`.padStart(9));
