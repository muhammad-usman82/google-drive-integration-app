import { Request, Response } from 'express';
import { GoogleDriveService } from '../services/GoogleDriveService';

/**
 * Controller responsible for managing Google Drive file operations.
 */
export class FileController {
  private readonly googleDriveService: GoogleDriveService;

  constructor() {
    // Consider using dependency injection for easier testing and flexibility.
    this.googleDriveService = new GoogleDriveService();
  }

  /**
   * Lists files from Google Drive for the authenticated user.
   * 
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} - A promise that resolves with the list of files.
   */
  public async listFiles(req: Request, res: Response): Promise<Response> {
    try {
      const accessToken = this.extractAccessToken(req);
      const files = await this.googleDriveService.listFiles(accessToken);
      return res.status(200).json(files);
    } catch (error) {
      return this.handleError(res, error, 'Failed to list files.');
    }
  }

  /**
   * Uploads a file to Google Drive.
   * 
   * @param {Request} req - The request object containing the file.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} - A promise that resolves when the file is uploaded.
   */
  public async uploadFile(req: Request, res: Response): Promise<Response> {
    try {
      const accessToken = this.extractAccessToken(req);
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided.' });
      }
      const fileId = await this.googleDriveService.uploadFile(req.file, accessToken);
      return res.status(201).json({ fileId });
    } catch (error) {
      return this.handleError(res, error, 'Failed to upload file.');
    }
  }

  /**
   * Downloads a file from Google Drive by its ID.
   * 
   * @param {Request} req - The request object containing the file ID.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the file is downloaded.
   */
  public async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const accessToken = this.extractAccessToken(req);
      const { id } = req.params;
      await this.googleDriveService.downloadFile(id, accessToken, res);
    } catch (error) {
      this.handleError(res, error, 'Failed to download file.');
    }
  }

  /**
   * Deletes a file from Google Drive by its ID.
   * 
   * @param {Request} req - The request object containing the file ID.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} - A promise that resolves when the file is deleted.
   */
  public async deleteFile(req: Request, res: Response): Promise<Response> {
    try {
      const accessToken = this.extractAccessToken(req);
      const { id } = req.params;
      await this.googleDriveService.deleteFile(id, accessToken);
      return res.sendStatus(204); // 204 No Content
    } catch (error) {
      return this.handleError(res, error, 'Failed to delete file.');
    }
  }

  /**
   * Extracts the access token from the Authorization header.
   * 
   * @param {Request} req - The request object.
   * @returns {string} - The extracted access token.
   * @throws {Error} - If the access token is missing or malformed.
   */
  private extractAccessToken(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header is missing.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Access token is missing.');
    }

    return token;
  }

  /**
   * Handles errors by sending an appropriate response.
   * 
   * @param {Response} res - The response object.
   * @param {unknown} error - The error to handle.
   * @param {string} contextMessage - A contextual message to include with the error.
   * @returns {Response} - The response with the error status and message.
   */
  private handleError(res: Response, error: unknown, contextMessage: string): Response {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`${contextMessage} ${errorMessage}`);
    return res.status(500).json({ error: contextMessage });
  }
}
