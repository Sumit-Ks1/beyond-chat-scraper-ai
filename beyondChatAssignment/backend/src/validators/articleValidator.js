import { z } from 'zod';

const referenceSchema = z.object({
  title: z.string().trim().optional(),
  url: z.string().url('Invalid reference URL').optional(),
  source: z.string().trim().optional(),
});

const metaSchema = z.object({
  description: z
    .string()
    .max(300, 'Meta description cannot exceed 300 characters')
    .optional(),
  keywords: z.array(z.string()).optional(),
});

const baseArticleSchema = {
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(500, 'Title cannot exceed 500 characters'),
  
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
    .optional(),
  
  author: z.string().trim().default('Unknown'),
  
  publish_date: z
    .string()
    .datetime()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  
  content: z.string().min(1, 'Content is required'),
  
  original_url: z.string().url('Invalid original URL'),
  
  parent_article_id: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid parent article ID')
    .nullable()
    .optional(),
  
  article_type: z.enum(['original', 'enhanced']).default('original'),
  
  references: z.array(referenceSchema).optional(),
  
  meta: metaSchema.optional(),
};

export const createArticleSchema = z.object(baseArticleSchema);

export const updateArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(500, 'Title cannot exceed 500 characters')
    .optional(),
  
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
    .optional(),
  
  author: z.string().trim().optional(),
  
  publish_date: z
    .string()
    .datetime()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  
  content: z.string().min(1, 'Content cannot be empty').optional(),
  
  original_url: z.string().url('Invalid original URL').optional(),
  
  parent_article_id: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid parent article ID')
    .nullable()
    .optional(),
  
  article_type: z.enum(['original', 'enhanced']).optional(),
  
  references: z.array(referenceSchema).optional(),
  
  meta: metaSchema.optional(),
});

export const mongoIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid article ID'),
});

export const queryParamsSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1, 'Page must be at least 1')
    .optional()
    .default('1'),
  
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default('10'),
  
  article_type: z.enum(['original', 'enhanced', 'all']).optional().default('all'),
  
  sort: z
    .string()
    .regex(/^-?(title|publish_date|createdAt|updatedAt)$/, 'Invalid sort field')
    .optional()
    .default('-publish_date'),
});

export default {
  createArticleSchema,
  updateArticleSchema,
  mongoIdSchema,
  queryParamsSchema,
};
