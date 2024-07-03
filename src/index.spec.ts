import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });
});
