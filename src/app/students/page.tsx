'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
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

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data.students);
      } catch (err) {
        setError('Failed to load students');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      // Remove the deleted student from the state
      setStudents(students.filter(student => student.id !== id));
    } catch (err) {
      setError('Failed to delete student');
      console.error('Error deleting student:', err);
    }
  };

  if (loading) {
    return (
      <Layout title="Students" subtitle="Manage student assignments">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-blue-light dark:border-ocean-blue-light-alt"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Students" subtitle="Manage student assignments">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Student List</h2>
        <Link 
          href="/students/new" 
          className="btn-gradient"
        >
          Add New Student
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-[#1e293b] rounded-lg overflow-hidden">
          <thead className="bg-[#1e40af] text-white">
            <tr>
              <th className="py-3 px-4 text-left">NIS</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Class</th>
              <th className="py-3 px-4 text-left">Project Link</th>
              <th className="py-3 px-4 text-left">Screenshot</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{student.nis}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{student.nama}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{student.kelas}</td>
                  <td className="py-3 px-4">
                    <a 
                      href={student.linkProject} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-ocean-blue-light dark:text-ocean-blue-light-alt hover:underline"
                    >
                      View Project
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    {student.screenshotUrl ? (
                      <a 
                        href={student.screenshotUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-ocean-blue-light dark:text-ocean-blue-light-alt hover:underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No file</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/students/edit/${student.id}`}
                        className="px-3 py-1 bg-[#3b82f6] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                  No students found. <Link href="/students/new" className="text-ocean-blue-light dark:text-ocean-blue-light-alt hover:underline">Add one</Link>?
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default StudentsPage;