import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import config from '../config.js';


function cleanContent(html, url) {
  const $ = cheerio.load(html);

  const removeSelectors = [
    'script',
    'style',
    'nav',
    'header',
    'footer',
    'aside',
    '.sidebar',
    '.advertisement',
    '.ads',
    '.social-share',
    '.comments',
    '.related-posts',
    '.newsletter',
    '.popup',
    '.modal',
    '.cookie-notice',
    '#cookie-notice',
    '.share-buttons',
    '.author-bio',
    'form',
    'iframe',
    '.navigation',
    '.breadcrumb',
  ];

  removeSelectors.forEach((selector) => $(selector).remove());

  const contentSelectors = [
    '#main-container #main.site-main',
    '#main-container .site-main',
    '#main.site-main',
    'main.site-main',
    '#main-container main',
    '.elementor-widget-theme-post-content .elementor-widget-container',
    '[data-elementor-type="single-post"] .elementor-section',
    '.elementor-widget-text-editor .elementor-widget-container',
    'article',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.blog-content',
    '.content-area',
    'main .content',
    '.single-post-content',
    '[role="main"]',
    'main',
    '#main-container',
  ];

  let content = '';

  for (const selector of contentSelectors) {
    const element = $(selector);
    if (element.length) {
      const clone = element.clone();
      clone.find('script, style, nav, header, footer, .sidebar, .widget, .navigation, .breadcrumb, .share-buttons, .ct-header, .ct-footer, form, .cookie-notice').remove();
      content = clone.text().trim();
      if (content.length > 200) {
        break;
      }
    }
  }

  if (!content || content.length < 200) {
    const bodyClone = $('body').clone();
    bodyClone.find('script, style, nav, header, footer, .sidebar, .widget, .navigation, .ct-header, .ct-footer').remove();
    content = bodyClone.text().trim();
  }

  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  if (content.length > 5000) {
    content = content.substring(0, 5000) + '...';
  }

  return content;
}


export async function scrapeUrl(url) {
  console.log(`📄 Scraping: ${url}`);

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent(config.scraping.userAgent);

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, {
      waitUntil: 'domcontentloaded', 
      timeout: 45000,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const html = await page.content();
    const content = cleanContent(html, url);

    const $ = cheerio.load(html);
    const title =
      $('h1').first().text().trim() ||
      $('title').text().split('|')[0].trim() ||
      'Unknown Title';

    await browser.close();

    return {
      title,
      content,
      url,
      source: new URL(url).hostname.replace('www.', ''),
    };
  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    if (browser) await browser.close();
    return null;
  }
}

export async function scrapeMultiple(urls) {
  const results = [];

  for (const url of urls) {
    const result = await scrapeUrl(url);
    if (result) {
      results.push(result);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

export default { scrapeUrl, scrapeMultiple };
