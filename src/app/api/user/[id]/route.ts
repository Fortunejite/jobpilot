import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Remove the password field before sending the response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ data: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('GET /user error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
