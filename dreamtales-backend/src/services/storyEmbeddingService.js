import embeddingService from './embeddingService.js';
import { queryContext, addToVectorStore } from './pineconeService.js';

class StoryEmbeddingService {
    async findSimilarStories(query, theme, count = 3) {
        try {
            // Get relevant context based on the query and theme
            const context = await queryContext(theme);
            
            return {
                context,
                similarityScore: context.score
            };
        } catch (error) {
            console.error('Error finding similar stories:', error);
            throw error;
        }
    }

    async addNewStory(storyData) {
        try {
            const { title, content, theme } = storyData;
            
            const story = {
                id: `story-${Date.now()}`,
                theme,
                content: `# ${title}\n${content}`,
            };

            await addToVectorStore(story);
            return story.id;
        } catch (error) {
            console.error('Error adding new story:', error);
            throw error;
        }
    }

    async generateStoryPrompt(theme, context) {
        // Combine theme and retrieved context to create an enhanced prompt
        const prompt = `
            Theme: ${theme}
            
            Relevant Context:
            ${context}
            
            Please create a unique story incorporating elements from this context while maintaining originality.
        `;

        return prompt;
    }
}

export default new StoryEmbeddingService();