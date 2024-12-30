import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import savedJob from '@/models/SavedJob';
import SavedJob from '@/models/SavedJob';
import Worker from '@/models/Worker';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'worker') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const sortOrder = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    await dbConnect();

    const worker = await Worker.findOne({ userId: user._id });

    if (!worker) {
      return NextResponse.json(
        { message: 'Unable to fetch worker' },
        { status: 501 },
      );
    }

    const jobs = await SavedJob.find({ workerId: worker._id })
      .populate('jobId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('GET /saved-jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'worker') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const data: { jobId: string } = await request.json();

    const { jobId } = data;
    if (!jobId) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 },
      );
    }
    await dbConnect();

    const worker = await Worker.findOne({ userId: user._id });
    if (!worker) {
      return NextResponse.json(
        { message: 'Unable to fetch worker' },
        { status: 501 },
      );
    }

    const job = new savedJob({ ...data, workerId: worker._id });
    await job.save();

    return NextResponse.json(
      { message: 'Job saved successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /saved-jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
