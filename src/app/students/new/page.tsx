'use client';

import React from 'react';
import Layout from '@/components/Layout';
import StudentForm from '@/components/StudentForm';
import { useRouter } from 'next/navigation';

const NewStudentPage = () => {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create student');
      }

      // If successful, redirect to the students list
      router.push('/students');
      router.refresh(); // Refresh to update any cached data
    } catch (error: any) {
      console.error('Error creating student:', error);
      alert(error.message || 'An error occurred while creating the student');
    }
  };

  return (
    <Layout title="Add Student" subtitle="Enter student details">
      <StudentForm onSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewStudentPage;