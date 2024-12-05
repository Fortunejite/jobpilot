import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/job';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const userId = searchParams.get('userId');
    const count = Boolean(searchParams.get('count')) || false;
    const sortOrder = searchParams.get('order') || 'desc';
    const skip = (page - 1) * limit;

    const query: any = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: 'Invalid company ID' },
          { status: 400 },
        );
      }
      query.companyId = new mongoose.Types.ObjectId(userId);
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
      return NextResponse.json({ data: jobs, total: numJobs }, { status: 200 });
    }

    return NextResponse.json({ data: jobs }, { status: 200 });
  } catch (error) {
    console.error('GET /jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const jobSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  tags: z.array(z.string()).nonempty({ message: 'At least one tag is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  minSalary: z.number().nonnegative({ message: 'Minimum salary must be 0 or more' }),
  maxSalary: z.number().nonnegative({ message: 'Maximum salary must be 0 or more' }),
  salaryType: z.enum(['Hourly', 'Monthly', 'Project Basis']),
  education: z.string().min(1, { message: 'Education level is required' }),
  exprience: z.string().min(1, { message: 'Experience is required' }),
  type: z.enum(['Full Time', 'Part Time', 'Contract', 'FreeLance', 'Internship']),
  vacancies: z.number().min(1, { message: 'There must be at least one vacancy' }),
  expire: z.date(),
  country: z.string().min(1, { message: 'Country is required' }),
  benefits: z.array(z.string()).optional(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  applyOn: z.enum(['jobpilot', 'email', 'other']),
  skills: z.array(z.string()).optional(),
  applicatiions: z.array(z.string()).optional(),
})
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
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error);
      return NextResponse.json(
        { message: error.issues[0]?.message || 'Invalid data' },
        { status: 400 },
      );
    }

    console.error('POST /jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
