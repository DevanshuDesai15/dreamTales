import { useState } from "react";
import {
    Button,
    TextField,
    MenuItem,
    Card,
    CardContent,
    CardHeader,
    Select,
    FormControl,
    InputLabel,
    Typography,
    CircularProgress,
    Paper,
    Box,
    Divider,
} from '@mui/material';
import { NightsStay as MoonIcon, AutoAwesome as SparklesIcon, AutoStories as StoryIcon } from '@mui/icons-material';
import { marked } from "marked";
import { generateStoryAPI } from './services/api';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify'; // For sanitizing HTML

// Configure marked to handle GitHub Flavored Markdown
marked.setOptions({
    gfm: true,
    breaks: true
});

// Custom renderer to prevent unwanted bold text
const renderer = new marked.Renderer();
renderer.strong = (text) => text; // Prevent bold text
marked.use({ renderer });

const storyStyles = {
    storyContainer: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
    },
    storyHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    storyContent: {
        '& h1': {
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#2c3e50',
            fontFamily: '"Playfair Display", serif',
        },
        '& p': {
            fontSize: '1.1rem',
            fontWeight: '400',
            lineHeight: '1.8',
            color: '#34495e',
            marginBottom: '1.2rem',
            fontFamily: '"Merriweather", serif',
        },
        '& strong': {
            fontWeight: '400', // Prevent bold text
        }
    },
    divider: {
        margin: '1.5rem 0',
        background: 'linear-gradient(to right, transparent, #3498db, transparent)',
        height: '2px',
    },
    endText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#7f8c8d',
        marginTop: '2rem',
    }
};

export default function DreamTales() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [characterName, setCharacterName] = useState("");
    const [theme, setTheme] = useState("adventure");
    const [length, setLength] = useState("short");
    const [storyOutput, setStoryOutput] = useState(
        "Your magical story will appear here..."
    );

    const generateStory = async () => {
        if (isGenerating) return;

        if (!characterName) {
            alert("Please enter a character name");
            return;
        }

        setIsGenerating(true);
        setStoryOutput("Generating your magical story...");

        try {
            const story = await generateStoryAPI({
                characterName,
                theme,
                length,
                timestamp: Date.now()
            });

            // Just set the raw markdown, don't parse it yet
            setStoryOutput(story);
        } catch (error) {
            console.error('Error:', error);
            setStoryOutput(
                "Sorry, there was an error generating your story. Please try again."
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const renderStory = (content) => {
        if (isGenerating) {
            return '<p class="text-center">✨ Creating your magical story... ✨</p>';
        }

        try {
            // Clean up any remaining markdown artifacts
            const cleanContent = content
                .replace(/===+/g, '')
                .replace(/```/g, '')
                .replace(/\*\*/g, '')
                .replace(/markdown/g, '')
                .trim();

            // Parse markdown and sanitize HTML
            const parsedContent = marked.parse(cleanContent);
            const sanitizedHtml = DOMPurify.sanitize(parsedContent);
            return sanitizedHtml;
        } catch (error) {
            console.error('Error rendering story:', error);
            return content; // Fallback to raw content if parsing fails
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 relative bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
            {/* Add decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/3 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Existing content */}
            <div className="relative"> {/* Add relative wrapper to keep content above background */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                    ✨ DreamTales ✨
                </h1>
                <div className="max-w-4xl mx-auto">
                    <Card sx={{ mb: 4 }}>
                        <CardHeader title="Create Your Magical Bedtime Story" />
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Main Character's Name"
                                placeholder="Enter character name..."
                                value={characterName}
                                onChange={(e) => setCharacterName(e.target.value)}
                                fullWidth
                            />

                            <FormControl fullWidth>
                                <InputLabel>Story Theme</InputLabel>
                                <Select
                                    value={theme}
                                    label="Story Theme"
                                    onChange={(e) => setTheme(e.target.value)}
                                >
                                    <MenuItem value="adventure">Magical Adventure</MenuItem>
                                    <MenuItem value="space">Space Journey</MenuItem>
                                    <MenuItem value="forest">Enchanted Forest</MenuItem>
                                    <MenuItem value="ocean">Ocean Discovery</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Story Length</InputLabel>
                                <Select
                                    value={length}
                                    label="Story Length"
                                    onChange={(e) => setLength(e.target.value)}
                                >
                                    <MenuItem value="short">Short (5 minutes)</MenuItem>
                                    <MenuItem value="medium">Medium (10 minutes)</MenuItem>
                                    <MenuItem value="long">Long (15 minutes)</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                variant="contained"
                                onClick={generateStory}
                                disabled={isGenerating}
                                startIcon={isGenerating ? <CircularProgress size={20} /> : <SparklesIcon />}
                                fullWidth
                            >
                                {isGenerating ? "Generating Story..." : "Generate Story"}
                            </Button>
                        </CardContent>
                    </Card>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        key={storyOutput}
                    >
                        <Paper sx={storyStyles.storyContainer}>
                            <Box sx={storyStyles.storyHeader}>
                                <StoryIcon sx={{ fontSize: 40, color: '#3498db' }} />
                                <Typography variant="h4" component="h2" color="primary">
                                    Your Magical Story
                                </Typography>
                            </Box>
                            <Divider sx={storyStyles.divider} />

                            <Box
                                sx={storyStyles.storyContent}
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: renderStory(storyOutput)
                                }}
                            />
                        </Paper>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}