import { Article } from '../models/index.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import config from '../config/index.js';

export const getAllArticles = async (options = {}) => {
  const {
    page = config.pagination.defaultPage,
    limit = config.pagination.defaultLimit,
    article_type = 'all',
    sort = '-publish_date',
  } = options;

  const filter = { isDeleted: false };
  
  if (article_type !== 'all') {
    filter.article_type = article_type;
  }

  const skip = (page - 1) * limit;

  const [articles, totalItems] = await Promise.all([
    Article.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('parent_article_id', 'title slug')
      .lean(),
    Article.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    articles,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
};

export const getArticleById = async (id) => {
  const article = await Article.findOne({ _id: id, isDeleted: false })
    .populate('parent_article_id', 'title slug original_url')
    .populate('enhanced_version', 'title slug _id')
    .lean();

  if (!article) {
    throw new NotFoundError('Article');
  }

  return article;
};

export const getArticleBySlug = async (slug) => {
  const article = await Article.findOne({ slug, isDeleted: false })
    .populate('parent_article_id', 'title slug original_url')
    .populate('enhanced_version', 'title slug _id')
    .lean();

  if (!article) {
    throw new NotFoundError('Article');
  }

  return article;
};

export const createArticle = async (articleData) => {
  if (articleData.parent_article_id) {
    const parentExists = await Article.exists({
      _id: articleData.parent_article_id,
      isDeleted: false,
    });

    if (!parentExists) {
      throw new BadRequestError('Parent article not found');
    }
  }

  const article = new Article(articleData);
  await article.save();

  return article.toObject();
};

export const updateArticle = async (id, updateData) => {
  if (updateData.parent_article_id) {
    const parentExists = await Article.exists({
      _id: updateData.parent_article_id,
      isDeleted: false,
    });

    if (!parentExists) {
      throw new BadRequestError('Parent article not found');
    }

    if (updateData.parent_article_id === id) {
      throw new BadRequestError('Article cannot be its own parent');
    }
  }

  const article = await Article.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('parent_article_id', 'title slug')
    .lean();

  if (!article) {
    throw new NotFoundError('Article');
  }

  return article;
};

export const deleteArticle = async (id) => {
  const article = await Article.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!article) {
    throw new NotFoundError('Article');
  }

  await Article.updateMany(
    { parent_article_id: id },
    { $set: { isDeleted: true } }
  );
};

export const getArticleWithEnhanced = async (id) => {
  const article = await Article.findOne({
    _id: id,
    isDeleted: false,
    article_type: 'original',
  }).lean();

  if (!article) {
    throw new NotFoundError('Original article');
  }

  const enhancedArticle = await Article.findOne({
    parent_article_id: id,
    isDeleted: false,
    article_type: 'enhanced',
  }).lean();

  return {
    original: article,
    enhanced: enhancedArticle || null,
  };
};

export const searchArticles = async (query, options = {}) => {
  const {
    page = config.pagination.defaultPage,
    limit = config.pagination.defaultLimit,
  } = options;

  const filter = {
    isDeleted: false,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
    ],
  };

  const skip = (page - 1) * limit;

  const [articles, totalItems] = await Promise.all([
    Article.find(filter)
      .sort('-publish_date')
      .skip(skip)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    articles,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
};

export const bulkCreateArticles = async (articles) => {
  const createdArticles = await Article.insertMany(articles, {
    ordered: false,
  });
  return createdArticles;
};

export default {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleWithEnhanced,
  searchArticles,
  bulkCreateArticles,
};
