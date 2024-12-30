import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Applicaton from '@/models/Application';
import Worker from '@/models/Worker';
import { NextRequest, NextResponse } from 'next/server';

type DataContent = {
  coverLetter: string;
  resume: number;
  jobId: string;
};

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

    const worker = await Worker.findOne({ userId: user._id });

    if (!worker) {
      return NextResponse.json(
        { message: 'Unable to fetch worker' },
        { status: 501 },
      );
    }

    const applicatiions = await Applicaton.find({ workerId: worker._id })
      .populate('jobId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });

    return NextResponse.json(applicatiions, { status: 200 });
  } catch (error) {
    console.error('GET /applications error:', error);
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

    const data: DataContent = await request.json();

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

    const applicatiions = await Applicaton.findOne({
      jobId,
      workerId: worker._id,
    });
    if (applicatiions) {
      return NextResponse.json(
        { message: 'Job already applied' },
        { status: 401 },
      );
    }

    const application = new Applicaton({ ...data, workerId: worker._id, status: 'Pending' });
    await application.save();

    return NextResponse.json(
      { message: 'Job applied successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /applications error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
