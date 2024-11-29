import { worker } from '@/app/(home)/(authenticated)/dashboard/workerDashboard';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import Worker from '@/models/worker';
import { getSession } from 'next-auth/react';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    if (!params.id) {
      return NextResponse.json({ data: null }, { status: 400 });
    }
    await dbConnect();

    const data = await Worker.findOne({ userId: params.id }).populate('userId');
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    if (!params.id) {
      return NextResponse.json({ data: null }, { status: 400 });
    }
    const workerId = params.id;
    const {userId, ...data} = await request.json() as worker;
    await dbConnect();

    await Worker.findOneAndUpdate({ _id: workerId }, data);
    await User.findOneAndUpdate({_id: userId._id}, userId)
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ data: null }, { status: 500 });
  }
}
