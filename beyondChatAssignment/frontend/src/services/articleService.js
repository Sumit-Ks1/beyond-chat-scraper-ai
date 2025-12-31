/**
 * Article API Service
 * Handles all API calls related to articles
 */
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

/**
 * Get all articles with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Paginated articles response
 */
export const getArticles = async (params = {}) => {
  const response = await api.get('/articles', { params });
  return response.data;
};

/**
 * Get a single article by ID
 * @param {string} id - Article ID
 * @returns {Promise<Object>} - Article data
 */
export const getArticleById = async (id) => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

/**
 * Get article with its enhanced version
 * @param {string} id - Original article ID
 * @returns {Promise<Object>} - Original and enhanced articles
 */
export const getArticleWithEnhanced = async (id) => {
  const response = await api.get(`/articles/${id}/with-enhanced`);
  return response.data;
};

/**
 * Search articles
 * @param {string} query - Search query
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} - Search results
 */
export const searchArticles = async (query, params = {}) => {
  const response = await api.get('/articles/search', {
    params: { q: query, ...params },
  });
  return response.data;
};

export default {
  getArticles,
  getArticleById,
  getArticleWithEnhanced,
  searchArticles,
};
