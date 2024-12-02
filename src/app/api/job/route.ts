import { auth } from '@/auth';
import Job from '@/models/job';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await auth();
    const user = session?.user;
    if (!user || user.role !== 'employer')
      return NextResponse.json({ msg: 'Unauthorized' }, { status: 403 });
    const job = new Job({ ...data, companyId: user._id });
    
    await job.save();
    return NextResponse.json({ msg: 'Job created' }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e);

      return NextResponse.json({ msg: e.issues[0].message }, { status: 401 });
    }
    console.log(e);
    return NextResponse.json({ msg: e }, { status: 500 });
  }
}
