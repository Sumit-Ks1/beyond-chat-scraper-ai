/**
 * Article Detail Page
 * Displays article with tabs for Original and Enhanced versions
 */
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticleDetail } from '../hooks';
import {
  ArticleContent,
  LoadingSpinner,
  ErrorMessage,
  TabSwitcher,
} from '../components';

const ArticleDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('original');
  const { original, enhanced, loading, error, refresh, hasEnhanced } = useArticleDetail(id);

  // Get current article based on active tab
  const currentArticle = activeTab === 'enhanced' && hasEnhanced ? enhanced : original;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Articles
      </Link>

      {/* Loading State */}
      {loading && <LoadingSpinner message="Loading article..." />}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage message={error} onRetry={refresh} />
      )}

      {/* Article Content */}
      {!loading && !error && original && (
        <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
          {/* Tab Switcher */}
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasEnhanced={hasEnhanced}
          />

          {/* Enhancement Info Banner */}
          {hasEnhanced && activeTab === 'original' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    AI Enhanced Version Available
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    This article has been enhanced by AI for improved structure, SEO, and readability.{' '}
                    <button
                      onClick={() => setActiveTab('enhanced')}
                      className="font-medium underline hover:no-underline"
                    >
                      View enhanced version →
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No Enhanced Version Notice */}
          {!hasEnhanced && activeTab === 'original' && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Original Article Only
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    This article has not been enhanced yet. Run the enhancement script to create an AI-improved version.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <ArticleContent
            article={currentArticle}
            type={activeTab}
          />
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
