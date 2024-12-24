import dbConnect from '@/lib/mongodb';
import Job from '@/models/job';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId');

    const query: { companyId?: mongoose.Types.ObjectId } = {};
    if (!userId)
      return NextResponse.json(
        { message: 'Company ID is required' },
        { status: 400 },
      );

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'Invalid company ID' },
        { status: 400 },
      );
    }
    const date = new Date();
    query.companyId = new mongoose.Types.ObjectId(userId);
    const total = await Job.countDocuments({ companyId: userId });
    const openJobs = await Job.countDocuments({
      companyId: userId,
      expire: {
        $gt: date,
      },
    });
    return NextResponse.json({ total, openJobs }, { status: 200 });
  } catch (error) {
    console.error('GET /jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
