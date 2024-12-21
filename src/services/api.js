const API_BASE_URL = 'http://localhost:3001/api';

export const generateStoryAPI = async ({ characterName, theme, length, timestamp }) => {
    try {
        // First, get relevant context
        const contextResponse = await fetch(`${API_BASE_URL}/retrieve-context`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({ theme, length, timestamp }),
        });

        if (!contextResponse.ok) {
            throw new Error('Failed to retrieve context');
        }

        const { context } = await contextResponse.json();

        // Then, generate the story
        const storyResponse = await fetch(`${API_BASE_URL}/generate-story`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({
                character_name: characterName,
                theme,
                length,
                context,
                timestamp
            }),
        });

        if (!storyResponse.ok) {
            throw new Error('Failed to generate story');
        }

        const { story } = await storyResponse.json();
        return story;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};