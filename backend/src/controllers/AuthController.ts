import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

/**
 * Controller responsible for managing authentication workflows.
 */
export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    // Dependency injection pattern could be used here for more flexibility
    this.authService = new AuthService();
  }

  /**
   * Initiates the OAuth2 login process by generating a Google authorization URL.
   * 
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void} - Responds with the authorization URL as a JSON object.
   */
  public getAuthUrl(req: Request, res: Response): void {
    try {
      const url = this.authService.generateAuthUrl();
      res.status(200).json({ url });
    } catch (error) {
      console.error('Error generating OAuth URL:', error);
      res.status(500).json({ error: 'Failed to generate OAuth URL.' });
    }
  }

  /**
   * Handles the OAuth2 callback, exchanges the authorization code for tokens,
   * and authenticates the user.
   * 
   * @param {Request} req - The Express request object containing the authorization code.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} - A promise that resolves when authentication is complete.
   */
  public async authenticate(req: Request, res: Response): Promise<void> {
    const { code } = req.body;

    if (!code) {
      res.status(400).json({ error: 'Authorization code is required.' });
      return;
    }

    try {
      const tokens = await this.authService.authenticate(code);
      res.status(200).json(tokens);
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).json({ error: 'Authentication failed.' });
    }
  }
}
