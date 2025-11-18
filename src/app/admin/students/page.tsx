'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/Layout';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import * as XLSX from 'xlsx';
import Tooltip from '@/components/ui/Tooltip';

const StudentsPage = () => {
  const { addToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [originalStudents, setOriginalStudents] = useState<any[]>([]); // Store original data for search
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    nis: '',
    nama: '',
    kelasId: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  // State for multi-select
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  // New state for search, pagination, and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      // Mock data - in real app, fetch from database via API
      const mockStudents = [
        { id: 1, nis: '12345', nama: 'Budi Santoso', kelasId: 1, submitted: false },
        { id: 2, nis: '12346', nama: 'Ani Lestari', kelasId: 1, submitted: true },
        { id: 3, nis: '12347', nama: 'Citra Dewi', kelasId: 2, submitted: false },
        { id: 4, nis: '12348', nama: 'Dedi Kurniawan', kelasId: 2, submitted: true },
        { id: 5, nis: '12349', nama: 'Eka Putri', kelasId: 3, submitted: false },
        { id: 6, nis: '12350', nama: 'Fajar Nugroho', kelasId: 3, submitted: true },
        { id: 7, nis: '12351', nama: 'Gina Permata', kelasId: 4, submitted: false },
        { id: 8, nis: '12352', nama: 'Hendra Pratama', kelasId: 1, submitted: false },
        { id: 9, nis: '12353', nama: 'Indah Lestari', kelasId: 2, submitted: true },
        { id: 10, nis: '12354', nama: 'Joko Widodo', kelasId: 4, submitted: false },
        { id: 11, nis: '12355', nama: 'Kartika Sari', kelasId: 1, submitted: true },
        { id: 12, nis: '12356', nama: 'Lukman Hakim', kelasId: 3, submitted: false },
        { id: 13, nis: '12357', nama: 'Maya Anggraini', kelasId: 2, submitted: true },
        { id: 14, nis: '12358', nama: 'Nurul Huda', kelasId: 4, submitted: false },
        { id: 15, nis: '12359', nama: 'Oka Prasetya', kelasId: 1, submitted: true },
        { id: 16, nis: '12360', nama: 'Putri Andini', kelasId: 2, submitted: false },
        { id: 17, nis: '12361', nama: 'Rizki Pratama', kelasId: 3, submitted: true },
        { id: 18, nis: '12362', nama: 'Sari Dewi', kelasId: 4, submitted: false },
        { id: 19, nis: '12363', nama: 'Taufik Hidayat', kelasId: 1, submitted: true },
        { id: 20, nis: '12364', nama: 'Umi Kalsum', kelasId: 2, submitted: false },
      ];
      setStudents(mockStudents);
      setOriginalStudents(mockStudents);
    } catch (err) {
      setError('Gagal memuat data siswa');
      console.error('Error fetching students:', err);
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

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nis || !formData.nama || !formData.kelasId) {
      setError('Semua field harus diisi');
      return;
    }

    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nis: formData.nis,
          nama: formData.nama,
          kelasId: parseInt(formData.kelasId),
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menambahkan siswa');
      }

      const newStudent = await response.json();
      setStudents([...students, newStudent]);
      setFormData({ nis: '', nama: '', kelasId: '' });
      addToast('Siswa berhasil ditambahkan!', 'success');
    } catch (err) {
      addToast('Gagal menambahkan siswa', 'error');
      console.error('Error adding student:', err);
    }
  };

  const openDeleteModal = (id: number) => {
    setStudentToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteStudent = async () => {
    if (studentToDelete === null) return;

    try {
      // In a real app, you would make an API call to delete the student
      setStudents(students.filter(student => student.id !== studentToDelete));
      addToast('Siswa berhasil dihapus!', 'success');
    } catch (err) {
      addToast('Gagal menghapus siswa', 'error');
      console.error('Error deleting student:', err);
    } finally {
      setShowConfirmModal(false);
      setStudentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setStudentToDelete(null);
  };

  // Multi-select functions
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
      setSelectAll(false);
    } else {
      setSelectedStudents(currentItems.map(item => item.id));
      setSelectAll(true);
    }
  };

  const toggleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(studentId => studentId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
    // Update select all state if needed
    if(selectAll && !currentItems.some(item => item.id === id)) {
      setSelectAll(false);
    } else if(!selectAll && currentItems.every(item => selectedStudents.includes(item.id) || item.id === id)) {
      setSelectAll(true);
    }
  };

  // Function to handle delete multiple students
  const handleDeleteMultiple = async () => {
    if (selectedStudents.length === 0) {
      addToast('Tidak ada siswa yang dipilih untuk dihapus', 'warning');
      return;
    }

    try {
      // In a real app, make API call to delete multiple students
      setStudents(students.filter(student => !selectedStudents.includes(student.id)));
      setOriginalStudents(originalStudents.filter(student => !selectedStudents.includes(student.id)));
      setSelectedStudents([]);
      setSelectAll(false);
      addToast(`${selectedStudents.length} siswa berhasil dihapus!`, 'success');
    } catch (err) {
      addToast('Gagal menghapus siswa', 'error');
      console.error('Error deleting multiple students:', err);
    }
  };

  // Function to confirm delete multiple
  const confirmDeleteMultiple = () => {
    if (selectedStudents.length === 0) {
      addToast('Tidak ada siswa yang dipilih untuk dihapus', 'warning');
      return;
    }

    if (typeof window !== 'undefined' && confirm(`Anda yakin ingin menghapus ${selectedStudents.length} siswa?`)) {
      handleDeleteMultiple();
    }
  };

  // Export to Excel
  const handleExport = () => {
    try {
      // Prepare data for export
      const exportData = students.map((student: any) => ({
        NIS: student.nis,
        Nama: student.nama,
        'Kelas ID': student.kelasId,
        'Status Tugas': student.submitted ? 'Sudah' : 'Belum',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');

      // Set column widths
      const colWidths = [
        { wch: 15 }, // NIS
        { wch: 25 }, // Nama
        { wch: 15 }, // Kelas ID
        { wch: 15 }, // Status Tugas
      ];
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(workbook, 'data_siswa.xlsx');
      addToast('Data berhasil diekspor ke Excel!', 'success');
    } catch (error) {
      addToast('Gagal mengekspor data ke Excel', 'error');
      console.error('Export error:', error);
    }
  };

  // Download template
  const handleDownloadTemplate = () => {
    try {
      const templateData = [
        { NIS: '12345', Nama: 'Nama Lengkap Siswa', 'Kelas ID': 1, 'Status Tugas': 'Belum' }
      ];

      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

      // Set column widths
      const colWidths = [
        { wch: 15 }, // NIS
        { wch: 25 }, // Nama
        { wch: 15 }, // Kelas ID
        { wch: 15 }, // Status Tugas
      ];
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(workbook, 'template_import_siswa.xlsx');
      addToast('Template berhasil diunduh!', 'success');
    } catch (error) {
      addToast('Gagal mengunduh template', 'error');
      console.error('Template download error:', error);
    }
  };

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  // Import from Excel
  const handleImport = async () => {
    if (!uploadFile) {
      addToast('Silakan pilih file terlebih dahulu', 'error');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and process the data
        const processedData = jsonData.map((row: any) => ({
          nis: String(row['NIS'] || row['Nis'] || ''),
          nama: String(row['Nama'] || ''),
          kelasId: parseInt(row['Kelas ID'] || row['KelasId'] || 0),
          submitted: String(row['Status Tugas']).toLowerCase() === 'sudah'
        }));

        // Filter out invalid entries
        const validData = processedData.filter(item =>
          item.nis && item.nama && !isNaN(item.kelasId) && item.kelasId > 0
        );

        if (validData.length === 0) {
          addToast('Tidak ada data valid ditemukan dalam file', 'error');
          return;
        }

        // Add valid data to state
        const newStudents = [...students];
        validData.forEach(item => {
          // Check for duplicate NIS
          const exists = newStudents.some(s => s.nis === item.nis);
          if (!exists) {
            newStudents.push({
              id: Date.now() + newStudents.length, // Generate unique ID
              nis: item.nis,
              nama: item.nama,
              kelasId: item.kelasId,
              submitted: item.submitted
            });
          }
        });

        setStudents(newStudents);
        setOriginalStudents(newStudents);
        setShowImportModal(false);
        setUploadFile(null);

        addToast(`Berhasil mengimpor ${validData.length} data siswa`, 'success');
      };

      reader.readAsArrayBuffer(uploadFile);
    } catch (error) {
      addToast('Gagal mengimpor data dari Excel', 'error');
      console.error('Import error:', error);
    }
  };

  // Calculate pagination values based on search term
  const filteredStudents = searchTerm
    ? originalStudents.filter(student =>
        student.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : originalStudents;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <AdminLayout title="Manajemen Siswa" subtitle="Tambah, edit, atau hapus data siswa">
      {/* Search, Export, Import Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Cari berdasarkan NIS atau Nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
          />
          {/* Items per page selector */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
          >
            <option value={5}>5 per halaman</option>
            <option value={10}>10 per halaman</option>
            <option value={20}>20 per halaman</option>
            <option value={50}>50 per halaman</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Add Student Button */}
          <Tooltip text="Tambah Siswa Baru">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-gradient p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </Tooltip>

          {/* Export Button */}
          <Tooltip text="Ekspor ke Excel">
            <button
              onClick={handleExport}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Tooltip>

          {/* Download Template Button */}
          <Tooltip text="Download Template">
            <button
              onClick={handleDownloadTemplate}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7.293-9.707a1 1 0 00-1.414 0l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L7.414 13H15a1 1 0 100-2H7.414l1.879-1.879a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Tooltip>

          {/* Import Button */}
          <Tooltip text="Impor dari Excel">
            <button
              onClick={() => setShowImportModal(true)}
              className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7.293-7.707a1 1 0 00-1.414 0l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L7.414 15H15a1 1 0 100-2H7.414l1.879-1.879a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Tooltip>

          {/* Delete Multiple Button - Only shown when students are selected */}
          {selectedStudents.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                {selectedStudents.length} dipilih
              </span>
              <Tooltip text={`Hapus ${selectedStudents.length} Siswa Terpilih`}>
                <button
                  onClick={confirmDeleteMultiple}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          )}
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
        <div className="overflow-x-auto rounded-lg shadow mt-4">
          <table className="min-w-full bg-white dark:bg-[#1e293b] rounded-lg overflow-hidden">
            <thead className="bg-[#1e40af] text-white">
              <tr>
                <th className="py-3 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-[#1e40af] bg-gray-100 border-gray-300 rounded focus:ring-[#1e40af] dark:focus:ring-[#3b82f6] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </th>
                <th className="py-3 px-4 text-left">No.</th>
                <th className="py-3 px-4 text-left">NIS</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Kelas</th>
                <th className="py-3 px-4 text-left">Status Tugas</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((student, index) => {
                  const className = classes.find(cls => cls.id === student.kelasId)?.name || 'Kelas Tidak Ditemukan';
                  const rowIndex = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr key={student.id} className={`hover:bg-gray-50 dark:hover:bg-[#0f172a] ${selectedStudents.includes(student.id) ? 'bg-blue-50 dark:bg-[#1e3a8a]' : ''}`}>
                      <td className="py-3 px-4 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleSelectStudent(student.id)}
                          className="w-4 h-4 text-[#1e40af] bg-gray-100 border-gray-300 rounded focus:ring-[#1e40af] dark:focus:ring-[#3b82f6] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{rowIndex}.</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{student.nis}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{student.nama}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{className}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          student.submitted
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }`}>
                          {student.submitted ? 'Sudah' : 'Belum'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Tooltip text="Hapus Siswa">
                            <button
                              onClick={() => openDeleteModal(student.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? 'Tidak ditemukan siswa dengan pencarian tersebut.'
                      : 'Belum ada siswa. Tambah siswa baru?'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>


          {/* Pagination Controls */}
          {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
            <div className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
              Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, filteredStudents.length)} dari {filteredStudents.length} data
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Sebelumnya
              </button>

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-[#1e40af] text-white'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                  // Show ellipsis for skipped pages
                  return (
                    <span key={pageNumber} className="px-3 py-1">...</span>
                  );
                } else if (
                  pageNumber < currentPage - 2 ||
                  pageNumber > currentPage + 2
                ) {
                  return null; // Skip this page button
                }
                return null;
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    )}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Konfirmasi Hapus Siswa"
        message="Apakah Anda yakin ingin menghapus siswa ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDeleteStudent}
        onCancel={handleCancelDelete}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmButtonType="danger"
      />

      {/* Custom Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => {
              setShowImportModal(false);
              setUploadFile(null);
            }}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Impor Data Siswa dari Excel
                </h3>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setUploadFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="mb-4 text-gray-600 dark:text-gray-300">Pilih file Excel untuk mengimpor data siswa:</p>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1e293b] dark:text-white"
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Pastikan format file sesuai dengan template yang tersedia
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setUploadFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Impor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAddModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Tambah Siswa Baru
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="nis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    NIS
                  </label>
                  <input
                    type="text"
                    id="nis"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
                    placeholder="Nomor Induk Siswa"
                  />
                </div>

                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
                    placeholder="Nama lengkap siswa"
                  />
                </div>

                <div>
                  <label htmlFor="kelasId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kelas
                  </label>
                  <select
                    id="kelasId"
                    value={formData.kelasId}
                    onChange={(e) => setFormData({ ...formData, kelasId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
                  >
                    <option value="">Pilih kelas</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-gradient px-4 py-2"
                  >
                    Tambah Siswa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default StudentsPage;