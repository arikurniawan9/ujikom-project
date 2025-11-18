'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  id: number;
  nis: string;
  nama: string;
  kelas: string;
  linkProject: string;
  screenshotUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const StudentForm = ({ initialData, onSubmit }: StudentFormProps) => {
  const [nis, setNis] = useState(initialData?.nis || '');
  const [nama, setNama] = useState(initialData?.nama || '');
  const [kelas, setKelas] = useState(initialData?.kelas || '');
  const [linkProject, setLinkProject] = useState(initialData?.linkProject || '');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.screenshotUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('nis', nis);
      formData.append('nama', nama);
      formData.append('kelas', kelas);
      formData.append('linkProject', linkProject);
      
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      // For now, we'll just submit the basic data without file handling
      // The file upload logic would be implemented server-side
      await onSubmit({
        nis,
        nama,
        kelas,
        linkProject,
        screenshotUrl: previewUrl, // Use existing URL if no new file uploaded
      });

      // Reset form
      if (!initialData) {
        setNis('');
        setNama('');
        setKelas('');
        setLinkProject('');
        setScreenshot(null);
        setPreviewUrl('');
      }
      
      router.push('/students');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred while saving the student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        return;
      }
      
      setScreenshot(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Clear error if a valid file is selected
      if (error && file.type === 'application/pdf') {
        setError(null);
      }
    }
  };

  return (
    <div className="card p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {initialData ? 'Edit Student' : 'Add New Student'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              NIS <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nis"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
              placeholder="Enter NIS"
            />
          </div>

          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kelas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="kelas"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
              placeholder="Enter class"
            />
          </div>

          <div>
            <label htmlFor="linkProject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Link Project <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="linkProject"
              value={linkProject}
              onChange={(e) => setLinkProject(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
              placeholder="https://example.com/project"
            />
          </div>
        </div>

        <div>
          <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload Screenshot (PDF)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="screenshot"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent bg-white dark:bg-[#1e293b] dark:text-white"
            />
          </div>
          {error && error.includes('PDF') && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          {previewUrl && !error && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">Preview:</p>
              <a 
                href={previewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-ocean-blue-light dark:text-ocean-blue-light-alt hover:underline"
              >
                View uploaded PDF
              </a>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/students')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : initialData ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;