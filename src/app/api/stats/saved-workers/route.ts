import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import savedWorker from '@/models/SavedWorker';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

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

    const count = await savedWorker.countDocuments({ companyId: company._id })

    return NextResponse.json({count}, { status: 200 });
  } catch (error) {
    console.error('GET /stats/aved-jobs error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
