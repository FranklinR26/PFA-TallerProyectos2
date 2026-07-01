# Análisis de Valor Ganado (EVM) — Earned Value Management

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos
**Fecha de corte:** 2026-06-28 (fin del Sprint 7)
**Presupuesto total (BAC):** $72,468
**Duración planificada:** 14 semanas (23 Mar — 05 Jul)

---

## 1. Datos base por sprint

| Sprint | Período | Story Points planificados | SP completados | PV ($) | EV ($) | AC ($) |
|--------|---------|--------------------------|----------------|--------|--------|--------|
| S1 | 23 Mar – 05 Abr | 12 | 12 | $10,353 | $10,353 | $9,800 |
| S2 | 06 Abr – 19 Abr | 11 | 11 | $9,490 | $9,490 | $10,100 |
| S3 | 20 Abr – 03 May | 8 | 7 | $6,901 | $6,039 | $7,200 |
| S4 | 04 May – 17 May | 8 | 9 | $6,901 | $7,763 | $7,500 |
| S5 | 18 May – 31 May | 10 | 10 | $8,627 | $8,627 | $8,400 |
| S6 | 01 Jun – 14 Jun | 10 | 10 | $8,627 | $8,627 | $8,800 |
| S7 | 15 Jun – 28 Jun | 10 | 10 | $10,353 | $10,353 | $10,200 |
| **Total** | | **69** | **69** | **$61,252** | **$61,252** | **$62,000** |

**Notas:**
- PV (Planned Value) = BAC × (SP planificados acumulados / SP totales)
- EV (Earned Value) = BAC × (SP completados acumulados / SP totales)
- AC (Actual Cost) = horas reales × tarifa ($54.46/hr)
- S3: HU-05 comenzó con retraso por complejidad del AC-3; se recuperó en S4 con horas extra

---

## 2. Indicadores de desempeño

### 2.1 Al cierre del Sprint 7 (corte final)

| Indicador | Fórmula | Valor | Interpretación |
|-----------|---------|-------|---------------|
| **SPI** (Schedule Performance Index) | EV / PV | $61,252 / $61,252 = **1.00** | En tiempo: el proyecto entrega según lo planificado |
| **CPI** (Cost Performance Index) | EV / AC | $61,252 / $62,000 = **0.99** | Ligeramente por encima del presupuesto (1% de sobrecosto) |
| **SV** (Schedule Variance) | EV − PV | $0 | Sin variación de cronograma |
| **CV** (Cost Variance) | EV − AC | −$748 | Sobrecosto menor de $748 (1.2%) |

### 2.2 Proyecciones

| Indicador | Fórmula | Valor | Interpretación |
|-----------|---------|-------|---------------|
| **EAC** (Estimate at Completion) | BAC / CPI | $72,468 / 0.99 = **$73,200** | Costo estimado final: +$732 sobre presupuesto |
| **ETC** (Estimate to Complete) | EAC − AC | $73,200 − $62,000 = **$11,200** | Costo restante para la fase de cierre |
| **VAC** (Variance at Completion) | BAC − EAC | $72,468 − $73,200 = **−$732** | Sobrecosto proyectado: 1.0% del BAC |
| **TCPI** (To-Complete Performance Index) | (BAC − EV) / (BAC − AC) | ($72,468 − $61,252) / ($72,468 − $62,000) = **1.07** | Necesita mejorar 7% la eficiencia en cierre |

### 2.3 Evolución del SPI y CPI por sprint

```
Sprint    SPI     CPI     Estado
──────────────────────────────────
  S1      1.00    1.06    ✅ Adelantado y bajo presupuesto
  S2      1.00    0.98    ✅ En tiempo, costo marginal
  S3      0.93    0.90    ⚠️ Retraso en HU-05 (complejidad AC-3)
  S4      1.03    0.99    ✅ Recuperación con horas extra
  S5      1.00    1.01    ✅ Estable
  S6      1.00    0.99    ✅ Estable
  S7      1.00    0.99    ✅ Entrega completa
```

---

## 3. Análisis de variaciones

### Sprint 3 (mayor variación)
- **Causa:** La implementación de AC-3 (propagación de restricciones) en el Motor CSP resultó más compleja de lo estimado. El espacio de búsqueda de 8,750 variables requirió optimización de la heurística MRV.
- **Impacto:** SPI bajó a 0.93 (7% de retraso); 1 story point se pasó al Sprint 4.
- **Acción correctiva:** Se dedicaron 10 horas extra en S4 para completar la funcionalidad. El retraso se absorbió completamente.

### Sobrecosto general ($748)
- **Causa:** Horas extra en S3-S4 para la complejidad del solver CSP + horas de auditoría OWASP no presupuestadas originalmente.
- **Impacto:** 1.0% sobre el BAC — dentro del margen de contingencia presupuestado ($16,408).

---

## 4. Conclusión

| Métrica | Objetivo | Resultado | Veredicto |
|---------|----------|-----------|-----------|
| SPI final | ≥ 0.95 | **1.00** | ✅ Proyecto entregado en tiempo |
| CPI final | ≥ 0.95 | **0.99** | ✅ Sobrecosto dentro de tolerancia (1%) |
| Story Points completados | 69 | **69** | ✅ 100% del alcance entregado |
| Contingencia utilizada | $16,408 disponible | $748 (4.6%) | ✅ Contingencia prácticamente intacta |

El proyecto se completó según el cronograma planificado, con un sobrecosto marginal del 1% que se encuentra ampliamente dentro del margen de contingencia. La única desviación significativa (Sprint 3) fue corregida en el sprint siguiente mediante acción correctiva oportuna.
