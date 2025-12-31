/**
 * Article List Page
 * Displays all articles with pagination and filtering
 */
import { useArticles } from '../hooks';
import {
  ArticleCard,
  LoadingSpinner,
  ErrorMessage,
  Pagination,
} from '../components';

const ArticleList = () => {
  const {
    articles,
    pagination,
    loading,
    error,
    goToPage,
    refresh,
  } = useArticles({ article_type: 'original' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Articles</h1>
        <p className="text-gray-600">
          Browse articles scraped from BeyondChats blog, with AI-enhanced versions available.
        </p>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner message="Loading articles..." />}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage message={error} onRetry={refresh} />
      )}

      {/* Articles Grid */}
      {!loading && !error && (
        <>
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                Run the scraper to fetch articles from BeyondChats blog.
              </p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={refresh}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination pagination={pagination} onPageChange={goToPage} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ArticleList;
