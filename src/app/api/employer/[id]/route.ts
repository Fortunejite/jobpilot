import dbConnect from '@/lib/mongodb';
import Employer from '@/models/employer';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    await dbConnect();
    const employer = await Employer.findOne({ userId: id }).populate('userId');

    if (!employer) {
      return NextResponse.json(
        { message: 'Employer not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: employer }, { status: 200 });
  } catch (error) {
    console.error('GET /employer error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } },) {
  try {
    const { id: employerId } = params;
    if (!employerId) {
      return NextResponse.json(
        { message: 'Employer ID is required' },
        { status: 400 },
      );
    }

    const { userId, ...employerData } = await request.json();
    if (!userId || !employerData) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 },
      );
    }

    await dbConnect();

    // Update the Employer model
    const updatedEmployer = await Employer.findByIdAndUpdate(
      employerId,
      employerData,
      { new: true },
    );
    if (!updatedEmployer) {
      return NextResponse.json(
        { message: 'Employer not found' },
        { status: 404 },
      );
    }

    // Update the associated User model
    await User.findByIdAndUpdate(userId._id, userId, { new: true });

    return NextResponse.json(
      {
        message: 'Employer and User updated successfully',
        data: updatedEmployer,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('PATCH /employer error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
