import * as articleService from '../services/articleService.js';
import {
  asyncHandler,
  successResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
} from '../utils/index.js';

export const getAllArticles = asyncHandler(async (req, res) => {
  const { page, limit, article_type, sort } = req.query;

  const result = await articleService.getAllArticles({
    page,
    limit,
    article_type,
    sort,
  });

  return paginatedResponse(
    res,
    result.articles,
    result.pagination,
    'Articles retrieved successfully'
  );
});

export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await articleService.getArticleById(id);

  return successResponse(res, article, 'Article retrieved successfully');
});

export const getArticleBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const article = await articleService.getArticleBySlug(slug);

  return successResponse(res, article, 'Article retrieved successfully');
});

export const createArticle = asyncHandler(async (req, res) => {
  const article = await articleService.createArticle(req.body);

  return createdResponse(res, article, 'Article created successfully');
});

export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await articleService.updateArticle(id, req.body);

  return successResponse(res, article, 'Article updated successfully');
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await articleService.deleteArticle(id);

  return noContentResponse(res);
});

export const getArticleWithEnhanced = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await articleService.getArticleWithEnhanced(id);

  return successResponse(
    res,
    result,
    'Article with enhanced version retrieved successfully'
  );
});

export const searchArticles = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    return successResponse(res, [], 'No search query provided');
  }

  const result = await articleService.searchArticles(q, { page, limit });

  return paginatedResponse(
    res,
    result.articles,
    result.pagination,
    'Search results retrieved successfully'
  );
});

export default {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleWithEnhanced,
  searchArticles,
};
