import { pipeline } from '@xenova/transformers';

class EmbeddingService {
    constructor() {
        this.embedder = null;
    }

    async initialize() {
        if (!this.embedder) {
            // Load the embedding model - this will download and cache the model locally
            this.embedder = await pipeline(
                'feature-extraction',
                'Xenova/all-MiniLM-L6-v2'  // Lightweight but effective model
            );
        }
    }

    async createEmbedding(text) {
        await this.initialize();
        
        try {
            // Generate embeddings
            const output = await this.embedder(text, {
                pooling: 'mean',
                normalize: true,
            });

            // Convert to Array for compatibility with vector databases
            return Array.from(output.data);
        } catch (error) {
            console.error('Error creating embedding:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const embeddingService = new EmbeddingService();
export default embeddingService;