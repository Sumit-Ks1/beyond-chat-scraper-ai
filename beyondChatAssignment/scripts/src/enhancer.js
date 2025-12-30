import {
  getArticle,
  createArticle,
  searchGoogle,
  scrapeMultiple,
  enhanceArticle,
} from './services/index.js';


async function enhanceArticleById(articleId) {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 Article Enhancer                            ║
║                                                   ║
║   Enhancing article: ${articleId.padEnd(24)}║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);

  try {
    console.log('\n📥 Step 1: Fetching original article...');
    const originalArticle = await getArticle(articleId);
    console.log(`✅ Found: "${originalArticle.title}"`);

    if (originalArticle.article_type === 'enhanced') {
      console.log('⚠️ This is already an enhanced article. Skipping...');
      return null;
    }

    console.log('\n🔍 Step 2: Searching for related articles...');
    const searchResults = await searchGoogle(originalArticle.title, 2);

    if (searchResults.length === 0) {
      console.log('⚠️ No related articles found. Proceeding with LLM enhancement only.');
    } else {
      console.log(`✅ Found ${searchResults.length} related articles:`);
      searchResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.title}`);
        console.log(`      Source: ${result.source}`);
      });
    }

    console.log('\n📄 Step 3: Scraping related articles...');
    const scrapedContent = await scrapeMultiple(searchResults.map((r) => r.url));
    console.log(`✅ Successfully scraped ${scrapedContent.length} articles`);

    console.log('\n🤖 Step 4: Enhancing article with LLM...');
    const enhancedContent = await enhanceArticle(originalArticle, scrapedContent);

    const references = scrapedContent.map((content) => ({
      title: content.title,
      url: content.url,
      source: content.source,
    }));

    console.log('\n💾 Step 5: Publishing enhanced article...');
    const enhancedArticle = await createArticle({
      title: enhancedContent.title,
      slug: `${originalArticle.slug}-enhanced`,
      author: originalArticle.author,
      publish_date: new Date().toISOString(),
      content: enhancedContent.content,
      original_url: originalArticle.original_url,
      parent_article_id: originalArticle._id,
      article_type: 'enhanced',
      references,
      meta: enhancedContent.meta,
    });

    console.log(`✅ Enhanced article created with ID: ${enhancedArticle._id}`);

    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   ✅ Enhancement Complete!                       ║
║                                                   ║
║   Original Article: ${originalArticle._id}       ║
║   Enhanced Article: ${enhancedArticle._id}       ║
║                                                   ║
║   References Used: ${references.length}                              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);

    return enhancedArticle;
  } catch (error) {
    console.error('\n❌ Enhancement failed:', error.message);
    throw error;
  }
}

async function main() {
  const articleId = process.argv[2];

  if (!articleId) {
    console.error('❌ Please provide an article ID');
    console.log('Usage: node src/enhancer.js <article_id>');
    process.exit(1);
  }

  if (!/^[a-f\d]{24}$/i.test(articleId)) {
    console.error('❌ Invalid article ID format');
    process.exit(1);
  }

  try {
    await enhanceArticleById(articleId);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

export { enhanceArticleById };
