'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/Layout';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

const ClassesPage = () => {
  const { addToast } = useToast();
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClassName.trim()) {
      setError('Nama kelas harus diisi');
      return;
    }

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newClassName }),
      });

      if (!response.ok) {
        throw new Error('Gagal menambahkan kelas');
      }

      const newClass = await response.json();
      setClasses([...classes, newClass]);
      setNewClassName('');
      addToast('Kelas berhasil ditambahkan!', 'success');
    } catch (err) {
      addToast('Gagal menambahkan kelas', 'error');
      console.error('Error adding class:', err);
    }
  };

  const openDeleteModal = (id: number) => {
    setClassToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteClass = async () => {
    if (classToDelete === null) return;

    try {
      // In a real app, you would make an API call to delete the class
      setClasses(classes.filter(cls => cls.id !== classToDelete));
      addToast('Kelas berhasil dihapus!', 'success');
    } catch (err) {
      addToast('Gagal menghapus kelas', 'error');
      console.error('Error deleting class:', err);
    } finally {
      setShowConfirmModal(false);
      setClassToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setClassToDelete(null);
  };

  return (
    <AdminLayout title="Manajemen Kelas" subtitle="Tambah, edit, atau hapus data kelas">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Daftar Kelas</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="card p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Tambah Kelas Baru</h3>
        <form onSubmit={handleAddClass} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Nama kelas (contoh: XII RPL 1)"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
          />
          <button
            type="submit"
            className="btn-gradient px-4 py-2"
          >
            Tambah Kelas
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e40af]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white dark:bg-[#1e293b] rounded-lg overflow-hidden">
            <thead className="bg-[#1e40af] text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nama Kelas</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{cls.id}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{cls.name}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openDeleteModal(cls.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                    Belum ada kelas. Tambah kelas baru?
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Konfirmasi Hapus Kelas"
        message="Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDeleteClass}
        onCancel={handleCancelDelete}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmButtonType="danger"
      />
    </AdminLayout>
  );
};

export default ClassesPage;