import { OAuth2Client } from 'google-auth-library';
import { drive_v3, google } from 'googleapis';
import { Readable } from 'stream';
import { IGoogleDriveService } from '../interfaces/IGoogleDriveService';

export class GoogleDriveService implements IGoogleDriveService {
  private drive: drive_v3.Drive;

  constructor() {
    this.drive = google.drive({ version: 'v3' });
  }

  public async listFiles(accessToken: string): Promise<drive_v3.Schema$File[]> {
    const oauth2Client = this.createOAuthClient(accessToken);
    const response = await this.drive.files.list({
      auth: oauth2Client,
      pageSize: 10,
      fields: 'files(id, name, mimeType, modifiedTime)',
    });
    return response.data.files || [];
  }

  public async uploadFile(file: Express.Multer.File, accessToken: string): Promise<string> {
    const oauth2Client = this.createOAuthClient(accessToken);
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const fileMetadata = { name: file.originalname };
    const media = { mimeType: file.mimetype, body: bufferStream };

    try {
      const response = await this.drive.files.create({
        auth: oauth2Client,
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });
      return response.data.id || '';
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }

  public async downloadFile(fileId: string, accessToken: string, res: any): Promise<void> {
    const oauth2Client = this.createOAuthClient(accessToken);
    const response = await this.drive.files.get(
      { auth: oauth2Client, fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    response.data.pipe(res);
  }

  public async deleteFile(fileId: string, accessToken: string): Promise<void> {
    const oauth2Client = this.createOAuthClient(accessToken);
    await this.drive.files.delete({
      auth: oauth2Client,
      fileId,
    });
  }

  private createOAuthClient(accessToken: string): OAuth2Client {
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    return oauth2Client;
  }
}
