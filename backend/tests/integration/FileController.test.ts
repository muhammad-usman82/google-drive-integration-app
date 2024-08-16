import request from 'supertest';
import app from '../../src/app';

describe('FileController', () => {
    it('should list files', async () => {
        const res = await request(app).get('/api/files');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
