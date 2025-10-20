import React from 'react';
import { useApp } from '../contexts/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`transition-all duration-200 ${
        sidebarOpen ? 'md:ml-60' : 'md:ml-16'
      }`}>
        <Header />
        <main className="enterprise-content">
          <Breadcrumbs />
          <div className="animate-fade-in">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}