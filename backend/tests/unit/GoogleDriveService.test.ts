import { OAuth2Client } from 'google-auth-library';
import { drive_v3, google } from 'googleapis';
import { GoogleDriveService } from '../../src/services/GoogleDriveService';

jest.mock('googleapis', () => ({
  google: {
    drive: jest.fn(() => ({
      files: {
        list: jest.fn(),
        create: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    })),
  },
}));

describe('GoogleDriveService', () => {
  let googleDriveService: GoogleDriveService;
  let mockDriveFiles: jest.Mocked<drive_v3.Resource$Files>;

  beforeEach(() => {
    const authClient = new OAuth2Client();
    googleDriveService = new GoogleDriveService(authClient);

    const driveInstance = google.drive({ version: 'v3', auth: authClient });
    mockDriveFiles = driveInstance.files as jest.Mocked<drive_v3.Resource$Files>;
  });

  it('should list files from Google Drive', async () => {
    const mockFiles: drive_v3.Schema$File[] = [{ id: '1', name: 'testfile.txt' }];

    mockDriveFiles.list.mockImplementation(() =>
      Promise.resolve({ data: { files: mockFiles } } as drive_v3.Schema$FileList)
    );

    const files = await googleDriveService.listFiles();

    expect(mockDriveFiles.list).toHaveBeenCalled();
    expect(files).toEqual(mockFiles);
  });

  it('should upload a file to Google Drive', async () => {
    const mockFile = { originalname: 'testfile.txt', mimetype: 'text/plain', buffer: Buffer.from('test') };
    const mockFileId = 'mock-file-id';

    mockDriveFiles.create.mockImplementation(() =>
      Promise.resolve({ data: { id: mockFileId } } as drive_v3.Schema$File)
    );

    const fileId = await googleDriveService.uploadFile(mockFile as any);

    expect(mockDriveFiles.create).toHaveBeenCalledWith({
      requestBody: { name: mockFile.originalname },
      media: { mimeType: mockFile.mimetype, body: mockFile.buffer },
      fields: 'id',
    });
    expect(fileId).toBe(mockFileId);
  });

  it('should download a file from Google Drive', async () => {
    const mockFileId = 'mock-file-id';
    const mockResponseStream = { pipe: jest.fn() };

    mockDriveFiles.get.mockImplementation(() =>
      Promise.resolve({ data: mockResponseStream } as any)
    );

    const res = { pipe: jest.fn() };

    await googleDriveService.downloadFile(mockFileId, res as any);

    expect(mockDriveFiles.get).toHaveBeenCalledWith(
      { fileId: mockFileId, alt: 'media' },
      { responseType: 'stream' }
    );
    expect(mockResponseStream.pipe).toHaveBeenCalledWith(res);
  });

  it('should delete a file from Google Drive', async () => {
    const mockFileId = 'mock-file-id';

    mockDriveFiles.delete.mockImplementation(() =>
      Promise.resolve({} as drive_v3.Schema$File)
    );

    await googleDriveService.deleteFile(mockFileId);

    expect(mockDriveFiles.delete).toHaveBeenCalledWith({ fileId: mockFileId });
  });
});
