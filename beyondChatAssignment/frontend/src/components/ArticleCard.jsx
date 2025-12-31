import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const truncate = (text, length = 150) => {
  if (!text) return '';
  const stripped = stripHtml(text);
  if (stripped.length <= length) return stripped;
  return stripped.substring(0, length).trim() + '...';
};

const ArticleCard = ({ article }) => {
  const { _id, title, author, publish_date, content, enhanced_version } = article;

  return (
    <article className="article-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {author?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{author || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{formatDate(publish_date)}</p>
            </div>
          </div>

          {enhanced_version && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              AI Enhanced
            </span>
          )}
        </div>

        <Link to={`/articles/${_id}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors line-clamp-2">
            {title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncate(content, 200)}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/articles/${_id}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            Read Article
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {enhanced_version && (
            <span className="text-xs text-gray-500">
              View Original & Enhanced
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
