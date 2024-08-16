import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';

dotenv.config();

const app = express();

// Enable CORS for the frontend application
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));

app.use(express.json());

// Route configurations
app.use('/api', authRoutes);
app.use('/api', fileRoutes);

export default app;
