import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Ujikom Tracker - Dibuat oleh Ari Kurniawan</p>
          <p className="text-sm mt-1">Tahun 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;