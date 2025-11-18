'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/Layout';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

const ResubmitRequestsPage = () => {
  const { addToast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetchRequests();
    fetchClasses();
  }, []);

  const fetchRequests = async () => {
    try {
      // Mock data - in real app, fetch from database
      const mockRequests = [
        { id: 1, studentId: 2, nis: '12346', studentName: 'Ani Lestari', className: 'XII RPL 1', reason: 'Ada bug di fitur login', submittedAt: new Date('2023-05-15'), status: 'pending' },
        { id: 2, studentId: 5, nis: '12350', studentName: 'Dedi Kurniawan', className: 'XII TKJ 1', reason: 'Perlu perbaikan UI', submittedAt: new Date('2023-05-16'), status: 'approved' },
      ];
      setRequests(mockRequests);
    } catch (err) {
      setError('Gagal memuat permintaan perbaikan');
      console.error('Error fetching requests:', err);
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

  const handleApprove = async (requestId: number) => {
    try {
      // In a real app, you would update the student's resubmitRequest status to true
      setRequests(requests.map(req =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      ));

      // Also update the student record to allow resubmission
      // This would be done through another API call in a real app

      addToast('Permintaan perbaikan disetujui', 'success');
    } catch (err) {
      addToast('Gagal menyetujui permintaan perbaikan', 'error');
      console.error('Error approving request:', err);
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      // In a real app, you would update the request status
      setRequests(requests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      ));

      addToast('Permintaan perbaikan ditolak', 'info');
    } catch (err) {
      addToast('Gagal menolak permintaan perbaikan', 'error');
      console.error('Error rejecting request:', err);
    }
  };

  return (
    <AdminLayout title="Permintaan Perbaikan Tugas" subtitle="Lihat dan tangani permintaan perbaikan dari siswa">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Daftar Permintaan Perbaikan</h2>
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
                <th className="py-3 px-4 text-left">Alasan Perbaikan</th>
                <th className="py-3 px-4 text-left">Tanggal Pengajuan</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{request.nis}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{request.studentName}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{request.className}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{request.reason}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {new Date(request.submittedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                      }`}>
                        {request.status === 'approved' ? 'Disetujui' : 
                         request.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {request.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada permintaan perbaikan saat ini.
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

export default ResubmitRequestsPage;