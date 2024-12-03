import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/job';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const companyId = searchParams.get('companyId');
    const count = Boolean(searchParams.get('count')) || false;
    const sortOrder = searchParams.get('order') || 'desc';
    const skip = (page - 1) * limit;

    const query: any = {};
    if (companyId) {
      if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return NextResponse.json({ message: 'Invalid company ID' }, { status: 400 });
      }
      query.companyId = new mongoose.Types.ObjectId(companyId);
    }

    const jobs = await Job.find(query)
      .populate('companyId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });

    if (!jobs.length) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    if (count) {
      const numJobs = await Job.countDocuments(query);
      return NextResponse.json(
        { data: jobs, total: numJobs },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: jobs }, { status: 200 });
  } catch (error) {
    console.error('GET /jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();

    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const newJob = new Job({ ...data, companyId: user._id });
    await newJob.save();

    return NextResponse.json(
      { message: 'Job created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error);
      return NextResponse.json(
        { message: error.issues[0]?.message || 'Invalid data' },
        { status: 400 }
      );
    }

    console.error('POST /jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
