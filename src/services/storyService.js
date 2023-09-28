import {Configuration, OpenAIApi} from 'openai';

export default class StoryService {
    constructor(apiKey) {
        const configuration = new Configuration({
            organization: "org-uoGVFme600n1NwkDznXHJ2FZ",
            apiKey: apiKey
        });
        this.openai = new OpenAIApi(configuration);
        this.model = 'gpt-3.5-turbo';
    }

    async generateStory(headline) {
        try {
            const messages = [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": `Create a humorous story based on the following positive news headline: ${headline}` }
            ];

            const chat = await this.openai.createChatCompletion({
                model: this.model,
                messages
            });

            if (!chat.data || !chat.data.choices || !chat.data.choices[0]) {
                throw new Error('Failed to generate story');
            }

            return chat.data.choices[0].message.content.trim();
        } catch (error) {
            console.error(`Error generating story: ${error.message}`);
            return 'Unable to generate story';
        }
    }
}
