import { Pinecone } from '@pinecone-database/pinecone';
import embeddingService from './embeddingService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

console.log('PineconeService looking for .env at:', envPath);
dotenv.config({ path: envPath });

console.log('Attempting to initialize Pinecone with:', {
    apiKey: process.env.PINECONE_API_KEY ? 'Present' : 'Missing'
});

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not defined in environment variables');
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export async function queryContext(theme, length) {
    try {
        // Create embedding for the query
        const queryEmbedding = await embeddingService.createEmbedding(
            `${theme} story ${length} length`
        );

        // Query Pinecone
        const queryResponse = await index.query({
            vector: queryEmbedding,
            filter: { theme: theme },
            topK: 3,
            includeMetadata: true,
        });

        return queryResponse.matches.map(match => match.metadata.content).join('\n');
    } catch (error) {
        console.error('Error querying context:', error);
        throw error;
    }
}

export async function addToVectorStore(story) {
    try {
        const embedding = await embeddingService.createEmbedding(story.content);
        
        await index.upsert([{
            id: story.id,
            values: embedding,
            metadata: {
                theme: story.theme,
                content: story.content,
            },
        }]);
    } catch (error) {
        console.error('Error adding to vector store:', error);
        throw error;
    }
}