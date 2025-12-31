/**
 * Main Layout Component
 * Wraps pages with common header and footer
 */
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../components';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
