import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    return response.data[0].embedding;
}

export async function generateStory(prompt, context) {
    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: `You are a creative storyteller who writes engaging children's stories. 
                Use the following context to enhance your story: ${context}`
            },
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
    });

    return response.choices[0].message.content;
}