import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, reason } = body;

    // In a real app, you would update the student record in the database
    // to set resubmitRequest to true and store the reason
    console.log(`Resubmit request from student ${studentId}: ${reason}`);
    
    return Response.json({ 
      success: true, 
      message: 'Permintaan perbaikan berhasil dikirim ke admin' 
    });
  } catch (error) {
    console.error('Resubmit request error:', error);
    return Response.json(
      { error: 'Terjadi kesalahan saat mengirim permintaan perbaikan' },
      { status: 500 }
    );
  }
}