import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

type tParams = Promise<{ id: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    await dbConnect();

    const userId = (await params).id;
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Remove the password field before sending the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ data: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('GET /user error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
