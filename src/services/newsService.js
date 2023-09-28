import axios from 'axios';

export default class NewsService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://newsapi.org/v2/top-headlines';
        this.source = 'bbc-news';
    }

    buildUrl() {
        return `${this.baseUrl}?sources=${this.source}&apiKey=${this.apiKey}`;
    }

    async fetchTopHeadlines() {
        try {
            const url = this.buildUrl();
            const response = await axios.get(url);
            console.log(response.data.articles)
            if (response.status !== 200) {
                throw new Error('Failed to fetch news');
            }
            return response.data.articles.map(article => article.description);
        } catch (error) {
            console.error(`Error fetching news: ${error.message}`);
            return [];
        }
    }
}
