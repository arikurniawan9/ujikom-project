import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout = ({ children, title, subtitle }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1e40af]/5 to-[#0f172a]/5 dark:from-[#0f172a] to-[#1e293b]">
      <header className="bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur-sm shadow-md py-4 px-6 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link href="/" className="text-xl font-bold text-[#1e40af] dark:text-[#3b82f6]">
              Ujikom Tracker
            </Link>
            {title && (
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{title}</h1>
            )}
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;