
import dotenv from 'dotenv';

dotenv.config();

const config = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
  },

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchat_articles',
  },

  google: {
    apiKey: process.env.GOOGLE_API_KEY,
    searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
    searchUrl: 'https://www.googleapis.com/customsearch/v1',
  },

  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile', // Updated to latest available model
    maxTokens: 8000,
    temperature: 0.7,
  },

  scraping: {
    blogUrl: process.env.BEYONDCHATS_BLOG_URL || 'https://beyondchats.com/blogs/',
    articlesToScrape: parseInt(process.env.ARTICLES_TO_SCRAPE, 10) || 5,
    timeout: 30000,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
};

export default config;
