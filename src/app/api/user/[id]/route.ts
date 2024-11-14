import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    
    if (!params.id) {
      return NextResponse.json({ data: null }, { status: 400 });
    }
    const data = await User.findById(params.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = data?._doc
    return NextResponse.json({ data: user }, { status: 200 });

  } catch(e) {
    console.log(e)
    return NextResponse.json({ data: null }, { status: 500 });
  }
}
