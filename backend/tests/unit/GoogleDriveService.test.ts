import { OAuth2Client } from 'google-auth-library';
import { drive_v3, google } from 'googleapis';
import { Readable } from 'stream';
import { GoogleDriveService } from '../../src/services/GoogleDriveService';

jest.mock('googleapis', () => ({
  google: {
    drive: jest.fn().mockReturnValue({
      files: {
        list: jest.fn(),
        create: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    }),
  },
}));

describe('GoogleDriveService', () => {
  let googleDriveService: GoogleDriveService;
  let mockFiles: jest.Mocked<drive_v3.Resource$Files>;

  beforeEach(() => {
    googleDriveService = new GoogleDriveService();
    const driveInstance = google.drive({ version: 'v3' });
    mockFiles = driveInstance.files as jest.Mocked<drive_v3.Resource$Files>;
  });

  it('should list files from Google Drive', async () => {
    const mockResponse: drive_v3.Schema$FileList = {
      files: [{ id: '1', name: 'file.txt' }],
    };
    (mockFiles.list as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

    const files = await googleDriveService.listFiles('mockAccessToken');

    expect(mockFiles.list).toHaveBeenCalledWith({
      auth: expect.any(OAuth2Client),
      pageSize: 10,
      fields: 'files(id, name, mimeType, modifiedTime)',
    });
    expect(files).toEqual(mockResponse.files);
  });

  it('should upload a file to Google Drive', async () => {
    const mockFile = {
      originalname: 'file.txt',
      mimetype: 'text/plain',
      buffer: Buffer.from('test content'),
    } as Express.Multer.File;

    const mockResponse: drive_v3.Schema$File = { id: 'mockFileId' };
    (mockFiles.create as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

    const fileId = await googleDriveService.uploadFile(mockFile, 'mockAccessToken');

    expect(mockFiles.create).toHaveBeenCalledWith({
      auth: expect.any(OAuth2Client),
      requestBody: { name: mockFile.originalname },
      media: {
        mimeType: mockFile.mimetype,
        body: expect.any(Readable),
      },
      fields: 'id',
    });
    expect(fileId).toBe('mockFileId');
  });

  it('should delete a file from Google Drive', async () => {
    (mockFiles.delete as jest.Mock).mockResolvedValueOnce({});

    await googleDriveService.deleteFile('mockFileId', 'mockAccessToken');

    expect(mockFiles.delete).toHaveBeenCalledWith({
      auth: expect.any(OAuth2Client),
      fileId: 'mockFileId',
    });
  });
});
