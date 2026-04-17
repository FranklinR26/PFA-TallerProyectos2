const request = require('supertest');
const app = require('./server');

describe('Prueba de Integración Inicial', () => {
  it('Debe retornar status Online desde la API', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('Online');
  });
});