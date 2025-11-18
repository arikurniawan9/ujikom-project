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