import request from 'supertest';
import app from '../../src/app';
import { AuthService } from '../../src/services/AuthService';

jest.mock('../../src/services/AuthService');

describe('AuthController', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    it('should redirect to Google OAuth URL', async () => {
        const mockAuthUrl = 'https://mockauthurl.com';
        jest.spyOn(authService, 'generateAuthUrl').mockReturnValue(mockAuthUrl);

        const response = await request(app).get('/api/auth');

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe(mockAuthUrl);
    });

    it('should handle authentication callback', async () => {
        const mockCode = 'mock-code';
        jest.spyOn(authService, 'authenticate').mockResolvedValueOnce();

        const response = await request(app).get(`/api/auth/callback?code=${mockCode}`);

        expect(authService.authenticate).toHaveBeenCalledWith(mockCode);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Authentication successful');
    });
});
