import { populateVectorStore } from '../services/pineconeService.js';

const sampleStories = [
    {
        id: '1',
        theme: 'adventure',
        content: 'Sample adventure story content...',
    },
    {
        id: '2',
        theme: 'space',
        content: 'Sample space story content...',
    },
    // Add more sample stories
];

async function populate() {
    try {
        await populateVectorStore(sampleStories);
        console.log('Vector store populated successfully');
    } catch (error) {
        console.error('Error populating vector store:', error);
    }
}

populate();