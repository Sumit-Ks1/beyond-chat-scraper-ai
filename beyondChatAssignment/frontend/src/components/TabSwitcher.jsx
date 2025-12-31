
const TabSwitcher = ({ activeTab, onTabChange, hasEnhanced }) => {
  const tabs = [
    {
      id: 'original',
      label: 'Original',
      icon: (
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'enhanced',
      label: 'AI Enhanced',
      icon: (
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      disabled: !hasEnhanced,
    },
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-4" aria-label="Article versions">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`tab-button flex items-center ${
              activeTab === tab.id ? 'active' : ''
            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon}
            {tab.label}
            {tab.disabled && (
              <span className="ml-2 text-xs text-gray-400">(Not available)</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabSwitcher;
