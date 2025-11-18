'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/Layout';

const AdminDashboard = () => {
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [classStats, setClassStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from database
    const mockRecentSubmissions = [
      { id: 1, nis: '12345', nama: 'Budi Santoso', kelas: 'XII RPL 1', submittedAt: new Date('2023-05-15T10:30:00'), linkProject: 'https://example.com/budi' },
      { id: 2, nis: '12346', nama: 'Ani Lestari', kelas: 'XII RPL 1', submittedAt: new Date('2023-05-15T14:20:00'), linkProject: 'https://example.com/ani' },
      { id: 3, nis: '12347', nama: 'Citra Dewi', kelas: 'XII TKJ 1', submittedAt: new Date('2023-05-16T09:15:00'), linkProject: 'https://example.com/citra' },
      { id: 4, nis: '12348', nama: 'Dedi Kurniawan', kelas: 'XII TKJ 2', submittedAt: new Date('2023-05-16T16:45:00'), linkProject: 'https://example.com/dedi' },
      { id: 5, nis: '12349', nama: 'Eka Putri', kelas: 'XII RPL 2', submittedAt: new Date('2023-05-17T11:30:00'), linkProject: 'https://example.com/eka' },
    ];

    const mockClassStats = [
      { id: 1, name: 'XII RPL 1', totalStudents: 32, submittedCount: 28, percentage: 87.5 },
      { id: 2, name: 'XII RPL 2', totalStudents: 30, submittedCount: 25, percentage: 83.3 },
      { id: 3, name: 'XII TKJ 1', totalStudents: 28, submittedCount: 18, percentage: 64.3 },
      { id: 4, name: 'XII TKJ 2', totalStudents: 31, submittedCount: 22, percentage: 71.0 },
    ];

    setRecentSubmissions(mockRecentSubmissions);
    setClassStats(mockClassStats);
    setLoading(false);
  }, []);

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout title="Dashboard Admin" subtitle="Kelola kelas dan siswa">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Siswa</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">121</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Sudah Submit</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">93</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Belum Submit</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">28</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Permintaan Perbaikan</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Pengumpulan Terbaru</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">NIS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kelas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentSubmissions.slice(0, 5).map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300">{submission.nis}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300">{submission.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300">{submission.kelas}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300">{formatDateTime(submission.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Class Stats */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Statistik per Kelas</h3>
          <div className="space-y-4">
            {classStats.map((stat) => (
              <div key={stat.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-white">{stat.name}</h4>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.submittedCount}/{stat.totalStudents}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-[#3b82f6] h-2.5 rounded-full"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{stat.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;