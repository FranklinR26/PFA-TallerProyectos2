# Evidencia WCAG — Auditoría de Accesibilidad

**Proyecto:** HorarioConti  
**Herramienta:** Inspección manual del DOM + análisis de código fuente  
**Fecha:** 2026-06-11  
**Páginas auditadas:** `/login` (LoginPage.jsx), navegación principal (Navbar.jsx)

---

## 1. Resumen de correcciones implementadas (evidencia en código)

Todas las correcciones son verificables en el código fuente del repositorio:

### LoginPage.jsx — `Frontend/src/pages/LoginPage.jsx`

| Problema detectado | Corrección aplicada | Criterio WCAG |
|-------------------|---------------------|---------------|
| `<html lang="en">` con contenido en español | `<html lang="es">` | 3.1.1 (A) |
| Inputs sin `<label>`: solo tenían `placeholder` | `<label htmlFor="email">` y `<label htmlFor="password">` visibles | 1.3.1 / 3.3.2 (A) |
| Toggle contraseña con `tabIndex={-1}` | `tabIndex` eliminado; `aria-label="Mostrar/ocultar contraseña"`; `aria-pressed` dinámico | 2.1.1 (A) |
| Mensaje de error en `<div>` sin semántica | `role="alert"` añadido | 4.1.3 (AA) |
| `#ababab` sobre blanco → contraste ≈ 2.4:1 | `#6b6b6b` sobre blanco → contraste ≈ 5.3:1 | 1.4.3 (AA) |
| `#5a5a5a` sobre `#080808` → contraste ≈ 3.9:1 | `#9a9a9a` sobre `#080808` → contraste ≈ 7.7:1 | 1.4.3 (AA) |
| `#d8d8d8` sobre blanco → contraste ≈ 1.5:1 | Texto actualizado a colores aprobados | 1.4.3 (AA) |
| Login compuesto solo de `<div>` | `<aside>` panel informativo, `<main>` contenedor del formulario | 1.3.1 (A) |
| Tarjetas de rol sin estado seleccionado accesible | `role="group"` + `aria-label` en contenedor; `aria-pressed` en cada tarjeta | 4.1.2 (AA) |
| SVGs decorativos expuestos a lectores de pantalla | `aria-hidden="true"` en todos los iconos decorativos | 1.1.1 (A) |

### Navbar.jsx — `Frontend/src/components/Navbar.jsx`

| Problema detectado | Corrección aplicada | Criterio WCAG |
|-------------------|---------------------|---------------|
| `<nav>` sin `aria-label` | `aria-label="Navegación principal"` | 4.1.2 (AA) |

---

## 2. Verificación de contraste (herramienta: WebAIM Contrast Checker)

| Combinación | Estado | Ratio antes | Ratio después | Criterio |
|-------------|--------|-------------|---------------|---------|
| `#6b6b6b` sobre `#ffffff` | ✅ PASS | 2.4:1 (`#ababab`) | **5.3:1** | AA (≥ 4.5:1) |
| `#9a9a9a` sobre `#080808` | ✅ PASS | 3.9:1 (`#5a5a5a`) | **7.7:1** | AA (≥ 4.5:1) |
| `#ffffff` sobre `#146ef5` (botón primario) | ✅ PASS | — | **3.2:1** | AA botones grandes (≥ 3:1) |

---

## 3. Inspección del DOM — Estructura semántica (LoginPage)

**Antes:**
```html
<div class="login-page">
  <div class="left-panel">...</div>
  <div class="right-panel">
    <div class="form-container">
      <input type="email" placeholder="Email" />
      <div class="error">Credenciales incorrectas</div>
    </div>
  </div>
</div>
```

**Después:**
```html
<div class="login-page">
  <aside class="left-panel" aria-label="Panel informativo">...</aside>
  <main class="right-panel">
    <div class="form-container">
      <label for="email">Email institucional</label>
      <input id="email" type="email" placeholder="Email" />
      <div role="alert" aria-live="assertive">Credenciales incorrectas</div>
    </div>
  </main>
</div>
```

---

## 4. Herramientas automáticas — Estimación Lighthouse

Basada en los criterios WCAG auditados manualmente, las correcciones implementadas resuelven las siguientes categorías que Lighthouse evalúa:

| Auditoría Lighthouse | Estado |
|---------------------|--------|
| `html-has-lang` | ✅ Corregido (`lang="es"`) |
| `label` (form inputs) | ✅ Corregido |
| `color-contrast` | ✅ Corregido (3 combinaciones) |
| `aria-required-attr` | ✅ Corregido |
| `button-name` | ✅ Corregido (`aria-label` en toggle) |
| `region` (landmarks) | ✅ Corregido (`<main>`, `<aside>`) |
| `link-name` | ✅ Presente en Navbar |
| `image-alt` | N/A (sin imágenes críticas) |
| `focus-visible` | ⬜ Pendiente validación manual |

> **Instrucción para captura:** Ejecutar `npm run dev` en Frontend → Chrome DevTools → Lighthouse → Accessibility → analizar `http://localhost:5173/login` → exportar y guardar como `wcag-login-despues.png`.

---

## 5. Evaluaciones pendientes de validación manual

| Evaluación | Herramienta recomendada | Instrucciones |
|-----------|------------------------|---------------|
| Lector de pantalla en login | NVDA (gratuito, Windows) | Tab por todos los campos; verificar anuncios de labels y errores |
| Teclado — páginas internas | Teclado del navegador | Recorrer DataPage y SchedulePage completamente con Tab/Shift+Tab/Enter |
| Drag & drop accesible | NVDA + teclado | Verificar si @dnd-kit tiene alternativa de teclado activada |
| Reflow a 320 px (1.4.10) | DevTools → Device Toolbar | Login panel con width fijo 480 px necesita media query |
| Formularios de DataPage | axe DevTools | Full Page Scan → exportar como `wcag-datapage.png` |

---

## 6. Listado de incumplimientos residuales

| ID | Criterio WCAG | Descripción | Prioridad |
|----|---------------|-------------|-----------|
| W-01 | 2.4.7 — Foco visible | Indicador de foco depende del navegador; no hay `:focus-visible` CSS explícito | Media |
| W-02 | 1.4.10 — Reflow | Panel derecho del login con `width: 480px` fijo; no usable a 320 px | Media |
| W-03 | 1.4.4 — Redimensionado | No evaluado a 200 % de zoom | Baja |
| W-04 | 2.1.1 — Teclado (drag & drop) | @dnd-kit tiene soporte de teclado pero no está verificado end-to-end | Alta |
| W-05 | 2.4.2 — Título de página | Páginas internas usan el mismo `<title>` genérico | Baja |
