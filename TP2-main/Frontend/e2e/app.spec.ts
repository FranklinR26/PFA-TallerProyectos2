import { test, expect } from '@playwright/test'

test('home redirects to /login when unauthenticated', async ({ page, baseURL }) => {
  await page.goto(baseURL!)
  // app redirects to /login by default
  await expect(page).toHaveURL(/\/login/)
})
