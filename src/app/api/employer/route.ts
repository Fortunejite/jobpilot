import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Employer from '@/models/employer';
import { NextRequest, NextResponse } from 'next/server';
import { object, string, date, record, ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const workers = await Employer.find()
      .populate('userId')
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ data: workers }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formValidator = object({
    companyName: string().min(1, { message: 'Company Name is required' }),
    about: string().min(1, { message: 'About Us is required' }),
    orginizationType: string().min(1, {
      message: 'Orginization Type is required',
    }),
    industryType: string().min(1, { message: 'Industry Type is required' }),
    teamSize: string(),
    yearOfEstablishment: date(),
    website: string()
      .url({ message: 'Invalid website url' })
      .min(1, { message: 'website is required' }),
    vision: string().min(1, { message: 'vision is required' }),
    links: record(string().url({ message: 'Enter a valid social link' })),
    phoneNumber: string().min(1, { message: 'phoneNumber is required' }),
    address: string().min(1, { message: 'Location  is required' }),
    email: string().email({ message: 'Invalid email address' }),
    logo: string()
      .url({ message: 'Invalid logo url' })
      .min(1, { message: 'website is required' }),
    banner: string()
      .url({ message: 'Invalid banner url' })
      .min(1, { message: 'website is required' }),
  });
  try {
    const body = await request.json();
    body.yearOfEstablishment = new Date(body.yearOfEstablishment)
    const data = formValidator.parse(body);
    await dbConnect();
    const session = await auth()
    const user = session?.user
    if (!user) return NextResponse.json({ msg: 'Unauthorized' }, { status: 403 });
    const oldEmployer = await Employer.findOne({userId: user._id})
    if (oldEmployer) return NextResponse.json({ msg: 'Employer already exists' }, { status: 402 });

    const company = new Employer({
      ...data,
      userId: user._id
    });
    await company.save();
    return NextResponse.json({ msg: 'Company created' }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e);

      return NextResponse.json({ msg: e.issues[0].message }, { status: 401 });
    }
    console.log(e);
    return NextResponse.json({ msg: e }, { status: 409 });
  }
}
