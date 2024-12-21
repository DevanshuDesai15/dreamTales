import embeddingService from '../services/embeddingService.js';

async function initialize() {
    try {
        console.log('Initializing embedding service...');
        
        // Initialize the embedding model
        await embeddingService.initialize();
        
        console.log('Embedding service initialized successfully!');
    } catch (error) {
        console.error('Error initializing:', error);
    }
}

initialize();