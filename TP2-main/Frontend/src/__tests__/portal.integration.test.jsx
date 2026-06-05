import { describe, it, expect } from 'vitest'
import { getPortalData } from '../api/portalApi'

describe('portalApi (integration)', () => {
  it('fetches portal data via API', async () => {
    const res = await getPortalData()
    expect(res.status).toBe(200)
    expect(res.data).toHaveProperty('user')
    expect(res.data.user.name).toBe('Test User')
  })
})
