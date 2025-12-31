/**
 * Main App Component
 * Sets up routing and global providers
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ArticleList, ArticleDetail, NotFound } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout wrapper */}
        <Route path="/" element={<MainLayout />}>
          {/* Article List - Home page */}
          <Route index element={<ArticleList />} />
          
          {/* Article Detail */}
          <Route path="articles/:id" element={<ArticleDetail />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
