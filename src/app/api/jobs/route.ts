import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import Job from '@/models/Job';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { z } from 'zod';

const JobSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  tags: z
    .array(z.string())
    .nonempty({ message: 'At least one tag is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  minSalary: z
    .number()
    .nonnegative({ message: 'Minimum salary must be 0 or more' }),
  maxSalary: z
    .number()
    .nonnegative({ message: 'Maximum salary must be 0 or more' }),
  salaryType: z.enum(['Hourly', 'Monthly', 'Project Basis']),
  education: z.string().min(1, { message: 'Education level is required' }),
  exprience: z.string().min(1, { message: 'Experience is required' }),
  type: z.enum([
    'Full Time',
    'Part Time',
    'Contract',
    'FreeLance',
    'Internship',
  ]),
  vacancies: z
    .number()
    .min(1, { message: 'There must be at least one vacancy' }),
  expire: z.date(),
  locationA: z.string().min(1, { message: 'Country is required' }),
  categoryId: z.string({ message: 'Category is required' }),
  benefits: z.array(z.string()).optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  applyOn: z.enum(['jobpilot', 'email', 'other']),
  skills: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    // paginations
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const sortOrder = searchParams.get('order') || 'desc';

    //filters
    const companyId = searchParams.get('companyId');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const keyword = searchParams.get('keyword');
    // const tag = searchParams.get('tag');

    const skip = (page - 1) * limit;

    const query = {
      ...(companyId && { companyId }),
      ...(category && { categoryId: category }),
      ...(location && { locationA: location }),
      ...(keyword && { $text: { $search: keyword } }),
    };

    const jobs = await Job.find(query)
      .populate('companyId')
      .populate('categoryId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('GET /jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {

  try {
    await dbConnect();
    const body = await request.json();
    body.expire = new Date(body.expire);
    const data = JobSchema.parse(body);

    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const company = await Company.findOne({ userId: user._id });
    if (!company) {
      return NextResponse.json(
        { message: 'Unable to fetch company' },
        { status: 501 },
      );
    }

    const newJob = new Job({ ...data, companyId: company._id });
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
