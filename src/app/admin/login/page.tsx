'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/Toast';

const AdminLogin = () => {
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send a request to an API endpoint
    // For this example, we'll use a simple check
    if (username === 'admin' && password === 'admin123') {
      // Set a session token or cookie in a real app
      localStorage.setItem('adminToken', 'valid-token');
      addToast('Login berhasil!', 'success');
      router.push('/admin/dashboard');
    } else {
      setError('Username atau password salah');
      addToast('Username atau password salah', 'error');
    }
  };

  return (
    <Layout title="Login Admin" subtitle="Silakan masuk sebagai admin">
      <div className="card p-8 max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login Admin</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ocean-blue-light focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
              placeholder="Masukkan username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ocean-blue-light focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
              placeholder="Masukkan password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full btn-gradient py-3"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AdminLogin;