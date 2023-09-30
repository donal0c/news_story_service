import { OpenAIApi, Configuration } from 'openai';

export default class ImageService {
    constructor(apiKey) {
        const configuration = new Configuration({
            organization: process.env.OPENAI_ORG,
            apiKey: apiKey
        });
        this.openai = new OpenAIApi(configuration);
    }

    async generateImage(prompt) {
        try {
            const response = await this.openai.createImage({
                prompt,
                n: 1,
                size: "1024x1024",
            });

            if (response.data && response.data.data[0] && response.data.data[0].url) {
                return response.data.data[0].url;
            } else {
                throw new Error('Image generation failed');
            }
        } catch (error) {
            console.error(`Error generating image: ${error.message}`);
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }
            return null;
        }
    }
}
