# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> home redirects to /login when unauthenticated
- Location: e2e\app.spec.ts:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test'
  2 | 
  3 | test('home redirects to /login when unauthenticated', async ({ page, baseURL }) => {
> 4 |   await page.goto(baseURL!)
    |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  5 |   // app redirects to /login by default
  6 |   await expect(page).toHaveURL(/\/login/)
  7 | })
  8 | 
```