import { useState, useEffect, useCallback } from 'react';
import { getArticles } from '../services/articleService';

export const useArticles = (initialParams = {}) => {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    article_type: 'original', // Default to original articles
    ...initialParams,
  });

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getArticles(params);
      setArticles(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const goToPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination]);

  const prevPage = useCallback(() => {
    if (pagination?.hasPrevPage) {
      setParams((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  }, [pagination]);

  const updateFilters = useCallback((newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    pagination,
    loading,
    error,
    params,
    goToPage,
    nextPage,
    prevPage,
    updateFilters,
    refresh,
  };
};

export default useArticles;
