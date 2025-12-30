import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import config from './config.js';


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


async function getTotalPages(page) {
  try {
    await page.waitForSelector('.pagination, .page-numbers, nav[aria-label*="pagination"]', {
      timeout: 10000,
    }).catch(() => null);

    const lastPageNumber = await page.evaluate(() => {
      const paginationSelectors = [
        '.pagination a',
        '.page-numbers',
        'nav[aria-label*="pagination"] a',
        '.wp-pagenavi a',
        '.nav-links a',
      ];

      let maxPage = 1;

      for (const selector of paginationSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          const text = el.textContent.trim();
          const num = parseInt(text, 10);
          if (!isNaN(num) && num > maxPage) {
            maxPage = num;
          }
        });
      }

      return maxPage;
    });

    console.log(`📄 Found ${lastPageNumber} pages`);
    return lastPageNumber;
  } catch (error) {
    console.log('⚠️ Could not determine total pages, assuming single page');
    return 1;
  }
}


async function extractArticleLinks(page) {
  const content = await page.content();
  const $ = cheerio.load(content);

  const links = [];

  const selectors = [
    'article a[href*="/blog"]',
    '.post a[href*="/blog"]',
    '.blog-post a',
    '.entry-title a',
    'h2 a[href*="beyondchats"]',
    '.post-title a',
    'a.post-link',
    '.blog-item a',
    '.article-card a',
    'a[href*="/blogs/"]',
  ];

  for (const selector of selectors) {
    $(selector).each((_, element) => {
      const href = $(element).attr('href');
      if (href && !links.includes(href)) {
        const excludePatterns = ['/page/', '/category/', '/tag/', '/author/', '/search/'];
        const isExcluded = excludePatterns.some(pattern => href.includes(pattern));
        
        if (!isExcluded) {
          const absoluteUrl = href.startsWith('http') ? href : `https://beyondchats.com${href}`;
          if (!links.includes(absoluteUrl)) {
            links.push(absoluteUrl);
          }
        }
      }
    });
  }

  return links;
}


async function scrapeArticle(browser, url) {
  console.log(`📰 Scraping article: ${url}`);

  const page = await browser.newPage();

  try {
    await page.setUserAgent(config.scraping.userAgent);

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });

    await page.waitForSelector('#main-container #main #content, #content, #main-container', { timeout: 15000 }).catch(() => null);

    await delay(5000);

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });

    await delay(2000);

    const content = await page.content();
    const $ = cheerio.load(content);
    const baseUrl = 'https://beyondchats.com';

    const title =
      $('h1.entry-title').text().trim() ||
      $('h1.post-title').text().trim() ||
      $('#content h1').first().text().trim() ||
      $('h1').first().text().trim() ||
      $('title').text().split('|')[0].trim() ||
      'Untitled Article';

    const author =
      $('.author-name').text().trim() ||
      $('meta[name="author"]').attr('content') ||
      $('.post-author').text().trim() ||
      $('[rel="author"]').text().trim() ||
      'BeyondChats Team';

    let publishDate = null;
    const dateSelectors = [
      'time[datetime]',
      '.post-date',
      '.entry-date',
      '.published',
      'meta[property="article:published_time"]',
    ];

    for (const selector of dateSelectors) {
      const element = $(selector);
      if (element.length) {
        const dateStr = element.attr('datetime') || element.attr('content') || element.text().trim();
        if (dateStr) {
          const parsed = new Date(dateStr);
          if (!isNaN(parsed.getTime())) {
            publishDate = parsed.toISOString();
            break;
          }
        }
      }
    }

    
    function makeAbsoluteUrl(url) {
      if (!url) return url;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (url.startsWith('//')) return 'https:' + url;
      if (url.startsWith('/')) return baseUrl + url;
      return baseUrl + '/' + url;
    }

    
    function cleanAndFormatHtml(element) {
      element.find('script, style, noscript, .social-share, .share-buttons, .related-posts, .comments, form, .cookie-notice, .popup, .modal, .advertisement, .ads').remove();

      element.find('img').each((_, img) => {
        const $img = $(img);
        const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
        if (src) {
          $img.attr('src', makeAbsoluteUrl(src));
          $img.removeAttr('data-src');
          $img.removeAttr('data-lazy-src');
          $img.removeAttr('loading');
        }
        $img.attr('style', 'max-width: 100%; height: auto; display: block; margin: 1rem auto;');
        $img.attr('loading', 'lazy');
      });

      element.find('a').each((_, anchor) => {
        const $a = $(anchor);
        const href = $a.attr('href');
        if (href) {
          $a.attr('href', makeAbsoluteUrl(href));
          $a.attr('target', '_blank');
          $a.attr('rel', 'noopener noreferrer');
        }
      });

      element.find('[srcset]').each((_, el) => {
        const $el = $(el);
        const srcset = $el.attr('srcset');
        if (srcset) {
          const fixedSrcset = srcset
            .split(',')
            .map((s) => {
              const parts = s.trim().split(' ');
              parts[0] = makeAbsoluteUrl(parts[0]);
              return parts.join(' ');
            })
            .join(', ');
          $el.attr('srcset', fixedSrcset);
        }
      });

      return element.html()?.trim() || '';
    }

    let articleContent = '';
    const contentDiv = $('#main-container #main #content, #main #content, #content').first();
    
    if (contentDiv.length) {
      console.log('✅ Found #content div');
      articleContent = cleanAndFormatHtml(contentDiv);
    }

    if (!articleContent || articleContent.length < 200) {
      const elementorPost = $('[data-elementor-type="single-post"]').first();
      if (elementorPost.length) {
        console.log('⚠️ Fallback to [data-elementor-type="single-post"]');
        articleContent = cleanAndFormatHtml(elementorPost);
      }
    }

    if (!articleContent || articleContent.length < 200) {
      const mainElement = $('#main-container #main, #main, main').first();
      if (mainElement.length) {
        console.log('⚠️ Fallback to main element');
        articleContent = cleanAndFormatHtml(mainElement);
      }
    }

    if (!articleContent || articleContent.length < 200) {
      const article = $('article').first();
      if (article.length) {
        console.log('⚠️ Fallback to article tag');
        articleContent = cleanAndFormatHtml(article);
      }
    }

    const slug = url
      .split('/')
      .filter(Boolean)
      .pop()
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase();

    await page.close();

    return {
      title,
      slug,
      author,
      publish_date: publishDate,
      content: articleContent,
      original_url: url,
      article_type: 'original',
    };
  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    await page.close();
    return null;
  }
}

