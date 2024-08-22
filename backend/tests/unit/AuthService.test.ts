import { AuthService } from '../../src/services/AuthService';

jest.mock('google-auth-library', () => {
    return {
        OAuth2Client: jest.fn().mockImplementation(() => {
            return {
                generateAuthUrl: jest.fn().mockReturnValue('mockAuthUrl'),
                getToken: jest.fn().mockResolvedValue({ tokens: { access_token: 'mockAccessToken' } }),
            };
        }),
    };
});

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    it('should generate an auth URL', () => {
        const url = authService.generateAuthUrl();
        expect(url).toBe('mockAuthUrl');
    });

    it('should authenticate a user with an authorization code', async () => {
        const tokens = await authService.authenticate('mockCode');
        expect(tokens.access_token).toBe('mockAccessToken');
    });
});
