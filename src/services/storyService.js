import { Configuration, OpenAIApi } from 'openai';

export default class StoryService {
    constructor(apiKey) {
        const configuration = new Configuration({
            organization: process.env.OPENAI_ORG,
            apiKey: apiKey
        });
        this.openai = new OpenAIApi(configuration);
        this.model = 'gpt-3.5-turbo';
    }

    async _sendRequest(userContent, errorPrefix) {
        try {
            const messages = [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": userContent }
            ];

            const chat = await this.openai.createChatCompletion({
                model: this.model,
                messages
            });

            if (!chat.data || !chat.data.choices || !chat.data.choices[0]) {
                throw new Error(`${errorPrefix} failed`);
            }

            return chat.data.choices[0].message.content.trim();
        } catch (error) {
            console.error(`${errorPrefix}: ${error.message}`);
            return null;
        }
    }

    async generateStory(headline) {
        return this._sendRequest(
            `Create a humorous story based on the following positive news headline: ${headline}`,
            'Story generation'
        );
    }

    async fetchHistoricalFact() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const prompt = `Tell me an interesting fact about something that happened on ${month}-${day} in a previous year.`;
        return this._sendRequest(prompt, 'Historical fact fetching');
    }

    async generateImagePrompt(story) {
        return this._sendRequest(
            `Generate a prompt for DALL-E based on this story: ${story}`,
            'Image prompt generation'
        );
    }
}
