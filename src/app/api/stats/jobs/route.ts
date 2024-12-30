import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import Job from '@/models/Job';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const session = await auth();
    const user = session?.user;

    const status = searchParams.get('status') as 'open' | 'closed' | undefined;

    if (!user || user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const company = await Company.findOne({ userId: user._id });
    if (!company) {
      return NextResponse.json(
        { message: 'Unable to fetch company' },
        { status: 501 },
      );
    }

    const currentDate = new Date();

    const query = {
      companyId: company._id,
      ...(status &&
        (status === 'open'
          ? { expire: { $ge: { currentDate } } }
          : { expire: { $lt: { currentDate } } })),
    };

    const count = await Job.countDocuments(query);

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('GET /stats/jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
