import dbConnect from '@/lib/mongodb';
import Worker from '@/models/worker';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    await dbConnect();
    const worker = await Worker.findOne({ userId: id })

    if (!worker) {
      return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json({ data: worker.favouriteJobs }, { status: 200 });
  } catch (error) {
    console.error('GET worker/[id]/favouriteJob error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const favouriteJobs: string[] = await request.json();

    await dbConnect();

    // Update the worker document
    const updatedWorker = await Worker.findOneAndUpdate({userId: id}, {favouriteJobs}, {
      new: true,
      runValidators: true,
    });

    if (!updatedWorker) {
      return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json([...updatedWorker?.favouriteJobs], { status: 200 });
  } catch (error) {
    console.error('PATCH /worker/[id]/favouriteJobs error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}