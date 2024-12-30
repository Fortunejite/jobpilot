import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import savedJob from "@/models/SavedJob";
import Worker from "@/models/Worker";
import { NextRequest, NextResponse } from "next/server";

type tParams = Promise<{ id: string }>

export async function DELETE(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'worker') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 },
      );
    }
    await dbConnect();

    const worker = await Worker.findOne({ userId: user._id });
    if (!worker) {
      return NextResponse.json(
        { message: 'Unable to fetch worker' },
        { status: 501 },
      );
    }

    await savedJob.deleteOne({ jobId: id, workerId: worker._id });

    return NextResponse.json(
      { message: 'Job deleted successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('DELETE /saved-jobs/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}