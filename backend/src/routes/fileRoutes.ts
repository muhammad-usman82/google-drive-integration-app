import express from 'express';
import multer from 'multer';
import { FileController } from '../controllers/FileController';

const router = express.Router();
const fileController = new FileController();
const upload = multer();

// Route for listing files in Google Drive
router.get('/files', (req, res) => fileController.listFiles(req, res));

// Route for uploading a file to Google Drive
router.post('/upload', upload.single('file'), (req, res) => fileController.uploadFile(req, res));

// Route for downloading a file from Google Drive by ID
router.get('/download/:id', (req, res) => fileController.downloadFile(req, res));

// Route for deleting a file from Google Drive by ID
router.delete('/delete/:id', (req, res) => fileController.deleteFile(req, res));

export default router;
