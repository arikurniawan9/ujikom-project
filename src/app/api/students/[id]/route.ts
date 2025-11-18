import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET a specific student by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return Response.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return Response.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return Response.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return Response.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// UPDATE a specific student by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);
    const body = await req.json();

    if (isNaN(studentId)) {
      return Response.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.nis || !body.nama || !body.kelas || !body.linkProject) {
      return Response.json(
        { error: 'NIS, Nama, Kelas, and Link Project are required' },
        { status: 400 }
      );
    }

    // Check if another student with this NIS exists (excluding current student)
    const existingStudent = await prisma.student.findFirst({
      where: {
        nis: body.nis,
        id: { not: studentId },
      },
    });

    if (existingStudent) {
      return Response.json(
        { error: 'Student with this NIS already exists' },
        { status: 409 }
      );
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        nis: body.nis,
        nama: body.nama,
        kelas: body.kelas,
        linkProject: body.linkProject,
        screenshotUrl: body.screenshotUrl || null,
      },
    });

    return Response.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return Response.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE a specific student by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return Response.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    await prisma.student.delete({
      where: { id: studentId },
    });

    return Response.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return Response.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}