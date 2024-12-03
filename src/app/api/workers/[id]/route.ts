import dbConnect from '@/lib/mongodb';
import Worker from '@/models/worker';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'Worker ID is required' }, { status: 400 });
    }

    await dbConnect();
    const worker = await Worker.findOne({ userId: id }).populate('userId');

    if (!worker) {
      return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json({ data: worker }, { status: 200 });
  } catch (error) {
    console.error('GET /worker error:', error);
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
      return NextResponse.json({ message: 'Worker ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { userId, ...updateData } = body;

    await dbConnect();

    // Update the worker document
    const updatedWorker = await Worker.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedWorker) {
      return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
    }

    // Update the associated user document if provided
    if (userId) {
      await User.findByIdAndUpdate(userId._id, userId, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json({ data: updatedWorker }, { status: 200 });
  } catch (error) {
    console.error('PATCH /worker error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
