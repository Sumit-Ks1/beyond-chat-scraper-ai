
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ArticleContent = ({ article, type = 'original' }) => {
  if (!article) return null;

  const { title, author, publish_date, content, original_url, references, meta } = article;

  return (
    <div className="article-wrapper">
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            type === 'enhanced'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {type === 'enhanced' ? (
            <>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              AI Enhanced Version
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
              </svg>
              Original Article
            </>
          )}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {title}
      </h1>

      {meta?.description && (
        <p className="text-lg text-gray-600 mb-6 italic border-l-4 border-primary-500 pl-4">
          {meta.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-medium">
              {author?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{author || 'Unknown Author'}</p>
            <p className="text-sm text-gray-500">{formatDate(publish_date)}</p>
          </div>
        </div>

        {original_url && (
          <a
            href={original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Original Source
          </a>
        )}
      </div>

      {meta?.keywords && meta.keywords.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {meta.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {references && references.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">References</h3>
          <ul className="space-y-3">
            {references.map((ref, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-600 mr-3">
                  {index + 1}
                </span>
                <div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {ref.title || ref.url}
                  </a>
                  {ref.source && (
                    <span className="text-sm text-gray-500 ml-2">({ref.source})</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArticleContent;
