import request from 'supertest';
import app from '../../src/app';
import { GoogleDriveService } from '../../src/services/GoogleDriveService';

jest.mock('../../src/services/GoogleDriveService');

describe('FileController', () => {
  let googleDriveService: jest.Mocked<GoogleDriveService>;

  beforeAll(() => {
    googleDriveService = new GoogleDriveService() as jest.Mocked<GoogleDriveService>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list files from Google Drive', async () => {
    const mockFiles = [{ id: '1', name: 'file.txt' }];
    googleDriveService.listFiles.mockResolvedValue(mockFiles);

    const response = await request(app)
      .get('/api/files')
      .set('Authorization', 'Bearer mockAccessToken');

    expect(response.status).toBe(200);
  });

  it('should upload a file to Google Drive', async () => {
    const mockFileId = 'mockFileId';
    googleDriveService.uploadFile.mockResolvedValue(mockFileId);

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', 'Bearer mockAccessToken')
      .attach('file', Buffer.from('test content'), 'test.txt');

    expect(response.status).toBe(201);
  });

  it('should return 400 if no file is provided during upload', async () => {
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', 'Bearer mockAccessToken');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No file provided.');
  });

  it('should delete a file from Google Drive', async () => {
    googleDriveService.deleteFile.mockResolvedValue();

    const response = await request(app)
      .delete('/api/delete/1')
      .set('Authorization', 'Bearer mockAccessToken');

    expect(response.status).toBe(204);
  });
});
