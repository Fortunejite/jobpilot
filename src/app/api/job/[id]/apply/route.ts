import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/job';
import Worker from '@/models/worker';
import { NextRequest, NextResponse } from 'next/server';

type DataContent = {
  coverLetter: string;
  resume: number;
};

type tParams = Promise<{ id: string }>

export async function POST(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 },
      );
    }
    await dbConnect();
    const data: DataContent = await request.json();

    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'worker') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const worker = await Worker.findOne({ userId: user._id });
    if (!worker) {
      return NextResponse.json(
        { message: 'Unable to fetch company' },
        { status: 501 },
      );
    }

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json(
        { message: 'Unable to fetch job' },
        { status: 501 },
      );
    }

    const applied = job.applicatiions.filter((application) => application.userId.toString() === user._id)
    if (applied.length > 0)  return NextResponse.json(
      { message: 'Job already applied' },
      { status: 401 },
    );

    await Job.findByIdAndUpdate(id, {
      $push: {
        applicatiions: {
          userId: user._id,
          coverLetter: data.coverLetter,
          resume: worker.resume[data.resume].url,
        },
      },
    });

    return NextResponse.json(
      { message: 'Job applied successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /job/[id]/apply error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
