import axios from 'axios';

export default class SentimentService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api-inference.huggingface.co';
        this.model = 'distilbert-base-uncased-finetuned-sst-2-english';
    }

    buildHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`
        };
    }

    async analyzeHeadline(headline) {
        try {
            const url = `${this.baseUrl}/models/${this.model}`;
            const headers = this.buildHeaders();
            const response = await axios.post(url, { inputs: [headline] }, { headers });
            if (response.status !== 200) {
                throw new Error('Failed to analyze sentiment');
            }
            const positiveScore = response.data[0].find(item => item.label === 'POSITIVE').score;
            return positiveScore > 0.5 ? 'positive' : 'negative';
        } catch (error) {
            console.error(`Error analyzing sentiment: ${error.message}`);
            return 'unknown';
        }
    }

    async analyzeHeadlines(headlines) {
        const results = await Promise.all(headlines.map(this.analyzeHeadline.bind(this)));
        return results;
    }
}
