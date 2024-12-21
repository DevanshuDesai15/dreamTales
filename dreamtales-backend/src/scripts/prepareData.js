import fs from 'fs/promises';
import path from 'path';
import embeddingService from '../services/embeddingService.js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { addToVectorStore } from '../services/pineconeService.js';

// Get the directory path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root (2 levels up from scripts folder)
dotenv.config({ path: join(__dirname, '../../.env') });

const sampleStories = [
    {
        id: 'story-1',
        theme: 'adventure',
        content: `# The Magic of Adventure
            In every great adventure, there's a moment of discovery...
            Stories about bravery and courage teach us important lessons...
            Adventures help children learn about overcoming challenges...`,
    },
    {
        id: 'story-2',
        theme: 'space',
        content: `# Exploring the Cosmos
            Space stories inspire wonder and curiosity...
            Tales of distant planets and stars capture imagination...
            Space adventures teach about science and exploration...`,
    },
    // Add more sample stories as needed
];

async function prepareAndStoreData() {
    try {
        console.log('Starting data preparation...');
        
        for (const story of sampleStories) {
            console.log(`Processing story: ${story.id}`);
            await addToVectorStore(story);
        }

        console.log('Data preparation completed successfully!');
    } catch (error) {
        console.error('Error preparing data:', error);
    }
}

// Run the preparation
prepareAndStoreData();