'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/Layout';
import { useToast } from '@/components/ui/Toast';

const SubmissionsPage = () => {
  const { addToast } = useToast();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');

  useEffect(() => {
    fetchSubmissions();
    fetchClasses();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // Mock data - in real app, fetch from database
      const mockSubmissions = [
        { id: 1, nis: '12345', nama: 'Budi Santoso', kelasId: 1, className: 'XII RPL 1', linkProject: 'https://example.com/budi-project', submittedAt: new Date('2023-05-15'), status: 'Submitted' },
        { id: 2, nis: '12346', nama: 'Ani Lestari', kelasId: 1, className: 'XII RPL 1', linkProject: 'https://example.com/ani-project', submittedAt: new Date('2023-05-16'), status: 'Resubmitted' },
        { id: 3, nis: '12347', nama: 'Citra Dewi', kelasId: 2, className: 'XII TKJ 1', linkProject: 'https://example.com/citra-project', submittedAt: new Date('2023-05-17'), status: 'Submitted' },
      ];
      setSubmissions(mockSubmissions);
    } catch (err) {
      setError('Gagal memuat data pengumpulan tugas');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/admin/classes');
      if (!response.ok) {
        throw new Error('Gagal mengambil data kelas');
      }
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError('Gagal memuat data kelas');
      console.error('Error fetching classes:', err);
    }
  };

  // Filter submissions based on selected class
  const filteredSubmissions = selectedClass === 'all'
    ? submissions
    : submissions.filter(sub => sub.kelasId.toString() === selectedClass);

  return (
    <AdminLayout title="Daftar Pengumpulan Tugas" subtitle="Lihat semua tugas yang telah dikumpulkan oleh siswa">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Pengumpulan Tugas Siswa</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
          >
            <option value="all">Semua Kelas</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e40af]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white dark:bg-[#1e293b] rounded-lg overflow-hidden">
            <thead className="bg-[#1e40af] text-white">
              <tr>
                <th className="py-3 px-4 text-left">NIS</th>
                <th className="py-3 px-4 text-left">Nama Siswa</th>
                <th className="py-3 px-4 text-left">Kelas</th>
                <th className="py-3 px-4 text-left">Tautan Project</th>
                <th className="py-3 px-4 text-left">Tanggal Submit</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{submission.nis}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{submission.nama}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{submission.className}</td>
                    <td className="py-3 px-4">
                      <a 
                        href={submission.linkProject} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#3b82f6] hover:underline"
                      >
                        Lihat Project
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {new Date(submission.submittedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        submission.status === 'Resubmitted' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => addToast(`Download file untuk siswa: ${submission.nama}`, 'info')}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada pengumpulan tugas untuk kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default SubmissionsPage;