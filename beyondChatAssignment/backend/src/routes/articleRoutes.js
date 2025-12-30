import { Router } from 'express';
import * as articleController from '../controllers/articleController.js';
import { validateBody, validateParams, validateQuery } from '../middleware/index.js';
import {
  createArticleSchema,
  updateArticleSchema,
  mongoIdSchema,
  queryParamsSchema,
} from '../validators/index.js';

const router = Router();

router.get('/search', articleController.searchArticles);

router.get(
  '/',
  validateQuery(queryParamsSchema),
  articleController.getAllArticles
);

router.get('/slug/:slug', articleController.getArticleBySlug);

router.get(
  '/:id/with-enhanced',
  validateParams(mongoIdSchema),
  articleController.getArticleWithEnhanced
);

router.get(
  '/:id',
  validateParams(mongoIdSchema),
  articleController.getArticleById
);

router.post(
  '/',
  validateBody(createArticleSchema),
  articleController.createArticle
);

router.put(
  '/:id',
  validateParams(mongoIdSchema),
  validateBody(updateArticleSchema),
  articleController.updateArticle
);

router.delete(
  '/:id',
  validateParams(mongoIdSchema),
  articleController.deleteArticle
);

export default router;
