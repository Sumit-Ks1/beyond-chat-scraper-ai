import axios from 'axios';
import config from '../config.js';

const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});


export async function getArticle(id) {
  try {
    const response = await api.get(`/articles/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error fetching article ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
}


export async function getAllArticles(params = {}) {
  try {
    const response = await api.get('/articles', { params });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching articles:', error.response?.data?.message || error.message);
    throw error;
  }
}


export async function getOriginalArticles() {
  try {
    const response = await api.get('/articles', {
      params: { article_type: 'original', limit: 100 },
    });
    return response.data.data;
  } catch (error) {
    console.error('❌ Error fetching original articles:', error.response?.data?.message || error.message);
    throw error;
  }
}


export async function createArticle(articleData) {
  try {
    const response = await api.post('/articles', articleData);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error creating article:', error.response?.data?.message || error.message);
    throw error;
  }
}


export async function updateArticle(id, updateData) {
  try {
    const response = await api.put(`/articles/${id}`, updateData);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error updating article ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
}

export default {
  getArticle,
  getAllArticles,
  getOriginalArticles,
  createArticle,
  updateArticle,
};
