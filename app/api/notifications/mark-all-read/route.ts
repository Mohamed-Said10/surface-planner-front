import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    console.log('🔄 Mark-all-read proxy called');
    
    // Get session to forward authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.error('❌ No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Session found:', session.user?.email);

    // Get cookies from request
    const cookieHeader = request.headers.get('cookie');
    console.log('🍪 Cookies:', cookieHeader);

    // Forward request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${backendUrl}/api/notifications/mark-all-read`;
    console.log('📤 Forwarding to:', url);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { 'Cookie': cookieHeader }),
      },
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Backend error:', error);
      return NextResponse.json(
        { error: 'Failed to mark notifications as read', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Backend success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in mark-all-read proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
