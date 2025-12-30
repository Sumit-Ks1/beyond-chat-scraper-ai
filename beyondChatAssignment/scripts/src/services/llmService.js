
import Groq from 'groq-sdk';
import config from '../config.js';

let groqClient = null;


function getGroqClient() {
  if (!groqClient && config.groq.apiKey) {
    groqClient = new Groq({
      apiKey: config.groq.apiKey,
    });
  }
  return groqClient;
}


export async function enhanceArticle(originalArticle, referenceArticles) {
  console.log(`🤖 Enhancing article with LLM: "${originalArticle.title}"`);

  const client = getGroqClient();

  if (!client) {
    console.warn('⚠️ Groq API not configured. Returning original content.');
    return {
      content: originalArticle.content,
      title: originalArticle.title,
      meta: {
        description: '',
        keywords: [],
      },
    };
  }

  const referencesContext = referenceArticles
    .map(
      (ref, index) =>
        `Reference Article ${index + 1} (from ${ref.source}):\nTitle: ${ref.title}\nContent Summary: ${ref.content.substring(0, 1500)}...`
    )
    .join('\n\n');

  const plainTextContent = originalArticle.content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const prompt = `You are an expert content writer and SEO specialist. Your task is to rewrite and enhance the following article to make it more engaging, well-structured, and SEO-optimized.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${plainTextContent.substring(0, 4000)}

${referencesContext ? `REFERENCE ARTICLES FOR STYLE AND TONE INSPIRATION:\n${referencesContext}` : ''}

INSTRUCTIONS:
1. Rewrite the article with improved structure, clear headings (H2, H3), and better formatting
2. Match the professional, informative tone of top-ranking articles
3. Make the content more engaging and valuable for readers
4. Optimize for SEO with relevant keywords naturally integrated
5. IMPORTANT: Do NOT plagiarize - rephrase everything intelligently
6. Add bullet points, numbered lists, or tables where appropriate
7. Keep the core message and key points from the original
8. Make the content comprehensive but concise
9. Write in HTML format with proper semantic tags

OUTPUT FORMAT:
Provide the rewritten article in the following JSON structure:
{
  "title": "Improved SEO-friendly title",
  "content": "<article>Your rewritten HTML content here</article>",
  "meta_description": "A compelling 150-160 character meta description",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Respond ONLY with the JSON object, no additional text.`;

  try {
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an expert content writer who creates engaging, well-structured, SEO-optimized articles. You always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: config.groq.model,
      max_tokens: config.groq.maxTokens,
      temperature: config.groq.temperature,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Article enhanced successfully');
        return {
          title: parsed.title || originalArticle.title,
          content: parsed.content || originalArticle.content,
          meta: {
            description: parsed.meta_description || '',
            keywords: parsed.keywords || [],
          },
        };
      }
    } catch (parseError) {
      console.error('⚠️ Failed to parse LLM response, using raw content');
    }

    return {
      title: originalArticle.title,
      content: `<article>${responseText}</article>`,
      meta: {
        description: '',
        keywords: [],
      },
    };
  } catch (error) {
    console.error('❌ LLM enhancement error:', error.message);
    throw error;
  }
}


export async function generateSummary(content) {
  const client = getGroqClient();

  if (!client) {
    return content.substring(0, 200) + '...';
  }

  try {
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Summarize this article in 2-3 sentences:\n\n${content.substring(0, 3000)}`,
        },
      ],
      model: config.groq.model,
      max_tokens: 200,
      temperature: 0.5,
    });

    return completion.choices[0]?.message?.content || content.substring(0, 200);
  } catch (error) {
    console.error('❌ Summary generation error:', error.message);
    return content.substring(0, 200) + '...';
  }
}

export default { enhanceArticle, generateSummary };
