'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the student submission page
    router.push('/submission');
  }, [router]);

  return null; // Don't render anything during redirect
}