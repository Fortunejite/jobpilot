import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Company from '@/models/Company';
import savedWorker from '@/models/SavedWorker';
import { NextRequest, NextResponse } from "next/server";

type tParams = Promise<{ id: string }>

export async function DELETE(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
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

    await savedWorker.deleteOne({ companyId: company._id, workerId: id });

    return NextResponse.json(
      { message: 'Worker deleted successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('DELETE /saved-workers/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}