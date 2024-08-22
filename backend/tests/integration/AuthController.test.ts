import express, { Request, Response } from 'express';
import request from 'supertest';
import { AuthController } from '../../src/controllers/AuthController';
import { AuthService } from '../../src/services/AuthService';

jest.mock('../../src/services/AuthService');

describe('AuthController', () => {
  let app: express.Application;
  let authService: jest.Mocked<AuthService>;
  let authController: AuthController;

  beforeEach(() => {
    authService = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController();
    app = express();
    app.use(express.json());

    app.get('/auth', (req: Request, res: Response) => authController.getAuthUrl(req, res));
    app.post('/auth/callback', (req: Request, res: Response) => authController.authenticate(req, res));
  });

  it('should return the authorization URL', async () => {

    const response = await request(app).get('/auth');
    expect(response.status).toBe(200);
  });

  it('should return 400 if the authorization code is missing', async () => {
    const response = await request(app)
      .post('/auth/callback')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Authorization code is required.');
  });
});
