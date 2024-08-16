import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

// Routes for handling authentication
router.get('/auth', (req, res) => authController.getAuthUrl(req, res));
router.post('/auth/callback', (req, res) => authController.authenticate(req, res));

export default router;
