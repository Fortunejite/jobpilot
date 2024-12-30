import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import savedWorker from '@/models/SavedWorker';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const sortOrder = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    await dbConnect();

    const company = await Company.findOne({ userId: user._id });

    if (!company) {
      return NextResponse.json(
        { message: 'Unable to fetch company' },
        { status: 501 },
      );
    }

    const workers = await savedWorker.find({ companyId: company._id })
      .populate('workerId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });

    return NextResponse.json(workers, { status: 200 });
  } catch (error) {
    console.error('GET /saved-workers error:', error);
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

    if (!user || user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const data: { workerId: string } = await request.json();

    const { workerId } = data;
    if (!workerId) {
      return NextResponse.json(
        { message: 'Worker ID is required' },
        { status: 400 },
      );
    }
    await dbConnect();

    const company = await Company.findOne({ userId: user._id });
    if (!company) {
      return NextResponse.json(
        { message: 'Unable to fetch company' },
        { status: 501 },
      );
    }

    const newWorker = new savedWorker({ ...data, companyId: company._id });
    await newWorker.save();

    return NextResponse.json(
      { message: 'Worker saved successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /saved-workers error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
