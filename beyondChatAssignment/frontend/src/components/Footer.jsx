
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-white font-semibold">BeyondChat Articles</span>
            </div>
            <p className="text-sm mt-2">
              AI-enhanced article management platform
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://beyondchats.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              BeyondChats
            </a>
            <a
              href="https://beyondchats.com/blogs/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Original Blog
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm">
          <p>© {currentYear} BeyondChat Assignment. All rights reserved.</p>
          <p className="mt-1 text-gray-500">
            Built with React, Express.js, MongoDB, and AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
