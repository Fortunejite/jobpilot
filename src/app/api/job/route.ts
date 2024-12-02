import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/job';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
    const companyId = request.nextUrl.searchParams.get('companyId') || null
    const skip = (page - 1) * limit;

    if (companyId) {
      const job = await Job.findOne({companyId})
      .populate('companyId');

      if (!job) return NextResponse.json({ data: null }, { status: 404 });

    return NextResponse.json({ data: jobs }, { status: 200 });
    }
    const jobs = await Job.find()
      .populate('companyId')
      .skip(skip)
      .limit(limit);

    if (!jobs) return NextResponse.json({ data: null }, { status: 404 });

    return NextResponse.json({ data: jobs }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const session = await auth();
    const user = session?.user;
    if (!user || user.role !== 'employer')
      return NextResponse.json({ msg: 'Unauthorized' }, { status: 403 });
    const job = new Job({ ...data, companyId: user._id });
    
    await job.save();
    return NextResponse.json({ msg: 'Job created' }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e);

      return NextResponse.json({ msg: e.issues[0].message }, { status: 401 });
    }
    console.log(e);
    return NextResponse.json({ msg: e }, { status: 500 });
  }
}
