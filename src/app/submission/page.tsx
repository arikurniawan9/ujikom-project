'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/Toast';

const StudentSubmissionPage = () => {
  const { addToast } = useToast();
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [nis, setNis] = useState('');
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'input' | 'form' | 'submitted'>('select'); // New state to track the step
  const [projectLink, setProjectLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Hanya file PDF yang diperbolehkan');
        setFile(null);
        setPreviewUrl(null);
        setFileName('');
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setFileError('File terlalu besar. Maksimal 5MB');
        setFile(null);
        setPreviewUrl(null);
        setFileName('');
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setFileName(selectedFile.name);
      setFileError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectLink || !file) {
      setError('Harap lengkapi semua field yang wajib');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create form data to send both file and link
      const formData = new FormData();
      formData.append('studentId', student.id.toString());
      formData.append('linkProject', projectLink);
      formData.append('screenshot', file);

      // In a real app, you would send request to API
      // const response = await fetch('/api/submission', {
      //   method: 'POST',
      //   body: formData
      // });

      // For demo purposes, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update the student's submission status in mock data
      setStudent({ ...student, submitted: true });

      // Show success message
      addToast('Tugas berhasil dikumpulkan!', 'success');

      // Return to input step to allow another submission if needed
      setStep('input');
      setNis('');
      setProjectLink('');
      setFile(null);
      setPreviewUrl(null);
      setFileName('');
    } catch (err) {
      addToast('Gagal mengirim tugas. Silakan coba lagi.', 'error');
      console.error('Error submitting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestResubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestReason.trim()) {
      setError('Harap berikan alasan perbaikan');
      return;
    }

    setIsRequesting(true);
    setError(null);

    try {
      // In a real app, you would send request to API
      // const response = await fetch('/api/admin/resubmit-requests', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     studentId: student.id,
      //     reason: requestReason,
      //   }),
      // });

      // For demo purposes, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      addToast('Permintaan perbaikan berhasil dikirim ke admin', 'success');

      // Reset and return to input step
      setRequestReason('');
      setStep('input');
      setNis('');
    } catch (err) {
      addToast('Gagal mengirim permintaan perbaikan', 'error');
      console.error('Error requesting resubmit:', err);
    } finally {
      setIsRequesting(false);
    }
  };

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

  const handleClassSelect = () => {
    if (!selectedClass) {
      setError('Pilih kelas terlebih dahulu');
      return;
    }
    setStep('input');
    setError(null);
  };

  const handleNisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nis) {
      setError('Masukkan NIS terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      // In a real app, we would verify this against the database
      // For now, we'll use mock data
      const mockStudents = [
        { id: 1, nis: '12345', nama: 'Budi Santoso', kelasId: 1, submitted: false },
        { id: 2, nis: '12346', nama: 'Ani Lestari', kelasId: 1, submitted: true },
        { id: 3, nis: '12347', nama: 'Citra Dewi', kelasId: 2, submitted: false },
      ];

      const foundStudent = mockStudents.find(s => s.nis === nis);
      
      if (foundStudent) {
        setStudent(foundStudent);
        if (foundStudent.submitted && !foundStudent.resubmitRequest) {
          // Show option to request resubmission
          setStep('submitted');
        } else if (foundStudent.submitted && foundStudent.resubmitRequest) {
          // Allow resubmission if admin approved resubmit request
          setStep('form');
        } else {
          setStep('form');
        }
      } else {
        setError('NIS tidak ditemukan. Hubungi admin untuk verifikasi.');
      }
    } catch (err) {
      setError('Gagal memverifikasi NIS');
      console.error('Error verifying NIS:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 'select') {
    return (
      <Layout title="Pengumpulan Tugas Ujikom" subtitle="Silakan pilih kelas dan masukkan NIS">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e40af]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Pengumpulan Tugas Ujikom" subtitle="Silakan pilih kelas dan masukkan NIS">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {step === 'select' && (
        <div className="card p-8 max-w-lg w-full mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Pilih Kelas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id.toString())}
                className={`p-4 rounded-lg border ${
                  selectedClass === cls.id.toString()
                    ? 'border-[#1e40af] bg-[#1e40af]/10 text-[#1e40af] dark:bg-[#1e40af]/20 dark:text-[#3b82f6]'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1e293b]'
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleClassSelect}
            className="w-full btn-gradient py-3"
          >
            Lanjutkan
          </button>
        </div>
      )}

      {step === 'input' && (
        <div className="card p-8 max-w-lg w-full mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Masukkan NIS</h2>
          
          <form onSubmit={handleNisSubmit}>
            <div className="mb-6">
              <label htmlFor="nis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nomor Induk Siswa (NIS)
              </label>
              <input
                type="text"
                id="nis"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
                placeholder="Masukkan NIS Anda"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Nama Anda akan otomatis muncul setelah NIS dimasukkan
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setStep('select');
                  setNis('');
                  setError(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 btn-gradient"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Verifikasi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'form' && student && (
        <div className="card p-8 max-w-2xl w-full mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Form Pengumpulan Tugas</h2>
          
          <div className="mb-6 p-4 bg-blue-50 dark:bg-[#0f172a] rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Nama Lengkap</p>
                <p className="font-medium text-gray-800 dark:text-white">{student.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">NIS</p>
                <p className="font-medium text-gray-800 dark:text-white">{student.nis}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="linkProject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link Project <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="linkProject"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
                placeholder="https://example.com/project"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Screenshot (PDF) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="screenshot"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
              />
              {fileError && (
                <p className="mt-1 text-sm text-red-600">{fileError}</p>
              )}
              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">File yang akan diupload:</p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3b82f6] hover:underline"
                  >
                    {fileName}
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setStudent(null);
                  setNis('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="btn-gradient px-6 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Submit Tugas'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'submitted' && student && (
        <div className="card p-8 max-w-2xl w-full mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Tugas Sudah Dikumpulkan</h2>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-[#0f172a] rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Nama Lengkap</p>
                <p className="font-medium text-gray-800 dark:text-white">{student.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">NIS</p>
                <p className="font-medium text-gray-800 dark:text-white">{student.nis}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 p-4 bg-yellow-50 dark:bg-[#7c2d12] rounded-lg">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Tugas Anda sudah dikumpulkan</h3>
            <p className="text-gray-600 dark:text-gray-200">
              Jika Anda ingin melakukan perbaikan terhadap tugas yang telah dikumpulkan,
              silakan ajukan permintaan perbaikan dengan mengisi form di bawah ini.
            </p>
          </div>

          <form onSubmit={handleRequestResubmit}>
            <div className="mb-6">
              <label htmlFor="requestReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alasan Perbaikan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requestReason"
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
                placeholder="Jelaskan bagian mana yang ingin Anda perbaiki dan mengapa..."
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setNis('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="btn-gradient px-6 py-2"
                disabled={isRequesting}
              >
                {isRequesting ? 'Mengirim...' : 'Ajukan Perbaikan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default StudentSubmissionPage;