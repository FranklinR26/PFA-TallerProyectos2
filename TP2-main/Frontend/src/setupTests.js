import '@testing-library/jest-dom'

// MSW: start server for integration tests (node environment)
if (typeof process !== 'undefined' && process.env.VITEST) {
	// dynamic import to avoid CJS/ESM interop issues
	import('./mocks/server').then(async ({ server }) => {
		server.listen({ onUnhandledRequest: 'warn' })
		const { afterAll } = await import('vitest')
		afterAll(() => server.close())
	})
}
