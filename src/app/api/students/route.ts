import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;
    
    const students = await prisma.student.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const total = await prisma.student.count();
    
    return Response.json({
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return Response.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.nis || !body.nama || !body.kelas || !body.linkProject) {
      return Response.json(
        { error: 'NIS, Nama, Kelas, and Link Project are required' },
        { status: 400 }
      );
    }
    
    // Check if NIS already exists
    const existingStudent = await prisma.student.findUnique({
      where: { nis: body.nis },
    });
    
    if (existingStudent) {
      return Response.json(
        { error: 'Student with this NIS already exists' },
        { status: 409 }
      );
    }
    
    const newStudent = await prisma.student.create({
      data: {
        nis: body.nis,
        nama: body.nama,
        kelas: body.kelas,
        linkProject: body.linkProject,
        screenshotUrl: body.screenshotUrl || null,
      },
    });
    
    return Response.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return Response.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}