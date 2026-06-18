# Checklist de Accesibilidad — WCAG 2.1 (Nivel AA)

**Proyecto:** HorarioConti — Sistema de Horarios Académicos
**Fecha de evaluación:** 2026-06-11
**Método:** inspección manual del DOM + revisión de código fuente. Complementar con Lighthouse (pestaña *Accessibility*) y la extensión **axe DevTools** para los reportes automáticos exigidos por la consigna (capturar y guardar en `docs/calidad/evidencias/`).

## 1. Resultados por criterio

| Criterio WCAG | Descripción | Resultado inicial | Estado |
|---------------|-------------|-------------------|--------|
| 3.1.1 Idioma de la página | `<html lang>` debe reflejar el idioma del contenido | ❌ `lang="en"` con contenido en español | ✅ Corregido → `lang="es"` (`Frontend/index.html`) |
| 1.3.1 / 3.3.2 Etiquetas en formularios | Inputs identificados programáticamente | ❌ Login usaba solo `placeholder` | ✅ Corregido → `<label htmlFor>` visibles para email y contraseña |
| 2.1.1 Teclado | Toda la funcionalidad operable por teclado | ❌ Botón mostrar/ocultar contraseña con `tabIndex={-1}` | ✅ Corregido → enfocable, con `aria-label` y `aria-pressed` |
| 4.1.3 Mensajes de estado | Errores anunciados a lectores de pantalla | ❌ Error de login en `div` sin rol | ✅ Corregido → `role="alert"` |
| 1.4.3 Contraste mínimo (4.5:1) | Texto normal con contraste suficiente | ❌ `#ababab` sobre blanco ≈ 2.4:1; `#5a5a5a` sobre `#080808` ≈ 3.9:1; `#d8d8d8` sobre blanco ≈ 1.5:1 | ✅ Corregido → `#6b6b6b` sobre blanco ≈ 5.3:1; `#9a9a9a` sobre `#080808` ≈ 7.7:1 |
| 1.3.1 Estructura semántica | Landmarks y jerarquía de encabezados | ❌ Página de login compuesta solo por `div` | ✅ Corregido → `<aside>` panel informativo, `<main>` formulario; `<nav>` con `aria-label` en Navbar |
| 4.1.2 Nombre, función, valor | Controles personalizados con estado expuesto | ❌ Tarjetas de rol sin estado seleccionado accesible | ✅ Corregido → `role="group"` + `aria-pressed` en cada tarjeta |
| 1.1.1 Contenido no textual | Iconos decorativos ocultos a AT | ⚠️ SVGs decorativos expuestos | ✅ Corregido en login (`aria-hidden="true"`) |
| 2.4.7 Foco visible | Indicador de foco perceptible | ⚠️ Dependía de estilos del navegador | ✅ Corregido → regla global `:focus-visible` (outline 2px azul) en `Frontend/src/index.css` |
| 1.4.10 Reflow / responsive | Usable a 320 px de ancho | ❌ Panel derecho de login con ancho fijo 480 px | ✅ Corregido → media query `≤600px` colapsa login a una columna en `index.css` (sin scroll horizontal a 320px) |
| 2.4.2 Título de página | Título descriptivo | ✅ "HorarioConti — Universidad Continental" | ✅ Sin cambios |
| 1.4.4 Redimensionado de texto | Zoom 200 % sin pérdida | ⚠️ No evaluado | ⬜ Pendiente de validación manual |

## 2. Evaluaciones obligatorias de la consigna — estado

| Evaluación | Estado |
|------------|--------|
| Contraste de colores | ✅ Auditado y corregido en login/navbar; ⬜ repetir en páginas internas con axe |
| Navegación por teclado | ✅ Login corregido; ⬜ validar Datos/Generar/Horario (drag & drop de @dnd-kit necesita alternativa por teclado) |
| Estructura semántica HTML | ✅ Login y Navbar; ⬜ añadir `<main>` en páginas internas |
| Uso correcto de etiquetas | ✅ Formulario de login |
| Lectores de pantalla | ⬜ Probar con NVDA (gratuito, Windows) y documentar |
| Accesibilidad de formularios | ✅ Login; ⬜ formularios de DataPage |
| Multimedia | N/A — la aplicación no incluye audio/video |
| Accesibilidad funcional | ⬜ Recorrido completo con teclado + NVDA |

## 3. Cómo generar los reportes automáticos (evidencia obligatoria)

1. `cd TP2-main/Frontend && npm run dev`
2. Chrome → DevTools → **Lighthouse** → categoría *Accessibility* → analizar `http://localhost:5173/login` y cada página interna. Exportar HTML/captura.
3. Instalar **axe DevTools** y ejecutar *Full Page Scan* en las mismas páginas. Exportar resultados.
4. Guardar todo en `docs/calidad/evidencias/` con nombre `wcag-<pagina>-<antes|despues>.png`.
