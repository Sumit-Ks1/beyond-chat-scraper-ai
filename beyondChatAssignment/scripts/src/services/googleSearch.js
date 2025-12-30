
import axios from 'axios';
import config from '../config.js';


function extractSearchQuery(title) {
  const cleanedTitle = title
    .replace(/[-–—|:].*(beyondchat|beyond chat|beyondchats).*/gi, '')
    .replace(/(beyondchat|beyond chat|beyondchats)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleanedTitle || title;
}


export async function searchGoogle(title, numResults = 2) {
  const searchTopic = extractSearchQuery(title);
  console.log(`🔍 Searching Google for: "${searchTopic}"`);

  if (!config.google.apiKey || !config.google.searchEngineId) {
    console.warn('⚠️ Google API credentials not configured. Using mock data.');
    return [];
  }

  try {
    const searchQueries = [
      `${searchTopic} blog article guide`,
      `${searchTopic} best practices tips`,
      `what is ${searchTopic} guide`,
    ];

    let allResults = [];

    for (const query of searchQueries) {
      if (allResults.length >= numResults) break;

      console.log(`   Trying query: "${query}"`);
      
      try {
        const response = await axios.get(config.google.searchUrl, {
          params: {
            key: config.google.apiKey,
            cx: config.google.searchEngineId,
            q: query,
            num: 10, 
          },
        });

        const items = response.data.items || [];
        console.log(`   Found ${items.length} raw results`);

        const filtered = items.filter((item) => {
          const url = item.link.toLowerCase();
          const title = item.title.toLowerCase();
          
          const excludePatterns = [
            'youtube.com',
            'youtu.be',
            '.pdf',
            'beyondchats.com',
            'facebook.com',
            'twitter.com',
            'linkedin.com',
            'instagram.com',
            '/category/',
            '/tag/',
            '/author/',
            'wikipedia.org',
          ];

          const isExcluded = excludePatterns.some(pattern => url.includes(pattern));
          
          const includePatterns = [
            '/blog',
            '/article',
            '/post',
            '/guide',
            '/news',
            '/insights',
            '/resources',
          ];
          
          const looksLikeArticle = includePatterns.some(pattern => url.includes(pattern)) ||
            url.match(/\/\d{4}\//) || // Date in URL like /2024/
            url.match(/[-_]\d+/) || // Article ID in URL
            title.includes('guide') ||
            title.includes('how to') ||
            title.includes('what is') ||
            title.includes('tips') ||
            title.includes('best');

          return !isExcluded && (looksLikeArticle || items.indexOf(item) < 5);
        });

        for (const item of filtered) {
          if (allResults.length >= numResults) break;
          
          const isDuplicate = allResults.some(r => r.url === item.link);
          if (!isDuplicate) {
            allResults.push({
              title: item.title,
              url: item.link,
              snippet: item.snippet,
              source: new URL(item.link).hostname.replace('www.', ''),
            });
          }
        }
      } catch (queryError) {
        console.log(`   Query failed: ${queryError.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Found ${allResults.length} relevant articles:`);
    allResults.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.title}`);
      console.log(`      URL: ${r.url}`);
    });

    return allResults;
  } catch (error) {
    console.error('❌ Google Search error:', error.response?.data?.error?.message || error.message);
    return [];
  }
}

export default { searchGoogle };
