import dbConnect from '@/lib/mongodb';
import Applicaton from '@/models/Application';
import { NextRequest, NextResponse } from 'next/server';

type tParams = Promise<{ jobId: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    const { jobId } = await params;
    if (!jobId) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 },
      );
    }

    await dbConnect();
    const applications = await Applicaton.find({ jobId: jobId }).populate(
      'jobId',
    );

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error('GET /applications/[jobId] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
