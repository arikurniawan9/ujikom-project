'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import StudentForm from '@/components/StudentForm';
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

const EditStudentPage = ({ params }: { params: { id: string } }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const id = parseInt(params.id);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Student not found');
          } else {
            throw new Error('Failed to fetch student');
          }
        } else {
          const data = await response.json();
          setStudent(data);
        }
      } catch (err) {
        setError('Failed to load student');
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update student');
      }

      // If successful, redirect to the students list
      router.push('/students');
      router.refresh(); // Refresh to update any cached data
    } catch (error: any) {
      console.error('Error updating student:', error);
      alert(error.message || 'An error occurred while updating the student');
    }
  };

  if (loading) {
    return (
      <Layout title="Edit Student" subtitle="Update student details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-blue-light dark:border-ocean-blue-light-alt"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Edit Student" subtitle="Update student details">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/students')}
            className="btn-gradient"
          >
            Back to Students
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Student" subtitle="Update student details">
      {student ? (
        <StudentForm initialData={student} onSubmit={handleSubmit} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Student not found</p>
          <button 
            onClick={() => router.push('/students')}
            className="btn-gradient mt-4"
          >
            Back to Students
          </button>
        </div>
      )}
    </Layout>
  );
};

export default EditStudentPage;