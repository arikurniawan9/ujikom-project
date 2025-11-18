'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/Navbar';
import AdminFooter from '@/components/admin/AdminFooter';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  // Tampilkan loading saat mengecek status login
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e40af]"></div>
      </div>
    );
  }

  // Jika tidak login, jangan render apapun karena akan redirect
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f172a]">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
          {subtitle && <p className="text-gray-600 dark:text-gray-300 mt-2">{subtitle}</p>}
        </div>
        {children}
      </main>

      <AdminFooter />
    </div>
  );
};

export default AdminLayout;