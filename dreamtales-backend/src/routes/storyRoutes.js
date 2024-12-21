import express from 'express';
import { retrieveContext, generateStoryWithAI } from '../controller/storyController.js';

const router = express.Router();

router.post('/retrieve-context', retrieveContext);
router.post('/generate-story', generateStoryWithAI);

export { router as storyRoutes };
