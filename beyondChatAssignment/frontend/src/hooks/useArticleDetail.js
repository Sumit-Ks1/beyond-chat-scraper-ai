import { useState, useEffect, useCallback } from 'react';
import { getArticleWithEnhanced } from '../services/articleService';

export const useArticleDetail = (articleId) => {
  const [original, setOriginal] = useState(null);
  const [enhanced, setEnhanced] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticle = useCallback(async () => {
    if (!articleId) {
      setError('Article ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getArticleWithEnhanced(articleId);
      setOriginal(response.data.original);
      setEnhanced(response.data.enhanced);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch article');
      setOriginal(null);
      setEnhanced(null);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const refresh = useCallback(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    original,
    enhanced,
    loading,
    error,
    refresh,
    hasEnhanced: enhanced !== null,
  };
};

export default useArticleDetail;
