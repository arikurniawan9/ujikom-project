import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Mock data - in real app, you would fetch from database
  const students = [
    { id: 1, nis: '12345', nama: 'Budi Santoso', kelasId: 1, submitted: false },
    { id: 2, nis: '12346', nama: 'Ani Lestari', kelasId: 1, submitted: true },
    { id: 3, nis: '12347', nama: 'Citra Dewi', kelasId: 2, submitted: false },
  ];

  return Response.json(students);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nis, nama, kelasId } = body;

    // Mock response - in real app, you would save to database
    const newStudent = {
      id: Date.now(), // Mock ID
      nis,
      nama,
      kelasId,
      submitted: false,
    };

    return Response.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return Response.json(
      { error: 'Gagal membuat siswa' },
      { status: 500 }
    );
  }
}