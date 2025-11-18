import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Mock data - in real app, you would fetch from database
  const classes = [
    { id: 1, name: 'XII RPL 1' },
    { id: 2, name: 'XII RPL 2' },
    { id: 3, name: 'XII TKJ 1' },
    { id: 4, name: 'XII TKJ 2' },
  ];

  return Response.json(classes);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    // Mock response - in real app, you would save to database
    const newClass = {
      id: Date.now(), // Mock ID
      name,
    };

    return Response.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return Response.json(
      { error: 'Gagal membuat kelas' },
      { status: 500 }
    );
  }
}