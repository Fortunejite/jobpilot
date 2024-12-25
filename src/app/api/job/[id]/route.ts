import dbConnect from '@/lib/mongodb';
import Job from '@/models/job';
import { NextRequest, NextResponse } from 'next/server';

type tParams = Promise<{ id: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    await dbConnect();
    const job = await Job.findById(id).populate('companyId').lean();

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ ...job }, { status: 200 });
  } catch (error) {
    console.error('GET /job/[id] error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}