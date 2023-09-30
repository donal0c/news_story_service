import NewsService from './services/newsService.js';
import SentimentService from './services/newsSentimentService.js';
import StoryService from './services/storyService.js';
import ImageService from "./services/imageService.js";
import { config } from 'dotenv';
config();

const newsService = new NewsService(process.env.NEWS_SERVICE_KEY);
const sentimentService = new SentimentService(process.env.HUGGINGFACE_KEY);
const storyService = new StoryService(process.env.OPENAI_API_KEY);
const imageService = new ImageService(process.env.OPENAI_API_KEY);

function rankHeadlines(analyzedHeadlines) {
    return analyzedHeadlines.sort((a, b) => (b.sentiment === 'positive') - (a.sentiment === 'positive'));
}

async function main() {
    try {
        const headlines = await newsService.fetchTopHeadlines();
        const sentiments = await sentimentService.analyzeHeadlines(headlines);
        const analyzedHeadlines = headlines.map((headline, index) => ({
            headline,
            sentiment: sentiments[index]
        }));
        const rankedHeadlines = rankHeadlines(analyzedHeadlines);
        const topHeadline = rankedHeadlines.find(h => h.sentiment === 'positive');

        let content;
        if (topHeadline) {
            const story = await storyService.generateStory(topHeadline.headline);
            content = story;
            console.log(`Humorous story based on top-ranked headline: ${story}`);
        } else {
            const historicalFact = await storyService.fetchHistoricalFact();
            content = historicalFact;
            console.log(`No positive headlines found. Here's an interesting historical fact instead: ${historicalFact}`);
        }

        const imagePrompt = await storyService.generateImagePrompt(content);
        console.log("##########################")
        console.log("##########################")
        console.log(`Image-friendly prompt: ${imagePrompt}`);
        console.log("##########################")
        console.log("##########################")

        // Generate an image based on the image-friendly prompt
        const imageUrl = await imageService.generateImage(imagePrompt);

        console.log(`Generated image URL: ${imageUrl}`);

    } catch (error) {
        console.error(`Error in main function: ${error.message}`);
    }
}

main();
