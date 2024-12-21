// USE FOR HUGGINGFACE
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY is not set in environment variables');
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function generateStory(prompt) {
    try {
        const { character_name, theme, length, timestamp } = JSON.parse(prompt);
        
        // Create a dynamic prompt with better formatting instructions
        const storyPrompt = `
[INST] Create a unique and original ${length} children's story about ${character_name} who discovers an amazing adventure in a ${theme} setting.

Story Requirements:
- Must be completely different from previous stories
- Include proper spacing between words and sentences
- Create clear paragraphs with line breaks
- Use proper punctuation and formatting
- Include dialogue with quotation marks
- Format in markdown with proper spacing
- Make it engaging for children
- Maximum 3-4 paragraphs per section
- Add line breaks between major scenes

Begin the story with a title using markdown heading (#):
[/INST]`;

        const response = await hf.textGeneration({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            inputs: storyPrompt,
            parameters: {
                // Adjust token length for better formatting
                max_new_tokens: length === 'short' ? 500 : 
                               length === 'medium' ? 750 : 
                               1000,
                temperature: 0.9,  // Slightly reduced for more coherent output
                top_p: 0.95,
                do_sample: true,
                repetition_penalty: 1.3,
                frequency_penalty: 1.2,  // Added to prevent word merging
            }
        });

        // Clean up the response
        let generatedStory = response.generated_text;
        
        // Remove instruction blocks
        generatedStory = generatedStory.replace(/\[INST\][\s\S]*?\[\/INST\]/g, '');
        
        generatedStory = generatedStory
        .replace(/\[INST\][\s\S]*?\[\/INST\]/g, '')
        .replace(/===+\s*Headers:/g, '')
        .replace(/===\s*Module[\s\S]*?===/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\*\*\*/g, '')
        .replace(/markdown/g, '')
        .replace(/Blockquotes & Code blocks:/g, '')
        .replace(/The End\./g, '\n\nThe End.')
        .trim();
        
        // Add title if missing
        if (!generatedStory.trim().startsWith('#')) {
            generatedStory = `# ${character_name}'s ${theme} Adventure\n\n${generatedStory}`;
        }

        // Ensure proper ending
        if (!generatedStory.toLowerCase().includes('the end')) {
            generatedStory += '\n\nThe End.';
        }

        return generatedStory;

    } catch (error) {
        console.error('Error generating story with Mistral:', error);
        throw error;
    }
}


// USE FOR OpenAI
// import OpenAI from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

// if (!process.env.OPENAI_API_KEY) {
//     throw new Error('OPENAI_API_KEY is not set in environment variables');
// }

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export async function generateStory(prompt) {
//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are a creative storyteller who writes engaging children's stories. Your stories should be formatted in markdown, include a title, and be engaging for children."
//                 },
//                 {
//                     role: "user",
//                     content: prompt
//                 }
//             ],
//             temperature: 0.7,
//             max_tokens: 1000,
//         });

//         return response.choices[0].message.content;
//     } catch (error) {
//         console.error('Error generating story with OpenAI:', error);
//         throw new Error('Failed to generate story');
//     }
// }

// USE FOR CLAUDE
// import { Anthropic } from '@anthropic-ai/sdk';

// // Initialize Anthropic client with your API key
// const anthropic = new Anthropic({
//     apiKey: process.env.CLAUDE_API_KEY,
// });

// export async function generateStory(prompt) {
//     try {
//         const response = await anthropic.messages.create({
//             model: "claude-3-sonnet-20240229",
//             max_tokens: 1000,
//             messages: [{
//                 role: "user",
//                 content: `You are a creative storyteller who writes engaging children's stories.
                
//                 Instructions:
//                 - Write the story in markdown format
//                 - Include a title with '#'
//                 - Add appropriate paragraphs and spacing
//                 - Keep the language child-friendly
//                 - Include a subtle moral lesson
                
//                 ${prompt}`
//             }],
//             temperature: 0.7, // Controls creativity vs consistency
//         });

//         // Extract the story from Claude's response
//         return response.content[0].text;
//     } catch (error) {
//         console.error('Error generating story with Claude:', error);
//         throw new Error('Failed to generate story');
//     }
// }