import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const jobcount = await Job.countDocuments();

    return NextResponse.json({ jobcount }, { status: 200 });
  } catch (error) {
    console.error('GET /stats error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