async function scrapeOldestArticles(browser, count) {
  const page = await browser.newPage();
  await page.setUserAgent(config.scraping.userAgent);

  console.log(`🌐 Navigating to ${config.scraping.blogUrl}`);

  await page.goto(config.scraping.blogUrl, {
    waitUntil: 'networkidle2',
    timeout: config.scraping.timeout,
  });

  await delay(3000);

  const totalPages = await getTotalPages(page);

  const allArticleLinks = [];
  let currentPage = totalPages;

  while (allArticleLinks.length < count && currentPage >= 1) {
    console.log(`📄 Scraping page ${currentPage}/${totalPages}`);

    const pageUrl =
      currentPage === 1
        ? config.scraping.blogUrl
        : `${config.scraping.blogUrl}page/${currentPage}/`;

    await page.goto(pageUrl, {
      waitUntil: 'networkidle2',
      timeout: config.scraping.timeout,
    });

    await delay(2000);

    const links = await extractArticleLinks(page);
    console.log(`  Found ${links.length} articles on page ${currentPage}`);

    if (currentPage === totalPages) {
      allArticleLinks.push(...links.reverse());
    } else {
      allArticleLinks.push(...links);
    }

    currentPage--;
  }

  await page.close();

  const uniqueLinks = [...new Set(allArticleLinks)].slice(0, count);
  console.log(`\n📋 Found ${uniqueLinks.length} unique article links to scrape`);

  const articles = [];
  for (const url of uniqueLinks) {
    const article = await scrapeArticle(browser, url);
    if (article) {
      articles.push(article);
      console.log(`✅ Scraped: ${article.title}`);
    }
    await delay(1500);
  }

  return articles;
}


async function saveArticlesToAPI(articles) {
  console.log('\n💾 Saving articles to API...');

  for (const article of articles) {
    try {
      const response = await axios.post(`${config.api.baseUrl}/articles`, article, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(`✅ Saved: ${article.title} (ID: ${response.data.data._id})`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️ Already exists: ${article.title}`);
      } else {
        console.error(`❌ Error saving ${article.title}:`, error.response?.data?.message || error.message);
      }
    }
  }
}


async function main() {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🕷️  BeyondChats Blog Scraper                   ║
║                                                   ║
║   Scraping ${config.scraping.articlesToScrape} oldest articles...                ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    const articles = await scrapeOldestArticles(browser, config.scraping.articlesToScrape);

    console.log(`\n📊 Scraped ${articles.length} articles successfully`);

    await saveArticlesToAPI(articles);

    console.log('\n✅ Scraping complete!');

    console.log('\n📋 Summary:');
    articles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     URL: ${article.original_url}`);
      console.log(`     Date: ${article.publish_date || 'Unknown'}\n`);
    });

  } catch (error) {
    console.error('❌ Scraper error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the scraper
main();
