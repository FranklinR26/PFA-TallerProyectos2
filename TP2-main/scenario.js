/**
 * Escenario de GreenFrame (Playwright).
 *
 * Simula un flujo crítico en el frontend React: carga del portal, intento de
 * login y navegación. La interacción dura >= 10 s para estabilizar las
 * mediciones de energía y CO₂ que realiza GreenFrame.
 *
 * La función se exporta de forma EXPLÍCITA, como exige GreenFrame.
 *
 * @param {import('playwright').Page} page - Página controlada por GreenFrame.
 */
async function sustainabilityScenario(page) {
  // 1. Carga inicial del frontend.
  await page.goto(process.env.BASE_URL || 'http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 2. Flujo crítico: intento de inicio de sesión (fetch de datos al backend).
  try {
    const email = page.locator('input[type="email"], input[name="email"]').first();
    if (await email.count()) {
      await email.fill('demo@continental.edu.pe');
      const pass = page.locator('input[type="password"]').first();
      await pass.fill('demo-password');
      await page.waitForTimeout(1500);
      const submit = page.locator('button[type="submit"], button:has-text("Ingresar")').first();
      if (await submit.count()) {
        await submit.click();
        await page.waitForTimeout(2500);
      }
    }
  } catch {
    // El escenario no debe fallar la medición si el formulario cambia.
  }

  // 3. Navegación adicional para sostener la carga (total >= 10 s).
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2500);
}

module.exports = sustainabilityScenario;
