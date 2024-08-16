import { AuthService } from '../../src/services/AuthService';

describe('AuthService', () => {
  it('should generate a valid auth URL', () => {
    const authService = new AuthService();
    const url = authService.generateAuthUrl();
    expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
  });

  it('should authenticate user with valid code', async () => {
    const authService = new AuthService();
    await expect(authService.authenticate('valid_code')).resolves.not.toThrow();
  });
});
