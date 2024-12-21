import storyEmbeddingService from '../services/storyEmbeddingService.js';
import { generateStory } from '../services/aiService.js';

export async function retrieveContext(req, res) {
    try {
        const { theme, length } = req.body;
        
        // Find similar stories based on theme
        const { context } = await storyEmbeddingService.findSimilarStories(
            `${theme} story ${length}`,
            theme
        );
        
        res.json({ context });
    } catch (error) {
        console.error('Error retrieving context:', error);
        res.status(500).json({ error: 'Failed to retrieve context' });
    }
}

export async function generateStoryWithAI(req, res) {
    try {
        const { character_name, theme, length, timestamp } = req.body;

        if (!character_name || !theme || !length) {
            return res.status(400).json({
                error: 'Missing required parameters',
                message: 'Please provide character_name, theme, and length'
            });
        }

        // Add randomness to the prompt to ensure unique stories
        const randomSeed = Math.random().toString(36).substring(7);
        
        const storyPrompt = JSON.stringify({
            character_name,
            theme,
            length,
            timestamp,
            randomSeed
        });

        const story = await generateStory(storyPrompt);
        
        res.json({ 
            story,
            generated_at: Date.now()
        });
    } catch (error) {
        console.error('Error in story generation:', error);
        res.status(500).json({ 
            error: 'Story generation failed',
            message: 'Unable to generate story at this time. Please try again.',
            details: error.message
        });
    }
}