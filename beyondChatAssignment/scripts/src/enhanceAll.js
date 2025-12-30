
import {
  getOriginalArticles,
  getArticle,
} from './services/apiService.js';
import { enhanceArticleById } from './enhancer.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


async function hasEnhancedVersion(articleId) {
  try {
    const article = await getArticle(articleId);
    return article.enhanced_version != null;
  } catch {
    return false;
  }
}


async function main() {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 Batch Article Enhancer                      ║
║                                                   ║
║   Enhancing all original articles...             ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);

  try {
    console.log('\n📥 Fetching original articles...');
    const articles = await getOriginalArticles();
    console.log(`✅ Found ${articles.length} original articles`);

    const toEnhance = [];
    for (const article of articles) {
      const hasEnhanced = await hasEnhancedVersion(article._id);
      if (!hasEnhanced) {
        toEnhance.push(article);
      } else {
        console.log(`⏭️ Skipping "${article.title}" (already enhanced)`);
      }
    }

    console.log(`\n📋 ${toEnhance.length} articles to enhance`);

    if (toEnhance.length === 0) {
      console.log('✅ All articles are already enhanced!');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < toEnhance.length; i++) {
      const article = toEnhance[i];
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Processing ${i + 1}/${toEnhance.length}: ${article.title}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      try {
        await enhanceArticleById(article._id);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to enhance: ${article.title}`);
        console.error(`   Error: ${error.message}`);
        failCount++;
      }

      // Rate limiting between articles
      if (i < toEnhance.length - 1) {
        console.log('\n⏳ Waiting before next article...');
        await delay(5000);
      }
    }

  
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   📊 Batch Enhancement Complete!                 ║
║                                                   ║
║   Total Articles: ${String(toEnhance.length).padEnd(29)}║
║   Successful: ${String(successCount).padEnd(34)}║
║   Failed: ${String(failCount).padEnd(38)}║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);

  } catch (error) {
    console.error('\n❌ Batch enhancement failed:', error.message);
    process.exit(1);
  }
}

main();
