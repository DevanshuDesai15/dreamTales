import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { storyRoutes } from './routes/storyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

console.log('Looking for .env file at:', envPath);
dotenv.config({ path: envPath });

console.log('Environment variables:', {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY ? 'Present' : 'Missing',
    PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT ? 'Present' : 'Missing',
    PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME ? 'Present' : 'Missing'
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Cache-Control'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', storyRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});