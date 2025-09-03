import React, { ReactNode, useState, useCallback } from 'react';
import { Sidebar } from '../Sidebar';
import Navbar from '../Navbar';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, className = '' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const activeTab = location.pathname === '/' ? 'dashboard' : 'ats-analysis';

  const handleTabChange = useCallback((_tab: string) => {
    // Handle navigation here if needed
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <main 
          id="main-content" 
          className={`flex-1 overflow-y-auto focus:outline-none transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : ''
          } ${className}`}
          role="main"
          tabIndex={0}
          onClick={() => isSidebarOpen && closeSidebar()}
        >
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default MainLayout;
