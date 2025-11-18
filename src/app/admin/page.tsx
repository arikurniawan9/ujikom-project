'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Jika sudah login, arahkan ke dashboard
      router.push('/admin/dashboard');
    } else {
      // Jika belum login, arahkan ke halaman login
      router.push('/admin/login');
    }
  }, [router]);

  return null; // Jangan render apapun selama proses redirect
};

export default AdminPage;