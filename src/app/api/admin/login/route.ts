import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Mock admin credentials - in real app, you would verify against database
    if (username === 'admin' && password === 'admin123') {
      // Return success response
      return Response.json({
        success: true,
        message: 'Login berhasil',
        // In a real app, you would generate a JWT token
        token: 'mock-jwt-token'
      });
    } else {
      return Response.json(
        { 
          success: false, 
          error: 'Username atau password salah' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}