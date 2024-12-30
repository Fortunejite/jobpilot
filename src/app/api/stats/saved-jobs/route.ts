import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import SavedJob from '@/models/SavedJob';
import Worker from '@/models/Worker';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'worker') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    await dbConnect();

    const worker = await Worker.findOne({ userId: user._id });

    if (!worker) {
      return NextResponse.json(
        { message: 'Unable to fetch worker' },
        { status: 501 },
      );
    }

    const count = await SavedJob.countDocuments({ workerId: worker._id })

    return NextResponse.json({count}, { status: 200 });
  } catch (error) {
    console.error('GET /stats/aved-jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
