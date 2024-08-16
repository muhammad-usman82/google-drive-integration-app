import { drive_v3 } from 'googleapis';

/**
 * Interface for Google Drive service operations.
 */
export interface IGoogleDriveService {
    /**
     * Lists files from Google Drive.
     * 
     * @param {string} accessToken - The access token for authentication.
     * @returns {Promise<drive_v3.Schema$File[]>} - An array of file metadata.
     */
    listFiles(accessToken: string): Promise<drive_v3.Schema$File[]>;

    /**
     * Uploads a file to Google Drive.
     * 
     * @param {Express.Multer.File} file - The file to upload.
     * @param {string} accessToken - The access token for authentication.
     * @returns {Promise<string>} - The ID of the uploaded file.
     */
    uploadFile(file: Express.Multer.File, accessToken: string): Promise<string>;

    /**
     * Downloads a file from Google Drive by its ID.
     * 
     * @param {string} fileId - The ID of the file to download.
     * @param {string} accessToken - The access token for authentication.
     * @param {Response} res - The response object to pipe the file stream into.
     * @returns {Promise<void>} - A promise that resolves when the file has been downloaded.
     */
    downloadFile(fileId: string, accessToken: string, res: any): Promise<void>;

    /**
     * Deletes a file from Google Drive by its ID.
     * 
     * @param {string} fileId - The ID of the file to delete.
     * @param {string} accessToken - The access token for authentication.
     * @returns {Promise<void>} - A promise that resolves when the file has been deleted.
     */
    deleteFile(fileId: string, accessToken: string): Promise<void>;
}
