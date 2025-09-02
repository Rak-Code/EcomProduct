import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/firebase/server-admin';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }

    const result = await verifyAdminToken(token);
    
    if (result.isValid) {
      return NextResponse.json({ 
        isValid: true, 
        email: result.email, 
        uid: result.uid 
      });
    } else {
      return NextResponse.json({ isValid: false }, { status: 403 });
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json({ isValid: false }, { status: 500 });
  }
}